import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TProduct } from '../services/category/types/common';
import { productSliceActions } from '../../store/modules/product/reducer';
import { getProductSeries, getCurrentSeriesIndex } from '../../store/modules/product/selectors';

export const useProductSeries = () => {
  const dispatch = useDispatch();
  const products = useSelector(getProductSeries);
  const currentIndex = useSelector(getCurrentSeriesIndex);

  console.log('useProductSeries hook:', { products: products?.length, currentIndex });

  // Сохраняем массив товаров подкатегории
  const setProductSeries = useCallback((productList: TProduct[]) => {
    console.log('🔄 setProductSeries: saving', productList.length, 'products to Redux');
    dispatch(productSliceActions.setProductSeries(productList));
    console.log('✅ setProductSeries: dispatch completed');
  }, [dispatch]);

  // Устанавливаем текущий индекс напрямую
  const setCurrentProductIndex = useCallback((index: number) => {
    console.log('🔄 setCurrentProductIndex:', { index, totalProducts: products.length });
    dispatch(productSliceActions.setCurrentSeriesIndex(index));
    console.log('✅ setCurrentProductIndex: dispatch completed');
  }, [dispatch, products]);



  // Получаем товар по индексу
  const getProductByIndex = useCallback((index: number): TProduct | null => {
    console.log('getProductByIndex:', { index, totalProducts: products.length });
    if (index < 0 || index >= products.length) return null;
    return products[index];
  }, [products]);

  // Получаем текущий индекс
  const getCurrentIndex = useCallback(() => {
    console.log('getCurrentIndex:', currentIndex);
    return currentIndex;
  }, [currentIndex]);

  // Получаем общее количество товаров
  const getProductsCount = useCallback(() => {
    return products.length;
  }, [products]);

  // Получаем все товары
  const getProducts = useCallback(() => {
    return products;
  }, [products]);

  // Очищаем серию товаров
  const clearProductSeries = useCallback(() => {
    console.log('clearProductSeries');
    dispatch(productSliceActions.clearProductSeries());
  }, [dispatch]);

  return {
    setProductSeries,
    setCurrentProductIndex,
    getProductByIndex,
    getCurrentIndex,
    getProductsCount,
    getProducts,
    clearProductSeries,
    currentIndex,
    products
  };
};