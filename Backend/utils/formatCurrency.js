/**
 * Formats a number to Indian currency format (e.g. 5,906.29 or ₹5,906.29)
 * @param {number} amount
 * @param {boolean} includeSymbol
 * @returns {string}
 */
const formatCurrency = (amount, includeSymbol = false) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return includeSymbol ? '₹0.00' : '0.00';
  }
  const formatted = Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return includeSymbol ? `₹${formatted}` : formatted;
};

module.exports = formatCurrency;
