import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';
import customerReducer from '../redux/slices/customerSlice';
import masterReducer from '../redux/slices/masterSlice';
import invoiceReducer from '../redux/slices/invoiceSlice';
import dashboardReducer from '../redux/slices/dashboardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    customers: customerReducer,
    masters: masterReducer,
    invoices: invoiceReducer,
    dashboard: dashboardReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});
