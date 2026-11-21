const mongoose = require('mongoose');

const invoiceSequenceSchema = new mongoose.Schema(
  {
    prefix: {
      type: String,
      default: 'PI'
    },
    financialYear: {
      type: String,
      required: true
    },
    lastSequenceNumber: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

invoiceSequenceSchema.index({ prefix: 1, financialYear: 1 }, { unique: true });

module.exports = mongoose.model('InvoiceSequence', invoiceSequenceSchema);
