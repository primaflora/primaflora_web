import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../common/hooks/useAuth/useAuth';
import { Service } from '../../common/services';
import { StorageService } from '../../common/storage/storage.service';
import { Toast } from '../../common/toast';
import { Button } from '../../components/buttons';
import { Row } from '../../components/common/Row';
import { useUserData } from '../../store/tools';
import { Section } from './components/Section/Section';
import './styles.css';

export const UserInfo = () => {
    const { user } = useUserData();
    // const { notifyError } = useToast();
    // const { updateUserData } = useAuth();
    const navigate = useNavigate();
    const { clearAll, setIsAuth } = useAuth();

    // const handleUpdateUser = async (updateObj: object) => {
    //     Service.UserService.patchUpdate(updateObj)
    //         .then(() => {
    //             updateUserData(updateObj);
    //         })
    //         .catch(error => {
    //             if (axios.isAxiosError(error)) {
    //                 notifyError(error.response?.data.message[0]);
    //             } else {
    //                 notifyError('Canot change user data');
    //             }
    //         });
    // };

    const handleLogOutPress = () => {
        Service.AuthService.postLogOut();
        StorageService.removeToken('accessToken');
        StorageService.removeToken('refreshToken');

        clearAll();
        setIsAuth(false);
        navigate('/');

        window.location.reload();
    };

    return (
        <div className="main-global-padding pt-6">
            <div className="user-info-info-section">
                <Row style={{ justifyContent: 'flex-end' }}>
                    <Button
                        text="ВАША ЗНИЖКА 10%"
                        style={{ width: '13rem', padding: '7px 10px' }}
                        onClick={() => {}}
                    />
                </Row>
            </div>
            <div className="justify-end flex">
                <h1 className="text-black">Затисніть, щоб копіювати</h1>
            </div>

            <div className="section-container">
                <Section
                    title="(ПІБ першої особи)"
                    content={user?.name || 'Test User Lorem Ipsum'}
                    // button={{
                    //     text: 'Редагувати',
                    //     onUpdate(newValue) {
                    //         handleUpdateUser({ name: newValue });
                    //     },
                    // }}
                />
                <Section
                    title="(ПІБ другої особи)"
                    content={user?.invitedUser?.name || 'No invited user'}
                    // button={{
                    //     text: 'Редагувати',
                    //     onUpdate: () => {
                    //         console.log('Edit Section #1');
                    //     },
                    // }}
                />
                <Section
                    title="(Особистий номер в компанії)"
                    content={user?.login || '#0001'}
                    // button={{
                    //     text: 'Редагувати',
                    //     onUpdate(newValue) {
                    //         handleUpdateUser({ login: newValue });
                    //     },
                    // }}
                />
                <Section
                    title="(Реферальне посилання)"
                    content={
                        user?.invitationCode
                            ? `http://localhost:3000/auth/sign-up/invite/${user?.invitationCode}`
                            : 'https://primaflora.com/auth/sign-up/invite/TEST_CODE'
                    }
                    // button={{
                    //     text: 'Редагувати',
                    //     onUpdate: () => {},
                    // }}
                />
                <Section
                    title="Телефон"
                    content={user?.phone || '+380000000000'}
                    // button={{
                    //     text: 'Редагувати',
                    //     onUpdate(newValue) {
                    //         handleUpdateUser({ phone: newValue });
                    //     },
                    // }}
                />
                <Section
                    title="Пошта"
                    content={user?.email || 'test@primaflora.com'}
                    // button={{
                    //     text: 'Редагувати',
                    //     onUpdate(newValue) {
                    //         handleUpdateUser({ email: newValue });
                    //     },
                    // }}
                />
                <Section
                    title="Пароль (хеш)"
                    content={user?.password || '********'}
                    // button={{
                    //     text: 'Редагувати',
                    //     onUpdate: () => {},
                    // }}
                />
            </div>

            <div className="user-info-logout-botton-mob pb-5">
                <Button
                    text="ВИЙТИ"
                    onClick={handleLogOutPress}
                    filled
                    style={{ borderRadius: '7px', width: '100%' }}
                />
            </div>
            <Toast />
        </div>
    );
};
