import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getAllTransactions as getAllTransactionsService,
  saveTransaction as saveTransactionService,
  updateTransaction as updateTransactionService,
  deleteTransaction as deleteTransactionService
} from '../../services/transactionService';

export const fetchTransactions = createAsyncThunk('transactions/fetchAll', async () => {
  return await getAllTransactionsService();
});

export const createTransaction = createAsyncThunk(
  'transactions/create',
  async (transactionData, { dispatch }) => {
    await saveTransactionService(transactionData);
    await dispatch(fetchTransactions());
  }
);

export const editTransaction = createAsyncThunk(
  'transactions/edit',
  async ({ transactionId, transactionData }, { dispatch }) => {
    await updateTransactionService(transactionId, transactionData);
    await dispatch(fetchTransactions());
  }
);

export const removeTransaction = createAsyncThunk(
  'transactions/delete',
  async (transactionId, { dispatch }) => {
    await deleteTransactionService(transactionId);
    await dispatch(fetchTransactions());
  }
);

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState: {
    items: [],
    isLoading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.isLoading = false;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to load transactions';
      })
      .addMatcher(
        (action) =>
          action.type.startsWith('transactions/create/') ||
          action.type.startsWith('transactions/edit/') ||
          action.type.startsWith('transactions/delete/'),
        (state, action) => {
          if (action.type.endsWith('/pending')) {
            state.isLoading = true;
            state.error = null;
          }
          if (action.type.endsWith('/rejected')) {
            state.isLoading = false;
            state.error = action.error?.message || 'Transaction action failed';
          }
          if (action.type.endsWith('/fulfilled')) {
            state.isLoading = false;
          }
        }
      );
  }
});

export default transactionsSlice.reducer;

