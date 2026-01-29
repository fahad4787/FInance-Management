import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './projects/projectsSlice';
import transactionsReducer from './transactions/transactionsSlice';
import expensesReducer from './expenses/expensesSlice';

export const store = configureStore({
  reducer: {
    projects: projectsReducer,
    transactions: transactionsReducer,
    expenses: expensesReducer
  }
});

