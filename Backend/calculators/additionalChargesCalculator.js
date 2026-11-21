const roundNumber = require('../utils/roundNumber');
const { DEFAULT_INSURANCE_PERCENT, DEFAULT_DOCUMENT_CHARGE } = require('../constants/calculationConstants');

/**
 * Calculates additional charges.
 * Insurance = Total Cost × Insurance Percent (default 2%)
 * Document Charge = Configured flat charge (default ₹25)
 * Other Additional Charges = Sum of other charges
 * Total Additional Charges = Insurance + Document Charge + Others
 * 
 * @param {number} totalCost - Total Cost (Glass Total + Total Processing)
 * @param {Object} options - { insurancePercent, documentCharge, otherCharges, insuranceOnGlassOnly }
 * @returns {Object}
 */
const calculateAdditionalCharges = (totalCost, glassTotal = 0, options = {}) => {
  const baseCost = options.insuranceOnGlassOnly ? Number(glassTotal) : Number(totalCost);
  const insurancePercent = options.insurancePercent !== undefined ? Number(options.insurancePercent) : DEFAULT_INSURANCE_PERCENT;
  const insuranceAmount = roundNumber((baseCost * insurancePercent) / 100, 2);

  const documentCharge = options.documentCharge !== undefined ? Number(options.documentCharge) : DEFAULT_DOCUMENT_CHARGE;
  const otherCharges = options.otherCharges ? Number(options.otherCharges) : 0;

  const totalAdditionalCharges = roundNumber(insuranceAmount + documentCharge + otherCharges, 2);

  return {
    insurancePercent,
    insuranceAmount,
    documentCharge,
    otherCharges,
    totalAdditionalCharges
  };
};

module.exports = {
  calculateAdditionalCharges
};
