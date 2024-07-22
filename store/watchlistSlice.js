// store/watchlistSlice.js
import { createSlice } from '@reduxjs/toolkit';

const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState: [],
  reducers: {
    addCoinToWatchlist: (state, action) => {
      state.push(action.payload);
    },
    setWatchlist: (state, action) => {
      return action.payload;
    },
  },
});

export const { addCoinToWatchlist, setWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;
