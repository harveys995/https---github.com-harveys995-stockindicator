import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchtop10sharpe5d } from '../api/fetchData';

// types
export interface SharpePayload {
  universe: string[];
  benchmark: string;
  sharpe_ratio_5d: Record<string, number | null>;
  debug: Record<string, unknown>;
}

interface Top10State {
  value: SharpePayload | null;   // ← correct shape
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: Top10State = {
  value: null,
  status: 'idle',
};

// thunk
export const loadtop10 = createAsyncThunk<SharpePayload>(
  'top10/loadtop10',
  async () => {
    const res = await fetchtop10sharpe5d();
    return res as SharpePayload;
  }
);

// slice
const Top10Slice = createSlice({
  name: 'top10',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadtop10.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loadtop10.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.value = action.payload;   // ← payload now matches type
      })
      .addCase(loadtop10.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default Top10Slice.reducer;
