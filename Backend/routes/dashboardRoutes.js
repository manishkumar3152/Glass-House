const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getRecentInvoices,
  getDashboardCharts
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/recent-invoices', getRecentInvoices);
router.get('/charts', getDashboardCharts);

module.exports = router;
