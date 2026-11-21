export const formatCurrency = (amount, includeSymbol = false) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return includeSymbol ? '₹0.00' : '0.00';
  }
  const formatted = Number(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return includeSymbol ? `₹${formatted}` : formatted;
};
