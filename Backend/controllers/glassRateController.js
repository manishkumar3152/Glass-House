const GlassRate = require('../models/GlassRate');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all glass rates
// @route   GET /api/glass-rates
// @access  Private
const getGlassRates = asyncHandler(async (req, res) => {
  const query = {};
  if (req.query.glassSpecification) {
    query.glassSpecification = req.query.glassSpecification;
  }
  if (req.query.customer) {
    query.customer = req.query.customer;
  }

  const rates = await GlassRate.find(query)
    .populate('glassSpecification')
    .populate('customer', 'customerName')
    .sort({ effectiveDate: -1 });

  res.status(200).json(
    new ApiResponse(200, rates, 'Glass rates fetched successfully')
  );
});

// @desc    Get glass rate by ID
// @route   GET /api/glass-rates/:id
// @access  Private
const getGlassRateById = asyncHandler(async (req, res, next) => {
  const rate = await GlassRate.findById(req.params.id)
    .populate('glassSpecification')
    .populate('customer');

  if (!rate) {
    return next(new ApiError(404, 'Glass rate not found'));
  }

  res.status(200).json(
    new ApiResponse(200, rate, 'Glass rate fetched successfully')
  );
});

// @desc    Create glass rate
// @route   POST /api/glass-rates
// @access  Private (Admin)
const createGlassRate = asyncHandler(async (req, res) => {
  const rate = await GlassRate.create(req.body);
  const populated = await rate.populate('glassSpecification');
  res.status(201).json(
    new ApiResponse(201, populated, 'Glass rate created successfully')
  );
});

// @desc    Update glass rate
// @route   PUT /api/glass-rates/:id
// @access  Private (Admin)
const updateGlassRate = asyncHandler(async (req, res, next) => {
  let rate = await GlassRate.findById(req.params.id);
  if (!rate) {
    return next(new ApiError(404, 'Glass rate not found'));
  }

  rate = await GlassRate.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('glassSpecification');

  res.status(200).json(
    new ApiResponse(200, rate, 'Glass rate updated successfully')
  );
});

// @desc    Delete glass rate
// @route   DELETE /api/glass-rates/:id
// @access  Private (Admin)
const deleteGlassRate = asyncHandler(async (req, res, next) => {
  const rate = await GlassRate.findById(req.params.id);
  if (!rate) {
    return next(new ApiError(404, 'Glass rate not found'));
  }

  await rate.deleteOne();
  res.status(200).json(
    new ApiResponse(200, null, 'Glass rate deleted successfully')
  );
});

module.exports = {
  getGlassRates,
  getGlassRateById,
  createGlassRate,
  updateGlassRate,
  deleteGlassRate
};
