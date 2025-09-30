import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Images } from '../../../assets';
import { useUserData } from '../../../store/tools';
import { useState } from 'react';
import { LogInModal } from '../Modals/LogInModal';
import { SignInModal } from '../Modals/SignInModal';
import './styles.css';

export const BottomTabBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuth } = useUserData();
    
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

    const handleLogInModalPress = () => {
        setIsLoginModalOpen(true);
    };
    
    const handleLogInModalClose = () => {
        setIsLoginModalOpen(false);
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

    const handleUserPress = () => {
        if (isAuth) {
            navigate('/user-info');
        } else {
            handleLogInModalPress();
        }
    };

    const handleLikesPress = () => {
        if (isAuth) {
            navigate('/likes');
        }
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        <>
            <div className="bottom-tab-bar">
                <Link 
                    to="/"
                    className={`tab-item ${isActive('/') ? 'active' : ''}`}
                >
                    <img src={Images.FolderIcon} alt="home" />
                    <span>Головна</span>
                </Link>

                <Link 
                    to="/order-history"
                    className={`tab-item ${isActive('/order-history') ? 'active' : ''} ${!isAuth ? 'disabled' : ''}`}
                >
                    <img src={Images.OrderIcon} alt="orders" />
                    <span>Замовлення</span>
                </Link>

                <div 
                    className={`tab-item ${isActive('/likes') ? 'active' : ''} ${!isAuth ? 'disabled' : ''}`}
                    onClick={handleLikesPress}
                >
                    <img src={Images.LinedLikeIconMob} alt="favorites" />
                    <span>Обране</span>
                </div>

                <Link 
                    to="/cart"
                    className={`tab-item ${isActive('/cart') ? 'active' : ''}`}
                >
                    <img src={Images.CartIconMob} alt="cart" />
                    <span>Кошик</span>
                </Link>

                <div 
                    className={`tab-item ${isActive('/user-info') ? 'active' : ''}`}
                    onClick={handleUserPress}
                >
                    <img src={Images.UserIconMob} alt="account" />
                    <span>Акаунт</span>
                </div>
            </div>

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
        </>
    );
};