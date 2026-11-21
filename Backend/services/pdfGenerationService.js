const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const config = require('../config/config');
const formatCurrency = require('../utils/formatCurrency');
const { formatDate } = require('../utils/dateFormatter');
const logger = require('../utils/logger');
const { AJAY_GLASS_HEADER_BASE64 } = require('../config/ajayGlassHeader');

/**
 * Builds the complete HTML string for the exact two-page Proforma Invoice layout.
 * 
 * @param {Object} invoice
 * @returns {string} HTML string
 */
const renderInvoiceHtml = (invoice) => {
  const cssPath = path.join(__dirname, '..', 'templates', 'invoice', 'invoiceTemplate.css');
  let cssContent = '';
  try {
    cssContent = fs.readFileSync(cssPath, 'utf8');
  } catch (err) {
    logger.warn('Could not read external css, using fallback styles');
  }

  const company = invoice.companySnapshot || {};
  const customer = invoice.customerSnapshot || {};
  const glassItems = invoice.glassItems || [];
  const processingItems = invoice.processingItems || [];
  const addCharges = invoice.additionalCharges || {};
  const tax = invoice.taxDetails || {};
  const terms = invoice.termsAndConditionsSnapshot || [];

  // Generate Glass Items rows
  const glassRowsHtml = glassItems.map((item, idx) => `
    <tr>
      <td class="text-left font-bold">
        ${item.itemCode ? `<span style="font-weight:700; color:#0f172a; margin-right:4px;">${item.itemCode}</span>` : ''}
        <span>${item.specification || ''}</span>
        ${item.remarks ? `<div style="font-size:7.5pt; font-weight:normal; color:#475569; font-family:monospace; margin-top:1px;">${item.remarks}</div>` : ''}
      </td>
      <td class="text-right font-mono">${item.originalLength !== undefined && item.originalLength !== null && item.originalLength !== '' ? item.originalLength : (item.length || 0)}</td>
      <td class="text-right font-mono">${item.originalWidth !== undefined && item.originalWidth !== null && item.originalWidth !== '' ? item.originalWidth : (item.width || 0)}</td>
      <td class="text-right font-bold">${item.quantity || 0}</td>
      <td class="text-center">${item.unit || 'unit'}</td>
      <td class="text-right font-mono">${Number(item.actualArea !== undefined ? item.actualArea : (item.actArea || 0)).toFixed(3)}</td>
      <td class="text-right font-mono">${Number(item.weight || 0).toFixed(2)}</td>
      <td class="text-right font-bold font-mono">${Number(item.chargeableArea !== undefined ? item.chargeableArea : (item.chrgArea || 0)).toFixed(3)}</td>
      <td class="text-right font-mono">${Number(item.rate || 0).toFixed(2)}</td>
      <td class="text-center">${item.per || 'Sqft'}</td>
      <td class="text-right font-bold font-mono">${formatCurrency(item.amount)}</td>
    </tr>
  `).join('');

  // Generate Processing Charges rows
  const processingRowsHtml = processingItems.length > 0
    ? processingItems.map((p) => `
        <tr>
          <td class="text-left font-bold">${p.name || ''}</td>
          <td class="text-right">${p.quantity || 0}</td>
          <td class="text-center">${p.unit || 'NOS'}</td>
          <td class="text-right">${Number(p.rate || 0).toFixed(2)}</td>
          <td class="text-center">${p.per || p.unit || 'NOS'}</td>
          <td class="text-right font-bold">${formatCurrency(p.amount)}</td>
        </tr>
      `).join('')
    : `
      <tr>
        <td colspan="6" class="text-center" style="color: #64748b; font-style: italic; padding: 4px;">No additional processing charges applied</td>
      </tr>
    `;

  // Tax Breakdown display
  let taxRowHtml = '';
  if (tax.isInterState) {
    taxRowHtml = `
      <tr>
        <td class="totals-label">IGST @ ${tax.igstRate || 18}%:</td>
        <td class="totals-val font-bold">₹${formatCurrency(tax.igstAmount)}</td>
      </tr>
    `;
  } else {
    taxRowHtml = `
      <tr>
        <td class="totals-label">CGST @ ${tax.cgstRate || 9}%:</td>
        <td class="totals-val">₹${formatCurrency(tax.cgstAmount)}</td>
      </tr>
      <tr>
        <td class="totals-label">SGST @ ${tax.sgstRate || 9}%:</td>
        <td class="totals-val">₹${formatCurrency(tax.sgstAmount)}</td>
      </tr>
    `;
  }

  // Generate Terms List
  const termsHtml = terms.map((t) => `
    <div class="term-item">
      <div class="term-number">${t.termNumber}.</div>
      <div class="term-text">${t.text}</div>
    </div>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Proforma Invoice - ${invoice.invoiceNumber}</title>
  <style>
    ${cssContent}
  </style>
</head>
<body>

  <!-- ==================== PAGE 1 ==================== -->
  <div class="page">
    <div class="invoice-title-bar">
      <h1>PROFORMA INVOICE</h1>
    </div>

    <!-- Company Details (Left) & Invoice Meta (Right) -->
    <div class="header-grid">
      <div class="company-col">
        <div class="company-name">${company.companyName || 'BANSAL GLASS INDUSTRIES'}</div>
        ${company.tagline ? `<div class="company-tagline">${company.tagline}</div>` : ''}
        <div class="company-details-text">
          <div><strong>Works / Address:</strong> ${company.address || 'Industrial Area, Phase 1'}</div>
          <div><strong>Phone:</strong> ${company.phone || '+91 98765 43210'} | <strong>Email:</strong> ${company.email || 'info@bansalglass.com'}</div>
          <div><strong>GSTIN:</strong> ${company.gstin || '07AAAAA0000A1Z5'} | <strong>State:</strong> ${company.state || 'Delhi'} (${company.stateCode || '07'})</div>
          ${company.cin ? `<div><strong>CIN:</strong> ${company.cin}</div>` : ''}
        </div>
      </div>
      <div class="meta-col">
        <div class="meta-row">
          <span class="meta-label">PI Number:</span>
          <span class="meta-value highlight-value">${invoice.invoiceNumber}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">PI Date:</span>
          <span class="meta-value">${formatDate(invoice.invoiceDate)}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">PO Number:</span>
          <span class="meta-value">${invoice.poNumber || 'N/A'}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Delivery Date:</span>
          <span class="meta-value">${invoice.deliveryDate ? formatDate(invoice.deliveryDate) : 'On Schedule'}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Area Unit:</span>
          <span class="meta-value">${invoice.areaUnit || 'SQM'}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Length Unit:</span>
          <span class="meta-value">${invoice.lengthUnit || 'MM'}</span>
        </div>
      </div>
    </div>

    <!-- Customer Information -->
    <div class="customer-grid">
      <div class="customer-box left">
        <div class="section-subheading">Buyer / Bill To:</div>
        <div class="customer-name">${customer.customerName || 'Customer'}</div>
        <div class="customer-info-line"><strong>Address:</strong> ${invoice.billingAddress || customer.billingAddress || ''}</div>
        <div class="customer-info-line"><strong>Contact Person:</strong> ${invoice.contactPerson || customer.contactPerson || 'N/A'}</div>
        <div class="customer-info-line"><strong>Phone:</strong> ${invoice.contactNumber || customer.phone || 'N/A'}</div>
        <div class="customer-info-line"><strong>GSTIN:</strong> ${invoice.customerGSTIN || customer.gstin || 'Unregistered'}</div>
      </div>
      <div class="customer-box">
        <div class="section-subheading">Consignee / Ship To:</div>
        <div class="customer-name">${customer.customerName || 'Customer'}</div>
        <div class="customer-info-line"><strong>Delivery Address:</strong> ${invoice.deliveryAddress || invoice.billingAddress || customer.deliveryAddress || ''}</div>
        <div class="customer-info-line"><strong>Expected Delivery:</strong> ${invoice.deliveryDate ? formatDate(invoice.deliveryDate) : 'As agreed'}</div>
        <div class="customer-info-line"><strong>Place of Supply:</strong> ${customer.state || company.state || 'Delhi'}</div>
      </div>
    </div>

    <!-- Glass Items Table (11 Columns) -->
    <div class="table-container">
      <div class="table-title">Glass Specifications & Dimensions</div>
      <table class="invoice-table">
        <thead>
          <tr>
            <th style="width: 25%;">Specification</th>
            <th style="width: 7%;">L</th>
            <th style="width: 7%;">W</th>
            <th style="width: 6%;">Qty</th>
            <th style="width: 6%;">Unit</th>
            <th style="width: 9%;">Act Area</th>
            <th style="width: 8%;">Weight</th>
            <th style="width: 9%;">Chrg Area</th>
            <th style="width: 8%;">Rate</th>
            <th style="width: 6%;">Per</th>
            <th style="width: 9%;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${glassRowsHtml}
          <!-- Subtotal Row -->
          <tr class="table-subtotal-row">
            <td class="text-left font-bold" colspan="3">Total Glass Summary:</td>
            <td class="text-right font-bold">${invoice.totalQuantity || 0}</td>
            <td class="text-center font-bold">NOS</td>
            <td class="text-right font-bold">${Number(invoice.totalActualArea || 0).toFixed(3)}</td>
            <td class="text-right font-bold">${Number(invoice.totalWeight || 0).toFixed(2)}</td>
            <td class="text-right font-bold">${Number(invoice.totalChargeableArea || 0).toFixed(3)}</td>
            <td colspan="2" class="text-right font-bold">Glass Total:</td>
            <td class="text-right font-bold">₹${formatCurrency(invoice.glassTotal)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Processing Charges Table -->
    <div class="table-container">
      <div class="table-title">Processing / Value Added Charges</div>
      <table class="invoice-table">
        <thead>
          <tr>
            <th style="width: 35%;">Name</th>
            <th style="width: 10%;">Qty</th>
            <th style="width: 12%;">Unit</th>
            <th style="width: 15%;">Rate</th>
            <th style="width: 13%;">Per</th>
            <th style="width: 15%;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${processingRowsHtml}
          <tr class="table-subtotal-row">
            <td colspan="5" class="text-right font-bold">Total Processing Cost:</td>
            <td class="text-right font-bold">₹${formatCurrency(invoice.totalProcessingCost)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Financial Summary & Breakdown -->
    <div class="summary-container">
      <div class="summary-left-pane">
        <div class="words-box">
          <div class="words-label">Amount Chargeable (in words):</div>
          <div class="words-value">${invoice.amountInWords || ''}</div>
        </div>
        <div style="font-size: 7.5pt; color: #475569; margin-top: 10px; line-height: 1.4; border-left: 3px solid #1e3a8a; padding-left: 6px;">
          Note: Proforma invoice issued for confirmation and advance planning. Payment terms as per agreed order schedule. Breakage during transit at customer's risk.
        </div>
      </div>

      <div class="summary-right-pane">
        <table class="totals-table">
          <tr>
            <td class="totals-label">Glass Total:</td>
            <td class="totals-val">₹${formatCurrency(invoice.glassTotal)}</td>
          </tr>
          <tr>
            <td class="totals-label">Total Processing Cost:</td>
            <td class="totals-val">₹${formatCurrency(invoice.totalProcessingCost)}</td>
          </tr>
          <tr style="background: #f1f5f9; font-weight: 700;">
            <td class="totals-label font-bold">Total Cost (Glass + Process):</td>
            <td class="totals-val font-bold">₹${formatCurrency(invoice.totalCost)}</td>
          </tr>
          <tr>
            <td class="totals-label">Insurance, Handling & Others (${addCharges.insurancePercent || 2}%):</td>
            <td class="totals-val">₹${formatCurrency(addCharges.insuranceAmount || 0)}</td>
          </tr>
          <tr>
            <td class="totals-label">Document Charge:</td>
            <td class="totals-val">₹${formatCurrency(addCharges.documentCharge || 25)}</td>
          </tr>
          ${addCharges.otherCharges ? `
          <tr>
            <td class="totals-label">Other Additional Charges:</td>
            <td class="totals-val">₹${formatCurrency(addCharges.otherCharges)}</td>
          </tr>` : ''}
          <tr>
            <td class="totals-label font-bold">Total Additional Charges:</td>
            <td class="totals-val font-bold">₹${formatCurrency(invoice.totalAdditionalCharges)}</td>
          </tr>
          <tr style="background: #f8fafc; font-weight: 700;">
            <td class="totals-label font-bold">Total Amount Before Tax:</td>
            <td class="totals-val font-bold">₹${formatCurrency(invoice.taxableAmount)}</td>
          </tr>
          ${taxRowHtml}
          <tr>
            <td class="totals-label">Total Amount After Tax:</td>
            <td class="totals-val font-bold">₹${formatCurrency(invoice.finalAmount)}</td>
          </tr>
          <tr>
            <td class="totals-label">Round Off:</td>
            <td class="totals-val">${invoice.roundOffDifference >= 0 ? '+' : ''}${Number(invoice.roundOffDifference || 0).toFixed(2)}</td>
          </tr>
          <tr class="grand-total-row">
            <td class="totals-label">Rounded Amount:</td>
            <td class="totals-val font-bold" style="font-size: 10.5pt;">₹${formatCurrency(invoice.roundedAmount)}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Page 1 Footer -->
    <div class="page-footer">
      <span>Subject to Terms and Conditions overleaf / Page 2</span>
      <span>Page 1 of 2</span>
    </div>
  </div>

  <!-- ==================== PAGE 2 ==================== -->
  <div class="page">
    <div class="page2-header">
      <h2>TERMS AND CONDITIONS</h2>
    </div>

    <!-- 15 Detailed Glass Industry Terms -->
    <div class="terms-container">
      ${termsHtml}
    </div>

    <!-- Bank Details & Signatures -->
    <div class="page2-bottom-grid">
      <div class="bank-details-box">
        <div class="bank-title">Bank Details for RTGS / NEFT / IMPS</div>
        <div class="bank-row">
          <span class="bank-lbl">Bank Name:</span>
          <span class="bank-val">${company.bankName || 'HDFC Bank Ltd'}</span>
        </div>
        <div class="bank-row">
          <span class="bank-lbl">Account Number:</span>
          <span class="bank-val">${company.accountNumber || '50200085210987'}</span>
        </div>
        <div class="bank-row">
          <span class="bank-lbl">IFSC / RTGS Code:</span>
          <span class="bank-val">${company.ifscCode || 'HDFC0001234'}</span>
        </div>
        <div class="bank-row">
          <span class="bank-lbl">Branch:</span>
          <span class="bank-val">${company.branch || 'Industrial Area Branch'}</span>
        </div>
        <div class="bank-row">
          <span class="bank-lbl">Account Holder Name:</span>
          <span class="bank-val">${company.accountHolderName || company.companyName || 'Bansal Glass Industries'}</span>
        </div>
      </div>

      <div class="signatures-box">
        <div class="company-sign-title">For ${company.companyName || 'BANSAL GLASS INDUSTRIES'}</div>
        <div class="sign-officers-row">
          <div class="sign-officer">
            <div>${invoice.preparedBy || 'Prepared By'}</div>
            <div style="margin-top: 15px; border-top: 1px dotted #94a3b8; width: 80px;">Sales Exec.</div>
          </div>
          <div class="sign-officer">
            <div>${invoice.checkedBy || 'Checked By'}</div>
            <div style="margin-top: 15px; border-top: 1px dotted #94a3b8; width: 80px;">Commercial Mgr.</div>
          </div>
        </div>
        <div class="sign-line">
          ${invoice.authorizedSignatory || company.authorizedSignatory || 'Authorized Signatory'}
        </div>
      </div>
    </div>

    <!-- Page 2 Footer -->
    <div class="page-footer">
      <span>Quotation / Proforma Confirmation</span>
      <span>Page 2 of 2</span>
    </div>
  </div>

</body>
</html>
  `;
};

/**
 * Generates PDF from Invoice document using Puppeteer.
 * 
 * @param {Object} invoice
 * @returns {Promise<{ buffer: Buffer, filePath: string, relativePath: string }>}
 */
const generateInvoicePdf = async (invoice) => {
  const htmlContent = renderInvoiceHtml(invoice);

  const uploadsDir = path.join(__dirname, '..', 'uploads', 'invoices');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const fileName = `${invoice.invoiceNumber || 'INVOICE'}.pdf`.replace(/[\/\\:*?"<>|]/g, '_');
  const filePath = path.join(uploadsDir, fileName);
  const relativePath = `uploads/invoices/${fileName}`;

  // Launch Puppeteer with available browser
  const launchOptions = {
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--font-render-hinting=max'
    ]
  };

  if (fs.existsSync(config.chromePath)) {
    launchOptions.executablePath = config.chromePath;
  }

  let browser;
  try {
    browser = await puppeteer.launch(launchOptions);
  } catch (launchErr) {
    logger.warn(`Could not launch chrome at ${config.chromePath}, attempting default puppeteer launcher: ${launchErr.message}`);
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  }

  try {
    const page = await browser.newPage();
    await page.setContent(htmlContent, {
      waitUntil: ['load', 'networkidle0'],
      timeout: 30000
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm'
      }
    });

    fs.writeFileSync(filePath, pdfBuffer);
    logger.info(`PDF successfully generated: ${filePath}`);

    return {
      buffer: pdfBuffer,
      filePath,
      relativePath
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = {
  renderInvoiceHtml,
  generateInvoicePdf
};
