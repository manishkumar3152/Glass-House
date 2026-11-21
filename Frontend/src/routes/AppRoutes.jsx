import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Layout from '../components/layout/Layout';

// Pages
import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import CustomerList from '../pages/customers/CustomerList';
import CreateCustomer from '../pages/customers/CreateCustomer';
import EditCustomer from '../pages/customers/EditCustomer';

import InvoiceList from '../pages/invoices/InvoiceList';
import CreateInvoice from '../pages/invoices/CreateInvoice';
import EditInvoice from '../pages/invoices/EditInvoice';
import ViewInvoice from '../pages/invoices/ViewInvoice';
import InvoicePreviewPage from '../pages/invoices/InvoicePreviewPage';

import CompanySettings from '../pages/masters/CompanySettings';
import GlassSpecifications from '../pages/masters/GlassSpecifications';
import GlassRates from '../pages/masters/GlassRates';
import ProcessingCharges from '../pages/masters/ProcessingCharges';
import TaxSettings from '../pages/masters/TaxSettings';
import TermsSettings from '../pages/masters/TermsSettings';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* Standalone Fullscreen Preview (Protected) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/invoices/preview/:id" element={<InvoicePreviewPage />} />
      </Route>

      {/* Main App Layout (Protected) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />

          {/* Customers */}
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/create" element={<CreateCustomer />} />
          <Route path="/customers/edit/:id" element={<EditCustomer />} />

          {/* Invoices */}
          <Route path="/invoices" element={<InvoiceList />} />
          <Route path="/invoices/create" element={<CreateInvoice />} />
          <Route path="/invoices/edit/:id" element={<EditInvoice />} />
          <Route path="/invoices/view/:id" element={<ViewInvoice />} />

          {/* Masters */}
          <Route path="/masters/company" element={<CompanySettings />} />
          <Route path="/masters/glass-specifications" element={<GlassSpecifications />} />
          <Route path="/masters/glass-rates" element={<GlassRates />} />
          <Route path="/masters/processing-charges" element={<ProcessingCharges />} />
          <Route path="/masters/tax" element={<TaxSettings />} />
          <Route path="/masters/terms" element={<TermsSettings />} />
        </Route>
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
