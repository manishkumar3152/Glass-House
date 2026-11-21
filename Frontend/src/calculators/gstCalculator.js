import { roundNumber } from './areaCalculator';

export const calculateGst = (taxableAmount, options = {}) => {
  const taxable = Number(taxableAmount) || 0;
  
  let isInterState = options.isInterState;
  if (isInterState === undefined && options.companyStateCode && options.customerStateCode) {
    isInterState = String(options.companyStateCode).trim() !== String(options.customerStateCode).trim();
  }
  if (isInterState === undefined) {
    isInterState = true;
  }

  const gstRate = options.gstRate !== undefined ? Number(options.gstRate) : 18;

  if (isInterState) {
    const igstAmount = roundNumber((taxable * gstRate) / 100, 2);
    return {
      taxType: 'IGST',
      isInterState: true,
      gstRate,
      igstRate: gstRate,
      igstAmount,
      cgstRate: 0,
      cgstAmount: 0,
      sgstRate: 0,
      sgstAmount: 0,
      totalGst: igstAmount
    };
  } else {
    const cgstRate = options.cgstRate !== undefined ? Number(options.cgstRate) : (gstRate / 2);
    const sgstRate = options.sgstRate !== undefined ? Number(options.sgstRate) : (gstRate / 2);
    const cgstAmount = roundNumber((taxable * cgstRate) / 100, 2);
    const sgstAmount = roundNumber((taxable * sgstRate) / 100, 2);
    const totalGst = roundNumber(cgstAmount + sgstAmount, 2);

    return {
      taxType: 'CGST_SGST',
      isInterState: false,
      gstRate,
      igstRate: 0,
      igstAmount: 0,
      cgstRate,
      cgstAmount,
      sgstRate,
      sgstAmount,
      totalGst
    };
  }
};
