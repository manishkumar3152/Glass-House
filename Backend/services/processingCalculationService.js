const { calculateProcessingCharges } = require('../calculators/processingCalculator');

const processProcessingItems = (processingItems = []) => {
  return calculateProcessingCharges(processingItems);
};

module.exports = {
  processProcessingItems
};
