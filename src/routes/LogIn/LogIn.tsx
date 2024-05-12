import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../common/hooks/useAuth/useAuth';
import { Service } from '../../common/services';
import { StorageService } from '../../common/storage/storage.service';
import './style.css';

export const LogIn = () => {
    const navigate = useNavigate();
    const { setUserData, setIsAuth } = useAuth();
    const [error, setError] = useState<string>('');

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const login = formData.get('login') as string;
        const password = formData.get('password') as string;

        Service.AuthService.postSignIn({
            login,
            password,
        })
            .then(res => {
                setUserData(res.data.user);
                StorageService.setToken('accessToken', res.data.accessToken);
                StorageService.setToken('refreshToken', res.data.refreshToken);
                setIsAuth(true);

                navigate('/');
            })
            .catch(e => {
                console.log('Error! => ', e);
                setError(e.response?.data.message);
            });
    };

    return (
        <div className="justify-center items-center flex">
            <div className="my-12 py-32 bg-slate-300 rounded-md">
                <div className="p-10">
                    <label>
                        <h1 className="text-2xl pb-5">LogIn</h1>
                    </label>
                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-flow-row gap-y-4 max-w-2xl">
                        <div className="grid grid-rows-2 gap-y-2">
                            <input
                                type="text"
                                placeholder="Login"
                                name="login"
                                className="bg-gray-300 border-solid border-2 border-black rounded-md px-5 py-2"
                            />
                            <input
                                type="password"
                                placeholder="password"
                                name="password"
                                className="bg-gray-300 border-solid border-2 border-black rounded-md px-5 py-2"
                            />
                        </div>
                        {error && (
                            <h2 className="text-red-500">Error: {error}</h2>
                        )}
                        <button
                            type="submit"
                            className="bg-blue-500 rounded-md px-5 py-2 text-white">
                            Press Here to Log in
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
