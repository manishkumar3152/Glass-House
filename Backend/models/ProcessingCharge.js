const mongoose = require('mongoose');

const processingChargeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Charge name is required'],
      trim: true
    },
    unit: {
      type: String,
      default: 'NOS'
    },
    rate: {
      type: Number,
      required: [true, 'Rate is required'],
      default: 0
    },
    description: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('ProcessingCharge', processingChargeSchema);
