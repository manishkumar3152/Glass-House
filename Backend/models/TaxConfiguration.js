const mongoose = require('mongoose');

const taxConfigurationSchema = new mongoose.Schema(
  {
    taxName: {
      type: String,
      default: 'GST'
    },
    gstPercentage: {
      type: Number,
      default: 18
    },
    cgstPercentage: {
      type: Number,
      default: 9
    },
    sgstPercentage: {
      type: Number,
      default: 9
    },
    igstPercentage: {
      type: Number,
      default: 18
    },
    taxApplicability: {
      type: String,
      default: 'Standard GST on Finished Goods'
    },
    effectiveDate: {
      type: Date,
      default: Date.now
    },
    isDefault: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('TaxConfiguration', taxConfigurationSchema);
