import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { userSliceActions } from '../../../store/modules/user/reducer.ts';
import { TUser } from '../../services';

export const useAuth = () => {
    const dispatch = useDispatch();

    const setUserData = useCallback(
        (user: TUser) => {
            dispatch(userSliceActions.setUser(user));
        },
        [dispatch],
    );

    const clearAll = useCallback(() => {
        dispatch(userSliceActions.clearUser());
        dispatch(userSliceActions.clearCategories());
        dispatch(userSliceActions.clearProducts());
    }, [dispatch]);

    const setIsAuth = useCallback(
        (isAuth: boolean) => {
            dispatch(userSliceActions.setIsAuth(isAuth));
        },
        [dispatch],
    );

    return { setUserData, clearAll, setIsAuth };
};
