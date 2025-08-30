import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchAIAnalysis } from '../api/fetchData';

interface AIAnalysisState {
  value: { ticker: string; analysis: strin } | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: AIAnalysisState = {
  value: null,
  status: 'idle',
};

export const loadAIAnalysis = createAsyncThunk(
  'aianalysis/loadAIAnalysis',
  async (ticker: string) => {
    return await fetchAIAnalysis(ticker);
  }
);

const AIAnalysisSlice = createSlice({
  name: 'aianalysis',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAIAnalysis.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loadAIAnalysis.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.value = action.payload;
      })
      .addCase(loadAIAnalysis.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default AIAnalysisSlice.reducer;
