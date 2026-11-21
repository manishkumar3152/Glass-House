const mongoose = require('mongoose');

const glassSpecificationSchema = new mongoose.Schema(
  {
    glassName: {
      type: String,
      required: [true, 'Glass specification name is required'],
      trim: true
    },
    glassCode: {
      type: String,
      trim: true,
      default: ''
    },
    thickness: {
      type: Number,
      required: [true, 'Thickness in mm is required']
    },
    glassType: {
      type: String,
      default: 'Clear Toughened'
    },
    description: {
      type: String,
      default: ''
    },
    weightPerSqm: {
      type: Number,
      default: 0
    },
    density: {
      type: Number,
      default: 2.5 // kg/m² per mm
    },
    defaultRate: {
      type: Number,
      default: 0
    },
    rateUnit: {
      type: String,
      enum: ['SQFT', 'SQM', 'NOS', 'UNIT'],
      default: 'SQFT'
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

module.exports = mongoose.model('GlassSpecification', glassSpecificationSchema);
