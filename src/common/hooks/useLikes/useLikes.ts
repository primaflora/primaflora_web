import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { userSliceActions } from '../../../store/modules/user/reducer.ts';
import { TLike } from '../../services/likes/index.ts';

export const useLikes = () => {
    const dispatch = useDispatch();

    const addLike = useCallback(
        (product: TLike) => {
            console.log('Add new like: ', product);
            dispatch(userSliceActions.pushLike(product));
        },
        [dispatch],
    );

    const removeLike = useCallback(
        (productId: number) => {
            dispatch(userSliceActions.removeLike(productId));
        },
        [dispatch],
    );

    return { addLike, removeLike };
};
