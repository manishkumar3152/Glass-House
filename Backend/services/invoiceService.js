const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const Company = require('../models/Company');
const TermsAndConditions = require('../models/TermsAndConditions');
const { generateNextInvoiceNumber } = require('./invoiceNumberService');
const { calculateInvoiceTotals } = require('./invoiceCalculationService');
const { createCustomerSnapshot } = require('./customerService');
const ApiError = require('../utils/ApiError');
const { STATUS } = require('../constants/invoiceStatusConstants');

/**
 * Creates a new invoice with full calculation and snapshot preservation.
 */
const createInvoice = async (invoiceData, userId) => {
  const customer = await Customer.findById(invoiceData.customer);
  if (!customer) {
    throw new ApiError(404, 'Customer not found');
  }

  // Get active Company
  let company = await Company.findOne({ isDefault: true });
  if (!company) {
    company = await Company.findOne();
  }
  const companySnapshot = company ? company.toObject() : {};

  // Get Terms and Conditions
  let termsDoc = await TermsAndConditions.findOne({ isDefault: true });
  if (!termsDoc) {
    termsDoc = await TermsAndConditions.findOne();
  }
  const termsSnapshot = termsDoc && termsDoc.terms ? termsDoc.terms.filter(t => t.isActive).map(t => ({
    termNumber: t.termNumber,
    text: t.text
  })) : [];

  // Generate unique PI number or use custom provided PI number
  const invoiceDate = invoiceData.invoiceDate ? new Date(invoiceData.invoiceDate) : new Date();
  let invoiceNumber = invoiceData.invoiceNumber ? String(invoiceData.invoiceNumber).trim() : '';
  let financialYear = '';
  let sequenceNumber = 0;

  if (invoiceNumber) {
    const existing = await Invoice.findOne({ invoiceNumber });
    if (existing) {
      throw new ApiError(400, `Invoice with number "${invoiceNumber}" already exists.`);
    }
    const match = invoiceNumber.match(/PI-(\d{2}-\d{2})-(\d+)/i);
    if (match) {
      financialYear = match[1];
      sequenceNumber = parseInt(match[2], 10);
    } else {
      financialYear = 'CUSTOM';
      sequenceNumber = 1;
    }
  } else {
    const sequenceInfo = await generateNextInvoiceNumber(invoiceDate);
    invoiceNumber = sequenceInfo.invoiceNumber;
    financialYear = sequenceInfo.financialYear;
    sequenceNumber = sequenceInfo.sequenceNumber;
  }

  // Build Customer Snapshot
  const customerSnapshot = createCustomerSnapshot(customer, {
    customerName: customer.customerName,
    billingAddress: invoiceData.billingAddress,
    deliveryAddress: invoiceData.deliveryAddress,
    contactPerson: invoiceData.contactPerson,
    contactNumber: invoiceData.contactNumber,
    customerGSTIN: invoiceData.customerGSTIN
  });

  // Authoritative calculations
  const calculated = calculateInvoiceTotals({
    glassItems: invoiceData.glassItems || [],
    processingItems: invoiceData.processingItems || [],
    additionalCharges: invoiceData.additionalCharges || {},
    taxConfig: invoiceData.taxConfig || {},
    lengthUnit: invoiceData.lengthUnit || 'MM',
    areaUnit: invoiceData.areaUnit || 'SQM',
    extra: invoiceData.extra !== undefined ? Number(invoiceData.extra) : 0,
    standard: Boolean(invoiceData.standard),
    companyStateCode: companySnapshot.stateCode || '07',
    customerStateCode: customer.stateCode || ''
  });

  const invoice = new Invoice({
    invoiceNumber: invoiceNumber,
    financialYear: financialYear,
    sequenceNumber: sequenceNumber,
    invoiceDate: invoiceDate,
    poNumber: invoiceData.poNumber || '',
    customer: customer._id,
    customerSnapshot,
    billingAddress: invoiceData.billingAddress || customer.billingAddress,
    deliveryAddress: invoiceData.deliveryAddress || customer.deliveryAddress || customer.billingAddress,
    deliveryDate: invoiceData.deliveryDate ? new Date(invoiceData.deliveryDate) : null,
    contactPerson: invoiceData.contactPerson || customer.contactPerson,
    contactNumber: invoiceData.contactNumber || customer.phone,
    customerGSTIN: invoiceData.customerGSTIN || customer.gstin,
    areaUnit: invoiceData.areaUnit || 'SQM',
    lengthUnit: invoiceData.lengthUnit || 'MM',
    extra: invoiceData.extra !== undefined ? Number(invoiceData.extra) : 0,
    standard: Boolean(invoiceData.standard),

    ...calculated,

    preparedBy: invoiceData.preparedBy || 'Sales Executive',
    checkedBy: invoiceData.checkedBy || 'Commercial Manager',
    authorizedSignatory: companySnapshot.authorizedSignatory || 'Authorized Signatory',
    termsAndConditionsSnapshot: termsSnapshot,
    companySnapshot,
    invoiceStatus: invoiceData.invoiceStatus || STATUS.DRAFT,
    createdBy: userId
  });

  return await invoice.save();
};

/**
 * Updates an existing draft or pending invoice.
 */
const updateInvoice = async (invoiceId, updateData, userId) => {
  const existingInvoice = await Invoice.findById(invoiceId);
  if (!existingInvoice) {
    throw new ApiError(404, 'Invoice not found');
  }

  if (existingInvoice.invoiceStatus === STATUS.APPROVED) {
    throw new ApiError(400, 'Approved invoices cannot be modified. Please create an amendment or duplicate.');
  }

  let customer = existingInvoice.customer;
  if (updateData.customer && updateData.customer.toString() !== existingInvoice.customer.toString()) {
    customer = await Customer.findById(updateData.customer);
    if (!customer) {
      throw new ApiError(404, 'New customer not found');
    }
  } else {
    customer = await Customer.findById(existingInvoice.customer);
  }

  const customerSnapshot = createCustomerSnapshot(customer, {
    customerName: customer.customerName,
    billingAddress: updateData.billingAddress || existingInvoice.billingAddress,
    deliveryAddress: updateData.deliveryAddress || existingInvoice.deliveryAddress,
    contactPerson: updateData.contactPerson || existingInvoice.contactPerson,
    contactNumber: updateData.contactNumber || existingInvoice.contactNumber,
    customerGSTIN: updateData.customerGSTIN || existingInvoice.customerGSTIN
  });

  const calculated = calculateInvoiceTotals({
    glassItems: updateData.glassItems || existingInvoice.glassItems,
    processingItems: updateData.processingItems || existingInvoice.processingItems,
    additionalCharges: updateData.additionalCharges || existingInvoice.additionalCharges,
    taxConfig: updateData.taxConfig || existingInvoice.taxDetails,
    lengthUnit: updateData.lengthUnit || existingInvoice.lengthUnit,
    areaUnit: updateData.areaUnit || existingInvoice.areaUnit,
    extra: updateData.extra !== undefined ? Number(updateData.extra) : (existingInvoice.extra || 0),
    standard: updateData.standard !== undefined ? Boolean(updateData.standard) : Boolean(existingInvoice.standard),
    companyStateCode: existingInvoice.companySnapshot?.stateCode || '07',
    customerStateCode: customer.stateCode || ''
  });

  if (updateData.invoiceNumber && String(updateData.invoiceNumber).trim()) {
    const customNum = String(updateData.invoiceNumber).trim();
    if (customNum !== existingInvoice.invoiceNumber) {
      const duplicate = await Invoice.findOne({ invoiceNumber: customNum, _id: { $ne: invoiceId } });
      if (duplicate) {
        throw new ApiError(400, `Invoice with number "${customNum}" already exists.`);
      }
      existingInvoice.invoiceNumber = customNum;
    }
  }

  Object.assign(existingInvoice, {
    poNumber: updateData.poNumber !== undefined ? updateData.poNumber : existingInvoice.poNumber,
    deliveryDate: updateData.deliveryDate ? new Date(updateData.deliveryDate) : existingInvoice.deliveryDate,
    billingAddress: updateData.billingAddress || existingInvoice.billingAddress,
    deliveryAddress: updateData.deliveryAddress || existingInvoice.deliveryAddress,
    contactPerson: updateData.contactPerson || existingInvoice.contactPerson,
    contactNumber: updateData.contactNumber || existingInvoice.contactNumber,
    customerGSTIN: updateData.customerGSTIN || existingInvoice.customerGSTIN,
    areaUnit: updateData.areaUnit || existingInvoice.areaUnit,
    lengthUnit: updateData.lengthUnit || existingInvoice.lengthUnit,
    extra: updateData.extra !== undefined ? Number(updateData.extra) : (existingInvoice.extra || 0),
    standard: updateData.standard !== undefined ? Boolean(updateData.standard) : Boolean(existingInvoice.standard),
    customerSnapshot,
    ...calculated,
    preparedBy: updateData.preparedBy || existingInvoice.preparedBy,
    checkedBy: updateData.checkedBy || existingInvoice.checkedBy,
    invoiceStatus: updateData.invoiceStatus || existingInvoice.invoiceStatus
  });

  return await existingInvoice.save();
};

/**
 * Approves an invoice and locks its snapshot.
 */
const approveInvoice = async (invoiceId, userId) => {
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) {
    throw new ApiError(404, 'Invoice not found');
  }

  if (invoice.invoiceStatus === STATUS.APPROVED) {
    throw new ApiError(400, 'Invoice is already approved');
  }

  invoice.invoiceStatus = STATUS.APPROVED;
  invoice.approvedBy = userId;
  invoice.approvalDate = new Date();

  return await invoice.save();
};

/**
 * Cancels an invoice.
 */
const cancelInvoice = async (invoiceId, userId) => {
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) {
    throw new ApiError(404, 'Invoice not found');
  }

  invoice.invoiceStatus = STATUS.CANCELLED;
  return await invoice.save();
};

/**
 * Duplicates an invoice to a new draft with a fresh PI number.
 */
const duplicateInvoice = async (invoiceId, userId) => {
  const source = await Invoice.findById(invoiceId);
  if (!source) {
    throw new ApiError(404, 'Source invoice not found');
  }

  const sequenceInfo = await generateNextInvoiceNumber(new Date());

  const sourceObj = source.toObject();
  delete sourceObj._id;
  delete sourceObj.createdAt;
  delete sourceObj.updatedAt;

  // Clean subdocument IDs if needed
  if (Array.isArray(sourceObj.glassItems)) {
    sourceObj.glassItems = sourceObj.glassItems.map(item => {
      const copy = { ...item };
      delete copy._id;
      return copy;
    });
  }
  if (Array.isArray(sourceObj.processingItems)) {
    sourceObj.processingItems = sourceObj.processingItems.map(item => {
      const copy = { ...item };
      delete copy._id;
      return copy;
    });
  }

  const newInvoice = new Invoice({
    ...sourceObj,
    invoiceNumber: sequenceInfo.invoiceNumber,
    financialYear: sequenceInfo.financialYear,
    sequenceNumber: sequenceInfo.sequenceNumber,
    invoiceDate: new Date(),
    invoiceStatus: STATUS.DRAFT,
    pdfPath: '',
    pdfGeneratedAt: null,
    createdBy: userId,
    approvedBy: null,
    approvalDate: null
  });

  return await newInvoice.save();
};

module.exports = {
  createInvoice,
  updateInvoice,
  approveInvoice,
  cancelInvoice,
  duplicateInvoice
};
