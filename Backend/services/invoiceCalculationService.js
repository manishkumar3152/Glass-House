const { processGlassItems } = require('./glassCalculationService');
const { processProcessingItems } = require('./processingCalculationService');
const { calculateAdditionalCharges } = require('../calculators/additionalChargesCalculator');
const { processTaxCalculation } = require('./taxCalculationService');
const { calculateRounding } = require('../calculators/roundingCalculator');
const { amountInWords } = require('../calculators/amountInWordsCalculator');
const roundNumber = require('../utils/roundNumber');

/**
 * Authoritative complete invoice calculation service.
 * Used by invoiceController on save/update, and invoiceCalculationController for live preview.
 * 
 * @param {Object} payload
 * @returns {Object} Complete calculated invoice breakdown
 */
const calculateInvoiceTotals = (payload = {}) => {
  const {
    glassItems = [],
    processingItems = [],
    additionalCharges = {},
    taxConfig = {},
    lengthUnit = 'MM',
    areaUnit = 'SQM',
    extra = 0,
    standard = false,
    companyStateCode,
    customerStateCode
  } = payload;

  // 1. Glass Items calculations
  const glassData = processGlassItems(glassItems, lengthUnit, areaUnit, extra, standard);

  // 2. Processing Items calculations
  const processingData = processProcessingItems(processingItems);

  // 3. Total Cost
  const totalCost = roundNumber(glassData.glassTotal + processingData.totalProcessingCost, 2);

  // 4. Additional Charges (Insurance, Handling, Document, Others)
  const addChargesData = calculateAdditionalCharges(
    totalCost,
    glassData.glassTotal,
    additionalCharges
  );

  // 5. Taxable Amount (Total Amount Before Tax)
  const taxableAmount = roundNumber(totalCost + addChargesData.totalAdditionalCharges, 2);

  // 6. Tax / GST Calculation
  const taxOptions = {
    isInterState: taxConfig.isInterState,
    gstRate: taxConfig.gstRate,
    cgstRate: taxConfig.cgstRate,
    sgstRate: taxConfig.sgstRate,
    companyStateCode: companyStateCode || taxConfig.companyStateCode,
    customerStateCode: customerStateCode || taxConfig.customerStateCode
  };
  const taxDetails = processTaxCalculation(taxableAmount, taxOptions);

  // 7. Total Amount After Tax
  const finalAmount = roundNumber(taxableAmount + taxDetails.totalGst, 2);

  // 8. Rounding Off
  const rounding = calculateRounding(finalAmount);

  // 9. Amount in Words
  const words = amountInWords(rounding.roundedAmount);

  return {
    glassItems: glassData.items,
    totalQuantity: glassData.totalQuantity,
    totalActualArea: glassData.totalActualArea,
    totalWeight: glassData.totalWeight,
    totalChargeableArea: glassData.totalChargeableArea,
    glassTotal: glassData.glassTotal,

    processingItems: processingData.items,
    totalProcessingCost: processingData.totalProcessingCost,

    totalCost,

    additionalCharges: {
      insurancePercent: addChargesData.insurancePercent,
      insuranceAmount: addChargesData.insuranceAmount,
      documentCharge: addChargesData.documentCharge,
      otherCharges: addChargesData.otherCharges,
      insuranceOnGlassOnly: Boolean(additionalCharges.insuranceOnGlassOnly)
    },
    totalAdditionalCharges: addChargesData.totalAdditionalCharges,

    taxableAmount,
    taxDetails,
    totalGST: taxDetails.totalGst,

    finalAmount,
    roundedAmount: rounding.roundedAmount,
    roundOffDifference: rounding.roundOffDifference,
    amountInWords: words
  };
};

module.exports = {
  calculateInvoiceTotals
};
