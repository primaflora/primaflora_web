import { useState } from 'react';
import { Images } from '../../../../assets';
import { useAuth } from '../../../../common/hooks/useAuth/useAuth';
import { Service } from '../../../../common/services';
import { StorageService } from '../../../../common/storage/storage.service';
import { Button } from '../../../buttons';
import { Line } from '../../Line';
import { InputModal } from '../Input/InputModal';
import { TLogInModalProps } from './types';
import { useTranslation } from 'react-i18next';
import './styles.css';

export const LogInModal = ({
    isOpen,
    onClose,
    onMoveToSignUp,
}: TLogInModalProps) => {
    const { t } = useTranslation();
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
                <h1 className="modal-title">
                    {t('auth.modal.log-in-modal-title')}
                </h1>
                <button className="modal-close-button" onClick={onClose}>
                    <img src={Images.CrossIcon} alt="close" />
                </button>
                <Line />

                <div className="modal-input-container">
                    <InputModal
                        title={t('auth.modal.login')}
                        placeholder="#1000"
                        onChange={value => setLogin(value)}
                    />
                    <InputModal
                        type="password"
                        title={t('auth.modal.password')}
                        placeholder="********"
                        onChange={value => setPassword(value)}
                    />
                    <div className="flex flex-col gap-4">
                        <Button
                            text={t('auth.modal.move-to-log-in')}
                            onClick={handleLogIn}
                            style={{ borderRadius: '7px' }}
                        />
                        <h1 className="text-red text-2xl">{error}</h1>
                    </div>
                </div>

                <Line />
                <div className="modal-bottom-buttons-container">
                    {/* TODO: make an ability to loig in via email */}
                    <h1 className="modal-use-email">
                        {t('auth.modal.log-in-via-email')}
                    </h1>
                    <button
                        className="modal-registrate-link"
                        onClick={onMoveToSignUp}>
                        {t('auth.modal.move-to-sign-up')}
                    </button>
                </div>
            </div>
        </div>
    );
};
