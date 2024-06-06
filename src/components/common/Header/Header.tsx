import { Link } from 'react-router-dom';
import { Images } from '../../../assets';
import { useUserData } from '../../../store/tools';
import { NavLinks } from './components/NavLinks';
import { UpperHeaderBar } from './components/UpperHeaderBar';
import './styles.css';

export const Header = () => {
    const { isAuth, user } = useUserData();

    return (
        <div className="header-main-container">
            <UpperHeaderBar isAuth={isAuth} />
            <div className="header-stripe main-global-padding">
                <div className="header-logo-navigation-container">
                    <Link to={'/'}>
                        <img src={Images.PrimafloraLogoSvg} alt="Primaflora" />
                    </Link>

                    <div className="header-nav-links">
                        <NavLinks isAuth={isAuth} />
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

            <div
                className={`header-bottom-stipe-mob ${
                    isAuth ? 'bottom-stripe-guest' : 'bottom-stripe-authed'
                }`}>
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
