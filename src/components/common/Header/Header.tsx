import { Link } from 'react-router-dom';
import { Images } from '../../../assets';
import { useUserData } from '../../../store/tools';
import { NavLinks } from './components/NavLinks';
import './styles.css';
import { UpperHeaderBar } from './components/UpperHeaderBar';

export const Header = () => {
    const { isAuth } = useUserData();
    
    return (
        <div className="header-main-container">
            <UpperHeaderBar isAuth={isAuth}/>
            <div className="header-stripe main-global-padding">
                <div className="header-logo-navigation-container">
                    <Link to={'/'}>
                        <img src={Images.PrimafloraLogoSvg} alt="Primaflora" />
                    </Link>
                    <NavLinks isAuth={isAuth} />
                </div>
                <div className="header-input-container">
                    <input className="header-input" placeholder="Пошук" />
                    <button className="header-input-button">
                        <img src={Images.SearchIcon} alt="Search" />
                    </button>
                </div>
            </div>
        </div>
    );
};
