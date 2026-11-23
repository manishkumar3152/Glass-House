const express = require('express');
const router = express.Router();
const {
  getProcessingCharges,
  getProcessingChargeById,
  createProcessingCharge,
  updateProcessingCharge,
  deleteProcessingCharge,
  bulkUpdateChargeStatus,
  bulkDeleteCharges
} = require('../controllers/processingChargeController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { processingChargeRules } = require('../validators/masterValidator');
const validate = require('../middleware/validationMiddleware');

router.use(protect);

router
  .route('/')
  .get(getProcessingCharges)
  .post(authorize('admin', 'super_admin'), processingChargeRules, validate, createProcessingCharge);

// Bulk operations (must be before /:id)
router.post('/bulk-status', authorize('admin', 'super_admin'), bulkUpdateChargeStatus);
router.post('/bulk-delete', authorize('admin', 'super_admin'), bulkDeleteCharges);

router
  .route('/:id')
  .get(getProcessingChargeById)
  .put(authorize('admin', 'super_admin'), processingChargeRules, validate, updateProcessingCharge)
  .delete(authorize('admin', 'super_admin'), deleteProcessingCharge);

module.exports = router;
