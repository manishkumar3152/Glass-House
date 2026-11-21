const mongoose = require('mongoose');
const config = require('../config/config');
const Invoice = require('../models/Invoice');
const { generateInvoicePdf } = require('../services/pdfGenerationService');

const testPdfGeneration = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB for PDF generation test...');

    const invoice = await Invoice.findOne({ invoiceNumber: 'PI-26-27-8521' });
    if (!invoice) {
      console.error('Invoice PI-26-27-8521 not found!');
      process.exit(1);
    }

    console.log(`Generating PDF for ${invoice.invoiceNumber}...`);
    const result = await generateInvoicePdf(invoice);
    console.log(`PDF generated successfully at: ${result.filePath}`);
    console.log(`Buffer size: ${result.buffer.length} bytes`);

    invoice.pdfPath = result.relativePath;
    invoice.pdfGeneratedAt = new Date();
    await invoice.save();

    console.log('PDF generation test completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error generating PDF:', err);
    process.exit(1);
  }
};

testPdfGeneration();
