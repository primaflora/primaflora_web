import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation();
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
    //                 notifyError(t('erros.change-user-data'));
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
                        isClickable={false}
                        text={t('header.user-discount', { discount: 10 })}
                        style={{ width: '13rem', padding: '7px 10px' }}
                        onClick={() => {}}
                    />
                </Row>
            </div>
            <div className="justify-end flex">
                <h1 className="">{t('user-info.press-to-copy')}</h1>
            </div>

            <div className="section-container">
                <Section
                    title={t('user-info.first-person-name')}
                    content={user?.name || 'Test User Lorem Ipsum'}
                    // button={{
                    //     text: 'Редагувати',
                    //     onUpdate(newValue) {
                    //         handleUpdateUser({ name: newValue });
                    //     },
                    // }}
                />
                <Section
                    title={t('user-info.second-person-name')}
                    content={user?.invitedUser?.name || 'No invited user'}
                    // button={{
                    //     text: 'Редагувати',
                    //     onUpdate: () => {
                    //         console.log('Edit Section #1');
                    //     },
                    // }}
                />
                <Section
                    title={t('user-info.company-number')}
                    content={user?.login || '#0001'}
                    // button={{
                    //     text: 'Редагувати',
                    //     onUpdate(newValue) {
                    //         handleUpdateUser({ login: newValue });
                    //     },
                    // }}
                />
                <Section
                    title={t('user-info.invite-link')}
                    content={
                        user?.invitationCode
                            ? `${process.env.REACT_APP_HOME_URL}/auth/sign-up/invite/${user?.invitationCode}`
                            : 'https://primaflora.store/auth/sign-up/invite/TEST_CODE'
                    }
                    // button={{
                    //     text: 'Редагувати',
                    //     onUpdate: () => {},
                    // }}
                />
                <Section
                    title={t('user-info.phone')}
                    content={user?.phone || '+380000000000'}
                    // button={{
                    //     text: 'Редагувати',
                    //     onUpdate(newValue) {
                    //         handleUpdateUser({ phone: newValue });
                    //     },
                    // }}
                />
                <Section
                    title={t('user-info.email')}
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

            {/* Desktop version */}
            <div className="user-info-logout-botton-desktop pb-5">
                <Button
                    text="📋 Історія замовлень"
                    onClick={() => navigate('/order-history')}
                    filled={false}
                    style={{ borderRadius: '7px', width: '100%', marginBottom: '10px', border: '2px solid #72BF44', color: '#72BF44' }}
                />
                <Button
                    text="🔔 Відстежувані товари"
                    onClick={() => navigate('/user/watched-products')}
                    filled={false}
                    style={{ borderRadius: '7px', width: '100%', marginBottom: '10px', border: '2px solid #72BF44', color: '#72BF44' }}
                />
                <Button
                    text={t('auth.log-out-button')}
                    onClick={handleLogOutPress}
                    filled
                    style={{ borderRadius: '7px', width: '100%' }}
                />
            </div>

            {/* Mobile version */}
            <div className="user-info-logout-botton-mob pb-5">
                <Button
                    text="📋 Історія замовлень"
                    onClick={() => navigate('/order-history')}
                    filled={false}
                    style={{ borderRadius: '7px', width: '100%', marginBottom: '10px', border: '2px solid #72BF44', color: '#72BF44' }}
                />
                <Button
                    text="🔔 Відстежувані товари"
                    onClick={() => navigate('/user/watched-products')}
                    filled={false}
                    style={{ borderRadius: '7px', width: '100%', marginBottom: '10px', border: '2px solid #72BF44', color: '#72BF44' }}
                />
                <Button
                    text={t('auth.log-out-button')}
                    onClick={handleLogOutPress}
                    filled
                    style={{ borderRadius: '7px', width: '100%' }}
                />
            </div>
            <Toast />
        </div>
    );
};
