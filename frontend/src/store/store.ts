import { configureStore } from '@reduxjs/toolkit';
import tickerReducer from './ticker';
import priceReducer from './price';
import maReducer from './ma'
import betaReducer from './beta'



export const store = configureStore({
  reducer: {
    ticker: tickerReducer,
    price: priceReducer,
    ma: maReducer,
    beta: betaReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
