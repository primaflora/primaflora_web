import { combineReducers } from '@reduxjs/toolkit';
import { EStoreReducer } from './types.ts';
import { productReducer, userReducer } from './modules';

export default combineReducers({
    [EStoreReducer.user]: userReducer,
    product: productReducer
})