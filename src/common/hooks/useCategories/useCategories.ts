import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { userSliceActions } from '../../../store/modules/user/reducer.ts';
import { TCategory } from '../../services/category/types';

export const useCategories = () => {
    const dispatch = useDispatch();

    const setCategories = useCallback(
        (categories: TCategory[]) => {
            dispatch(userSliceActions.setCategories(categories));
        },
        [dispatch],
    );

    return { setCategories };
};
