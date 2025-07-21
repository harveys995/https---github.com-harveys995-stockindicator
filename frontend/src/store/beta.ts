import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchBeta } from '../api/fetchData';

interface BetaState {
  value: { ticker: string; beta: number } | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: BetaState = {
  value: null,
  status: 'idle',
};

export const loadBeta = createAsyncThunk(
  'beta/loadBeta',
  async (ticker: string) => {
    return await fetchBeta(ticker);
  }
);

const betaSlice = createSlice({
  name: 'beta',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadBeta.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loadBeta.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.value = action.payload;
      })
      .addCase(loadBeta.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default betaSlice.reducer;
