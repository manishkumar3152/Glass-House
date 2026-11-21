const { calculateInvoiceTotals } = require('../services/invoiceCalculationService');
const Company = require('../models/Company');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Calculate live invoice totals
// @route   POST /api/invoices/calculate
// @access  Private
const calculateLiveInvoice = asyncHandler(async (req, res) => {
  const company = await Company.findOne({ isDefault: true });
  const companyStateCode = company ? company.stateCode : '07';

  const calculationResult = calculateInvoiceTotals({
    ...req.body,
    companyStateCode
  });

  res.status(200).json(
    new ApiResponse(200, calculationResult, 'Invoice calculated successfully')
  );
});

module.exports = {
  calculateLiveInvoice
};
