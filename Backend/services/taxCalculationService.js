const { calculateGst } = require('../calculators/gstCalculator');

const processTaxCalculation = (taxableAmount, options = {}) => {
  return calculateGst(taxableAmount, options);
};

module.exports = {
  processTaxCalculation
};
