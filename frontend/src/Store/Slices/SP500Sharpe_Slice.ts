import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

//* API Data Shape ──────────────────────────────────────────────
interface SP500SharpeData {
  periods: {
      '5d': [string, number][];
      '30d': [string, number][];
      '100d': [string, number][];
      '252d': [string, number][];
  };
}

//* API Data + UI Metadata  ──────────────────────────────────────────────
interface SP500SharpeState {
    value: SP500SharpeData | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error?: string;
  }

//* Thunk: Load S&P 500 rows (emits pending/fulfilled/rejected, returns rows or a typed error) ──────────────────────────────────────────────
//? INFO Documentation: https://redux-toolkit.js.org/api/createAsyncThunk
export const loadSP500Sharpe = createAsyncThunk<
  SP500SharpeData,
  void,
  { rejectValue: string }
>(
  'sp500Sharpe/loadSP500Sharpe',
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch('http://localhost:8000/api/sp500_sharpe_multi');
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      return json;
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Failed to load SP500 Sharpe data');
    }
  }
);

const initialState: SP500SharpeState = {
    value: null,
    status: 'idle',
  };

//* Redux Slice — S&P 500 List: loads rows via createAsyncThunk (pending/fulfilled/rejected) ──────────────────────────────────────────────
const sp500SharpeSlice = createSlice({
    name: 'sp500Sharpe',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(loadSP500Sharpe.pending, (state) => {
          state.status = 'loading';
          state.error = undefined;
        })
        .addCase(loadSP500Sharpe.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.value = action.payload;
        })
        .addCase(loadSP500Sharpe.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.payload ?? action.error.message;
        });
    },
  });
  
export default sp500SharpeSlice.reducer; // To connect with the main store

//* Selectors: Returns a section of the Redux Slice (sp500List) ──────────────────────────────────────────────
export const selectSP500SharpeData = (s: { sp500Sharpe: SP500SharpeState }) => s.sp500Sharpe.value;
export const selectSP500SharpeStatus = (s: { sp500Sharpe: SP500SharpeState }) => s.sp500Sharpe.status;