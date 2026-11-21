import React from 'react';
import { formatCurrency } from '../../utils/currencyFormatter';
import { formatDate } from '../../utils/dateFormatter';
import '../../styles/invoice.css';

const default15Terms = [
  { termNumber: 1, text: 'Goods once sold will not be taken back or exchanged under any circumstances.' },
  { termNumber: 2, text: 'Any breakage, damage or shortage during transit shall be entirely at buyer\'s / customer\'s risk.' },
  { termNumber: 3, text: 'Tolerance for cutting and toughening will be ± 2mm in length and width as per standard industry specifications.' },
  { termNumber: 4, text: 'Due to high temperature tempering process, minor roller waves, bow, warp, and optical distortion are inherent characteristics of toughened glass and shall not be treated as defects.' },
  { termNumber: 5, text: 'No cutting, drilling, notching, or grinding can be done after the glass is toughened. Any attempt to modify processed glass will cause spontaneous breakage.' },
  { termNumber: 6, text: 'Delivery schedule is given in good faith and subject to force majeure, raw material availability, machine maintenance, and uninterrupted power supply.' },
  { termNumber: 7, text: 'Payment terms: 100% advance or as agreed mutually in purchase order prior to dispatch.' },
  { termNumber: 8, text: 'Interest @ 18% per annum will be charged on overdue payments beyond the agreed credit period.' },
  { termNumber: 9, text: 'Inspection of materials must be done at the time of delivery / dispatch. No complaint will be entertained once the material leaves our factory premises.' },
  { termNumber: 10, text: 'Insurance coverage during transit will only be applicable if requested specifically by the buyer and charged extra.' },
  { termNumber: 11, text: 'Tax rates are subject to change as per statutory government notifications prevailing at the time of invoicing.' },
  { termNumber: 12, text: 'Unloading of material at the destination site is the sole responsibility of the customer.' },
  { termNumber: 13, text: 'Dimensions and processing details provided by customer in purchase order or approved drawings will be considered final and binding.' },
  { termNumber: 14, text: 'Disputes, if any, arising out of this contract shall be subject to the exclusive jurisdiction of local courts only.' },
  { termNumber: 15, text: 'This Proforma Invoice is valid for 15 days from the date of issue. Rates and raw material surcharges are subject to revision thereafter.' }
];

const InvoicePreview = ({ invoice = {}, company = {} }) => {
  const comp = invoice.companySnapshot || company || {};
  const cust = invoice.customerSnapshot || {};
  const glassItems = invoice.glassItems || [];
  const processingItems = invoice.processingItems || [];
  const addCharges = invoice.additionalCharges || {};
  const tax = invoice.taxDetails || {};
  const terms = invoice.termsAndConditionsSnapshot && invoice.termsAndConditionsSnapshot.length > 0
    ? invoice.termsAndConditionsSnapshot
    : default15Terms;

  return (
    <div className="pi-preview-container">
      {/* ================= PAGE 1 ================= */}
      <div className="pi-preview-page">
        {/* Title */}
        <div className="pi-title-bar">
          <h1>PROFORMA INVOICE</h1>
        </div>

        {/* Company & PI Meta Grid */}
        <div className="pi-header-grid">
          <div className="pi-company-col">
            <div className="pi-company-name">{comp.companyName || 'BANSAL GLASS INDUSTRIES'}</div>
            {comp.tagline && <div className="pi-company-tagline">{comp.tagline}</div>}
            <div className="pi-company-text">
              <div><strong>Works / Address:</strong> {comp.address || 'Plot No. 42-43, Navdeep Colony, Phase-II Industrial Area, New Delhi'}</div>
              <div><strong>Phone:</strong> {comp.phone || '+91 98765 43210'} | <strong>Email:</strong> {comp.email || 'info@bansalglass.com'}</div>
              <div><strong>GSTIN:</strong> {comp.gstin || '07AAAAA0000A1Z5'} | <strong>State:</strong> {comp.state || 'Delhi'} ({comp.stateCode || '07'})</div>
              {comp.cin && <div><strong>CIN:</strong> {comp.cin}</div>}
            </div>
          </div>

          <div className="pi-meta-col">
            <div className="pi-meta-row">
              <span className="pi-meta-label">PI Number:</span>
              <span className="pi-meta-value pi-highlight-value">{invoice.invoiceNumber || 'PI-26-27-XXXX'}</span>
            </div>
            <div className="pi-meta-row">
              <span className="pi-meta-label">PI Date:</span>
              <span className="pi-meta-value">{formatDate(invoice.invoiceDate || new Date())}</span>
            </div>
            <div className="pi-meta-row">
              <span className="pi-meta-label">PO Number:</span>
              <span className="pi-meta-value">{invoice.poNumber || 'N/A'}</span>
            </div>
            <div className="pi-meta-row">
              <span className="pi-meta-label">Delivery Date:</span>
              <span className="pi-meta-value">{invoice.deliveryDate ? formatDate(invoice.deliveryDate) : 'On Schedule'}</span>
            </div>
            <div className="pi-meta-row">
              <span className="pi-meta-label">Area Unit:</span>
              <span className="pi-meta-value">{invoice.areaUnit || 'SQM'}</span>
            </div>
            <div className="pi-meta-row">
              <span className="pi-meta-label">Length Unit:</span>
              <span className="pi-meta-value">{invoice.lengthUnit || 'MM'}</span>
            </div>
          </div>
        </div>

        {/* Customer Information (Bill To / Ship To) */}
        <div className="pi-customer-grid">
          <div className="pi-customer-box left">
            <div className="pi-subheading">Buyer / Bill To:</div>
            <div className="pi-customer-name">{cust.customerName || invoice.customer?.customerName || 'Customer'}</div>
            <div className="pi-customer-line">
              <strong>Address:</strong> {invoice.billingAddress || cust.billingAddress || ''}
            </div>
            <div className="pi-customer-line">
              <strong>Contact Person:</strong> {invoice.contactPerson || cust.contactPerson || 'N/A'}
            </div>
            <div className="pi-customer-line">
              <strong>Phone:</strong> {invoice.contactNumber || cust.phone || 'N/A'}
            </div>
            <div className="pi-customer-line">
              <strong>GSTIN:</strong> {invoice.customerGSTIN || cust.gstin || 'Unregistered'}
            </div>
          </div>

          <div className="pi-customer-box">
            <div className="pi-subheading">Consignee / Ship To:</div>
            <div className="pi-customer-name">{cust.customerName || invoice.customer?.customerName || 'Customer'}</div>
            <div className="pi-customer-line">
              <strong>Delivery Address:</strong> {invoice.deliveryAddress || invoice.billingAddress || cust.deliveryAddress || ''}
            </div>
            <div className="pi-customer-line">
              <strong>Expected Delivery:</strong> {invoice.deliveryDate ? formatDate(invoice.deliveryDate) : 'As agreed'}
            </div>
            <div className="pi-customer-line">
              <strong>Place of Supply:</strong> {cust.state || comp.state || 'Delhi'}
            </div>
          </div>
        </div>

        {/* 11-Column Glass Items Table */}
        <div className="pi-table-container">
          <div className="pi-table-title">Glass Specifications & Dimensions</div>
          <table className="pi-table">
            <thead>
              <tr>
                <th style={{ width: '25%', textAlign: 'left' }}>Specification</th>
                <th style={{ width: '7%', textAlign: 'right' }}>L</th>
                <th style={{ width: '7%', textAlign: 'right' }}>W</th>
                <th style={{ width: '6%', textAlign: 'right' }}>Qty</th>
                <th style={{ width: '6%', textAlign: 'center' }}>Unit</th>
                <th style={{ width: '9%', textAlign: 'right' }}>Act Area</th>
                <th style={{ width: '8%', textAlign: 'right' }}>Weight</th>
                <th style={{ width: '9%', textAlign: 'right' }}>Chrg Area</th>
                <th style={{ width: '8%', textAlign: 'right' }}>Rate</th>
                <th style={{ width: '6%', textAlign: 'center' }}>Per</th>
                <th style={{ width: '9%', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {glassItems.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ textAlign: 'left', fontWeight: 'bold' }}>
                    {item.itemCode && <span style={{ marginRight: '6px', color: '#1e3a8a' }}>{item.itemCode}</span>}
                    <span>{item.specification}</span>
                    {item.remarks && <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'normal', fontFamily: 'monospace' }}>{item.remarks}</div>}
                  </td>
                  <td style={{ textAlign: 'right' }}>{item.originalLength !== undefined && item.originalLength !== null && item.originalLength !== '' ? item.originalLength : item.length}</td>
                  <td style={{ textAlign: 'right' }}>{item.originalWidth !== undefined && item.originalWidth !== null && item.originalWidth !== '' ? item.originalWidth : item.width}</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{item.quantity}</td>
                  <td style={{ textAlign: 'center' }}>{item.unit || 'unit'}</td>
                  <td style={{ textAlign: 'right' }}>{Number(item.actArea || 0).toFixed(3)}</td>
                  <td style={{ textAlign: 'right' }}>{Number(item.weight || 0).toFixed(2)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{Number(item.chrgArea || 0).toFixed(3)}</td>
                  <td style={{ textAlign: 'right' }}>{Number(item.rate || 0).toFixed(2)}</td>
                  <td style={{ textAlign: 'center' }}>{item.per || 'Sqft'}</td>
                  <td style={{ textAlign: 'right', fontWeight: 'bold' }}>₹{formatCurrency(item.amount)}</td>
                </tr>
              ))}

              {/* Subtotal Row */}
              <tr className="pi-subtotal-row">
                <td colSpan={3} style={{ textAlign: 'left', fontWeight: 'bold' }}>Total Glass Summary:</td>
                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{invoice.totalQuantity || 0}</td>
                <td style={{ textAlign: 'center', fontWeight: 'bold' }}>NOS</td>
                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{Number(invoice.totalActualArea || 0).toFixed(3)}</td>
                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{Number(invoice.totalWeight || 0).toFixed(2)}</td>
                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>{Number(invoice.totalChargeableArea || 0).toFixed(3)}</td>
                <td colSpan={2} style={{ textAlign: 'right', fontWeight: 'bold' }}>Glass Total:</td>
                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>₹{formatCurrency(invoice.glassTotal)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Processing Charges Table */}
        <div className="pi-table-container">
          <div className="pi-table-title">Processing / Value Added Charges</div>
          <table className="pi-table">
            <thead>
              <tr>
                <th style={{ width: '35%', textAlign: 'left' }}>Name</th>
                <th style={{ width: '10%', textAlign: 'right' }}>Qty</th>
                <th style={{ width: '12%', textAlign: 'center' }}>Unit</th>
                <th style={{ width: '15%', textAlign: 'right' }}>Rate</th>
                <th style={{ width: '13%', textAlign: 'center' }}>Per</th>
                <th style={{ width: '15%', textAlign: 'right' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {processingItems.length > 0 ? (
                processingItems.map((p, idx) => (
                  <tr key={idx}>
                    <td style={{ textAlign: 'left', fontWeight: 'bold' }}>{p.name}</td>
                    <td style={{ textAlign: 'right' }}>{p.quantity}</td>
                    <td style={{ textAlign: 'center' }}>{p.unit || 'NOS'}</td>
                    <td style={{ textAlign: 'right' }}>{Number(p.rate || 0).toFixed(2)}</td>
                    <td style={{ textAlign: 'center' }}>{p.per || p.unit || 'NOS'}</td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold' }}>₹{formatCurrency(p.amount)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', color: '#64748b', fontStyle: 'italic', padding: '4px' }}>
                    No processing charges applied
                  </td>
                </tr>
              )}
              <tr className="pi-subtotal-row">
                <td colSpan={5} style={{ textAlign: 'right', fontWeight: 'bold' }}>Total Processing Cost:</td>
                <td style={{ textAlign: 'right', fontWeight: 'bold' }}>₹{formatCurrency(invoice.totalProcessingCost)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary Grid */}
        <div className="pi-summary-grid">
          <div className="pi-summary-left">
            <div className="pi-words-box">
              <div className="pi-words-lbl">Amount Chargeable (in words):</div>
              <div className="pi-words-val">{invoice.amountInWords || 'Rupees Zero Only'}</div>
            </div>
            <div style={{ fontSize: '7.5pt', color: '#475569', marginTop: '10px', lineHeight: '1.4', borderLeft: '3px solid #1e3a8a', paddingLeft: '6px' }}>
              Note: Proforma invoice issued for confirmation and advance planning. Payment terms as per agreed order schedule. Breakage during transit at customer&apos;s risk.
            </div>
          </div>

          <div className="pi-summary-right">
            <table className="pi-totals-table">
              <tbody>
                <tr>
                  <td className="pi-totals-label">Glass Total:</td>
                  <td className="pi-totals-val">₹{formatCurrency(invoice.glassTotal)}</td>
                </tr>
                <tr>
                  <td className="pi-totals-label">Total Processing Cost:</td>
                  <td className="pi-totals-val">₹{formatCurrency(invoice.totalProcessingCost)}</td>
                </tr>
                <tr style={{ background: '#f1f5f9', fontWeight: 'bold' }}>
                  <td className="pi-totals-label" style={{ fontWeight: 'bold' }}>Total Cost (Glass + Process):</td>
                  <td className="pi-totals-val" style={{ fontWeight: 'bold' }}>₹{formatCurrency(invoice.totalCost)}</td>
                </tr>
                <tr>
                  <td className="pi-totals-label">Insurance, Handling & Others ({addCharges.insurancePercent || 2}%):</td>
                  <td className="pi-totals-val">₹{formatCurrency(addCharges.insuranceAmount)}</td>
                </tr>
                <tr>
                  <td className="pi-totals-label">Document Charge:</td>
                  <td className="pi-totals-val">₹{formatCurrency(addCharges.documentCharge)}</td>
                </tr>
                {addCharges.otherCharges > 0 && (
                  <tr>
                    <td className="pi-totals-label">Other Additional Charges:</td>
                    <td className="pi-totals-val">₹{formatCurrency(addCharges.otherCharges)}</td>
                  </tr>
                )}
                <tr>
                  <td className="pi-totals-label" style={{ fontWeight: 'bold' }}>Total Additional Charges:</td>
                  <td className="pi-totals-val" style={{ fontWeight: 'bold' }}>₹{formatCurrency(invoice.totalAdditionalCharges)}</td>
                </tr>
                <tr style={{ background: '#f8fafc', fontWeight: 'bold' }}>
                  <td className="pi-totals-label" style={{ fontWeight: 'bold' }}>Total Amount Before Tax:</td>
                  <td className="pi-totals-val" style={{ fontWeight: 'bold' }}>₹{formatCurrency(invoice.taxableAmount)}</td>
                </tr>

                {tax.isInterState ? (
                  <tr>
                    <td className="pi-totals-label">IGST @ {tax.igstRate || 18}%:</td>
                    <td className="pi-totals-val" style={{ fontWeight: 'bold' }}>₹{formatCurrency(tax.igstAmount)}</td>
                  </tr>
                ) : (
                  <>
                    <tr>
                      <td className="pi-totals-label">CGST @ {tax.cgstRate || 9}%:</td>
                      <td className="pi-totals-val">₹{formatCurrency(tax.cgstAmount)}</td>
                    </tr>
                    <tr>
                      <td className="pi-totals-label">SGST @ {tax.sgstRate || 9}%:</td>
                      <td className="pi-totals-val">₹{formatCurrency(tax.sgstAmount)}</td>
                    </tr>
                  </>
                )}

                <tr>
                  <td className="pi-totals-label">Total Amount After Tax:</td>
                  <td className="pi-totals-val" style={{ fontWeight: 'bold' }}>₹{formatCurrency(invoice.finalAmount)}</td>
                </tr>
                <tr>
                  <td className="pi-totals-label">Round Off:</td>
                  <td className="pi-totals-val">
                    {invoice.roundOffDifference >= 0 ? '+' : ''}{Number(invoice.roundOffDifference || 0).toFixed(2)}
                  </td>
                </tr>
                <tr className="pi-grand-total">
                  <td className="pi-totals-label">Rounded Amount:</td>
                  <td className="pi-totals-val" style={{ fontSize: '10.5pt' }}>₹{formatCurrency(invoice.roundedAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Page 1 Footer */}
        <div className="pi-page-footer">
          <span>Subject to Terms and Conditions overleaf / Page 2</span>
          <span>Page 1 of 2</span>
        </div>
      </div>

      {/* ================= PAGE 2 ================= */}
      <div className="pi-preview-page">
        <div className="pi-page2-header">
          <h2>TERMS AND CONDITIONS</h2>
        </div>

        {/* 15 Terms */}
        <div className="pi-terms-container">
          {terms.map((t) => (
            <div key={t.termNumber} className="pi-term-item">
              <div className="pi-term-num">{t.termNumber}.</div>
              <div className="pi-term-txt">{t.text}</div>
            </div>
          ))}
        </div>

        {/* Bank Details & Signatures */}
        <div className="pi-page2-bottom">
          <div className="pi-bank-box">
            <div className="pi-bank-title">Bank Details for RTGS / NEFT / IMPS</div>
            <div className="pi-bank-row">
              <span className="pi-meta-label" style={{ width: '130px' }}>Bank Name:</span>
              <span className="pi-meta-value">{comp.bankName || 'HDFC Bank Ltd'}</span>
            </div>
            <div className="pi-bank-row">
              <span className="pi-meta-label" style={{ width: '130px' }}>Account Number:</span>
              <span className="pi-meta-value">{comp.accountNumber || '50200085210987'}</span>
            </div>
            <div className="pi-bank-row">
              <span className="pi-meta-label" style={{ width: '130px' }}>IFSC / RTGS Code:</span>
              <span className="pi-meta-value">{comp.ifscCode || 'HDFC0001234'}</span>
            </div>
            <div className="pi-bank-row">
              <span className="pi-meta-label" style={{ width: '130px' }}>Branch:</span>
              <span className="pi-meta-value">{comp.branch || 'Industrial Area Phase-II'}</span>
            </div>
            <div className="pi-bank-row">
              <span className="pi-meta-label" style={{ width: '130px' }}>Account Holder:</span>
              <span className="pi-meta-value">{comp.accountHolderName || comp.companyName || 'Bansal Glass Industries'}</span>
            </div>
          </div>

          <div className="pi-sign-box">
            <div style={{ textAlign: 'right', fontWeight: 'bold', fontSize: '8.5pt' }}>
              For {comp.companyName || 'BANSAL GLASS INDUSTRIES'}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '35px', borderTop: '1px dashed #cbd5e1', paddingTop: '4px', fontSize: '7.5pt', color: '#475569' }}>
              <div style={{ textAlign: 'center' }}>
                <div>{invoice.preparedBy || 'Sales Executive'}</div>
                <div style={{ borderTop: '1px dotted #94a3b8', marginTop: '10px', width: '70px' }}>Prepared By</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div>{invoice.checkedBy || 'Commercial Manager'}</div>
                <div style={{ borderTop: '1px dotted #94a3b8', marginTop: '10px', width: '70px' }}>Checked By</div>
              </div>
            </div>
            <div style={{ marginTop: '20px', borderTop: '1px solid #94a3b8', paddingTop: '3px', textAlign: 'right', fontWeight: 'bold', fontSize: '8pt' }}>
              {invoice.authorizedSignatory || comp.authorizedSignatory || 'Authorized Signatory'}
            </div>
          </div>
        </div>

        {/* Page 2 Footer */}
        <div className="pi-page-footer">
          <span>Quotation / Proforma Confirmation</span>
          <span>Page 2 of 2</span>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
