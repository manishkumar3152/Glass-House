const mongoose = require('mongoose');
const Company = require('../models/Company');
const Customer = require('../models/Customer');
const GlassSpecification = require('../models/GlassSpecification');
const GlassRate = require('../models/GlassRate');
const ProcessingCharge = require('../models/ProcessingCharge');
const TaxConfiguration = require('../models/TaxConfiguration');
const TermsAndConditions = require('../models/TermsAndConditions');
const InvoiceSequence = require('../models/InvoiceSequence');
const Invoice = require('../models/Invoice');
const User = require('../models/User');
const config = require('../config/config');

const standard15Terms = [
  { termNumber: 1, text: 'Goods once sold will not be taken back or exchanged under any circumstances.' },
  { termNumber: 2, text: 'Any breakage, damage or shortage during transit shall be entirely at buyer\'s / customer\'s risk.' },
  { termNumber: 3, text: 'Tolerance for cutting and toughening will be ± 2mm in length and width as per standard industry specifications.' },
  { termNumber: 4, text: 'Due to high temperature tempering process, minor roller waves, bow, warp, and optical distortion are inherent characteristics of toughened glass and shall not be treated as defects.' },
  { termNumber: 5, text: 'No cutting, drilling, notching, or grinding can be done after the glass is toughened. Any attempt to modify processed glass will cause spontaneous breakage.' },
  { termNumber: 6, text: 'Delivery schedule is given in good faith and subject to force majeure, raw material availability, machine maintenance, and uninterrupted power supply.' },
  { termNumber: 7, text: 'Payment terms: 100% advance or as agreed mutually in purchase order prior to dispatch.' },
  { termNumber: 8, text: 'Interest @ 18% per annum will be charged on overdue payments beyond the agreed credit period.' },
  { termNumber: 9, text: 'Inspection of materials must be done at the time of delivery / dispatch. No complaint will be entertained once the material leaves our factory premises.' },
  { termNumber: 10, text: 'Insurance coverage during transit will only be applicable if requested specifically by the buyer and charged extra.' },
  { termNumber: 11, text: 'Tax rates are subject to change as per statutory government notifications prevailing at the time of invoicing.' },
  { termNumber: 12, text: 'Unloading of material at the destination site is the sole responsibility of the customer.' },
  { termNumber: 13, text: 'Dimensions and processing details provided by customer in purchase order or approved drawings will be considered final and binding.' },
  { termNumber: 14, text: 'Disputes, if any, arising out of this contract shall be subject to the exclusive jurisdiction of local courts only.' },
  { termNumber: 15, text: 'This Proforma Invoice is valid for 15 days from the date of issue. Rates and raw material surcharges are subject to revision thereafter.' }
];

const seedMasters = async () => {
  try {
    await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected for master seeding...');

    // 1. Company
    await Company.deleteMany({});
    const company = await Company.create({
      companyName: 'BANSAL GLASS INDUSTRIES',
      tagline: 'Leading Architectural Toughened & Laminated Glass Processors',
      address: 'Plot No. 42-43, Navdeep Colony, Phase-II Industrial Area',
      city: 'New Delhi',
      state: 'Delhi',
      stateCode: '07',
      pinCode: '110020',
      phone: '+91 98765 43210 / 011-28521000',
      email: 'info@bansalglass.com',
      website: 'www.bansalglass.com',
      cin: 'U26100DL2018PTC321456',
      gstin: '07AAAAA0000A1Z5',
      bankName: 'HDFC Bank Ltd',
      accountNumber: '50200085210987',
      ifscCode: 'HDFC0001234',
      branch: 'Industrial Area Phase-II',
      accountHolderName: 'Bansal Glass Industries',
      authorizedSignatory: 'Authorized Signatory',
      isDefault: true
    });
    console.log('Company master seeded');

    // 2. Customer
    await Customer.deleteMany({});
    const customer = await Customer.create({
      customerName: 'Ajay Glass House',
      billingAddress: 'Shop No. 12, Main Glass Market, Ring Road, Jaipur, Rajasthan',
      deliveryAddress: 'Site Plot 88, Vishwakarma Industrial Area (VKI), Jaipur, Rajasthan',
      city: 'Jaipur',
      state: 'Rajasthan',
      stateCode: '08',
      country: 'India',
      pinCode: '302013',
      contactPerson: 'Mr. Ajay Sharma',
      phone: '+91 98290 85210',
      email: 'ajayglasshouse@gmail.com',
      gstin: '08AAACA5555M1Z2',
      customerType: 'B2B',
      status: 'Active'
    });

    await Customer.create({
      customerName: 'Sharma Aluminium & Glazing',
      billingAddress: 'GF-4, Metro Commercial Complex, Sector 18, Noida, Uttar Pradesh',
      deliveryAddress: 'GF-4, Metro Commercial Complex, Sector 18, Noida, Uttar Pradesh',
      city: 'Noida',
      state: 'Uttar Pradesh',
      stateCode: '09',
      contactPerson: 'Ramesh Sharma',
      phone: '+91 98110 12345',
      email: 'sharma.glazing@gmail.com',
      gstin: '09AABCS1234P1Z8',
      customerType: 'Dealer',
      status: 'Active'
    });
    console.log('Customer master seeded');

    // 3. Glass Specifications
    await GlassSpecification.deleteMany({});
    const spec6mm = await GlassSpecification.create({
      glassName: '6mm Clear Flat Tuff Glass',
      glassCode: 'GL-6MM-CFT',
      thickness: 6,
      glassType: 'Clear Toughened',
      description: '6mm High Precision Thermal Toughened Safety Glass',
      weightPerSqm: 15,
      density: 2.5,
      defaultRate: 72,
      rateUnit: 'SQFT',
      status: 'Active'
    });

    const spec8mm = await GlassSpecification.create({
      glassName: '8mm Clear Flat Tuff Glass',
      glassCode: 'GL-8MM-CFT',
      thickness: 8,
      glassType: 'Clear Toughened',
      description: '8mm Architectural Toughened Safety Glass',
      weightPerSqm: 20,
      density: 2.5,
      defaultRate: 95,
      rateUnit: 'SQFT',
      status: 'Active'
    });

    const spec10mm = await GlassSpecification.create({
      glassName: '10mm Clear Flat Tuff Glass',
      glassCode: 'GL-10MM-CFT',
      thickness: 10,
      glassType: 'Clear Toughened',
      description: '10mm Heavy Duty Toughened Glass for Partitions',
      weightPerSqm: 25,
      density: 2.5,
      defaultRate: 120,
      rateUnit: 'SQFT',
      status: 'Active'
    });

    const spec12mm = await GlassSpecification.create({
      glassName: '12mm Clear Flat Tuff Glass',
      glassCode: 'GL-12MM-CFT',
      thickness: 12,
      glassType: 'Clear Toughened',
      description: '12mm Structural Toughened Glass for Facades',
      weightPerSqm: 30,
      density: 2.5,
      defaultRate: 148,
      rateUnit: 'SQFT',
      status: 'Active'
    });
    console.log('Glass specifications seeded');

    // 4. Glass Rates
    await GlassRate.deleteMany({});
    await GlassRate.create([
      { glassSpecification: spec6mm._id, rate: 72, per: 'SQFT', status: 'Active' },
      { glassSpecification: spec8mm._id, rate: 95, per: 'SQFT', status: 'Active' },
      { glassSpecification: spec10mm._id, rate: 120, per: 'SQFT', status: 'Active' },
      { glassSpecification: spec12mm._id, rate: 148, per: 'SQFT', status: 'Active' }
    ]);
    console.log('Glass rates seeded');

    // 5. Processing Charges
    await ProcessingCharge.deleteMany({});
    await ProcessingCharge.create([
      { name: 'Small Hole (Up to 25mm)', unit: 'NOS', rate: 45, description: 'CNC drilled small hole' },
      { name: 'Big Hole (Above 25mm)', unit: 'NOS', rate: 75, description: 'CNC waterjet big hole' },
      { name: 'Standard Cutout / Notch', unit: 'NOS', rate: 120, description: 'Precision corner or edge notch' },
      { name: 'Flat Edge Polishing', unit: 'RFT', rate: 15, description: 'Diamond wheel flat polished edge' },
      { name: 'Beveled Edge Polishing', unit: 'RFT', rate: 30, description: 'Precision bevel edge' }
    ]);
    console.log('Processing charges seeded');

    // 6. Tax Configuration
    await TaxConfiguration.deleteMany({});
    await TaxConfiguration.create({
      taxName: 'GST',
      gstPercentage: 18,
      cgstPercentage: 9,
      sgstPercentage: 9,
      igstPercentage: 18,
      taxApplicability: 'Standard GST on Toughened Glass',
      isDefault: true
    });
    console.log('Tax configuration seeded');

    // 7. Terms and Conditions
    await TermsAndConditions.deleteMany({});
    await TermsAndConditions.create({
      title: 'Standard Glass Industry Terms and Conditions',
      terms: standard15Terms,
      isDefault: true
    });
    console.log('Terms and conditions seeded');

    // 8. Invoice Sequence
    await InvoiceSequence.deleteMany({});
    await InvoiceSequence.create({
      prefix: 'PI',
      financialYear: '26-27',
      lastSequenceNumber: 8521
    });
    console.log('Invoice sequence seeded (at 8521)');

    // 9. Seed the exact Reference Invoice PI-26-27-8521
    const adminUser = await User.findOne({ email: 'admin@glasshouse.com' });
    await Invoice.deleteMany({ invoiceNumber: 'PI-26-27-8521' });

    const refInvoice = new Invoice({
      invoiceNumber: 'PI-26-27-8521',
      financialYear: '26-27',
      sequenceNumber: 8521,
      invoiceDate: new Date('2026-11-21'),
      poNumber: 'PO-8521',
      customer: customer._id,
      customerSnapshot: {
        customerName: 'Ajay Glass House',
        billingAddress: 'Shop No. 12, Main Glass Market, Ring Road, Jaipur, Rajasthan',
        deliveryAddress: 'Site Plot 88, Vishwakarma Industrial Area (VKI), Jaipur, Rajasthan',
        city: 'Jaipur',
        state: 'Rajasthan',
        stateCode: '08',
        country: 'India',
        pinCode: '302013',
        contactPerson: 'Mr. Ajay Sharma',
        phone: '+91 98290 85210',
        email: 'ajayglasshouse@gmail.com',
        gstin: '08AAACA5555M1Z2'
      },
      billingAddress: 'Shop No. 12, Main Glass Market, Ring Road, Jaipur, Rajasthan',
      deliveryAddress: 'Site Plot 88, Vishwakarma Industrial Area (VKI), Jaipur, Rajasthan',
      deliveryDate: new Date('2026-11-28'),
      contactPerson: 'Mr. Ajay Sharma',
      contactNumber: '+91 98290 85210',
      customerGSTIN: '08AAACA5555M1Z2',
      areaUnit: 'SQM',
      lengthUnit: 'MM',

      glassItems: [
        {
          itemCode: 'G1',
          remarks: 'BS',
          specification: '6mm Clear Flat Tuff Glass',
          specificationId: spec6mm._id,
          length: 2063,
          width: 800,
          quantity: 2,
          unit: 'unit',
          actArea: 3.301,
          weight: 49.42,
          chrgArea: 3.328,
          rate: 72.00,
          per: 'Sqft',
          amount: 2579.21,
          thickness: 6
        },
        {
          itemCode: 'G2',
          remarks: 'BS',
          specification: '6mm Clear Flat Tuff Glass',
          specificationId: spec6mm._id,
          length: 2130,
          width: 625,
          quantity: 1,
          unit: 'unit',
          actArea: 1.331,
          weight: 20.34,
          chrgArea: 1.370,
          rate: 72.00,
          per: 'Sqft',
          amount: 1061.75,
          thickness: 6
        },
        {
          itemCode: 'G3',
          remarks: 'BS',
          specification: '6mm Clear Flat Tuff Glass',
          specificationId: spec6mm._id,
          length: 2160,
          width: 441,
          quantity: 1,
          unit: 'unit',
          actArea: 0.953,
          weight: 14.76,
          chrgArea: 0.994,
          rate: 72.00,
          per: 'Sqft',
          amount: 770.35,
          thickness: 6
        },
        {
          itemCode: 'G4',
          remarks: 'DRAW',
          specification: '6mm Clear Flat Tuff Glass',
          specificationId: spec6mm._id,
          length: 713,
          width: 1002,
          quantity: 1,
          unit: 'unit',
          actArea: 0.714,
          weight: 10.90,
          chrgArea: 0.734,
          rate: 72.00,
          per: 'Sqft',
          amount: 568.85,
          thickness: 6
        },
        {
          itemCode: 'G5',
          remarks: 'BS',
          specification: '6mm Clear Flat Tuff Glass',
          specificationId: spec6mm._id,
          length: 504,
          width: 681,
          quantity: 1,
          unit: 'unit',
          actArea: 0.343,
          weight: 5.40,
          chrgArea: 0.364,
          rate: 72.00,
          per: 'Sqft',
          amount: 282.10,
          thickness: 6
        },
        {
          itemCode: 'G6',
          remarks: 'BS',
          specification: '6mm Clear Flat Tuff Glass',
          specificationId: spec6mm._id,
          length: 670,
          width: 604,
          quantity: 1,
          unit: 'unit',
          actArea: 0.405,
          weight: 6.27,
          chrgArea: 0.422,
          rate: 72.00,
          per: 'Sqft',
          amount: 327.05,
          thickness: 6
        },
        {
          itemCode: 'G7',
          remarks: 'BS',
          specification: '6mm Clear Flat Tuff Glass',
          specificationId: spec6mm._id,
          length: 645,
          width: 604,
          quantity: 1,
          unit: 'unit',
          actArea: 0.390,
          weight: 6.07,
          chrgArea: 0.409,
          rate: 72.00,
          per: 'Sqft',
          amount: 316.98,
          thickness: 6
        }
      ],

      totalQuantity: 8,
      totalActualArea: 7.437,
      totalWeight: 113.16,
      totalChargeableArea: 7.621,
      glassTotal: 5906.29,

      processingItems: [
        {
          name: 'Big Hole',
          quantity: 1.00,
          unit: 'unit',
          rate: 90.00,
          per: 'unit',
          amount: 90.00
        }
      ],
      totalProcessingCost: 90.00,
      totalCost: 5996.29,

      additionalCharges: {
        insurancePercent: 2,
        insuranceAmount: 118.13,
        documentCharge: 25.00,
        otherCharges: 0,
        insuranceOnGlassOnly: true
      },
      totalAdditionalCharges: 143.13,
      taxableAmount: 6139.42,

      taxDetails: {
        taxType: 'IGST',
        isInterState: true,
        gstRate: 18,
        igstRate: 18,
        igstAmount: 1105.10,
        cgstRate: 0,
        cgstAmount: 0,
        sgstRate: 0,
        sgstAmount: 0,
        totalGst: 1105.10
      },
      totalGST: 1105.10,
      finalAmount: 7244.52,
      roundedAmount: 7245.00,
      roundOffDifference: 0.48,
      amountInWords: 'INR Seven Thousand Two Hundred Forty Five Only',

      preparedBy: 'Sales Executive',
      checkedBy: 'Commercial Manager',
      authorizedSignatory: 'Authorized Signatory',
      termsAndConditionsSnapshot: standard15Terms,
      companySnapshot: company.toObject(),
      invoiceStatus: 'Approved',
      createdBy: adminUser?._id,
      approvedBy: adminUser?._id,
      approvalDate: new Date('2026-11-21')
    });

    await refInvoice.save();
    console.log('Reference test invoice PI-26-27-8521 seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding masters:', error);
    process.exit(1);
  }
};

seedMasters();
