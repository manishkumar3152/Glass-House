const mongoose = require('mongoose');

const glassItemSchema = new mongoose.Schema({
  itemCode: {
    type: String,
    default: ''
  },
  remarks: {
    type: String,
    default: ''
  },
  specification: {
    type: String,
    required: true
  },
  specificationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GlassSpecification',
    default: null
  },
  originalLength: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  originalWidth: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  length: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  width: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  extra: {
    type: Number,
    default: 0
  },
  standard: {
    type: Boolean,
    default: false
  },
  adjustedLength: {
    type: Number,
    default: 0
  },
  adjustedWidth: {
    type: Number,
    default: 0
  },
  unit: {
    type: String,
    default: 'NOS'
  },
  actualArea: {
    type: Number,
    default: 0
  },
  chargeableArea: {
    type: Number,
    default: 0
  },
  actArea: {
    type: Number,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  chrgArea: {
    type: Number,
    required: true
  },
  rate: {
    type: Number,
    required: true
  },
  per: {
    type: String,
    default: 'SQFT'
  },
  amount: {
    type: Number,
    required: true
  },
  thickness: {
    type: Number,
    default: 6
  }
});

const processingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  processingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProcessingCharge',
    default: null
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'NOS'
  },
  rate: {
    type: Number,
    required: true
  },
  per: {
    type: String,
    default: 'NOS'
  },
  amount: {
    type: Number,
    required: true
  }
});

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    financialYear: {
      type: String,
      required: true
    },
    sequenceNumber: {
      type: Number,
      required: true
    },
    invoiceDate: {
      type: Date,
      default: Date.now
    },
    poNumber: {
      type: String,
      default: ''
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true
    },
    customerSnapshot: {
      customerName: String,
      billingAddress: String,
      deliveryAddress: String,
      city: String,
      state: String,
      stateCode: String,
      country: String,
      pinCode: String,
      contactPerson: String,
      phone: String,
      email: String,
      gstin: String
    },
    billingAddress: {
      type: String,
      required: true
    },
    deliveryAddress: {
      type: String,
      default: ''
    },
    deliveryDate: {
      type: Date,
      default: null
    },
    contactPerson: {
      type: String,
      default: ''
    },
    contactNumber: {
      type: String,
      default: ''
    },
    customerGSTIN: {
      type: String,
      default: ''
    },
    areaUnit: {
      type: String,
      default: 'SQM'
    },
    lengthUnit: {
      type: String,
      default: 'MM'
    },
    extra: {
      type: Number,
      default: 0
    },
    standard: {
      type: Boolean,
      default: false
    },
    glassItems: [glassItemSchema],
    totalQuantity: {
      type: Number,
      default: 0
    },
    totalActualArea: {
      type: Number,
      default: 0
    },
    totalWeight: {
      type: Number,
      default: 0
    },
    totalChargeableArea: {
      type: Number,
      default: 0
    },
    glassTotal: {
      type: Number,
      default: 0
    },
    processingItems: [processingItemSchema],
    totalProcessingCost: {
      type: Number,
      default: 0
    },
    totalCost: {
      type: Number,
      default: 0
    },
    additionalCharges: {
      insurancePercent: { type: Number, default: 2 },
      insuranceAmount: { type: Number, default: 0 },
      documentCharge: { type: Number, default: 25 },
      otherCharges: { type: Number, default: 0 },
      insuranceOnGlassOnly: { type: Boolean, default: false }
    },
    totalAdditionalCharges: {
      type: Number,
      default: 0
    },
    taxableAmount: {
      type: Number,
      default: 0
    },
    taxDetails: {
      taxType: { type: String, default: 'IGST' },
      isInterState: { type: Boolean, default: true },
      gstRate: { type: Number, default: 18 },
      igstRate: { type: Number, default: 18 },
      igstAmount: { type: Number, default: 0 },
      cgstRate: { type: Number, default: 0 },
      cgstAmount: { type: Number, default: 0 },
      sgstRate: { type: Number, default: 0 },
      sgstAmount: { type: Number, default: 0 },
      totalGst: { type: Number, default: 0 }
    },
    totalGST: {
      type: Number,
      default: 0
    },
    finalAmount: {
      type: Number,
      default: 0
    },
    roundedAmount: {
      type: Number,
      default: 0
    },
    roundOffDifference: {
      type: Number,
      default: 0
    },
    amountInWords: {
      type: String,
      default: ''
    },
    preparedBy: {
      type: String,
      default: 'Sales Executive'
    },
    checkedBy: {
      type: String,
      default: 'Commercial Manager'
    },
    authorizedSignatory: {
      type: String,
      default: 'Authorized Signatory'
    },
    termsAndConditionsSnapshot: [
      {
        termNumber: Number,
        text: String
      }
    ],
    companySnapshot: {
      type: Object,
      default: {}
    },
    invoiceStatus: {
      type: String,
      enum: ['Draft', 'Pending Approval', 'Approved', 'Cancelled'],
      default: 'Draft',
      index: true
    },
    pdfPath: {
      type: String,
      default: ''
    },
    pdfGeneratedAt: {
      type: Date,
      default: null
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    approvalDate: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

invoiceSchema.index({ invoiceNumber: 1, invoiceStatus: 1, invoiceDate: -1 });

module.exports = mongoose.model('Invoice', invoiceSchema);
