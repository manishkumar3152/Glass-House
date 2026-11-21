const express = require('express');
const router = express.Router();
const {
  getGlassRates,
  getGlassRateById,
  createGlassRate,
  updateGlassRate,
  deleteGlassRate
} = require('../controllers/glassRateController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { glassRateRules } = require('../validators/masterValidator');
const validate = require('../middleware/validationMiddleware');

router.use(protect);

router
  .route('/')
  .get(getGlassRates)
  .post(authorize('admin', 'super_admin'), glassRateRules, validate, createGlassRate);

router
  .route('/:id')
  .get(getGlassRateById)
  .put(authorize('admin', 'super_admin'), glassRateRules, validate, updateGlassRate)
  .delete(authorize('admin', 'super_admin'), deleteGlassRate);

module.exports = router;
