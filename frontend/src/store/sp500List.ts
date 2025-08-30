// src/features/sp500/sp500Slice.ts
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchSP500List } from '../api/fetchData';

type Sp500Row = Record<string, unknown>;

interface Sp500State {
  value: Sp500Row[] | null;                    // just rows
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

const initialState: Sp500State = {
  value: null,
  status: 'idle',
};

export const loadSp500Rows = createAsyncThunk<
  Sp500Row[],        // thunk return type: rows[]
  void,              // arg type
  { rejectValue: string }
>(
  'sp500/loadSp500Rows',
  async (_arg, { rejectWithValue }) => {
    try {
      const json = await fetchSP500List();     // expects { rows: [...] }
      const rows = Array.isArray(json?.rows) ? json.rows : [];
      return rows as Sp500Row[];
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Failed to load S&P 500 rows');
    }
  }
);

const sp500Slice = createSlice({
  name: 'sp500',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadSp500Rows.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loadSp500Rows.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.value = action.payload;          // rows[]
      })
      .addCase(loadSp500Rows.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message;
      });
  },
});

export default sp500Slice.reducer;

// Selectors
export const selectSp500Rows   = (s: { sp500: Sp500State }) => s.sp500.value ?? [];
export const selectSp500Status = (s: { sp500: Sp500State }) => s.sp500.status;
export const selectSp500Error  = (s: { sp500: Sp500State }) => s.sp500.error;

// Optional: quick ticker list if you need it somewhere:
// export const selectSp500Tickers = (s: { sp500: Sp500State }) =>
//   (s.sp500.value ?? []).map(r => String((r as any)['Symbol'] ?? '')).filter(Boolean);
