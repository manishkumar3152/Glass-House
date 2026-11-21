const TaxConfiguration = require('../models/TaxConfiguration');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get active tax configuration
// @route   GET /api/tax
// @access  Private
const getTaxConfiguration = asyncHandler(async (req, res) => {
  let tax = await TaxConfiguration.findOne({ isDefault: true });
  if (!tax) {
    tax = await TaxConfiguration.findOne();
  }

  res.status(200).json(
    new ApiResponse(200, tax, 'Tax configuration fetched successfully')
  );
});

// @desc    Update tax configuration
// @route   PUT /api/tax
// @access  Private (Admin)
const updateTaxConfiguration = asyncHandler(async (req, res) => {
  let tax = await TaxConfiguration.findOne({ isDefault: true });

  if (!tax) {
    tax = await TaxConfiguration.create({
      ...req.body,
      isDefault: true
    });
  } else {
    tax = await TaxConfiguration.findByIdAndUpdate(tax._id, req.body, {
      new: true,
      runValidators: true
    });
  }

  res.status(200).json(
    new ApiResponse(200, tax, 'Tax configuration updated successfully')
  );
});

module.exports = {
  getTaxConfiguration,
  updateTaxConfiguration
};
