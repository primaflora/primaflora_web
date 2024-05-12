import React from 'react';
import './styles.css';
import { TUpperHeaderBarProps } from './types';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../../buttons';
import { Service } from '../../../../../common/services';
import { StorageService } from '../../../../../common/storage/storage.service';
import { useDispatch } from 'react-redux';
import { userSliceActions } from '../../../../../store/modules/user/reducer';
import { useAuth } from '../../../../../common/hooks/useAuth/useAuth';

export const UpperHeaderBar = ({ isAuth }: TUpperHeaderBarProps) => {
    const navigate = useNavigate();
    const { clearAll, setIsAuth } = useAuth();

    const handleLoginPress = () => {
        navigate('/auth/log-in');
    };

    const handleSignUpPress = () => {
        navigate('/auth/sign-up');
    };

    const handleLogOutPress = () => {
        Service.AuthService.postLogOut();
        StorageService.removeToken('accessToken');
        StorageService.removeToken('refreshToken');

        clearAll();
        setIsAuth(false);
        navigate('/');
    };

    return (
        <div className="upper-header main-global-padding">
            <p className="header-title">
                НАТУРАЛЬНА ПРОДУКЦІЯ ДЛЯ ЗДОРОВ'Я ТА КРАСИ
            </p>
            <div className="upper-header-button-container">
                <Button
                    text={
                        isAuth
                            ? 'ВАША ЗНИЖКА 10%'
                            : 'ЗАРЕЄСТРУВАТИСЯ ТА ОТРИМАТИ ЗНИЖКУ 10%'
                    }
                    onClick={isAuth ? () => {} : handleSignUpPress}
                />
                <Button
                    text={isAuth ? 'ВИЙТИ' : 'УВІЙТИ'}
                    onClick={isAuth ? handleLogOutPress : handleLoginPress}
                    style={{ marginLeft: 20 }}
                    filled={false}
                />
            </div>
        </div>
    );
};
