const http = require('http');
const assert = require('assert');

const postRequest = (path, body, token = '') => {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(body || {});
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(
      {
        host: '127.0.0.1',
        port: 5000,
        path,
        method: 'POST',
        headers
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => resolve({ status: res.statusCode, data: JSON.parse(data) }));
      }
    );
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
};

const getRequest = (path, token = '') => {
  return new Promise((resolve, reject) => {
    const headers = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const req = http.request(
      {
        host: '127.0.0.1',
        port: 5000,
        path,
        method: 'GET',
        headers
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          try {
            resolve({ status: res.statusCode, data: JSON.parse(data), headers: res.headers });
          } catch (e) {
            resolve({ status: res.statusCode, raw: data, headers: res.headers });
          }
        });
      }
    );
    req.on('error', reject);
    req.end();
  });
};

const runIntegrationTests = async () => {
  console.log('=== STARTING FULL-STACK API INTEGRATION TESTS ===');

  // 1. Health check
  const health = await getRequest('/api/health');
  assert.strictEqual(health.status, 200, 'Health endpoint must return 200');
  console.log('✔ Health Check OK');

  // 2. Auth Login
  const loginRes = await postRequest('/api/auth/login', {
    email: 'admin@glasshouse.com',
    password: 'password123'
  });
  assert.strictEqual(loginRes.status, 200, 'Login must succeed');
  const token = loginRes.data.data.token;
  assert.ok(token, 'JWT Token must be returned');
  console.log('✔ User Authentication & JWT generation OK');

  // 3. Current User
  const meRes = await getRequest('/api/auth/me', token);
  assert.strictEqual(meRes.status, 200);
  assert.strictEqual(meRes.data.data.email, 'admin@glasshouse.com');
  console.log('✔ Fetch Current User (/api/auth/me) OK');

  // 4. Dashboard Stats
  const dashRes = await getRequest('/api/dashboard/stats', token);
  assert.strictEqual(dashRes.status, 200);
  assert.ok(dashRes.data.data.totalInvoices >= 1);
  console.log(`✔ Dashboard Stats OK (Total Invoices: ${dashRes.data.data.totalInvoices})`);

  // 5. Customers List
  const custRes = await getRequest('/api/customers', token);
  assert.strictEqual(custRes.status, 200);
  assert.ok(custRes.data.data.customers.length >= 1);
  const customer = custRes.data.data.customers[0];
  console.log(`✔ Customers CRUD OK (Found: ${customer.customerName})`);

  // 6. Company Master
  const compRes = await getRequest('/api/company', token);
  assert.strictEqual(compRes.status, 200);
  assert.ok(compRes.data.data.companyName);
  console.log(`✔ Company Settings Master OK (${compRes.data.data.companyName})`);

  // 7. Test Authoritative Calculation API (/api/invoices/calculate)
  const calcRes = await postRequest(
    '/api/invoices/calculate',
    {
      glassItems: [
        {
          specification: '6mm Clear Flat Tuff Glass',
          length: 2063,
          width: 800,
          quantity: 2,
          thickness: 6,
          density: 2.5,
          unit: 'NOS',
          rate: 72,
          per: 'SQFT'
        }
      ],
      processingItems: [
        {
          name: 'Small Hole (Up to 25mm)',
          quantity: 2,
          unit: 'NOS',
          rate: 45,
          per: 'NOS'
        }
      ],
      additionalCharges: {
        insurancePercent: 2,
        documentCharge: 25,
        otherCharges: 0
      },
      taxConfig: {
        isInterState: true,
        gstRate: 18
      }
    },
    token
  );
  assert.strictEqual(calcRes.status, 200);
  assert.strictEqual(calcRes.data.data.glassItems[0].actArea, 3.301);
  assert.strictEqual(calcRes.data.data.totalProcessingCost, 90);
  console.log('✔ Authoritative Calculation Service (/api/invoices/calculate) OK');

  // 8. Fetch Invoices and verify reference PI-26-27-8521
  const invRes = await getRequest('/api/invoices?search=8521', token);
  assert.strictEqual(invRes.status, 200);
  assert.ok(invRes.data.data.invoices.length >= 1);
  const invoice = invRes.data.data.invoices.find(inv => inv.invoiceNumber === 'PI-26-27-8521') || invRes.data.data.invoices[0];
  assert.strictEqual(invoice.invoiceNumber, 'PI-26-27-8521');
  assert.strictEqual(invoice.totalQuantity, 8);
  assert.strictEqual(invoice.totalWeight, 113.16);
  assert.strictEqual(invoice.totalChargeableArea, 7.621);
  assert.strictEqual(invoice.glassTotal, 5906.29);
  assert.strictEqual(invoice.totalProcessingCost, 90.0);
  assert.strictEqual(invoice.totalCost, 5996.29);
  assert.strictEqual(invoice.additionalCharges.documentCharge, 25.0);
  assert.strictEqual(invoice.roundedAmount, 7245);
  console.log('✔ Seeded Reference Invoice PI-26-27-8521 Exact Values Match 100%!');

  // 9. PDF Generation Endpoint
  const genPdfRes = await postRequest(`/api/invoices/${invoice._id}/generate-pdf`, {}, token);
  assert.strictEqual(genPdfRes.status, 200);
  assert.ok(genPdfRes.data.data.pdfPath);
  console.log(`✔ Puppeteer PDF Generation API OK (Saved at: ${genPdfRes.data.data.pdfPath})`);

  // 10. Test Duplicate Invoice
  const dupRes = await postRequest(`/api/invoices/${invoice._id}/duplicate`, {}, token);
  assert.strictEqual(dupRes.status, 201);
  assert.strictEqual(dupRes.data.data.invoiceStatus, 'Draft');
  console.log(`✔ Invoice Duplication OK (New Draft: ${dupRes.data.data.invoiceNumber})`);

  console.log('=== ALL INTEGRATION TESTS PASSED 100%! ===');
  process.exit(0);
};

runIntegrationTests().catch((err) => {
  console.error('Integration test failed:', err);
  process.exit(1);
});
