const GlassSpecification = require('../models/GlassSpecification');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all glass specifications
// @route   GET /api/glass-specifications
// @access  Private
const getGlassSpecifications = asyncHandler(async (req, res) => {
  const specs = await GlassSpecification.find().sort({ thickness: 1, glassName: 1 });
  res.status(200).json(
    new ApiResponse(200, specs, 'Glass specifications fetched successfully')
  );
});

// @desc    Get glass specification by ID
// @route   GET /api/glass-specifications/:id
// @access  Private
const getGlassSpecificationById = asyncHandler(async (req, res, next) => {
  const spec = await GlassSpecification.findById(req.params.id);
  if (!spec) {
    return next(new ApiError(404, 'Glass specification not found'));
  }
  res.status(200).json(
    new ApiResponse(200, spec, 'Glass specification fetched successfully')
  );
});

// @desc    Create glass specification
// @route   POST /api/glass-specifications
// @access  Private (Admin)
const createGlassSpecification = asyncHandler(async (req, res) => {
  const spec = await GlassSpecification.create(req.body);
  res.status(201).json(
    new ApiResponse(201, spec, 'Glass specification created successfully')
  );
});

// @desc    Update glass specification
// @route   PUT /api/glass-specifications/:id
// @access  Private (Admin)
const updateGlassSpecification = asyncHandler(async (req, res, next) => {
  let spec = await GlassSpecification.findById(req.params.id);
  if (!spec) {
    return next(new ApiError(404, 'Glass specification not found'));
  }

  spec = await GlassSpecification.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json(
    new ApiResponse(200, spec, 'Glass specification updated successfully')
  );
});

// @desc    Delete glass specification
// @route   DELETE /api/glass-specifications/:id
// @access  Private (Admin)
const deleteGlassSpecification = asyncHandler(async (req, res, next) => {
  const spec = await GlassSpecification.findById(req.params.id);
  if (!spec) {
    return next(new ApiError(404, 'Glass specification not found'));
  }

  await spec.deleteOne();
  res.status(200).json(
    new ApiResponse(200, null, 'Glass specification deleted successfully')
  );
});

// @desc    Bulk update glass specification status
// @route   POST /api/glass-specifications/bulk-status
// @access  Private (Admin)
const bulkUpdateSpecStatus = asyncHandler(async (req, res, next) => {
  const { ids, status } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return next(new ApiError(400, 'Please provide an array of specification IDs'));
  }
  if (!status) {
    return next(new ApiError(400, 'Please provide status'));
  }

  await GlassSpecification.updateMany({ _id: { $in: ids } }, { $set: { status } });

  res.status(200).json(
    new ApiResponse(200, { count: ids.length, status }, `Status updated to "${status}" for ${ids.length} specification(s)`)
  );
});

// @desc    Bulk delete glass specifications
// @route   POST /api/glass-specifications/bulk-delete
// @access  Private (Admin)
const bulkDeleteSpecs = asyncHandler(async (req, res, next) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return next(new ApiError(400, 'Please provide an array of specification IDs'));
  }

  const result = await GlassSpecification.deleteMany({ _id: { $in: ids } });

  res.status(200).json(
    new ApiResponse(200, { deletedCount: result.deletedCount }, `Deleted ${result.deletedCount} specification(s) successfully`)
  );
});

module.exports = {
  getGlassSpecifications,
  getGlassSpecificationById,
  createGlassSpecification,
  updateGlassSpecification,
  deleteGlassSpecification,
  bulkUpdateSpecStatus,
  bulkDeleteSpecs
};
