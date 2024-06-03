import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { userSliceActions } from '../../../store/modules/user/reducer.ts';
import { TSubcategory } from '../../services/category/types/common.ts';

export const usePickedSubcategory = () => {
    const dispatch = useDispatch();

    const setPickedSubcategory = useCallback(
        (subcategory: TSubcategory) => {
            console.log('Picked subcategory: ', subcategory);
            dispatch(userSliceActions.setPickedSubcategory(subcategory));
        },
        [dispatch],
    );

    const clearPickedSubcategory = useCallback(() => {
        dispatch(userSliceActions.clearPickedSubcategory());
    }, [dispatch]);

    return { setPickedSubcategory, clearPickedSubcategory };
};
