import { roundNumber } from './areaCalculator';

export const calculateWeight = (chargeableArea, thickness, customDensity = 2.475, manualWeight = null, areaUnit = 'SQM') => {
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
