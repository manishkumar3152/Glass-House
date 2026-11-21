import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { invoiceApi } from '../../api/invoiceApi';
import toast from 'react-hot-toast';

export const fetchInvoices = createAsyncThunk(
  'invoices/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await invoiceApi.getInvoices(params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch invoices');
    }
  }
);

export const fetchInvoiceById = createAsyncThunk(
  'invoices/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await invoiceApi.getInvoiceById(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch invoice details');
    }
  }
);

export const createInvoice = createAsyncThunk(
  'invoices/create',
  async (invoiceData, { rejectWithValue }) => {
    try {
      const response = await invoiceApi.createInvoice(invoiceData);
      toast.success('Proforma Invoice created successfully');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create invoice');
    }
  }
);

export const updateInvoice = createAsyncThunk(
  'invoices/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await invoiceApi.updateInvoice(id, data);
      toast.success('Invoice updated successfully');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update invoice');
    }
  }
);

export const approveInvoice = createAsyncThunk(
  'invoices/approve',
  async (id, { rejectWithValue }) => {
    try {
      const response = await invoiceApi.approveInvoice(id);
      toast.success('Invoice approved and locked successfully');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to approve invoice');
    }
  }
);

export const cancelInvoice = createAsyncThunk(
  'invoices/cancel',
  async (id, { rejectWithValue }) => {
    try {
      const response = await invoiceApi.cancelInvoice(id);
      toast.success('Invoice cancelled');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to cancel invoice');
    }
  }
);

export const duplicateInvoice = createAsyncThunk(
  'invoices/duplicate',
  async (id, { rejectWithValue }) => {
    try {
      const response = await invoiceApi.duplicateInvoice(id);
      toast.success(`Duplicated as new draft: ${response.data.invoiceNumber}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to duplicate invoice');
    }
  }
);

export const deleteInvoice = createAsyncThunk(
  'invoices/delete',
  async (id, { rejectWithValue }) => {
    try {
      await invoiceApi.deleteInvoice(id);
      toast.success('Draft invoice deleted');
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete invoice');
    }
  }
);

export const generatePdfThunk = createAsyncThunk(
  'invoices/generatePdf',
  async (id, { rejectWithValue }) => {
    try {
      const response = await invoiceApi.generatePdf(id);
      toast.success('PDF generated successfully');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to generate PDF');
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState: {
    invoices: [],
    currentInvoice: null,
    pagination: { page: 1, limit: 20, total: 0, pages: 1 },
    filters: {
      search: '',
      status: '',
      customer: '',
      startDate: '',
      endDate: ''
    },
    loading: false,
    error: null
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentInvoice: (state) => {
      state.currentInvoice = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch List
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload.invoices;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch By ID
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentInvoice = action.payload;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createInvoice.fulfilled, (state, action) => {
        state.invoices.unshift(action.payload);
        state.currentInvoice = action.payload;
      })
      // Update
      .addCase(updateInvoice.fulfilled, (state, action) => {
        const idx = state.invoices.findIndex((inv) => inv._id === action.payload._id);
        if (idx !== -1) state.invoices[idx] = action.payload;
        state.currentInvoice = action.payload;
      })
      // Approve
      .addCase(approveInvoice.fulfilled, (state, action) => {
        const idx = state.invoices.findIndex((inv) => inv._id === action.payload._id);
        if (idx !== -1) state.invoices[idx] = action.payload;
        if (state.currentInvoice?._id === action.payload._id) {
          state.currentInvoice = action.payload;
        }
      })
      // Cancel
      .addCase(cancelInvoice.fulfilled, (state, action) => {
        const idx = state.invoices.findIndex((inv) => inv._id === action.payload._id);
        if (idx !== -1) state.invoices[idx] = action.payload;
        if (state.currentInvoice?._id === action.payload._id) {
          state.currentInvoice = action.payload;
        }
      })
      // Duplicate
      .addCase(duplicateInvoice.fulfilled, (state, action) => {
        state.invoices.unshift(action.payload);
      })
      // Delete
      .addCase(deleteInvoice.fulfilled, (state, action) => {
        state.invoices = state.invoices.filter((inv) => inv._id !== action.payload);
      });
  }
});

export const { setFilters, clearCurrentInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;
