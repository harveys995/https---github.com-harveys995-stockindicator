import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchPrice } from '../api/fetchData';

interface SP500PricesState {
  prices: Record<string, { ticker: string; price: number }>;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: SP500PricesState = {
  prices: {},
  status: 'idle',
};

export const loadSP500Prices = createAsyncThunk(
  'sp500Prices/loadSP500Prices',
  async (symbols: string[]) => {
    const pricePromises = symbols.map(symbol => 
      fetchPrice(symbol).catch(() => null)
    );
    const results = await Promise.all(pricePromises);
    
    const prices: Record<string, { ticker: string; price: number }> = {};
    results.forEach(result => {
      if (result) {
        prices[result.ticker] = result;
      }
    });
    
    return prices;
  }
);

const sp500PricesSlice = createSlice({
  name: 'sp500Prices',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSP500Prices.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loadSP500Prices.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.prices = action.payload;
      })
      .addCase(loadSP500Prices.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default sp500PricesSlice.reducer;