const mongoose = require('mongoose');

const glassRateSchema = new mongoose.Schema(
  {
    glassSpecification: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GlassSpecification',
      required: true
    },
    rate: {
      type: Number,
      required: [true, 'Rate is required']
    },
    per: {
      type: String,
      enum: ['SQFT', 'SQM', 'NOS', 'UNIT'],
      default: 'SQFT'
    },
    effectiveDate: {
      type: Date,
      default: Date.now
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      default: null
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

module.exports = mongoose.model('GlassRate', glassRateSchema);
