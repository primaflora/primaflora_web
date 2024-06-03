import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TUser } from '../../../common/services';
import { EStoreReducer } from '../../types.ts';
import { TInitialState } from './types';
import {
    TCategory,
    TProduct,
    TSubcategory,
} from '../../../common/services/category/types/common.ts';
import { TLike } from '../../../common/services/likes/index.ts';

const initialState: TInitialState = {
    user: null,
    likes: [],
    categories: [],
    products: [],
    isAuth: false,
    pickedSubcategory: null,
};

export const slice = createSlice({
    name: EStoreReducer.user,
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<TUser>) => {
            state.user = action.payload;
        },
        updateUser: (state, action: PayloadAction<Partial<TUser>>) => {
            state.user = { ...state.user, ...action.payload } as TUser;
        },
        clearUser: state => {
            state.user = null;
        },

        setCategories: (state, action: PayloadAction<TCategory[]>) => {
            console.log('Set categories');
            console.log(action.payload);
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

        setPickedSubcategory(
            state,
            action: PayloadAction<TSubcategory | null>,
        ) {
            state.pickedSubcategory = action.payload;
            // state.pickedProduct = null;
        },
        clearPickedSubcategory(state) {
            state.pickedSubcategory = null;
        },

        setPickedProduct(state, action: PayloadAction<TProduct | null>) {
            state.pickedProduct = action.payload;
            // we render product and category in one component, so selected[subcategory or product] should be only one
            // state.pickedSubcategory = null;
        },
        clearPickedProduct(state) {
            state.pickedProduct = null;
        },

        pushLike(state, action: PayloadAction<TLike>) {
            state.likes.push(action.payload);
        },
        removeLike(state, action: PayloadAction<number>) {
            state.likes = state.likes.filter(item => item.id !== action.payload);
        }
    },
});

export const userSliceActions = slice.actions;

export default slice.reducer;
