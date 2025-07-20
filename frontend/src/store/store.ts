import { configureStore } from '@reduxjs/toolkit';
import tickerReducer from './ticker';
import priceReducer from './price';



export const store = configureStore({
  reducer: {
    ticker: tickerReducer,
    price: priceReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
