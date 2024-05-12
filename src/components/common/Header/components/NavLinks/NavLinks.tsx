import React from 'react';
import './styles.css';
import { TNavLinksProps } from './types';
import { Link } from 'react-router-dom';

export const NavLinks = ({ isAuth }: TNavLinksProps) => {
    return (
        <nav>
            <Link to="#">НАШ САЙТ</Link>
            <Link to="#">КОНТАКТА</Link>
            <Link to="#">ДОСТАВКА</Link>
            <Link to="#">КОШИК</Link>
            {isAuth && <Link to="#">БАЖАНЕ</Link>}
            {isAuth && <Link to="/user-info">ОСОБИСТА ІНФОРМАЦІЯ</Link>}
        </nav>
    );
};
