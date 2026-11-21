import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { companyApi } from '../../api/companyApi';
import { glassApi } from '../../api/glassApi';
import { processingApi } from '../../api/processingApi';
import { taxApi } from '../../api/taxApi';
import toast from 'react-hot-toast';

// Company
export const fetchCompany = createAsyncThunk('masters/fetchCompany', async () => {
  const res = await companyApi.getCompany();
  return res.data;
});

export const updateCompany = createAsyncThunk('masters/updateCompany', async (data) => {
  const res = await companyApi.updateCompany(data);
  toast.success('Company settings updated');
  return res.data;
});

// Glass Specs
export const fetchGlassSpecifications = createAsyncThunk('masters/fetchGlassSpecs', async () => {
  const res = await glassApi.getSpecifications();
  return res.data;
});

export const createGlassSpecification = createAsyncThunk('masters/createGlassSpec', async (data) => {
  const res = await glassApi.createSpecification(data);
  toast.success('Glass specification created');
  return res.data;
});

export const updateGlassSpecification = createAsyncThunk('masters/updateGlassSpec', async ({ id, data }) => {
  const res = await glassApi.updateSpecification(id, data);
  toast.success('Glass specification updated');
  return res.data;
});

export const deleteGlassSpecification = createAsyncThunk('masters/deleteGlassSpec', async (id) => {
  await glassApi.deleteSpecification(id);
  toast.success('Glass specification deleted');
  return id;
});

// Glass Rates
export const fetchGlassRates = createAsyncThunk('masters/fetchGlassRates', async (params) => {
  const res = await glassApi.getRates(params);
  return res.data;
});

export const createGlassRate = createAsyncThunk('masters/createGlassRate', async (data) => {
  const res = await glassApi.createRate(data);
  toast.success('Glass rate added');
  return res.data;
});

export const updateGlassRate = createAsyncThunk('masters/updateGlassRate', async ({ id, data }) => {
  const res = await glassApi.updateRate(id, data);
  toast.success('Glass rate updated');
  return res.data;
});

export const deleteGlassRate = createAsyncThunk('masters/deleteGlassRate', async (id) => {
  await glassApi.deleteRate(id);
  toast.success('Glass rate removed');
  return id;
});

// Processing Charges
export const fetchProcessingCharges = createAsyncThunk('masters/fetchProcessingCharges', async () => {
  const res = await processingApi.getCharges();
  return res.data;
});

export const createProcessingCharge = createAsyncThunk('masters/createProcessingCharge', async (data) => {
  const res = await processingApi.createCharge(data);
  toast.success('Processing charge added');
  return res.data;
});

export const updateProcessingCharge = createAsyncThunk('masters/updateProcessingCharge', async ({ id, data }) => {
  const res = await processingApi.updateCharge(id, data);
  toast.success('Processing charge updated');
  return res.data;
});

export const deleteProcessingCharge = createAsyncThunk('masters/deleteProcessingCharge', async (id) => {
  await processingApi.deleteCharge(id);
  toast.success('Processing charge removed');
  return id;
});

// Tax Config
export const fetchTaxConfig = createAsyncThunk('masters/fetchTaxConfig', async () => {
  const res = await taxApi.getTaxConfig();
  return res.data;
});

export const updateTaxConfig = createAsyncThunk('masters/updateTaxConfig', async (data) => {
  const res = await taxApi.updateTaxConfig(data);
  toast.success('Tax configuration updated');
  return res.data;
});

const masterSlice = createSlice({
  name: 'masters',
  initialState: {
    company: null,
    glassSpecifications: [],
    glassRates: [],
    processingCharges: [],
    taxConfig: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Company
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.company = action.payload;
      })
      .addCase(updateCompany.fulfilled, (state, action) => {
        state.company = action.payload;
      })
      // Specs
      .addCase(fetchGlassSpecifications.fulfilled, (state, action) => {
        state.glassSpecifications = action.payload;
      })
      .addCase(createGlassSpecification.fulfilled, (state, action) => {
        state.glassSpecifications.push(action.payload);
      })
      .addCase(updateGlassSpecification.fulfilled, (state, action) => {
        const idx = state.glassSpecifications.findIndex((s) => s._id === action.payload._id);
        if (idx !== -1) state.glassSpecifications[idx] = action.payload;
      })
      .addCase(deleteGlassSpecification.fulfilled, (state, action) => {
        state.glassSpecifications = state.glassSpecifications.filter((s) => s._id !== action.payload);
      })
      // Rates
      .addCase(fetchGlassRates.fulfilled, (state, action) => {
        state.glassRates = action.payload;
      })
      .addCase(createGlassRate.fulfilled, (state, action) => {
        state.glassRates.unshift(action.payload);
      })
      .addCase(updateGlassRate.fulfilled, (state, action) => {
        const idx = state.glassRates.findIndex((r) => r._id === action.payload._id);
        if (idx !== -1) state.glassRates[idx] = action.payload;
      })
      .addCase(deleteGlassRate.fulfilled, (state, action) => {
        state.glassRates = state.glassRates.filter((r) => r._id !== action.payload);
      })
      // Processing
      .addCase(fetchProcessingCharges.fulfilled, (state, action) => {
        state.processingCharges = action.payload;
      })
      .addCase(createProcessingCharge.fulfilled, (state, action) => {
        state.processingCharges.push(action.payload);
      })
      .addCase(updateProcessingCharge.fulfilled, (state, action) => {
        const idx = state.processingCharges.findIndex((p) => p._id === action.payload._id);
        if (idx !== -1) state.processingCharges[idx] = action.payload;
      })
      .addCase(deleteProcessingCharge.fulfilled, (state, action) => {
        state.processingCharges = state.processingCharges.filter((p) => p._id !== action.payload);
      })
      // Tax
      .addCase(fetchTaxConfig.fulfilled, (state, action) => {
        state.taxConfig = action.payload;
      })
      .addCase(updateTaxConfig.fulfilled, (state, action) => {
        state.taxConfig = action.payload;
      });
  }
});

export default masterSlice.reducer;
