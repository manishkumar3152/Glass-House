const Invoice = require('../models/Invoice');
const invoiceService = require('../services/invoiceService');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { STATUS } = require('../constants/invoiceStatusConstants');

// @desc    Get all invoices with filters & pagination
// @route   GET /api/invoices
// @access  Private
const getInvoices = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;
  const search = req.query.search ? req.query.search.trim() : '';
  const customerId = req.query.customer;
  const status = req.query.status;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;

  const query = {};

  if (customerId) {
    query.customer = customerId;
  }

  if (status) {
    query.invoiceStatus = status;
  }

  if (search) {
    query.$or = [
      { invoiceNumber: { $regex: search, $options: 'i' } },
      { poNumber: { $regex: search, $options: 'i' } },
      { 'customerSnapshot.customerName': { $regex: search, $options: 'i' } },
      { 'customerSnapshot.phone': { $regex: search, $options: 'i' } },
      { customerGSTIN: { $regex: search, $options: 'i' } }
    ];
  }

  if (startDate || endDate) {
    query.invoiceDate = {};
    if (startDate) {
      query.invoiceDate.$gte = new Date(startDate);
    }
    if (endDate) {
      const eDate = new Date(endDate);
      eDate.setHours(23, 59, 59, 999);
      query.invoiceDate.$lte = eDate;
    }
  }

  const total = await Invoice.countDocuments(query);
  const invoices = await Invoice.find(query)
    .populate('customer', 'customerName email phone gstin')
    .sort({ invoiceDate: -1, sequenceNumber: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        invoices,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      },
      'Invoices retrieved successfully'
    )
  );
});

// @desc    Get single invoice by ID
// @route   GET /api/invoices/:id
// @access  Private
const getInvoiceById = asyncHandler(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate('customer')
    .populate('createdBy', 'name email role')
    .populate('approvedBy', 'name email role');

  if (!invoice) {
    return next(new ApiError(404, 'Invoice not found'));
  }

  res.status(200).json(
    new ApiResponse(200, invoice, 'Invoice retrieved successfully')
  );
});

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Private
const createInvoice = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.createInvoice(req.body, req.user._id);

  res.status(201).json(
    new ApiResponse(201, invoice, 'Proforma Invoice created successfully')
  );
});

// @desc    Update invoice
// @route   PUT /api/invoices/:id
// @access  Private
const updateInvoice = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.updateInvoice(req.params.id, req.body, req.user._id);

  res.status(200).json(
    new ApiResponse(200, invoice, 'Proforma Invoice updated successfully')
  );
});

// @desc    Delete invoice (Draft only)
// @route   DELETE /api/invoices/:id
// @access  Private
const deleteInvoice = asyncHandler(async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) {
    return next(new ApiError(404, 'Invoice not found'));
  }

  if (invoice.invoiceStatus !== STATUS.DRAFT) {
    return next(new ApiError(400, 'Only draft invoices can be deleted. Please cancel approved or pending invoices instead.'));
  }

  await invoice.deleteOne();

  res.status(200).json(
    new ApiResponse(200, null, 'Draft invoice deleted successfully')
  );
});

// @desc    Approve invoice
// @route   POST /api/invoices/:id/approve
// @access  Private (Admin / Super Admin)
const approveInvoice = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.approveInvoice(req.params.id, req.user._id);

  res.status(200).json(
    new ApiResponse(200, invoice, 'Proforma Invoice approved successfully')
  );
});

// @desc    Cancel invoice
// @route   POST /api/invoices/:id/cancel
// @access  Private
const cancelInvoice = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.cancelInvoice(req.params.id, req.user._id);

  res.status(200).json(
    new ApiResponse(200, invoice, 'Proforma Invoice cancelled')
  );
});

// @desc    Duplicate invoice
// @route   POST /api/invoices/:id/duplicate
// @access  Private
const duplicateInvoice = asyncHandler(async (req, res) => {
  const invoice = await invoiceService.duplicateInvoice(req.params.id, req.user._id);

  res.status(201).json(
    new ApiResponse(201, invoice, 'Invoice duplicated as new draft successfully')
  );
});

module.exports = {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  approveInvoice,
  cancelInvoice,
  duplicateInvoice
};
