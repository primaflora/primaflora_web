import { useAuth } from '../../common/hooks/useAuth/useAuth';
import { Service } from '../../common/services';

export const useLoadUserData = () => {
    const { setUserData } = useAuth();

    const load = () => {
        Service.UserService.getUserByToken({ loadInvitedUser: true })
            .then(res => setUserData(res.data))
            .catch(err => console.log(err));
    }

    return { load };
};
