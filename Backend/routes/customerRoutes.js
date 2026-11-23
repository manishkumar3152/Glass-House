const express = require('express');
const router = express.Router();
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  bulkUpdateCustomerStatus,
  bulkDeleteCustomers
} = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { customerValidationRules } = require('../validators/customerValidator');
const validate = require('../middleware/validationMiddleware');

router.use(protect);

router
  .route('/')
  .get(getCustomers)
  .post(customerValidationRules, validate, createCustomer);

// Bulk operations (must be before /:id)
router.post('/bulk-status', bulkUpdateCustomerStatus);
router.post('/bulk-delete', authorize('admin', 'super_admin'), bulkDeleteCustomers);

router
  .route('/:id')
  .get(getCustomerById)
  .put(customerValidationRules, validate, updateCustomer)
  .delete(authorize('admin', 'super_admin'), deleteCustomer);

module.exports = router;
