const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const { STATUS } = require('../constants/invoiceStatusConstants');

// @desc    Get dashboard metrics & stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const monthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);

  const [
    totalInvoices,
    draftInvoices,
    approvedInvoices,
    pendingInvoices,
    todayInvoicesCount,
    monthlyAggregation,
    overallGlassTotals
  ] = await Promise.all([
    Invoice.countDocuments(),
    Invoice.countDocuments({ invoiceStatus: STATUS.DRAFT }),
    Invoice.countDocuments({ invoiceStatus: STATUS.APPROVED }),
    Invoice.countDocuments({ invoiceStatus: STATUS.PENDING }),
    Invoice.countDocuments({ invoiceDate: { $gte: todayStart } }),
    Invoice.aggregate([
      {
        $match: {
          invoiceDate: { $gte: monthStart },
          invoiceStatus: { $ne: STATUS.CANCELLED }
        }
      },
      {
        $group: {
          _id: null,
          monthlyValue: { $sum: '$roundedAmount' }
        }
      }
    ]),
    Invoice.aggregate([
      {
        $match: {
          invoiceStatus: { $ne: STATUS.CANCELLED }
        }
      },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: '$totalQuantity' },
          totalWeight: { $sum: '$totalWeight' },
          totalValue: { $sum: '$roundedAmount' }
        }
      }
    ])
  ]);

  const monthlyInvoiceValue = monthlyAggregation[0]?.monthlyValue || 0;
  const totalGlassQuantity = overallGlassTotals[0]?.totalQuantity || 0;
  const totalGlassWeight = overallGlassTotals[0]?.totalWeight || 0;

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalInvoices,
        draftInvoices,
        approvedInvoices,
        pendingInvoices,
        todayInvoices: todayInvoicesCount,
        monthlyInvoiceValue,
        totalGlassQuantity,
        totalGlassWeight: Number(totalGlassWeight.toFixed(2))
      },
      'Dashboard stats retrieved successfully'
    )
  );
});

// @desc    Get recent invoices
// @route   GET /api/dashboard/recent-invoices
// @access  Private
const getRecentInvoices = asyncHandler(async (req, res) => {
  const recent = await Invoice.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('customer', 'customerName email phone');

  res.status(200).json(
    new ApiResponse(200, recent, 'Recent invoices retrieved successfully')
  );
});

// @desc    Get charts data (monthly trend & top customer distribution)
// @route   GET /api/dashboard/charts
// @access  Private
const getDashboardCharts = asyncHandler(async (req, res) => {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const [monthlyTrend, customerDistribution] = await Promise.all([
    Invoice.aggregate([
      {
        $match: {
          invoiceDate: { $gte: sixMonthsAgo },
          invoiceStatus: { $ne: STATUS.CANCELLED }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$invoiceDate' },
            month: { $month: '$invoiceDate' }
          },
          totalAmount: { $sum: '$roundedAmount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]),
    Invoice.aggregate([
      {
        $match: { invoiceStatus: { $ne: STATUS.CANCELLED } }
      },
      {
        $group: {
          _id: '$customerSnapshot.customerName',
          totalAmount: { $sum: '$roundedAmount' },
          invoicesCount: { $sum: 1 }
        }
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 6 }
    ])
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedMonthlyTrend = monthlyTrend.map(item => ({
    label: `${monthNames[item._id.month - 1]} ${item._id.year}`,
    totalAmount: item.totalAmount,
    count: item.count
  }));

  res.status(200).json(
    new ApiResponse(
      200,
      {
        monthlyTrend: formattedMonthlyTrend,
        customerDistribution
      },
      'Chart data retrieved successfully'
    )
  );
});

module.exports = {
  getDashboardStats,
  getRecentInvoices,
  getDashboardCharts
};
