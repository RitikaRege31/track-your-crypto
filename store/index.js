// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import watchlistReducer from './watchlistSlice';

const store = configureStore({
  reducer: {
    watchlist: watchlistReducer,
  },
});

export default store;
