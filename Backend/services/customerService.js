const Customer = require('../models/Customer');
const ApiError = require('../utils/ApiError');

const createCustomerSnapshot = (customerDoc, overrides = {}) => {
  return {
    customerName: overrides.customerName || customerDoc.customerName,
    billingAddress: overrides.billingAddress || customerDoc.billingAddress,
    deliveryAddress: overrides.deliveryAddress !== undefined ? overrides.deliveryAddress : (customerDoc.deliveryAddress || customerDoc.billingAddress),
    city: customerDoc.city || '',
    state: customerDoc.state || '',
    stateCode: customerDoc.stateCode || '',
    country: customerDoc.country || 'India',
    pinCode: customerDoc.pinCode || '',
    contactPerson: overrides.contactPerson !== undefined ? overrides.contactPerson : customerDoc.contactPerson,
    phone: overrides.contactNumber !== undefined ? overrides.contactNumber : customerDoc.phone,
    email: customerDoc.email || '',
    gstin: overrides.customerGSTIN !== undefined ? overrides.customerGSTIN : customerDoc.gstin
  };
};

module.exports = {
  createCustomerSnapshot
};
