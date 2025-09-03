import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

//* ETF Data Shape ──────────────────────────────────────────────
interface ETFData {
  name: string;
  symbol: string;
  description: string;
}

//* ETF State + UI Metadata  ──────────────────────────────────────────────
interface ETFState {
  selectedETF: ETFData | null;
  availableETFs: ETFData[];
}

export const etfOptions: ETFData[] = [
  { name: 'S&P 500', symbol: 'SPY', description: '500 largest US companies' },
  { name: 'NASDAQ', symbol: 'QQQ', description: 'Tech-heavy index' },
];

const initialState: ETFState = {
  selectedETF: null, // No default selection
  availableETFs: etfOptions,
};

//* Redux Slice — ETF Selection: manages selected ETF state ──────────────────────────────────────────────
const etfSlice = createSlice({
  name: 'etf',
  initialState,
  reducers: {
    setSelectedETF: (state, action: PayloadAction<string>) => {
      const etf = state.availableETFs.find(e => e.name === action.payload);
      if (etf) {
        state.selectedETF = etf;
      }
    },
  },
});

export const { setSelectedETF } = etfSlice.actions;
export default etfSlice.reducer; // To connect with the main store

//* Selectors: Returns a section of the Redux Slice (etf) ──────────────────────────────────────────────
export const selectSelectedETF = (s: { etf: ETFState }) => s.etf.selectedETF;
export const selectAvailableETFs = (s: { etf: ETFState }) => s.etf.availableETFs;