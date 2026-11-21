const roundNumber = require('../utils/roundNumber');
const { SQM_TO_SQFT } = require('../constants/calculationConstants');
const { RATE_UNITS } = require('../constants/unitConstants');

/**
 * Calculates glass amount based on chargeable area, quantity, rate, per unit, and areaUnit.
 * 
 * @param {number} chargeableArea - Area in Sqm or Sqft
 * @param {number} quantity - Quantity of pieces
 * @param {number} rate - Applied rate
 * @param {string} per - Rate unit ('SQFT', 'SQM', 'NOS', 'UNIT')
 * @param {string} areaUnit - Area unit ('SQM', 'SQFT')
 * @returns {number} Amount rounded to 2 decimals
 */
const calculateGlassAmount = (chargeableArea, quantity, rate, per = 'SQFT', areaUnit = 'SQM') => {
  const chrg = Number(chargeableArea) || 0;
  const qty = Number(quantity) || 0;
  const r = Number(rate) || 0;
  const unit = String(per || 'SQFT').toUpperCase();
  const aUnit = String(areaUnit || 'SQM').toUpperCase();

  if (r <= 0) return 0;

  let amount = 0;

  if (unit === RATE_UNITS.SQFT || unit === 'SQFT') {
    if (aUnit === 'SQFT') {
      amount = chrg * r;
    } else {
      amount = chrg * SQM_TO_SQFT * r;
    }
  } else if (unit === RATE_UNITS.SQM || unit === 'SQM') {
    if (aUnit === 'SQM') {
      amount = chrg * r;
    } else {
      amount = (chrg / SQM_TO_SQFT) * r;
    }
  } else if (unit === RATE_UNITS.NOS || unit === RATE_UNITS.UNIT || unit === 'PCS') {
    amount = qty * r;
  } else {
    amount = aUnit === 'SQFT' ? chrg * r : chrg * SQM_TO_SQFT * r;
  }

  return roundNumber(amount, 2);
};

module.exports = {
  calculateGlassAmount
};
