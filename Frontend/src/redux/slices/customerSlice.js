import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { customerApi } from '../../api/customerApi';
import toast from 'react-hot-toast';

export const fetchCustomers = createAsyncThunk(
  'customers/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await customerApi.getCustomers(params);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch customers');
    }
  }
);

export const fetchCustomerById = createAsyncThunk(
  'customers/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await customerApi.getCustomerById(id);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch customer details');
    }
  }
);

export const createCustomer = createAsyncThunk(
  'customers/create',
  async (customerData, { rejectWithValue }) => {
    try {
      const response = await customerApi.createCustomer(customerData);
      toast.success('Customer created successfully');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create customer');
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await customerApi.updateCustomer(id, data);
      toast.success('Customer updated successfully');
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update customer');
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/delete',
  async (id, { rejectWithValue }) => {
    try {
      await customerApi.deleteCustomer(id);
      toast.success('Customer deleted successfully');
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete customer');
    }
  }
);

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    customers: [],
    selectedCustomer: null,
    pagination: { page: 1, limit: 50, total: 0, pages: 1 },
    loading: false,
    error: null
  },
  reducers: {
    clearSelectedCustomer: (state) => {
      state.selectedCustomer = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch list
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.customers;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch by ID
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.selectedCustomer = action.payload;
      })
      // Create
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.customers.unshift(action.payload);
      })
      // Update
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const index = state.customers.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
        if (state.selectedCustomer?._id === action.payload._id) {
          state.selectedCustomer = action.payload;
        }
      })
      // Delete
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter((c) => c._id !== action.payload);
      });
  }
});

export const { clearSelectedCustomer } = customerSlice.actions;
export default customerSlice.reducer;
