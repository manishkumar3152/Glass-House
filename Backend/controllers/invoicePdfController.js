const fs = require('fs');
const path = require('path');
const Invoice = require('../models/Invoice');
const { generateInvoicePdf, renderInvoiceHtml } = require('../services/pdfGenerationService');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const logger = require('../utils/logger');

// @desc    Download or view PDF for invoice
// @route   GET /api/invoices/:id/pdf
// @access  Private
const getInvoicePdf = asyncHandler(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    return next(new ApiError(404, 'Invoice not found'));
  }

  let filePath = invoice.pdfPath ? path.join(__dirname, '..', invoice.pdfPath) : null;

  // If PDF doesn't exist on disk, regenerate on the fly
  if (!filePath || !fs.existsSync(filePath)) {
    logger.info(`PDF not found on disk for ${invoice.invoiceNumber}, generating fresh PDF...`);
    const genResult = await generateInvoicePdf(invoice);
    invoice.pdfPath = genResult.relativePath;
    invoice.pdfGeneratedAt = new Date();
    await invoice.save();
    filePath = genResult.filePath;
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${invoice.invoiceNumber}.pdf"`);
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

// @desc    Explicitly generate or regenerate PDF
// @route   POST /api/invoices/:id/generate-pdf
// @access  Private
const generatePdf = asyncHandler(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    return next(new ApiError(404, 'Invoice not found'));
  }

  const result = await generateInvoicePdf(invoice);
  invoice.pdfPath = result.relativePath;
  invoice.pdfGeneratedAt = new Date();
  await invoice.save();

  res.status(200).json(
    new ApiResponse(
      200,
      {
        pdfPath: invoice.pdfPath,
        invoiceNumber: invoice.invoiceNumber,
        generatedAt: invoice.pdfGeneratedAt
      },
      'PDF generated successfully'
    )
  );
});

// @desc    Get raw HTML preview of the invoice
// @route   GET /api/invoices/:id/preview-html
// @access  Private
const getInvoiceHtmlPreview = asyncHandler(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    return next(new ApiError(404, 'Invoice not found'));
  }

  const html = renderInvoiceHtml(invoice);
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

module.exports = {
  getInvoicePdf,
  generatePdf,
  getInvoiceHtmlPreview
};
