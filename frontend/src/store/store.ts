import { configureStore } from '@reduxjs/toolkit';
import tickerReducer from './ticker';
import priceReducer from './price';
import maReducer from './ma'
import spReducer from './sp500List'
import aianalysisReducer from './aianalysis'
import sp500PricesReducer from './sp500Prices';

export const store = configureStore({
  reducer: {
    ticker: tickerReducer,
    price: priceReducer,
    ma: maReducer,
    sp500: spReducer,
    aianalysis: aianalysisReducer,
    sp500Prices: sp500PricesReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
