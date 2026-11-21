const express = require('express');
const router = express.Router();
const {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  approveInvoice,
  cancelInvoice,
  duplicateInvoice
} = require('../controllers/invoiceController');
const {
  getInvoicePdf,
  generatePdf,
  getInvoiceHtmlPreview
} = require('../controllers/invoicePdfController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { invoiceValidationRules } = require('../validators/invoiceValidator');
const validate = require('../middleware/validationMiddleware');

router.use(protect);

router
  .route('/')
  .get(getInvoices)
  .post(invoiceValidationRules, validate, createInvoice);

router
  .route('/:id')
  .get(getInvoiceById)
  .put(invoiceValidationRules, validate, updateInvoice)
  .delete(deleteInvoice);

// Invoice Workflow Actions
router.post('/:id/approve', authorize('admin', 'super_admin'), approveInvoice);
router.post('/:id/cancel', cancelInvoice);
router.post('/:id/duplicate', duplicateInvoice);

// PDF generation, download & HTML preview
router.get('/:id/pdf', getInvoicePdf);
router.post('/:id/generate-pdf', generatePdf);
router.get('/:id/preview-html', getInvoiceHtmlPreview);

module.exports = router;
