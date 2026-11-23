const ProcessingCharge = require('../models/ProcessingCharge');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all processing charges
// @route   GET /api/processing-charges
// @access  Private
const getProcessingCharges = asyncHandler(async (req, res) => {
  const charges = await ProcessingCharge.find().sort({ name: 1 });
  res.status(200).json(
    new ApiResponse(200, charges, 'Processing charges fetched successfully')
  );
});

// @desc    Get processing charge by ID
// @route   GET /api/processing-charges/:id
// @access  Private
const getProcessingChargeById = asyncHandler(async (req, res, next) => {
  const charge = await ProcessingCharge.findById(req.params.id);
  if (!charge) {
    return next(new ApiError(404, 'Processing charge not found'));
  }
  res.status(200).json(
    new ApiResponse(200, charge, 'Processing charge fetched successfully')
  );
});

// @desc    Create processing charge
// @route   POST /api/processing-charges
// @access  Private (Admin)
const createProcessingCharge = asyncHandler(async (req, res) => {
  const charge = await ProcessingCharge.create(req.body);
  res.status(201).json(
    new ApiResponse(201, charge, 'Processing charge created successfully')
  );
});

// @desc    Update processing charge
// @route   PUT /api/processing-charges/:id
// @access  Private (Admin)
const updateProcessingCharge = asyncHandler(async (req, res, next) => {
  let charge = await ProcessingCharge.findById(req.params.id);
  if (!charge) {
    return next(new ApiError(404, 'Processing charge not found'));
  }

  charge = await ProcessingCharge.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json(
    new ApiResponse(200, charge, 'Processing charge updated successfully')
  );
});

// @desc    Delete processing charge
// @route   DELETE /api/processing-charges/:id
// @access  Private (Admin)
const deleteProcessingCharge = asyncHandler(async (req, res, next) => {
  const charge = await ProcessingCharge.findById(req.params.id);
  if (!charge) {
    return next(new ApiError(404, 'Processing charge not found'));
  }

  await charge.deleteOne();
  res.status(200).json(
    new ApiResponse(200, null, 'Processing charge deleted successfully')
  );
});

// @desc    Bulk update processing charge status
// @route   POST /api/processing-charges/bulk-status
// @access  Private (Admin)
const bulkUpdateChargeStatus = asyncHandler(async (req, res, next) => {
  const { ids, status } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return next(new ApiError(400, 'Please provide an array of charge IDs'));
  }
  if (!status) {
    return next(new ApiError(400, 'Please provide status'));
  }

  await ProcessingCharge.updateMany({ _id: { $in: ids } }, { $set: { status } });

  res.status(200).json(
    new ApiResponse(200, { count: ids.length, status }, `Status updated to "${status}" for ${ids.length} charge(s)`)
  );
});

// @desc    Bulk delete processing charges
// @route   POST /api/processing-charges/bulk-delete
// @access  Private (Admin)
const bulkDeleteCharges = asyncHandler(async (req, res, next) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return next(new ApiError(400, 'Please provide an array of charge IDs'));
  }

  const result = await ProcessingCharge.deleteMany({ _id: { $in: ids } });

  res.status(200).json(
    new ApiResponse(200, { deletedCount: result.deletedCount }, `Deleted ${result.deletedCount} charge(s) successfully`)
  );
});

module.exports = {
  getProcessingCharges,
  getProcessingChargeById,
  createProcessingCharge,
  updateProcessingCharge,
  deleteProcessingCharge,
  bulkUpdateChargeStatus,
  bulkDeleteCharges
};
