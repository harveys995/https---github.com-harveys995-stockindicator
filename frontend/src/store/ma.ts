import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchMA } from '../api/fetchData';

interface MAState {
  value: {
    ma50: any;
    ma200: any; ticker: string; price: number 
} | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: MAState = {
  value: null,
  status: 'idle',
};

export const loadMA = createAsyncThunk(
  'price/loadMA',
  async (ticker: string) => {
    return await fetchMA(ticker);
  }
);

const MASlice = createSlice({
  name: 'ma',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadMA.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loadMA.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.value = action.payload;
      })
      .addCase(loadMA.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default MASlice.reducer;
