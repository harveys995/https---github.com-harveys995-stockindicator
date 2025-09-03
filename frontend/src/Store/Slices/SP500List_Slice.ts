import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { fetchSP500List } from '../../API/fetchData';

//* API Data Shape ──────────────────────────────────────────────
interface Sp500Row {
  Symbol: string;
  Security: string;
  "GICS Sector": string;
  "GICS Sub-Industry": string;
  "Headquarters Location": string;
  "Date added": string;
  CIK: number | string;
  Founded: string;
}

//* API Data + UI Metadata  ──────────────────────────────────────────────
interface Sp500State {
  value: Sp500Row[] | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
  lastUpdated?: number;
}

//* Thunk: Load S&P 500 rows (emits pending/fulfilled/rejected, returns rows or a typed error) ──────────────────────────────────────────────
//? INFO Documentation: https://redux-toolkit.js.org/api/createAsyncThunk
export const loadSp500Rows = createAsyncThunk<
  Sp500Row[],              // On success, the payload type is Sp500Row[]
  void,                    // No argument is passed to dispatch(...)
  { rejectValue: string }  // On error, the rejected payload is a string
>(
  'sp500/loadSp500Rows',    // Action type prefix Redux uses to generate pending, fulfilled & rejected
  async (_arg, { rejectWithValue }) => { // Argument passed on dispatch, "_arg" means unused. rejectWithValue allows to pass your own payload upon failure
    try {
      const res = await fetch(`http://localhost:8000/api/sp500/table`); // Fetch from API
      const json = await res.json();
      const rows = Array.isArray(json?.rows) ? json.rows : [];
      return rows as Sp500Row[]; // → triggers *fulfilled* with rows
    } catch (e: any) {
      return rejectWithValue(e?.message ?? 'Failed to load S&P 500 rows'); // → triggers *rejected* with message
    }
  }
);

const initialState: Sp500State = {
  value: null,
  status: 'idle',
};

//* Redux Slice — S&P 500 List: loads rows via createAsyncThunk (pending/fulfilled/rejected) ──────────────────────────────────────────────
const sp500ListSlice = createSlice({
  name: 'sp500List',
  initialState,
  reducers: {},
  extraReducers: (builder) => { // This handles the thunk/s 3 phases: pending/fulfilled/rejected
    builder
      .addCase(loadSp500Rows.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loadSp500Rows.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.value = action.payload;
      })
      .addCase(loadSp500Rows.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message;
      });
  },
});

export default sp500ListSlice.reducer; // To connect with the main store

//* Selectors: Returns a section of the Redux Slice (sp500List) ──────────────────────────────────────────────
export const selectSp500Rows   = (s: { sp500: Sp500State }) => s.sp500.value || [];
export const selectSp500Status = (s: { sp500: Sp500State }) => s.sp500.status;
export const selectSp500Error  = (s: { sp500: Sp500State }) => s.sp500.error;