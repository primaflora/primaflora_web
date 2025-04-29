// store/modules/product/reducer.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TProductFull } from '../../../common/services/category/types/common';

interface ProductState {
  selectedProduct: TProductFull | null;
}

const initialState: ProductState = {
  selectedProduct: null,
};

export const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setSelectedProduct(state, action: PayloadAction<TProductFull | null>) {
      state.selectedProduct = action.payload;
    },
    clearSelectedProduct(state) {
      state.selectedProduct = null;
    },
  },
});

export const productSliceActions = productSlice.actions;
export default productSlice.reducer;
