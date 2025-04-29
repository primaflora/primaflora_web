import { TypedUseSelectorHook, useSelector } from 'react-redux';
import { TRootState } from './types.ts';
import { getUserSelector, getProductSelector } from './modules/index.ts';

export const useTypedSelector: TypedUseSelectorHook<TRootState> = useSelector;

export const useUserData = () => useTypedSelector(getUserSelector);
export const useProductData = () => useSelector(getProductSelector);
