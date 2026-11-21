const mongoose = require('mongoose');

const termItemSchema = new mongoose.Schema({
  termNumber: {
    type: Number,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const termsAndConditionsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Standard Glass Industry Terms and Conditions'
    },
    terms: [termItemSchema],
    isDefault: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('TermsAndConditions', termsAndConditionsSchema);
