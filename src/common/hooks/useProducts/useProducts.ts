import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { userSliceActions } from '../../../store/modules/user/reducer.ts';
import { TProduct } from '../../services/product';

export const useProducts = () => {
    const dispatch = useDispatch();

    const setProducts = useCallback(
        (products: TProduct[]) => {
            dispatch(userSliceActions.setProducts(products));
        },
        [dispatch],
    );

    return { setProducts };
};