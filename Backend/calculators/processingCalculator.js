const roundNumber = require('../utils/roundNumber');

/**
 * Calculates processing charge row amount and total processing cost.
 * Amount = Qty × Rate
 * 
 * @param {Array} processingItems - List of { name, quantity, rate, per, amount }
 * @returns {Object} { items: Array, totalProcessingCost: number }
 */
const calculateProcessingCharges = (processingItems = []) => {
  if (!Array.isArray(processingItems) || processingItems.length === 0) {
    return { items: [], totalProcessingCost: 0 };
  }

  let totalProcessingCost = 0;

  const items = processingItems.map((item) => {
    const qty = Number(item.quantity ?? item.qty) || 0;
    const rate = Number(item.rate) || 0;
    const amount = roundNumber(qty * rate, 2);
    totalProcessingCost += amount;

    return {
      name: item.name || '',
      quantity: qty,
      unit: item.unit || 'NOS',
      rate: rate,
      per: item.per || item.unit || 'NOS',
      amount: amount
    };
  });

  return {
    items,
    totalProcessingCost: roundNumber(totalProcessingCost, 2)
  };
};

module.exports = {
  calculateProcessingCharges
};
