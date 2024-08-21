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
import { useTranslation } from 'react-i18next';

export const Cart = () => {
    const { t } = useTranslation();
    const { isAuth } = useUserData();
    const [cart, setCart] = useState<TCartItem[]>([]);

    useEffect(() => {
        if (isAuth) {
            Service.CartService.getAll().then(res => {setCart(res.data); console.log('cart => ', res.data)});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuth]);

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

    const handleSubmit = () => {
        const invoicePayload = cart.map(item => (
            {
                name: item.product.title,
                qty: item.quantity,
                sum: item.product.percent_discount
                    ? item.product.price_currency *
                    ((100 - item.product.percent_discount) / 100) * 100
                    : item.product.price_currency * 100, 
                icon: item.product.photo_url,
                unit: 'шт.',
                code: item.product.uuid,
            }
        ));

        Service.MonobankService.createInvoice({ 
            baskets: invoicePayload,
            amount: calculateTotalPrice() * 100
        })
        .then(res => {
            const win = window.open(res.data.pageUrl, '_blank');
            win?.focus();
        })
        .catch(err => console.log(err))
    }

    return (
        <div className="main-global-padding flex">
            <SideBar />
            <div className="cart-main-container">
                <div className="catalog-stripe-mob-container pb-5">
                    <CatalogStripeMob />
                </div>
                <Slider />
                <Line />
                <h1 className="cart-title">{t('navigation.cart')}</h1>
                {!isAuth ? (
                    <h1 className="justify-self-center text-black text-3xl pb-12">
                        {t('global.unauthorized')}
                    </h1>
                ) : cart.length === 0 ? (
                    <h1 className="justify-self-center text-black text-3xl pb-12">
                        {t('global.empty')}
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

                        <div className="cart-total-price-container pb-4">
                            <TotalPrice onSubmit={handleSubmit} price={calculateTotalPrice()} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
