import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getAllExpenses as getAllExpensesService,
  saveExpense as saveExpenseService,
  updateExpense as updateExpenseService,
  deleteExpense as deleteExpenseService
} from '../../services/expenseService';

export const fetchExpenses = createAsyncThunk('expenses/fetchAll', async () => {
  return await getAllExpensesService();
});

export const createExpense = createAsyncThunk(
  'expenses/create',
  async (expenseData, { dispatch }) => {
    await saveExpenseService(expenseData);
    await dispatch(fetchExpenses());
  }
);

export const editExpense = createAsyncThunk(
  'expenses/edit',
  async ({ expenseId, expenseData }, { dispatch }) => {
    await updateExpenseService(expenseId, expenseData);
    await dispatch(fetchExpenses());
  }
);

export const removeExpense = createAsyncThunk(
  'expenses/delete',
  async (expenseId, { dispatch }) => {
    await deleteExpenseService(expenseId);
    await dispatch(fetchExpenses());
  }
);

const expensesSlice = createSlice({
  name: 'expenses',
  initialState: {
    items: [],
    isLoading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.items = action.payload || [];
        state.isLoading = false;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || 'Failed to load expenses';
      })
      .addMatcher(
        (action) =>
          action.type.startsWith('expenses/create/') ||
          action.type.startsWith('expenses/edit/') ||
          action.type.startsWith('expenses/delete/'),
        (state, action) => {
          if (action.type.endsWith('/pending')) {
            state.isLoading = true;
            state.error = null;
          }
          if (action.type.endsWith('/rejected')) {
            state.isLoading = false;
            state.error = action.error?.message || 'Expense action failed';
          }
          if (action.type.endsWith('/fulfilled')) {
            state.isLoading = false;
          }
        }
      );
  }
});

export default expensesSlice.reducer;
