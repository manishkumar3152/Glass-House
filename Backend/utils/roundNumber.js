/**
 * Precise decimal rounding to avoid floating point issues.
 * @param {number} value
 * @param {number} decimals
 * @returns {number}
 */
const roundNumber = (value, decimals = 2) => {
  if (value === undefined || value === null || isNaN(value)) return 0;
  return Number(Math.round(Number(value + 'e' + decimals)) + 'e-' + decimals);
};

module.exports = roundNumber;
