import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../common/hooks/useAuth/useAuth';
import { Service } from '../../../../../common/services';
import { StorageService } from '../../../../../common/storage/storage.service';
import { Button } from '../../../../buttons';
import './styles.css';
import { TUpperHeaderBarProps } from './types';
import { LogInModal } from '../../../Modals/LogInModal';
import { useState } from 'react';
import { SignInModal } from '../../../Modals/SignInModal';
import { useTranslation } from 'react-i18next';

export const UpperHeaderBar = ({ isAuth }: TUpperHeaderBarProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { clearAll, setIsAuth } = useAuth();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

    const handleLoginPress = () => {
        setIsLoginModalOpen(true);
    };
    const handleLogInModalClose = () => {
        setIsLoginModalOpen(false);
    };

    const handleSignUpPress = () => {
        setIsSignUpModalOpen(true);
    };
    const handleSignUpModalClose = () => {
        setIsSignUpModalOpen(false);
    };

    const handleMoveToLogIn = () => {
        setIsSignUpModalOpen(false);
        setIsLoginModalOpen(true);
    };
    const handleMoveToSignUp = () => {
        setIsLoginModalOpen(false);
        setIsSignUpModalOpen(true);
    };

    const handleLogOutPress = () => {
        console.log('logout')
        Service.AuthService.postLogOut();
        StorageService.removeToken('accessToken');
        StorageService.removeToken('refreshToken');

        clearAll();
        setIsAuth(false);
        navigate('/');

        window.location.reload();
    };

    return (
        <div className="upper-header layout">
            <p className="header-title">
                {t('header.upper-header-title')}
            </p>
            <div className="upper-header-button-container">
                <LogInModal
                    isOpen={isLoginModalOpen}
                    onClose={handleLogInModalClose}
                    onMoveToSignUp={handleMoveToSignUp}
                />
                <SignInModal
                    isOpen={isSignUpModalOpen}
                    onClose={handleSignUpModalClose}
                    onMoveToLogIn={handleMoveToLogIn}
                />
                <Button
                    text={
                        isAuth
                            ? t('header.user-discount', { discount: 10 })
                            : t('header.sign-up-and-get-discount')
                    }
                    onClick={isAuth ? () => {} : handleSignUpPress}
                />
                <Button
                    text={isAuth ? t('auth.log-out-button') : t('auth.log-in-button')}
                    onClick={isAuth ? handleLogOutPress : handleLoginPress}
                    style={{ marginLeft: 20 }}
                    filled={false}
                />
            </div>
        </div>
    );
};
