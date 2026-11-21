const express = require('express');
const router = express.Router();
const {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { customerValidationRules } = require('../validators/customerValidator');
const validate = require('../middleware/validationMiddleware');

router.use(protect);

router
  .route('/')
  .get(getCustomers)
  .post(customerValidationRules, validate, createCustomer);

router
  .route('/:id')
  .get(getCustomerById)
  .put(customerValidationRules, validate, updateCustomer)
  .delete(authorize('admin', 'super_admin'), deleteCustomer);

module.exports = router;
