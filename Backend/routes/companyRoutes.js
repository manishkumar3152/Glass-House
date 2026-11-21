const express = require('express');
const router = express.Router();
const { getCompany, updateCompany } = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { companyValidationRules } = require('../validators/masterValidator');
const validate = require('../middleware/validationMiddleware');

router.use(protect);

router
  .route('/')
  .get(getCompany)
  .put(authorize('admin', 'super_admin'), companyValidationRules, validate, updateCompany);

module.exports = router;
