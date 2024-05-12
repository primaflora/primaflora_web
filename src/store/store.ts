import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducer.ts';


const store = configureStore({
   reducer: rootReducer,
   devTools: true
});

export default store;