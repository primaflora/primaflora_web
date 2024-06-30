import { Link } from 'react-router-dom';
import { Images } from '../../../assets';
import { useUserData } from '../../../store/tools';
import { NavLinks } from './components/NavLinks';
import { UpperHeaderBar } from './components/UpperHeaderBar';
import './styles.css';

import { useState } from 'react';
import { LogInModal } from '../Modals/LogInModal';
import { SignInModal } from '../Modals/SignInModal';

export const Header = () => {
    const { isAuth, isAdmin, user } = useUserData();
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const handleLogInModalClose = () => {
        setIsLoginModalOpen(false);
    };
    const handleSignInModalClose = () => {
        setIsSignUpModalOpen(false);
    };

    const handleSignUpPress = () => {
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

    return (
        <div className="header-main-container">
            <UpperHeaderBar isAuth={isAuth} />
            <div className="header-stripe main-global-padding">
                <div className="header-logo-navigation-container">
                    <Link to={'/'}>
                        <img src={Images.PrimafloraLogoSvg} alt="Primaflora" />
                    </Link>

                    <div className="header-nav-links">
                        <NavLinks isAdmin={isAdmin} isAuth={isAuth} />
                    </div>
                    <div className="header-nav-links-mob">
                        <NavLinks isMob isAuth={isAuth} />
                    </div>
                </div>

                <div className="header-input-container">
                    <input className="header-input" placeholder="Пошук" />
                    <button className="header-input-button">
                        <img src={Images.SearchIcon} alt="Search" />
                    </button>
                </div>
            </div>

            <SignInModal
                isOpen={isSignUpModalOpen}
                onClose={handleSignInModalClose}
                onMoveToLogIn={handleMoveToLogIn}
            />
            <LogInModal
                isOpen={isLoginModalOpen}
                onClose={handleLogInModalClose}
                onMoveToSignUp={handleMoveToSignUp}
            />

            <div
                className={`header-bottom-stipe-mob ${
                    isAuth ? 'bottom-stripe-guest' : 'bottom-stripe-authed'
                }`}
                onClick={isAuth ? () => {} : handleSignUpPress}>
                {isAuth ? (
                    <h1>ВАШ № {user?.login} / Ваша знижка 10%</h1>
                ) : (
                    <h1 className="header-bottom-stripe-mob-text">
                        ОТРИМАТИ ЗНИЖКУ 10%
                    </h1>
                )}
            </div>
        </div>
    );
};
