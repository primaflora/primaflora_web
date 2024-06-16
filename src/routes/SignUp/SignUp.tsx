import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Service } from '../../common/services';
import { TPostUserSignUpRequest } from '../../common/services/auth/types/postSignUp';
import { Toast, useToast } from '../../common/toast';
import './style.css';
import { TSignUpProps } from './types';

export const SignUp = ({ inviteCode }: TSignUpProps) => {
    const { notifySuccess, notifyError } = useToast();
    const [error, setError] = useState<string>('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const payload = formDataToSignUpObj(formData);

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
        <div className="justify-center items-center flex">
            <div className="my-12 py-32 bg-slate-300 rounded-md">
                <div className="p-10">
                    <label>
                        <h1 className="text-2xl pb-5">Sign Up!</h1>
                    </label>
                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-flow-row gap-y-4 max-w-2xl">
                        <div className="grid grid-rows-2 gap-y-2">
                            <input
                                type="text"
                                placeholder="Иванов Дмитрий Евгеньевич"
                                name="name"
                                className="bg-gray-300 border-solid border-2 border-black rounded-md px-5 py-2"
                            />
                            <input
                                type="text"
                                placeholder="+380971111111"
                                name="phone"
                                className="bg-gray-300 border-solid border-2 border-black rounded-md px-5 py-2"
                            />
                            <input
                                type="text"
                                placeholder="example@gmail.com"
                                name="email"
                                className="bg-gray-300 border-solid border-2 border-black rounded-md px-5 py-2"
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                name="password1"
                                className="bg-gray-300 border-solid border-2 border-black rounded-md px-5 py-2"
                            />
                            <input
                                type="password"
                                placeholder="Confirm password"
                                name="password2"
                                className="bg-gray-300 border-solid border-2 border-black rounded-md px-5 py-2"
                            />
                            <input
                                type="text"
                                placeholder="Login"
                                name="login"
                                className="bg-gray-300 border-solid border-2 border-black rounded-md px-5 py-2"
                            />
                        </div>
                        {error && (
                            <h2 className="text-red-500">Error: {error}</h2>
                        )}
                        <button
                            type="submit"
                            className="bg-blue-500 rounded-md px-5 py-2 text-white">
                            Press Here to SignUp
                        </button>
                    </form>
                    <Link className="text-blue-500" to={'/auth/log-in'}>
                        Click here to LogIn!
                    </Link>
                </div>
            </div>
            <Toast />
        </div>
    );
};
