import { useState, useEffect, useCallback } from 'react';
import { ProductWatchAPI } from '../api/product-watch.api';

let globalUpdateCallback: (() => void) | null = null;

export const useAvailableProducts = (isAuth: boolean) => {
    const [hasAvailableProducts, setHasAvailableProducts] = useState(false);
    
    const checkAvailableProducts = useCallback(async () => {
        if (isAuth) {
            try {
                const products = await ProductWatchAPI.getAvailableWatchedProducts();
                setHasAvailableProducts(products.length > 0);
            } catch (error) {
                console.error('Error checking available products:', error);
                setHasAvailableProducts(false);
            }
        } else {
            setHasAvailableProducts(false);
        }
    }, [isAuth]);

    // Устанавливаем глобальный callback для обновления из других компонентов
    useEffect(() => {
        globalUpdateCallback = checkAvailableProducts;
        return () => {
            globalUpdateCallback = null;
        };
    }, [checkAvailableProducts]);

    // Проверяем при изменении авторизации
    useEffect(() => {
        checkAvailableProducts();
    }, [checkAvailableProducts]);

    // Периодическая проверка
    useEffect(() => {
        if (isAuth) {
            const interval = setInterval(checkAvailableProducts, 60000); // каждую минуту
            return () => clearInterval(interval);
        }
    }, [isAuth, checkAvailableProducts]);

    // Слушаем кастомное событие для обновления
    useEffect(() => {
        const handleRefresh = () => {
            checkAvailableProducts();
        };

        window.addEventListener('refreshAvailableProducts', handleRefresh);
        return () => {
            window.removeEventListener('refreshAvailableProducts', handleRefresh);
        };
    }, [checkAvailableProducts]);

    return { hasAvailableProducts, refreshAvailableProducts: checkAvailableProducts };
};

// Функция для обновления состояния из других компонентов
export const refreshAvailableProducts = () => {
    if (globalUpdateCallback) {
        globalUpdateCallback();
    }
};