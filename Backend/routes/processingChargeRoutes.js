const express = require('express');
const router = express.Router();
const {
  getProcessingCharges,
  getProcessingChargeById,
  createProcessingCharge,
  updateProcessingCharge,
  deleteProcessingCharge
} = require('../controllers/processingChargeController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { processingChargeRules } = require('../validators/masterValidator');
const validate = require('../middleware/validationMiddleware');

router.use(protect);

router
  .route('/')
  .get(getProcessingCharges)
  .post(authorize('admin', 'super_admin'), processingChargeRules, validate, createProcessingCharge);

router
  .route('/:id')
  .get(getProcessingChargeById)
  .put(authorize('admin', 'super_admin'), processingChargeRules, validate, updateProcessingCharge)
  .delete(authorize('admin', 'super_admin'), deleteProcessingCharge);

module.exports = router;
