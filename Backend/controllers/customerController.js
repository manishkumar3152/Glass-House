const Customer = require('../models/Customer');
require('../models/GlassSpecification');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get all customers with search and pagination
// @route   GET /api/customers
// @access  Private
const getCustomers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 50;
  const search = req.query.search ? req.query.search.trim() : '';

  const query = {};
  if (search) {
    query.$or = [
      { customerName: { $regex: search, $options: 'i' } },
      { contactPerson: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { gstin: { $regex: search, $options: 'i' } },
      { city: { $regex: search, $options: 'i' } }
    ];
  }

  const total = await Customer.countDocuments(query);
  const customers = await Customer.find(query)
    .populate('glassRates.glassSpecification', 'glassName glassCode thickness defaultRate rateUnit')
    .sort({ customerName: 1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json(
    new ApiResponse(
      200,
      {
        customers,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      },
      'Customers fetched successfully'
    )
  );
});

// @desc    Get customer by ID
// @route   GET /api/customers/:id
// @access  Private
const getCustomerById = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id)
    .populate('glassRates.glassSpecification', 'glassName glassCode thickness defaultRate rateUnit');
  if (!customer) {
    return next(new ApiError(404, 'Customer not found'));
  }

  res.status(200).json(
    new ApiResponse(200, customer, 'Customer retrieved successfully')
  );
});

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
const createCustomer = asyncHandler(async (req, res) => {
  const created = await Customer.create(req.body);
  const customer = await Customer.findById(created._id)
    .populate('glassRates.glassSpecification', 'glassName glassCode thickness defaultRate rateUnit');
  res.status(201).json(
    new ApiResponse(201, customer, 'Customer created successfully')
  );
});

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = asyncHandler(async (req, res, next) => {
  let customer = await Customer.findById(req.params.id);
  if (!customer) {
    return next(new ApiError(404, 'Customer not found'));
  }

  customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  }).populate('glassRates.glassSpecification', 'glassName glassCode thickness defaultRate rateUnit');

  res.status(200).json(
    new ApiResponse(200, customer, 'Customer updated successfully')
  );
});

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private (Admin)
const deleteCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) {
    return next(new ApiError(404, 'Customer not found'));
  }

  await customer.deleteOne();

  res.status(200).json(
    new ApiResponse(200, null, 'Customer deleted successfully')
  );
});

// @desc    Bulk update customer status
// @route   POST /api/customers/bulk-status
// @access  Private
const bulkUpdateCustomerStatus = asyncHandler(async (req, res, next) => {
  const { ids, status } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return next(new ApiError(400, 'Please provide an array of customer IDs'));
  }
  if (!status) {
    return next(new ApiError(400, 'Please provide status'));
  }

  await Customer.updateMany({ _id: { $in: ids } }, { $set: { status } });

  res.status(200).json(
    new ApiResponse(200, { count: ids.length, status }, `Status updated for ${ids.length} customer(s)`)
  );
});

// @desc    Bulk delete customers
// @route   POST /api/customers/bulk-delete
// @access  Private (Admin)
const bulkDeleteCustomers = asyncHandler(async (req, res, next) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) {
    return next(new ApiError(400, 'Please provide an array of customer IDs'));
  }

  const result = await Customer.deleteMany({ _id: { $in: ids } });

  res.status(200).json(
    new ApiResponse(200, { deletedCount: result.deletedCount }, `Deleted ${result.deletedCount} customer(s) successfully`)
  );
});

module.exports = {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  bulkUpdateCustomerStatus,
  bulkDeleteCustomers
};
