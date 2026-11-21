const { body } = require('express-validator');

const companyValidationRules = [
  body('companyName').trim().notEmpty().withMessage('Company name is required'),
  body('address').trim().notEmpty().withMessage('Company address is required'),
  body('gstin').trim().notEmpty().withMessage('Company GSTIN is required')
];

const glassSpecificationRules = [
  body('glassName').trim().notEmpty().withMessage('Glass specification name is required'),
  body('thickness').isFloat({ gt: 0 }).withMessage('Thickness must be greater than 0 mm')
];

const glassRateRules = [
  body('glassSpecification').notEmpty().withMessage('Glass specification reference is required'),
  body('rate').isFloat({ min: 0 }).withMessage('Rate must be 0 or greater')
];

const processingChargeRules = [
  body('name').trim().notEmpty().withMessage('Processing charge name is required'),
  body('rate').isFloat({ min: 0 }).withMessage('Rate must be 0 or greater')
];

module.exports = {
  companyValidationRules,
  glassSpecificationRules,
  glassRateRules,
  processingChargeRules
};
