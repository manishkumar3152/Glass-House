const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true
    },
    billingAddress: {
      type: String,
      required: [true, 'Billing address is required'],
      trim: true
    },
    deliveryAddress: {
      type: String,
      default: '',
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
      default: ''
    },
    country: {
      type: String,
      default: 'India'
    },
    pinCode: {
      type: String,
      default: ''
    },
    contactPerson: {
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
    gstin: {
      type: String,
      trim: true,
      default: ''
    },
    customerType: {
      type: String,
      enum: ['B2B', 'B2C', 'Dealer', 'Contractor', 'Fabricator', 'Retailer'],
      default: 'B2B'
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active'
    },
    glassRates: [
      {
        glassSpecification: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'GlassSpecification',
          required: true
        },
        rate: {
          type: Number,
          default: 0
        },
        per: {
          type: String,
          enum: ['SQFT', 'SQM', 'NOS', 'UNIT'],
          default: 'SQFT'
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

customerSchema.index({ customerName: 'text', phone: 'text', email: 'text' });

module.exports = mongoose.model('Customer', customerSchema);
