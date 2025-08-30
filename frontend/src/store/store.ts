import { configureStore } from '@reduxjs/toolkit';
import tickerReducer from './ticker';
import priceReducer from './price';
import maReducer from './ma'
import betaReducer from './beta'
import sdReducer from './sd'
import atrReducer from './atr'
import Top10SharpeGrid from './top10_sharpe';
import aianalysisReducer from './aianalysis'



export const store = configureStore({
  reducer: {
    ticker: tickerReducer,
    price: priceReducer,
    ma: maReducer,
    beta: betaReducer,
    sd: sdReducer,
    atr: atrReducer,
    aianalysis: aianalysisReducer,
    sharpeGrid: Top10SharpeGrid
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
