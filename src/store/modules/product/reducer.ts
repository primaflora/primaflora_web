// store/modules/product/reducer.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TProductFull, TProduct } from '../../../common/services/category/types/common';

interface ProductState {
  selectedProduct: TProductFull | null;
  productSeries: TProduct[];
  currentSeriesIndex: number;
}

const initialState: ProductState = {
  selectedProduct: null,
  productSeries: [],
  currentSeriesIndex: -1,
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
    setProductSeries(state, action: PayloadAction<TProduct[]>) {
      console.log('🔄 Redux setProductSeries:', action.payload.length, 'products');
      state.productSeries = action.payload;
      state.currentSeriesIndex = -1; // сбрасываем индекс при установке новой серии
      console.log('✅ Redux setProductSeries completed, currentIndex:', state.currentSeriesIndex);
    },
    setCurrentSeriesIndex(state, action: PayloadAction<number>) {
      console.log('🔄 Redux setCurrentSeriesIndex:', action.payload);
      state.currentSeriesIndex = action.payload;
      console.log('✅ Redux setCurrentSeriesIndex completed, new index:', state.currentSeriesIndex);
    },
    clearProductSeries(state) {
      state.productSeries = [];
      state.currentSeriesIndex = -1;
    },
  },
});

export const productSliceActions = productSlice.actions;
export default productSlice.reducer;
