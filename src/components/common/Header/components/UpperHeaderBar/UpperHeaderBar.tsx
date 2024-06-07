import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../common/hooks/useAuth/useAuth';
import { Service } from '../../../../../common/services';
import { StorageService } from '../../../../../common/storage/storage.service';
import { Button } from '../../../../buttons';
import './styles.css';
import { TUpperHeaderBarProps } from './types';
import { LogInModal } from '../../../Modals/LogInModal';
import { useState } from 'react';

export const UpperHeaderBar = ({ isAuth }: TUpperHeaderBarProps) => {
    const navigate = useNavigate();
    const { clearAll, setIsAuth } = useAuth();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const handleLoginPress = () => {
        // navigate('/auth/log-in');
        setIsLoginModalOpen(true);
    };
    const handleLogInModalClose = () => {
        setIsLoginModalOpen(false);
    };

    const handleSignUpPress = () => {
        navigate('/auth/sign-up');
    };

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
        <div className="upper-header main-global-padding">
            <p className="header-title">
                НАТУРАЛЬНА ПРОДУКЦІЯ ДЛЯ ЗДОРОВ'Я ТА КРАСИ
            </p>
            <div className="upper-header-button-container">
                <LogInModal
                    isOpen={isLoginModalOpen}
                    onClose={handleLogInModalClose}
                />
                <Button
                    text={
                        isAuth
                            ? 'ВАША ЗНИЖКА 10%'
                            : 'ЗАРЕЄСТРУВАТИСЯ ТА ОТРИМАТИ ЗНИЖКУ 10%'
                    }
                    onClick={isAuth ? () => {} : handleSignUpPress}
                />
                <Button
                    text={isAuth ? 'ВИЙТИ' : 'УВІЙТИ'}
                    onClick={isAuth ? handleLogOutPress : handleLoginPress}
                    style={{ marginLeft: 20 }}
                    filled={false}
                />
            </div>
        </div>
    );
};
