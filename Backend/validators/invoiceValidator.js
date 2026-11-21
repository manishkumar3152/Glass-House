const { body } = require('express-validator');
const { parseDimensionValue } = require('../calculators/areaCalculator');

const invoiceValidationRules = [
  body('customer')
    .notEmpty()
    .withMessage('Customer reference is required'),
  body('billingAddress')
    .trim()
    .notEmpty()
    .withMessage('Billing address is required'),
  body('glassItems')
    .isArray({ min: 1 })
    .withMessage('At least one glass item is required'),
  body('glassItems.*.specification')
    .notEmpty()
    .withMessage('Glass specification is required for each item'),
  body('glassItems.*.length')
    .custom((val) => {
      const num = parseDimensionValue(val);
      if (num <= 0) throw new Error('Length must be greater than 0');
      return true;
    }),
  body('glassItems.*.width')
    .custom((val) => {
      const num = parseDimensionValue(val);
      if (num <= 0) throw new Error('Width must be greater than 0');
      return true;
    }),
  body('glassItems.*.quantity')
    .isInt({ gt: 0 })
    .withMessage('Quantity must be an integer greater than 0'),
  body('glassItems.*.rate')
    .isFloat({ min: 0 })
    .withMessage('Rate must be 0 or greater')
];

module.exports = {
  invoiceValidationRules
};
