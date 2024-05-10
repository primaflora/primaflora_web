import React from 'react';
import { Images } from '../../../assets';
import './styles.css';
import { Button } from '../../buttons';

export const Header = () => {
    return (
        <div className="header-main-container">
            <div className="upper-header px-10">
                <p className="header-title">
                    НАТУРАЛЬНА ПРОДУКЦІЯ ДЛЯ ЗДОРОВ'Я ТА КРАСИ
                </p>
                <div className="upper-header-button-container">
                    <Button
                        text="ЗАРЕЄСТРУВАТИСЯ ТА ОТРИМАТИ ЗНИЖКУ 10%"
                        onClick={() => console.log('Get discount 10%')}
                    />
                    <Button
                        text="УВІЙТИ"
                        onClick={() => console.log('Redirect to login page')}
                        style={{ marginLeft: 20 }}
                        filled={false}
                    />
                </div>
            </div>
            <div className="header-stripe px-10">
                <div className="header-logo-navigation-container">
                    <img src={Images.PrimafloraLogoSvg} alt="Primaflora" />
                    <nav>
                        <a href="#">НАШ САЙТ</a>
                        <a href="#">КОНТАКТИ</a>
                        <a href="#">ДОСТАВКА</a>
                        <a href="#">КОШИК</a>
                    </nav>
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
