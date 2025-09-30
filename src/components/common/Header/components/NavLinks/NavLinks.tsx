import { Link, useNavigate } from 'react-router-dom';
import './styles.css';
import { TNavLinksProps } from './types';
import { Images } from '../../../../../assets';
import { LogInModal } from '../../../Modals/LogInModal';
import { useState } from 'react';
import { SignInModal } from '../../../Modals/SignInModal';
import { useTranslation } from 'react-i18next';
import { useAvailableProducts } from '../../../../../common/hooks/useAvailableProducts';
import AvailableNotificationIcon from '../../../../../assets/svg/AvailableNotificationIcon';

export const NavLinks = ({ isAuth, isAdmin = false, isMob = false }: TNavLinksProps) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const { hasAvailableProducts } = useAvailableProducts(isAuth);

    const handleLogInModalPress = () => {
        setIsLoginModalOpen(true);
    };
    const handleLogInModalClose = () => {
        setIsLoginModalOpen(false);
    };

    const handleSignUpModalClose = () => {
        setIsSignUpModalOpen(true);
    };

    const handleMoveToLogIn = () => {
        setIsSignUpModalOpen(false);
        setIsLoginModalOpen(true);
    };
    const handleMoveToSignUp = () => {
        setIsLoginModalOpen(false);
        setIsSignUpModalOpen(true);
    };

    const handleLogInPress = () => {
        if (isAuth) navigate('/user-info');
        else handleLogInModalPress();
    };

    return (
        <nav>
            {isMob ? (
                <div className="header-nav-links-container-mob">
                    <div onClick={handleLogInPress}>
                        <img src={Images.UserIconMob} alt="user" />
                    </div>
                    <Link
                        to={isAuth ? '/likes' : '#'}
                        className={isAuth ? 'like-enabled' : 'like-disabled'}
                        style={{ position: 'relative' }}>
                        <img src={Images.LinedLikeIconMob} alt="likes" />
                        {isAuth && hasAvailableProducts && (
                            <div style={{
                                position: 'absolute',
                                top: 2,
                                right: -2,
                                zIndex: 10
                            }}>
                                <AvailableNotificationIcon style={{ width: 12, height: 10 }} />
                            </div>
                        )}
                    </Link>
                    <Link to="/cart">
                        <img src={Images.CartIconMob} alt="cart" />
                    </Link>
                </div>
            ) : (
                <div className="header-nav-links-container">
                    <Link to="/">{t('navigation.our-site')}</Link>
                    <Link to="#">{t('navigation.contacts')}</Link>
                    <Link to="#">{t('navigation.delivery')}</Link>
                    <Link to="/cart">{t('navigation.cart')}</Link>
                    {isAuth && (
                        <Link to="/likes" style={{ 
                            position: 'relative', 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '4px' 
                        }}>
                            {t('navigation.like-title')}
                            <div style={{ position: 'absolute', top: -9, right: -17 }}>
                                {hasAvailableProducts && (
                                    <AvailableNotificationIcon />
                                )}
                            </div>
                        </Link>
                    )}
                    {isAuth && (
                        <Link to="/user-info">
                            {t('navigation.user-info-title')}
                        </Link>
                    )}
                    {isAdmin && (
                        <Link to="/admin-page">
                            {t('navigation.admin-page-title')}
                        </Link>
                    )}
                </div>
            )}
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
        </nav>
    );
};
