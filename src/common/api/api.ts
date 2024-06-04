import axios from 'axios';
import { StorageService } from '../storage/storage.service';

// 10.0.2.2 - for Android   localhost - default
const privateInstance = axios.create({
    baseURL: process.env.HOST_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
});

const publicInstance = axios.create({
    baseURL: process.env.HOST_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true',
    },
});

privateInstance.interceptors.request.use(
    async config => {
        const accessToken = StorageService.getToken('accessToken');
        const refreshToken = StorageService.getToken('refreshToken');

        if (accessToken && config.headers) {
            console.log(`Request [${config.method}] ${config.url}`);
            config.headers.Authorization = 'Bearer ' + accessToken;
        }
        if (refreshToken) {
            config.headers['Cookie'] = `refreshToken=${refreshToken}`;
        } else {
            console.log('No refresh token');
            // Promise.reject('No refresh token in storage');
        }

        return config;
    },
    error => Promise.reject(error),
);

privateInstance.interceptors.response.use(
    value => value,
    async error => {
        if (axios.isAxiosError(error)) {
            if (error.request.status === 404 || error.request.status === 401) {
                console.log('Access token expired. Getting a new one...');
                console.log('Error: ', error);
                // access token is old. We need to get a new one and set it
                // try {
                //     // set new token
                //     const res = await Service.AuthService.refreshToken();
                //     StorageService.setToken(
                //         'accessToken',
                //         res.data.accessToken,
                //     );

                //     // resend old request and return it
                //     const config = {
                //         ...error.config,
                //         headers: {
                //             Authorization: `Bearer ${res.data.accessToken}`,
                //         },
                //     };
                //     return await privateInstance(config);
                // } catch (e) {
                //     console.error('Token refresh failed:', e);
                //     return Promise.reject(
                //         'Token refresh failed. Log out from your account and sign in.',
                //     );
                // }
            }
        }
        return Promise.reject(error);
    },
);

export const apiPublic = publicInstance;
export const apiPrivate = privateInstance;
