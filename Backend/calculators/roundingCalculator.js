const roundNumber = require('../utils/roundNumber');

/**
 * Calculates rounded amount and round-off difference.
 * Rounds to nearest integer rupee as standard Indian invoice practice.
 * 
 * @param {number} amount
 * @returns {Object} { roundedAmount: number, roundOffDifference: number }
 */
const calculateRounding = (amount) => {
  const val = Number(amount) || 0;
  const rounded = Math.round(val);
  const diff = roundNumber(rounded - val, 2);

  return {
    roundedAmount: rounded,
    roundOffDifference: diff
  };
};

module.exports = {
  calculateRounding
};
