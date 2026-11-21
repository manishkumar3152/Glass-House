const express = require('express');
const router = express.Router();
const { getTaxConfiguration, updateTaxConfiguration } = require('../controllers/taxController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);

router
  .route('/')
  .get(getTaxConfiguration)
  .put(authorize('admin', 'super_admin'), updateTaxConfiguration);

module.exports = router;
