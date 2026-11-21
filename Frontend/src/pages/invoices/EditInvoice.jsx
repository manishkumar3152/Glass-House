import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchInvoiceById, updateInvoice, approveInvoice } from '../../redux/slices/invoiceSlice';
import { fetchCustomers } from '../../redux/slices/customerSlice';
import {
  fetchCompany,
  fetchGlassSpecifications,
  fetchGlassRates,
  fetchProcessingCharges,
  fetchTaxConfig
} from '../../redux/slices/masterSlice';
import InvoiceHeaderForm from '../../components/invoice/InvoiceHeaderForm';
import CustomerDetailsForm from '../../components/invoice/CustomerDetailsForm';
import GlassItemsTable from '../../components/invoice/GlassItemsTable';
import ProcessingChargesTable from '../../components/invoice/ProcessingChargesTable';
import AdditionalCharges from '../../components/invoice/AdditionalCharges';
import TaxSummary from '../../components/invoice/TaxSummary';
import InvoicePreview from '../../components/invoice/InvoicePreview';
import InvoiceActions from '../../components/invoice/InvoiceActions';
import Loader from '../../components/common/Loader';
import { useInvoiceCalculation } from '../../hooks/useInvoiceCalculation';
import toast from 'react-hot-toast';

const EditInvoice = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentInvoice, loading: invoiceLoading } = useSelector((state) => state.invoices);
  const { customers } = useSelector((state) => state.customers);
  const {
    company,
    glassSpecifications,
    glassRates,
    processingCharges,
    taxConfig
  } = useSelector((state) => state.masters);

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    invoiceNumber: '',
    invoiceDate: '',
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
    extra: 0,
    standard: false,
    invoiceStatus: 'Draft'
  });

  const [glassItems, setGlassItems] = useState([]);
  const [processingItems, setProcessingItems] = useState([]);
  const [additionalCharges, setAdditionalCharges] = useState({
    insurancePercent: '',
    documentCharge: '',
    otherCharges: '',
    insuranceOnGlassOnly: false
  });
  const [isInterStateTax, setIsInterStateTax] = useState(true);

  useEffect(() => {
    dispatch(fetchInvoiceById(id));
    dispatch(fetchCustomers({ limit: 100 }));
    dispatch(fetchCompany());
    dispatch(fetchGlassSpecifications());
    dispatch(fetchGlassRates());
    dispatch(fetchProcessingCharges());
    dispatch(fetchTaxConfig());
  }, [dispatch, id]);

  useEffect(() => {
    if (currentInvoice) {
      if (currentInvoice.invoiceStatus === 'Approved') {
        toast.error('This invoice is Approved and locked. You can view or duplicate it.');
        navigate(`/invoices/view/${currentInvoice._id}`);
        return;
      }

      setFormData({
        invoiceNumber: currentInvoice.invoiceNumber || '',
        invoiceDate: currentInvoice.invoiceDate ? currentInvoice.invoiceDate.split('T')[0] : '',
        poNumber: currentInvoice.poNumber || '',
        customer: currentInvoice.customer?._id || currentInvoice.customer,
        billingAddress: currentInvoice.billingAddress || '',
        deliveryAddress: currentInvoice.deliveryAddress || '',
        deliveryDate: currentInvoice.deliveryDate ? currentInvoice.deliveryDate.split('T')[0] : '',
        contactPerson: currentInvoice.contactPerson || '',
        contactNumber: currentInvoice.contactNumber || '',
        customerGSTIN: currentInvoice.customerGSTIN || '',
        areaUnit: currentInvoice.areaUnit || 'SQM',
        lengthUnit: currentInvoice.lengthUnit || 'MM',
        extra: currentInvoice.extra !== undefined ? currentInvoice.extra : 0,
        standard: Boolean(currentInvoice.standard),
        invoiceStatus: currentInvoice.invoiceStatus || 'Draft'
      });

      setGlassItems(currentInvoice.glassItems || []);
      setProcessingItems(currentInvoice.processingItems || []);
      setAdditionalCharges(currentInvoice.additionalCharges || {
        insurancePercent: '',
        documentCharge: '',
        otherCharges: '',
        insuranceOnGlassOnly: false
      });
      setIsInterStateTax(currentInvoice.taxDetails?.isInterState ?? true);
    }
  }, [currentInvoice, navigate]);

  const handleCustomerSelect = (customer) => {
    setFormData((prev) => ({
      ...prev,
      customer: customer._id,
      billingAddress: customer.billingAddress || '',
      deliveryAddress: customer.deliveryAddress || customer.billingAddress || '',
      contactPerson: customer.contactPerson || '',
      contactNumber: customer.phone || '',
      customerGSTIN: customer.gstin || ''
    }));

    if (company?.stateCode && customer?.stateCode) {
      setIsInterStateTax(company.stateCode !== customer.stateCode);
    }
  };

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
        extra: 0,
        standard: false,
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
      toast.error('Invoice must retain at least one glass item');
      return;
    }
    setGlassItems(glassItems.filter((_, idx) => idx !== index));
  };

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

  const handleSave = async (status = formData.invoiceStatus) => {
    setSubmitting(true);
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

      const result = await dispatch(updateInvoice({ id, data: payload }));
      if (updateInvoice.fulfilled.match(result)) {
        navigate(`/invoices/view/${id}`);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async () => {
    await handleSave('Approved');
    await dispatch(approveInvoice(id));
    navigate(`/invoices/view/${id}`);
  };

  if (invoiceLoading && !currentInvoice) {
    return <Loader text="Loading invoice..." />;
  }

  const previewInvoiceData = {
    ...currentInvoice,
    ...formData,
    ...calculated,
    companySnapshot: currentInvoice?.companySnapshot || company,
    customerSnapshot: currentInvoice?.customerSnapshot || customers.find(c => c._id === formData.customer) || {}
  };

  return (
    <div className="space-y-5 pb-16">
      <InvoiceActions
        invoice={currentInvoice}
        onSaveDraft={() => handleSave('Draft')}
        onApprove={handleApprove}
        onPreviewToggle={() => setIsPreviewMode(!isPreviewMode)}
        isPreviewMode={isPreviewMode}
        onPrint={() => window.print()}
        loading={submitting}
      />

      {isPreviewMode ? (
        <InvoicePreview invoice={previewInvoiceData} company={company} />
      ) : (
        <div className="space-y-6">
          <InvoiceHeaderForm formData={formData} onChange={setFormData} />
          <CustomerDetailsForm
            formData={formData}
            customers={customers}
            onChange={setFormData}
            onCustomerSelect={handleCustomerSelect}
          />
          <GlassItemsTable
            items={calculated.glassItems}
            totals={calculated}
            specifications={glassSpecifications}
            rates={glassRates}
            lengthUnit={formData.lengthUnit}
            areaUnit={formData.areaUnit}
            extra={formData.extra}
            standard={formData.standard}
            onItemChange={handleGlassItemChange}
            onAddItem={handleAddGlassItem}
            onRemoveItem={handleRemoveGlassItem}
          />
          <ProcessingChargesTable
            items={calculated.processingItems}
            totalProcessingCost={calculated.totalProcessingCost}
            processingMaster={processingCharges}
            onChange={handleProcessingItemChange}
            onAddItem={handleAddProcessingItem}
            onRemoveItem={handleRemoveProcessingItem}
          />
          <AdditionalCharges
            charges={calculated.additionalCharges}
            onChange={setAdditionalCharges}
          />
          <TaxSummary
            calculation={calculated}
            onTaxTypeToggle={(isInterState) => setIsInterStateTax(isInterState)}
          />
        </div>
      )}
    </div>
  );
};

export default EditInvoice;
