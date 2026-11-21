const InvoiceSequence = require('../models/InvoiceSequence');
const { PREFIX } = require('../constants/invoiceConstants');

/**
 * Calculates financial year string (e.g. '26-27' for Nov 2026).
 * Indian FY starts 1-April and ends 31-March.
 * 
 * @param {Date|string} date
 * @returns {string} e.g. '26-27'
 */
const getFinancialYear = (date = new Date()) => {
  const d = new Date(date);
  const year = d.getFullYear(); // e.g. 2026
  const month = d.getMonth() + 1; // 1-12

  let startYear;
  let endYear;

  if (month >= 4) {
    startYear = year % 100;
    endYear = (year + 1) % 100;
  } else {
    startYear = (year - 1) % 100;
    endYear = year % 100;
  }

  const sStr = String(startYear).padStart(2, '0');
  const eStr = String(endYear).padStart(2, '0');

  return `${sStr}-${eStr}`;
};

/**
 * Generates next unique sequential invoice number atomically.
 * Example format: PI-26-27-8521
 * 
 * @param {Date|string} date
 * @param {string} prefix
 * @returns {Promise<{ invoiceNumber: string, financialYear: string, sequenceNumber: number }>}
 */
const generateNextInvoiceNumber = async (date = new Date(), prefix = PREFIX) => {
  const financialYear = getFinancialYear(date);

  const seqDoc = await InvoiceSequence.findOneAndUpdate(
    { prefix, financialYear },
    { $inc: { lastSequenceNumber: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  const sequenceNumber = seqDoc.lastSequenceNumber;
  const invoiceNumber = `${prefix}-${financialYear}-${sequenceNumber}`;

  return {
    invoiceNumber,
    financialYear,
    sequenceNumber
  };
};

module.exports = {
  getFinancialYear,
  generateNextInvoiceNumber
};
