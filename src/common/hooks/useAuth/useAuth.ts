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

    const updateUserData = useCallback(
        (user: Partial<TUser>) => {
            dispatch(userSliceActions.updateUser(user));
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

    const setIsAdmin = useCallback(
        (isAdmin: boolean) => {
            console.log('is Admin => ', isAdmin);
            dispatch(userSliceActions.setIsAdmin(isAdmin));
        },
        [dispatch]
    )

    return { setUserData, updateUserData, clearAll, setIsAuth, setIsAdmin };
};
