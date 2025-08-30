import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchATR } from '../api/fetchData';

interface ATRState {
  value: { ticker: string; atr: number } | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: ATRState = {
  value: null,
  status: 'idle',
};

export const loadATR = createAsyncThunk(
  'atr/loadATR',
  async (ticker: string) => {
    return await fetchATR(ticker);
  }
);

const ATRSlice = createSlice({
  name: 'atr',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadATR.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loadATR.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.value = action.payload;
      })
      .addCase(loadATR.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default ATRSlice.reducer;
