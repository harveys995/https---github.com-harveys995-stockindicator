import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchPrice } from '../api/fetchData'

interface PriceState {
  value: { ticker: string; price: number } | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: PriceState = {
  value: null,
  status: 'idle',
};

export const loadPrice = createAsyncThunk(
  'price/loadPrice',
  async (ticker: string) => {
    return await fetchPrice(ticker);
  }
);

const priceSlice = createSlice({
  name: 'price',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadPrice.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loadPrice.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.value = action.payload;
      })
      .addCase(loadPrice.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default priceSlice.reducer;
