import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getAllWithdrawals as getAllWithdrawalsService,
  addWithdrawal as addWithdrawalService,
  updateWithdrawal as updateWithdrawalService,
  deleteWithdrawal as deleteWithdrawalService
} from '../../services/impactFundService';

export const fetchWithdrawals = createAsyncThunk('impactFund/fetchWithdrawals', async () => {
  return await getAllWithdrawalsService();
});

export const createWithdrawal = createAsyncThunk(
  'impactFund/createWithdrawal',
  async (withdrawalData, { dispatch }) => {
    await addWithdrawalService(withdrawalData);
    await dispatch(fetchWithdrawals());
  }
);

export const updateWithdrawal = createAsyncThunk(
  'impactFund/updateWithdrawal',
  async ({ id, ...withdrawalData }, { dispatch }) => {
    await updateWithdrawalService(id, withdrawalData);
    await dispatch(fetchWithdrawals());
  }
);

export const removeWithdrawal = createAsyncThunk(
  'impactFund/removeWithdrawal',
  async (withdrawalId, { dispatch }) => {
    await deleteWithdrawalService(withdrawalId);
    await dispatch(fetchWithdrawals());
  }
);

const impactFundSlice = createSlice({
  name: 'impactFund',
  initialState: {
    withdrawals: [],
    isLoading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWithdrawals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWithdrawals.fulfilled, (state, action) => {
        state.withdrawals = action.payload || [];
        state.isLoading = false;
      })
      .addCase(fetchWithdrawals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to load withdrawals';
      })
      .addCase(createWithdrawal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createWithdrawal.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createWithdrawal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to add withdrawal';
      })
      .addCase(updateWithdrawal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateWithdrawal.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateWithdrawal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to update withdrawal';
      })
      .addCase(removeWithdrawal.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeWithdrawal.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(removeWithdrawal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to delete withdrawal';
      });
  }
});

export default impactFundSlice.reducer;
