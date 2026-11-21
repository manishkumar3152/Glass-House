const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true
    },
    logo: {
      type: String,
      default: ''
    },
    tagline: {
      type: String,
      default: ''
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true
    },
    city: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    stateCode: {
      type: String,
      default: '07'
    },
    pinCode: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    website: {
      type: String,
      default: ''
    },
    cin: {
      type: String,
      default: ''
    },
    gstin: {
      type: String,
      required: [true, 'Company GSTIN is required'],
      trim: true
    },
    pan: {
      type: String,
      default: ''
    },
    bankName: {
      type: String,
      default: ''
    },
    accountNumber: {
      type: String,
      default: ''
    },
    ifscCode: {
      type: String,
      default: ''
    },
    branch: {
      type: String,
      default: ''
    },
    accountHolderName: {
      type: String,
      default: ''
    },
    authorizedSignatory: {
      type: String,
      default: 'Authorized Signatory'
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

module.exports = mongoose.model('Company', companySchema);
