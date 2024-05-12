import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '../../../common/services';
import { TCategory } from '../../../common/services/category/types';
import { TProduct } from '../../../common/services/product';
import { EStoreReducer } from '../../types.ts';
import { TInitialState } from './types';

const initialState: TInitialState = {
    user: null,
    categories: [],
    products: [],
    isAuth: false,
};

export const slice = createSlice({
    name: EStoreReducer.user,
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<TUser>) => {
            state.user = action.payload;
        },
        clearUser: state => {
            state.user = null;
        },

        setCategories: (state, action: PayloadAction<TCategory[]>) => {
            state.categories = action.payload;
        },
        clearCategories: state => {
            state.categories = [];
        },

        setProducts: (state, action: PayloadAction<TProduct[]>) => {
            state.products = action.payload;
        },
        clearProducts: state => {
            state.products = [];
        },

        setIsAuth(state, action: PayloadAction<boolean>) {
            state.isAuth = action.payload;
        },
    },
});

export const userSliceActions = slice.actions;

export default slice.reducer;
