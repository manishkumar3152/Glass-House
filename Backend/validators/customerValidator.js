const { body } = require('express-validator');

const customerValidationRules = [
  body('customerName')
    .trim()
    .notEmpty()
    .withMessage('Customer name is required'),
  body('billingAddress')
    .trim()
    .notEmpty()
    .withMessage('Billing address is required'),
  body('phone')
    .optional({ checkFalsy: true })
    .trim(),
  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email address'),
  body('gstin')
    .optional({ checkFalsy: true })
    .trim()
];

module.exports = {
  customerValidationRules
};
