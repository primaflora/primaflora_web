import { useEffect, useState } from 'react';
import { Line, SideBar } from '../../components/common';
import { Slider } from '../Home/components/Slider';
import './styles.css';
import { TCartItem } from '../../common/services/cart';
import { Service } from '../../common/services';
import { CartItem } from './components/CartItem';
import { TotalPrice } from './components/TotalPrice';

export const Cart = () => {
    const [cart, setCart] = useState<TCartItem[]>([]);

    useEffect(() => {
        Service.CartService.getAll().then(res => setCart(res.data));
    }, []);

    const onCartItemQuantityChange = (productUid: string, quantity: number) => {
        console.log('uuid: ', productUid, ' quantity: ', quantity);
        setCart(oldCart =>
            oldCart.map(item =>
                item.product.uuid === productUid ? { ...item, quantity } : item,
            ),
        );
    };

    const handleCartItemRemove = (cartItemUid: string) => {
        Service.CartService.delete({ uuid: cartItemUid }).then(() => {
            setCart(cart.filter(item => item.uuid !== cartItemUid));
        });
    };

    const calculateTotalPrice = () => {
        return cart.reduce(
            (total, item) =>
                total +
                (item.product.percent_discount
                    ? item.product.price_currency *
                      ((100 - item.product.percent_discount) / 100)
                    : item.product.price_currency) *
                    item.quantity,
            0,
        );
    };

    return (
        <div className="main-global-padding py-10 flex">
            <SideBar />
            <div className="w-full ml-10">
                <Slider />
                <Line />
                <h1 className="cart-title">Кошик</h1>
                {cart.length === 0 ? (
                    <h1 className="justify-self-center text-black text-3xl">
                        Nothing to show!
                    </h1>
                ) : (
                    cart.map(item => (
                        <CartItem
                            key={item.uuid}
                            item={item}
                            onQuantityChange={onCartItemQuantityChange}
                            onRemove={handleCartItemRemove}
                        />
                    ))
                )}

                <div className="w-full pt-10 flex justify-end">
                    <TotalPrice price={calculateTotalPrice()} />
                </div>
            </div>
        </div>
    );
};
