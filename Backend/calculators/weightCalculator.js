const roundNumber = require('../utils/roundNumber');

/**
 * Calculates glass weight in Kg.
 * Weight = Area (Sqm) × Thickness (mm) × Glass Density (default 2.475 kg/m² per mm)
 * 
 * @param {number} chargeableArea - Area in Sqm or Sqft
 * @param {number} thickness - Thickness in mm
 * @param {number|null} customDensity - Density factor (default 2.475)
 * @param {number|null} manualWeight - Manual override
 * @param {string} areaUnit - 'SQM' or 'SQFT'
 * @returns {number} Weight in Kg rounded to 2 decimals
 */
const calculateWeight = (chargeableArea, thickness, customDensity = null, manualWeight = null, areaUnit = 'SQM') => {
  if (manualWeight !== null && manualWeight !== undefined && manualWeight !== '') {
    return roundNumber(Number(manualWeight), 2);
  }

  let areaInSqm = Number(chargeableArea) || 0;
  const thk = Number(thickness) || 6;
  const density = Number(customDensity) || 2.475;

  if (areaInSqm <= 0 || thk <= 0) return 0;

  if (String(areaUnit || 'SQM').toUpperCase() === 'SQFT') {
    areaInSqm = areaInSqm / 10.7639104167;
  }

  const rawWeight = areaInSqm * thk * density;
  return roundNumber(rawWeight, 2);
};

module.exports = {
  calculateWeight
};
