import { configureStore } from '@reduxjs/toolkit';
import tickerReducer from '../Slices/Ticker_Slice';
import spReducer from '../Slices/SP500List_Slice'
import sp500SharpeSlice from '../Slices/SP500Sharpe_Slice';
import ETFSlice from '../Slices/ETF_Slice'

export const store = configureStore({
  reducer: {
    ticker: tickerReducer,
    sp500: spReducer,
    sp500Sharpe: sp500SharpeSlice,
    etf: ETFSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
