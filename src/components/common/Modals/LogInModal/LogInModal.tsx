import { useState } from 'react';
import { Button } from '../../../buttons';
import { Line } from '../../Line';
import { InputModal } from '../Input/InputModal';
import { TLogInModalProps } from './types';
import './styles.css';
import { Images } from '../../../../assets';
import { Row } from '../../Row';
import { Service } from '../../../../common/services';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../common/hooks/useAuth/useAuth';
import { StorageService } from '../../../../common/storage/storage.service';

export const LogInModal = ({ isOpen, onClose }: TLogInModalProps) => {
    const navigate = useNavigate();
    const { setIsAuth, setUserData } = useAuth();
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogIn = () => {
        if (!login || !password) return;

        Service.AuthService.postSignIn({
            login,
            password,
        })
            .then(res => {
                console.log(res.data);
                setUserData(res.data.user);
                StorageService.setToken('accessToken', res.data.accessToken);
                StorageService.setToken('refreshToken', res.data.refreshToken);
                setIsAuth(true);

                onClose();
                window.location.reload();
            })
            .catch(e => {
                console.log('Error! => ', e);
                setError(e.response?.data.message);
                setTimeout(() => {
                    setError('');
                }, 10000);
            });
    };

    return (
        <div
            className={`modal-container ${
                isOpen ? 'modal-show' : 'modal-close'
            }`}>
            <div className="modal-content-container">
                <h1 className="modal-title">Вхід</h1>
                <button className="modal-close-button" onClick={onClose}>
                    <img src={Images.CrossIcon} alt="close" />
                </button>
                <Line />

                <div className="modal-input-container">
                    <InputModal
                        title="Логін"
                        placeholder="#1000"
                        onChange={value => setLogin(value)}
                    />
                    <InputModal
                        type="password"
                        title="Пароль"
                        placeholder="********"
                        onChange={value => setPassword(value)}
                    />
                    <div className="flex flex-col gap-4">
                        <Button
                            text="Увійти"
                            onClick={handleLogIn}
                            style={{ borderRadius: '7px' }}
                        />
                        <h1 className="text-red text-2xl">{error}</h1>
                    </div>
                </div>

                <Line />
                <div className="modal-bottom-buttons-container">
                    <a className="modal-use-email" href="#">
                        Увійти через пошту
                    </a>
                    <a className="modal-registrate-link" href="#">
                        Зареєструватися
                    </a>
                </div>
            </div>
        </div>
    );
};
