import { useAuth } from '../../common/hooks/useAuth/useAuth';
import { EUserRole, Service } from '../../common/services';
import { StorageService } from '../../common/storage/storage.service';

export const useLoadUserData = () => {
    const { setUserData, setIsAdmin, setIsAuth, clearAll } = useAuth();

    const load = () => {
        Service.UserService.getUserByToken({ loadInvitedUser: true })
            .then(res => {
                setUserData(res.data);
                setIsAdmin(res.data.role?.name === EUserRole.ADMIN);
            })
            .catch(err => {
                // Если получили ошибку при загрузке данных пользователя (например, истёкший токен),
                // очищаем токены и сбрасываем состояние авторизации
                console.log('Error loading user data:', err);
                StorageService.clearTokens();
                setIsAuth(false);
                clearAll();
                setIsAdmin(false);
            });
    }

    return { load };
};
