import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface TickerState {
  value: string;
}

const initialState: TickerState = {
  value: 'AAPL',
};

const tickerSlice = createSlice({
  name: 'ticker',
  initialState,
  reducers: {
    setTicker: (state, action: PayloadAction<string>) => {
      state.value = action.payload;
    },
  },
});

export const { setTicker } = tickerSlice.actions;
export default tickerSlice.reducer;
