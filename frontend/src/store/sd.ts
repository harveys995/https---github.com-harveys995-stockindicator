import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchSD } from '../api/fetchData';

interface SDState {
  value: { ticker: string; sd: number } | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: SDState = {
  value: null,
  status: 'idle',
};

export const loadSD = createAsyncThunk(
  'sd/loadSD',
  async (ticker: string) => {
    return await fetchSD(ticker);
  }
);

const SDSlice = createSlice({
  name: 'sd',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSD.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loadSD.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.value = action.payload;
      })
      .addCase(loadSD.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default SDSlice.reducer;
