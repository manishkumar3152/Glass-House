const express = require('express');
const router = express.Router();
const {
  getGlassSpecifications,
  getGlassSpecificationById,
  createGlassSpecification,
  updateGlassSpecification,
  deleteGlassSpecification,
  bulkUpdateSpecStatus,
  bulkDeleteSpecs
} = require('../controllers/glassSpecificationController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { glassSpecificationRules } = require('../validators/masterValidator');
const validate = require('../middleware/validationMiddleware');

router.use(protect);

router
  .route('/')
  .get(getGlassSpecifications)
  .post(authorize('admin', 'super_admin'), glassSpecificationRules, validate, createGlassSpecification);

// Bulk operations (must be before /:id)
router.post('/bulk-status', authorize('admin', 'super_admin'), bulkUpdateSpecStatus);
router.post('/bulk-delete', authorize('admin', 'super_admin'), bulkDeleteSpecs);

router
  .route('/:id')
  .get(getGlassSpecificationById)
  .put(authorize('admin', 'super_admin'), glassSpecificationRules, validate, updateGlassSpecification)
  .delete(authorize('admin', 'super_admin'), deleteGlassSpecification);

module.exports = router;
