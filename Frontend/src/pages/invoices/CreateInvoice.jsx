import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createInvoice } from '../../redux/slices/invoiceSlice';
import { fetchCustomers } from '../../redux/slices/customerSlice';
import {
  fetchCompany,
  fetchGlassSpecifications,
  fetchProcessingCharges,
  fetchTaxConfig
} from '../../redux/slices/masterSlice';
import { calculateGlassAmount } from '../../calculators/amountCalculator';
import InvoiceHeaderForm from '../../components/invoice/InvoiceHeaderForm';
import CustomerDetailsForm from '../../components/invoice/CustomerDetailsForm';
import GlassItemsTable from '../../components/invoice/GlassItemsTable';
import ProcessingChargesTable from '../../components/invoice/ProcessingChargesTable';
import AdditionalCharges from '../../components/invoice/AdditionalCharges';
import TaxSummary from '../../components/invoice/TaxSummary';
import InvoicePreview from '../../components/invoice/InvoicePreview';
import InvoiceActions from '../../components/invoice/InvoiceActions';
import { useInvoiceCalculation } from '../../hooks/useInvoiceCalculation';
import toast from 'react-hot-toast';

const CreateInvoice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { customers } = useSelector((state) => state.customers);
  const {
    company,
    glassSpecifications,
    processingCharges,
    taxConfig
  } = useSelector((state) => state.masters);

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    poNumber: '',
    customer: '',
    billingAddress: '',
    deliveryAddress: '',
    deliveryDate: '',
    contactPerson: '',
    contactNumber: '',
    customerGSTIN: '',
    areaUnit: 'SQM',
    lengthUnit: 'MM',
    extra: "",
    standard: false,
    invoiceStatus: 'Draft'
  });

  const [glassItems, setGlassItems] = useState([
    {
      itemCode: 'G1',
      remarks: '',
      specification: '',
      specificationId: null,
      length: '',
      width: '',
      quantity: '',
      thickness: 6,
      density: 2.475,
      unit: 'unit',
      actArea: '',
      weight: '',
      chrgArea: '',
      rate: '',
      per: 'Sqft',
      amount: 0
    }
  ]);

  const [processingItems, setProcessingItems] = useState([]);

  const [additionalCharges, setAdditionalCharges] = useState({
    insurancePercent: '',
    documentCharge: '',
    otherCharges: '',
    insuranceOnGlassOnly: false
  });

  const [isInterStateTax, setIsInterStateTax] = useState(true);

  // Load masters on mount
  useEffect(() => {
    dispatch(fetchCustomers({ limit: 100 }));
    dispatch(fetchCompany());
    dispatch(fetchGlassSpecifications());
    dispatch(fetchProcessingCharges());
    dispatch(fetchTaxConfig());
  }, [dispatch]);

  // Selected customer and their custom rates
  const selectedCustomer = customers.find((c) => c._id === formData.customer);
  const customerRates = selectedCustomer?.glassRates || [];

  // Handle customer selection
  const handleCustomerSelect = (customer) => {
    setFormData((prev) => ({
      ...prev,
      customer: customer ? customer._id : '',
      billingAddress: customer ? customer.billingAddress || '' : '',
      deliveryAddress: customer ? customer.deliveryAddress || customer.billingAddress || '' : '',
      contactPerson: customer ? customer.contactPerson || '' : '',
      contactNumber: customer ? customer.phone || '' : '',
      customerGSTIN: customer ? customer.gstin || '' : ''
    }));

    // Auto-detect tax type
    if (company?.stateCode && customer?.stateCode) {
      setIsInterStateTax(company.stateCode !== customer.stateCode);
    }

    // Auto-update rates for all existing items:
    // If a customer is selected and has a custom rate for that specification, use customer rate.
    // Otherwise (no customer, or customer has no custom rate for this spec), ALWAYS revert to specification defaultRate!
    setGlassItems((prevItems) =>
      prevItems.map((item) => {
        if (!item.specificationId) return item;
        const spec = glassSpecifications.find(
          (s) => String(s._id) === String(item.specificationId)
        );
        const matchingCustRate = customer && Array.isArray(customer.glassRates)
          ? customer.glassRates.find(
              (r) => String(r.glassSpecification?._id || r.glassSpecification) === String(item.specificationId)
            )
          : null;

        let nextRate = '';
        let nextPer = item.per || 'Sqft';

        if (matchingCustRate && matchingCustRate.rate !== undefined && matchingCustRate.rate !== null && Number(matchingCustRate.rate) > 0) {
          nextRate = matchingCustRate.rate;
          nextPer = matchingCustRate.per || (spec ? spec.rateUnit : 'Sqft');
        } else if (spec) {
          nextRate = spec.defaultRate !== undefined && spec.defaultRate !== null ? spec.defaultRate : '';
          nextPer = spec.rateUnit || 'Sqft';
        } else {
          nextRate = item.rate;
          nextPer = item.per || 'Sqft';
        }

        const chrg = Number(item.chrgArea) || 0;
        const nextAmount = chrg > 0 && nextRate !== ''
          ? calculateGlassAmount(chrg, item.quantity, nextRate, nextPer, formData.areaUnit)
          : 0;

        return {
          ...item,
          rate: nextRate,
          per: nextPer,
          amount: nextAmount
        };
      })
    );
  };

  // Live Calculations Hook
  const calculated = useInvoiceCalculation({
    glassItems,
    processingItems,
    additionalCharges,
    taxConfig: {
      isInterState: isInterStateTax,
      gstRate: taxConfig?.gstPercentage || 18,
      cgstRate: taxConfig?.cgstPercentage || 9,
      sgstRate: taxConfig?.sgstPercentage || 9
    },
    lengthUnit: formData.lengthUnit,
    areaUnit: formData.areaUnit,
    extra: formData.extra,
    standard: formData.standard,
    companyStateCode: company?.stateCode || '07',
    customerStateCode: formData.customer ? customers.find(c => c._id === formData.customer)?.stateCode : ''
  });

  // Glass Items handlers
  const handleGlassItemChange = (index, updatedItem) => {
    const updated = [...glassItems];
    updated[index] = updatedItem;
    setGlassItems(updated);
  };

  const handleAddGlassItem = () => {
    const nextCode = `G${glassItems.length + 1}`;
    setGlassItems([
      ...glassItems,
      {
        itemCode: nextCode,
        remarks: '',
        specification: '',
        specificationId: null,
        length: '',
        width: '',
        quantity: '',
        thickness: 6,
        density: 2.475,
        unit: 'unit',
        actArea: '',
        weight: '',
        chrgArea: '',
        rate: '',
        per: 'Sqft',
        amount: 0
      }
    ]);
  };

  const handleRemoveGlassItem = (index) => {
    if (glassItems.length === 1) {
      toast.error('An invoice must have at least one glass item');
      return;
    }
    setGlassItems(glassItems.filter((_, idx) => idx !== index));
  };

  // Processing Items handlers
  const handleProcessingItemChange = (index, updatedItem) => {
    const updated = [...processingItems];
    updated[index] = updatedItem;
    setProcessingItems(updated);
  };

  const handleAddProcessingItem = () => {
    setProcessingItems([
      ...processingItems,
      {
        name: '',
        processingId: null,
        quantity: '',
        unit: 'unit',
        rate: '',
        per: 'unit',
        amount: 0
      }
    ]);
  };

  const handleRemoveProcessingItem = (index) => {
    setProcessingItems(processingItems.filter((_, idx) => idx !== index));
  };

  // Save handler
  const handleSave = async (status = 'Draft') => {
    if (!formData.customer) {
      toast.error('Please select a customer for this invoice');
      return;
    }
    if (!formData.billingAddress) {
      toast.error('Billing address is required');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        invoiceStatus: status,
        glassItems: calculated.glassItems,
        processingItems: calculated.processingItems,
        additionalCharges: calculated.additionalCharges,
        taxConfig: {
          isInterState: isInterStateTax,
          gstRate: taxConfig?.gstPercentage || 18,
          cgstRate: taxConfig?.cgstPercentage || 9,
          sgstRate: taxConfig?.sgstPercentage || 9
        }
      };

      const result = await dispatch(createInvoice(payload));
      if (createInvoice.fulfilled.match(result)) {
        navigate(`/invoices/view/${result.payload._id}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const previewInvoiceData = {
    ...formData,
    ...calculated,
    companySnapshot: company,
    customerSnapshot: customers.find((c) => c._id === formData.customer) || {}
  };

  return (
    <div className="space-y-5 pb-16">
      {/* Action Header */}
      <InvoiceActions
        onSaveDraft={() => handleSave('Draft')}
        onApprove={() => handleSave('Approved')}
        onPreviewToggle={() => setIsPreviewMode(!isPreviewMode)}
        isPreviewMode={isPreviewMode}
        onPrint={() => window.print()}
        loading={loading}
      />

      {isPreviewMode ? (
        <InvoicePreview invoice={previewInvoiceData} company={company} />
      ) : (
        <div className="space-y-6">
          {/* Header Form */}
          <InvoiceHeaderForm
            formData={formData}
            onChange={setFormData}
          />

          {/* Customer Details */}
          <CustomerDetailsForm
            formData={formData}
            customers={customers}
            onChange={setFormData}
            onCustomerSelect={handleCustomerSelect}
          />

          {/* Glass Items Table */}
          <GlassItemsTable
            items={calculated.glassItems}
            totals={calculated}
            specifications={glassSpecifications}
            customerRates={customerRates}
            rates={customerRates}
            lengthUnit={formData.lengthUnit}
            areaUnit={formData.areaUnit}
            extra={formData.extra}
            standard={formData.standard}
            onItemChange={handleGlassItemChange}
            onAddItem={handleAddGlassItem}
            onRemoveItem={handleRemoveGlassItem}
          />

          {/* Processing Charges */}
          <ProcessingChargesTable
            items={calculated.processingItems}
            totalProcessingCost={calculated.totalProcessingCost}
            processingMaster={processingCharges}
            onChange={handleProcessingItemChange}
            onAddItem={handleAddProcessingItem}
            onRemoveItem={handleRemoveProcessingItem}
          />

          {/* Additional Charges */}
          <AdditionalCharges
            charges={calculated.additionalCharges}
            onChange={setAdditionalCharges}
          />

          {/* Tax Summary & Totals */}
          <TaxSummary
            calculation={calculated}
            onTaxTypeToggle={(isInterState) => setIsInterStateTax(isInterState)}
          />
        </div>
      )}
    </div>
  );
};

export default CreateInvoice;
