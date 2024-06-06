import { Link } from 'react-router-dom';
import './styles.css';
import { TNavLinksProps } from './types';
import { Images } from '../../../../../assets';

export const NavLinks = ({ isAuth, isMob = false }: TNavLinksProps) => {
    return (
        <nav>
            {isMob ? (
                <div className="header-nav-links-container-mob">
                    <Link to="#">
                        <img src={Images.UserIconMob} alt="user" />
                    </Link>
                    <Link
                        to={isAuth ? '/likes' : '#'}
                        className={isAuth ? 'like-enabled' : 'like-disabled'}>
                        <img src={Images.LinedLikeIconMob} alt="likes" />
                    </Link>
                    <Link to="#">
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
        </nav>
    );
};
