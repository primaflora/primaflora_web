import { FormEvent, useState } from 'react';
import { Images } from '../../../../assets';
import { Service } from '../../../../common/services';
import { TPostUserSignUpRequest } from '../../../../common/services/auth/types/postSignUp';
import { useToast } from '../../../../common/toast';
import { Button } from '../../../buttons';
import { Line } from '../../Line';
import { InputModal } from '../Input/InputModal';
import './styles.css';
import { TLogInModalProps } from './types';

export const SignInModal = ({
    isOpen,
    onClose,
}: // onMoveToLogIn,
TLogInModalProps) => {
    const { notifyError, notifySuccess } = useToast();
    const [error, setError] = useState('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const payload = formDataToSignUpObj(formData);

        console.log('payload => ', payload);

        Service.AuthService.postSignUp(payload)
            .then(res => {
                notifySuccess(
                    `Success SignUp, verification code have been send to your email. Now you can log in. `,
                );
                console.log(res.data);
            })
            .catch(e => {
                console.log('Error! => ', e);
                if (Array.isArray(e.response?.data.message)) {
                    (e.response?.data.message as Array<string>).forEach(err =>
                        notifyError(err),
                    );
                    setError(e.response?.data.message[0]);
                    setTimeout(() => {
                        setError('');
                    }, 10000);
                } else {
                    notifyError(e.response?.data.message);
                }
            });
    };

    const formDataToSignUpObj = (
        formData: FormData,
    ): TPostUserSignUpRequest['payload'] => {
        const payloadObj: Record<string, FormDataEntryValue> = {};

        formData.forEach((value, key) => (payloadObj[key] = value));

        return {
            ...payloadObj,
            phone_allowed: false,
            consultation_allowed: false,
        } as TPostUserSignUpRequest['payload'];
    };

    return (
        <div
            className={`modal-container ${
                isOpen ? 'modal-show' : 'modal-close'
            }`}>
            <div className="modal-content-container">
                <h1 className="modal-title">Реєстрація</h1>
                <button className="modal-close-button" onClick={onClose}>
                    <img src={Images.CrossIcon} alt="close" />
                </button>
                <Line />

                <form onSubmit={handleSubmit}>
                    <div className="modal-input-container">
                        <InputModal
                            title="Ім'я"
                            placeholder="ПІБ"
                            formDataFieldName="name"
                        />
                        <InputModal
                            title="Телефон"
                            placeholder="+380971111111"
                            formDataFieldName="phone"
                        />
                        <InputModal
                            title="Електронна пошта"
                            placeholder="example@gmail.com"
                            formDataFieldName="email"
                        />
                        <InputModal
                            type="password"
                            title="Пароль"
                            placeholder="Password"
                            formDataFieldName="password1"
                        />
                        <InputModal
                            type="password"
                            title="Підтвердити пароль"
                            placeholder="Confirm password"
                            formDataFieldName="password2"
                        />
                        <InputModal
                            title="Логін"
                            placeholder="Login"
                            formDataFieldName="login"
                        />

                        <div className="flex flex-col gap-4">
                            <Button
                                text="ЗАРЕЄСТРУВАТИСЯ"
                                onClick={() => {}}
                                style={{ borderRadius: '7px' }}
                            />
                            <h1 className="text-red text-2xl">{error}</h1>
                        </div>
                    </div>
                    {error && <h1>{error}</h1>}
                </form>

                {/* <Line /> */}
                {/* 
                <Row style={{ justifyContent: 'space-between' }}>
                    <button
                        className="modal-registrate-link"
                        onClick={onMoveToLogIn}>
                        Увійти
                    </button>
                </Row> */}
            </div>
        </div>
    );
};
