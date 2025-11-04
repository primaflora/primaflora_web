import { useEffect, useState } from 'react';
import { Service } from '../services';
import { useUserData } from '../../store/tools';
import { TCartItem } from '../services/cart';

export const useCartStatus = (productUuid: string) => {
    const { isAuth } = useUserData();
    const [isInCart, setIsInCart] = useState(false);
    const [cartItems, setCartItems] = useState<TCartItem[]>([]);
    const [loading, setLoading] = useState(false);

    // Функция для проверки корзины
    const checkCartStatus = async () => {
        if (!isAuth) {
            setIsInCart(false);
            return;
        }

        setLoading(true);
        try {
            const response = await Service.CartService.getAll();
            const items = response.data || [];
            setCartItems(items);
            
            // Проверяем есть ли товар с таким UUID в корзине
            const isProductInCart = items.some(item => item.product.uuid === productUuid);
            setIsInCart(isProductInCart);
        } catch (error) {
            console.error('Error checking cart status:', error);
            setIsInCart(false);
        } finally {
            setLoading(false);
        }
    };

    // Проверяем корзину при загрузке и изменении аутентификации
    useEffect(() => {
        checkCartStatus();
    }, [isAuth, productUuid]);

    // Функция для добавления товара в корзину
    const addToCart = async (quantity: number = 1) => {
        if (!isAuth) {
            throw new Error('User not authenticated');
        }

        try {
            await Service.CartService.postCreate({
                quantity,
                productUId: productUuid,
                userUId: '', // Этот параметр не используется на бэкенде, он получает userUid из токена
            });
            
            // Обновляем статус после добавления
            await checkCartStatus();
            return true;
        } catch (error) {
            console.error('Error adding to cart:', error);
            throw error;
        }
    };

    // Функция для удаления товара из корзины
    const removeFromCart = async () => {
        if (!isAuth) {
            throw new Error('User not authenticated');
        }

        try {
            // Находим товар в корзине
            const cartItem = cartItems.find(item => item.product.uuid === productUuid);
            if (!cartItem) {
                throw new Error('Product not found in cart');
            }

            await Service.CartService.delete({ uuid: cartItem.uuid });
            
            // Обновляем статус после удаления
            await checkCartStatus();
            return true;
        } catch (error) {
            console.error('Error removing from cart:', error);
            throw error;
        }
    };

    return {
        isInCart,
        loading,
        cartItems,
        addToCart,
        removeFromCart,
        refreshCart: checkCartStatus,
    };
};