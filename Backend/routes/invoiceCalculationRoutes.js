const express = require('express');
const router = express.Router();
const { calculateLiveInvoice } = require('../controllers/invoiceCalculationController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', calculateLiveInvoice);

module.exports = router;
