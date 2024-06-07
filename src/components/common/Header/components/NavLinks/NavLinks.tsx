import { Link, useNavigate } from 'react-router-dom';
import './styles.css';
import { TNavLinksProps } from './types';
import { Images } from '../../../../../assets';
import { LogInModal } from '../../../Modals/LogInModal';
import { useState } from 'react';
import { SignInModal } from '../../../Modals/SignInModal';

export const NavLinks = ({ isAuth, isMob = false }: TNavLinksProps) => {
    const navigate = useNavigate();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

    const handleLogInModalPress = () => {
        setIsLoginModalOpen(true);
    };
    const handleLogInModalClose = () => {
        setIsLoginModalOpen(false);
    };

    const handleSignUpPress = () => {
        setIsSignUpModalOpen(true);
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
                        className={isAuth ? 'like-enabled' : 'like-disabled'}>
                        <img src={Images.LinedLikeIconMob} alt="likes" />
                    </Link>
                    <Link to="/cart">
                        <img src={Images.CartIconMob} alt="cart" />
                    </Link>
                </div>
            ) : (
                <div className="header-nav-links-container">
                    <Link to="/">НАШ САЙТ</Link>
                    <Link to="#">КОНТАКТА</Link>
                    <Link to="#">ДОСТАВКА</Link>
                    <Link to="/cart">КОШИК</Link>
                    {isAuth && <Link to="/likes">БАЖАНЕ</Link>}
                    {isAuth && <Link to="/user-info">ОСОБИСТА ІНФОРМАЦІЯ</Link>}
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
