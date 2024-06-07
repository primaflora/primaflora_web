import { useEffect, useState } from 'react';
import { Service } from '../../common/services';
import { TCartItem } from '../../common/services/cart';
import { Line, SideBar } from '../../components/common';
import { Slider } from '../Home/components/Slider';
import { CartItem } from './components/CartItem';
import { TotalPrice } from './components/TotalPrice';
import './styles.css';
import { useUserData } from '../../store/tools';
import { CatalogStripeMob } from '../../components/common/CatalogStripeMob';

export const Cart = () => {
    const { isAuth } = useUserData();
    const [cart, setCart] = useState<TCartItem[]>([]);

    useEffect(() => {
        if (isAuth) {
            Service.CartService.getAll().then(res => setCart(res.data));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        <div className="main-global-padding flex">
            <SideBar />
            <div className="cart-main-container">
                <div className="catalog-stripe-mob-container pb-5">
                    <CatalogStripeMob />
                </div>
                <Slider />
                <Line />
                <h1 className="cart-title">Кошик</h1>
                {!isAuth ? (
                    <h1 className="justify-self-center text-black text-3xl">
                        You need to be authorized to view cart!
                    </h1>
                ) : cart.length === 0 ? (
                    <h1 className="justify-self-center text-black text-3xl">
                        Nothing to show!
                    </h1>
                ) : (
                    <div>
                        {cart.map(item => (
                            <CartItem
                                key={item.uuid}
                                item={item}
                                onQuantityChange={onCartItemQuantityChange}
                                onRemove={handleCartItemRemove}
                            />
                        ))}

                        <div className="cart-total-price-container">
                            <TotalPrice price={calculateTotalPrice()} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
