const Company = require('../models/Company');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get company details
// @route   GET /api/company
// @access  Private
const getCompany = asyncHandler(async (req, res) => {
  let company = await Company.findOne({ isDefault: true });
  if (!company) {
    company = await Company.findOne();
  }

  res.status(200).json(
    new ApiResponse(200, company, 'Company details fetched successfully')
  );
});

// @desc    Update company details
// @route   PUT /api/company
// @access  Private (Admin)
const updateCompany = asyncHandler(async (req, res) => {
  let company = await Company.findOne({ isDefault: true });

  if (!company) {
    company = await Company.create({
      ...req.body,
      isDefault: true
    });
  } else {
    company = await Company.findByIdAndUpdate(company._id, req.body, {
      new: true,
      runValidators: true
    });
  }

  res.status(200).json(
    new ApiResponse(200, company, 'Company details updated successfully')
  );
});

module.exports = {
  getCompany,
  updateCompany
};
