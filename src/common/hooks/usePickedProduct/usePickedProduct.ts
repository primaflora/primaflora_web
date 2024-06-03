import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { userSliceActions } from '../../../store/modules/user/reducer.ts';
import { TProduct } from '../../services/product/index.ts';

export const usePickedProduct = () => {
    const dispatch = useDispatch();

    const setPickedProduct = useCallback(
        (product: TProduct | null) => {
            console.log('Picked product: ', product);
            dispatch(userSliceActions.setPickedProduct(product));
        },
        [dispatch],
    );

    const clearPickedProduct = useCallback(() => {
        dispatch(userSliceActions.clearPickedProduct());
    }, [dispatch]);

    return { setPickedProduct, clearPickedProduct };
};
