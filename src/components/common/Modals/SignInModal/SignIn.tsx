import { FormEvent, useEffect, useState } from 'react';
import { Images } from '../../../../assets';
import { Service, TUser } from '../../../../common/services';
import { TPostUserSignUpRequest } from '../../../../common/services/auth/types/postSignUp';
import { useToast } from '../../../../common/toast';
import { Button } from '../../../buttons';
import { Line } from '../../Line';
import { InputModal } from '../Input/InputModal';
import './styles.css';
import { TSignInModalProps } from './types';
import { useTranslation } from 'react-i18next';

export const SignInModal = ({
    isOpen,
    onClose,
    inviteCode,
}: TSignInModalProps) => {
    const { t } = useTranslation();
    const { notifyError, notifySuccess } = useToast();
    const [error, setError] = useState('');
    const [inviter, setInviter] = useState<TUser | null>(null);
    const [inviterError, setInviterError] = useState<string>('');

    useEffect(() => {
        console.log('Invite code: ', inviteCode);
        if (inviteCode) {
            Service.AuthService.getVerifyInviteCode({ code: inviteCode })
                .then(res => setInviter(res.data))
                .catch(e => setInviterError(t('errors.invite-not-found')));
        }
        //@ts-ignore
    }, []);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const payload = formDataToSignUpObj(formData);

        console.log('payload => ', payload);

        Service.AuthService.postSignUp(payload, { inviteCode: inviteCode })
            .then(res => {
                notifySuccess(t('messages.success-sign-up'));
                console.log(res.data);
            })
            .catch(e => {
                console.log('Error! => ', e);
                if (e.response?.status === 500) {
                    notifyError(t('errors.cred-already-exist'));
                    setError(t('errors.cred-already-exist'));
                    setTimeout(() => {
                        setError('');
                    }, 10000);
                    return;
                }

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
                <h1 className="modal-title">
                    {t('auth.modal.sign-up-modal-title')}
                </h1>

                {inviter && (
                    <h1>{t('auth.modal.inviter', { name: inviter.name })}</h1>
                )}
                {inviterError && <p>{inviterError}</p>}

                <button className="modal-close-button" onClick={onClose}>
                    <img src={Images.CrossIcon} alt="close" />
                </button>
                <Line />

                <form onSubmit={handleSubmit}>
                    <div className="modal-input-container">
                        <InputModal
                            title={t('auth.modal.name')}
                            placeholder={t('auth.modal.name-placeholder')}
                            formDataFieldName="name"
                        />
                        <InputModal
                            title={t('auth.modal.phone')}
                            placeholder="+380971111111"
                            formDataFieldName="phone"
                        />
                        <InputModal
                            title={t('auth.modal.email')}
                            placeholder="example@gmail.com"
                            formDataFieldName="email"
                        />
                        <InputModal
                            type="password"
                            title={t('auth.modal.password')}
                            placeholder="Password"
                            formDataFieldName="password1"
                        />
                        <InputModal
                            type="password"
                            title={t('auth.modal.confirm-password')}
                            placeholder="Confirm password"
                            formDataFieldName="password2"
                        />
                        <InputModal
                            title={t('auth.modal.login')}
                            placeholder="Login"
                            formDataFieldName="login"
                        />

                        <div className="flex flex-col gap-4">
                            <Button
                                type='submit'
                                text={
                                    inviter
                                        ? t(
                                              'auth.modal.sign-up-button-and-inviter',
                                              {
                                                  name: inviter.name.toUpperCase(),
                                              },
                                          )
                                        : t('auth.sign-up-button')
                                }
                                onClick={() => {}}
                                style={{ borderRadius: '7px' }}
                            />
                        </div>
                    </div>
                    {error && <h1>{error}</h1>}
                </form>
            </div>
        </div>
    );
};
