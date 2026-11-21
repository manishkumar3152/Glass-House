const roundNumber = require('../utils/roundNumber');
const { DEFAULT_GST_RATE, DEFAULT_CGST_RATE, DEFAULT_SGST_RATE } = require('../constants/taxConstants');

/**
 * Calculates GST (IGST or CGST + SGST) based on taxable amount and company/customer state.
 * 
 * @param {number} taxableAmount - Amount before tax
 * @param {Object} options - { isInterState, gstRate, cgstRate, sgstRate, stateCode, customerStateCode }
 * @returns {Object}
 */
const calculateGst = (taxableAmount, options = {}) => {
  const taxable = Number(taxableAmount) || 0;
  
  // Determine if inter-state or intra-state
  let isInterState = options.isInterState;
  if (isInterState === undefined && options.companyStateCode && options.customerStateCode) {
    isInterState = String(options.companyStateCode).trim() !== String(options.customerStateCode).trim();
  }
  if (isInterState === undefined) {
    isInterState = true; // Default to IGST as per reference PI-26-27-8521
  }

  const gstRate = options.gstRate !== undefined ? Number(options.gstRate) : DEFAULT_GST_RATE;
  
  if (isInterState) {
    // IGST
    const igstAmount = roundNumber((taxable * gstRate) / 100, 2);
    return {
      taxType: 'IGST',
      isInterState: true,
      gstRate: gstRate,
      igstRate: gstRate,
      igstAmount: igstAmount,
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      totalGst: igstAmount
    };
  } else {
    // CGST + SGST
    const cgstRate = options.cgstRate !== undefined ? Number(options.cgstRate) : (gstRate / 2);
    const sgstRate = options.sgstRate !== undefined ? Number(options.sgstRate) : (gstRate / 2);

    const cgstAmount = roundNumber((taxable * cgstRate) / 100, 2);
    const sgstAmount = roundNumber((taxable * sgstRate) / 100, 2);
    const totalGst = roundNumber(cgstAmount + sgstAmount, 2);

    return {
      taxType: 'CGST_SGST',
      isInterState: false,
      gstRate: gstRate,
      igstRate: 0,
      igstAmount: 0,
      cgstRate: cgstRate,
      cgstAmount: cgstAmount,
      sgstRate: sgstRate,
      sgstAmount: sgstAmount,
      totalGst: totalGst
    };
  }
};

module.exports = {
  calculateGst
};
