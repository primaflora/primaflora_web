import axios from 'axios';
import { StorageService } from '../storage/storage.service';

// 10.0.2.2 - for Android   localhost - default
const privateInstance = axios.create({
    baseURL: process.env.REACT_APP_HOST_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
    },
});

const publicInstance = axios.create({
    baseURL: process.env.REACT_APP_HOST_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
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
            if (error.response?.status === 401) {
                console.log('Access token expired or invalid. Logging out...');
                // Очищаем токены
                StorageService.clearTokens();
                
                // Перенаправляем на главную и перезагружаем страницу
                window.location.href = '/';
                return Promise.reject(error);
            }
            if (error.request.status === 404) {
                console.log('Resource not found:', error.config?.url);
            }
        }
        return Promise.reject(error);
    },
);

export const apiPublic = publicInstance;
export const apiPrivate = privateInstance;
