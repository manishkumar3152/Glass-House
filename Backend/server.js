// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const path = require('path');
// const rateLimit = require('express-rate-limit');
// const config = require('./config/config');
// const connectDB = require('./config/db');
// const notFound = require('./middleware/notFoundMiddleware');
// const errorHandler = require('./middleware/errorMiddleware');
// const logger = require('./utils/logger');

// // Route imports
// const authRoutes = require('./routes/authRoutes');
// const customerRoutes = require('./routes/customerRoutes');
// const companyRoutes = require('./routes/companyRoutes');
// const glassSpecificationRoutes = require('./routes/glassSpecificationRoutes');
// const glassRateRoutes = require('./routes/glassRateRoutes');
// const processingChargeRoutes = require('./routes/processingChargeRoutes');
// const taxRoutes = require('./routes/taxRoutes');
// const invoiceRoutes = require('./routes/invoiceRoutes');
// const invoiceCalculationRoutes = require('./routes/invoiceCalculationRoutes');
// const dashboardRoutes = require('./routes/dashboardRoutes');

// const app = express();

// // Connect to MongoDB
// connectDB();

// // Security Middleware
// app.use(helmet({
//   contentSecurityPolicy: false,
//   crossOriginResourcePolicy: { policy: 'cross-origin' }
// }));

// // CORS Configuration
// app.use(cors({
//   origin: '*',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Rate Limiter
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 1000,
//   message: 'Too many requests from this IP, please try again later.'
// });
// app.use('/api', limiter);

// // Logging
// if (config.nodeEnv !== 'test') {
//   app.use(morgan('dev'));
// }

// // Body parsers
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Static uploads folder
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.status(200).json({ status: 'OK', uptime: process.uptime(), timestamp: new Date() });
// });

// // API Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/customers', customerRoutes);
// app.use('/api/company', companyRoutes);
// app.use('/api/glass-specifications', glassSpecificationRoutes);
// app.use('/api/glass-rates', glassRateRoutes);
// app.use('/api/processing-charges', processingChargeRoutes);
// app.use('/api/tax', taxRoutes);
// app.use('/api/invoices/calculate', invoiceCalculationRoutes);
// app.use('/api/invoices', invoiceRoutes);
// app.use('/api/dashboard', dashboardRoutes);

// // Error Middlewares
// app.use(notFound);
// app.use(errorHandler);

// const PORT = config.port || 5000;
// const server = app.listen(PORT, () => {
//   logger.info(`GlassHouse Server running in ${config.nodeEnv} mode on port ${PORT}`);
// });

// process.on('unhandledRejection', (err) => {
//   logger.error(`Unhandled Rejection: ${err.message}`, err.stack);
// });

// module.exports = { app, server };




const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const connectDB = require('./config/db');
const notFound = require('./middleware/notFoundMiddleware');
const errorHandler = require('./middleware/errorMiddleware');
const logger = require('./utils/logger');

// Route imports
const authRoutes = require('./routes/authRoutes');
const customerRoutes = require('./routes/customerRoutes');
const companyRoutes = require('./routes/companyRoutes');
const glassSpecificationRoutes = require('./routes/glassSpecificationRoutes');
const glassRateRoutes = require('./routes/glassRateRoutes');
const processingChargeRoutes = require('./routes/processingChargeRoutes');
const taxRoutes = require('./routes/taxRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const invoiceCalculationRoutes = require('./routes/invoiceCalculationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

const app = express();

// Vercel sits behind a proxy; needed for express-rate-limit to see real IPs
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS Configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Logging
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Ensure the DB is connected before handling any request (cached across invocations)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    logger.error(`Database connection failed: ${err.message}`);
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});

// Static uploads folder
// NOTE: Vercel's filesystem is read-only, so new uploads cannot be saved here.
// Use cloud storage (Cloudinary, S3, etc.) for user uploads in production.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', uptime: process.uptime(), timestamp: new Date() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/glass-specifications', glassSpecificationRoutes);
app.use('/api/glass-rates', glassRateRoutes);
app.use('/api/processing-charges', processingChargeRoutes);
app.use('/api/tax', taxRoutes);
app.use('/api/invoices/calculate', invoiceCalculationRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`, err.stack);
});

// Only start a listener when NOT running on Vercel (i.e. local / traditional hosting)
if (!process.env.VERCEL) {
  const PORT = config.port || 5000;
  app.listen(PORT, () => {
    logger.info(`GlassHouse Server running in ${config.nodeEnv} mode on port ${PORT}`);
  });
}

// Vercel needs the Express app itself as the export
module.exports = app;