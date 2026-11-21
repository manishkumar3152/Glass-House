import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardApi } from '../../api/dashboardApi';

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchData',
  async (_, { rejectWithValue }) => {
    try {
      const [statsRes, recentRes, chartsRes] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getRecentInvoices(),
        dashboardApi.getCharts()
      ]);

      return {
        stats: statsRes.data,
        recentInvoices: recentRes.data,
        charts: chartsRes.data
      };
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch dashboard data');
    }
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    stats: null,
    recentInvoices: [],
    charts: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.stats = action.payload.stats;
        state.recentInvoices = action.payload.recentInvoices;
        state.charts = action.payload.charts;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default dashboardSlice.reducer;
