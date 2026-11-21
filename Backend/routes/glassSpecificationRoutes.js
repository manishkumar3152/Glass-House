const express = require('express');
const router = express.Router();
const {
  getGlassSpecifications,
  getGlassSpecificationById,
  createGlassSpecification,
  updateGlassSpecification,
  deleteGlassSpecification
} = require('../controllers/glassSpecificationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { glassSpecificationRules } = require('../validators/masterValidator');
const validate = require('../middleware/validationMiddleware');

router.use(protect);

router
  .route('/')
  .get(getGlassSpecifications)
  .post(authorize('admin', 'super_admin'), glassSpecificationRules, validate, createGlassSpecification);

router
  .route('/:id')
  .get(getGlassSpecificationById)
  .put(authorize('admin', 'super_admin'), glassSpecificationRules, validate, updateGlassSpecification)
  .delete(authorize('admin', 'super_admin'), deleteGlassSpecification);

module.exports = router;
