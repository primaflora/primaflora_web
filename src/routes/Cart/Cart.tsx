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
import { StorageService } from '../../common/storage/storage.service';
import { useNavigate } from 'react-router-dom';

export const Cart = () => {
    const { t } = useTranslation();
    const { isAuth } = useUserData();
    const [cart, setCart] = useState<TCartItem[]>([]);
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuth) {
            Service.CartService.getAll().then(res => {
                setCart(res.data);
                // По умолчанию выбираем все товары
                const allItemIds = new Set(res.data.map(item => item.uuid));
                setSelectedItems(allItemIds);
                console.log('cart => ', res.data);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuth]);

    const onCartItemQuantityChange = async (productUid: string, quantity: number) => {
        console.log('uuid: ', productUid, ' quantity: ', quantity);
        setCart(oldCart =>
            oldCart.map(item =>
                item.product.uuid === productUid ? { ...item, quantity } : item,
            ),
        );
        const token = await StorageService.getToken('accessToken');
        console.log(token);
        const response = await fetch(
            `${process.env.REACT_APP_HOST_URL}/cart`,
            {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                    'Accept-language' : 'ukr'
                },
                body: JSON.stringify({
                    productUuid: productUid,
                    quantity: quantity
                })
            }
        );
        const data = await response.json();
        console.log(data);
    };

    const handleCartItemRemove = (cartItemUid: string) => {
        Service.CartService.delete({ uuid: cartItemUid }).then(() => {
            setCart(cart.filter(item => item.uuid !== cartItemUid));
            // Убираем из выбранных при удалении
            setSelectedItems(prev => {
                const newSet = new Set(prev);
                newSet.delete(cartItemUid);
                return newSet;
            });
        });
    };

    const handleItemSelect = (itemUuid: string, isSelected: boolean) => {
        setSelectedItems(prev => {
            const newSet = new Set(prev);
            if (isSelected) {
                newSet.add(itemUuid);
            } else {
                newSet.delete(itemUuid);
            }
            return newSet;
        });
    };

    const handleSelectAll = (selectAll: boolean) => {
        if (selectAll) {
            const allItemIds = new Set(cart.map(item => item.uuid));
            setSelectedItems(allItemIds);
        } else {
            setSelectedItems(new Set());
        }
    };

    const calculateTotalPrice = () => {
        return cart
            .filter(item => selectedItems.has(item.uuid))
            .reduce(
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

    const getSelectedItemsCount = () => selectedItems.size;

    const handleSubmit = () => {
        // Фильтруем только выбранные товары
        const selectedCartItems = cart.filter(item => selectedItems.has(item.uuid));
        
        if (selectedCartItems.length === 0) {
            alert('Выберите товары для заказа');
            return;
        }

        const invoicePayload = selectedCartItems.map(item => (
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
                    <h1 className="justify-self-center text-3xl pb-12">
                        {t('global.unauthorized')}
                    </h1>
                ) : cart.length === 0 ? (
                    <h1 className="justify-self-center text-3xl pb-12">
                        {t('global.empty')}
                    </h1>
                ) : (
                    <div style={{marginTop: 40}}>
                        {/* Заголовок с чекбоксом "Выбрать все" */}
                        <div className="flex items-center justify-between mb-4 p-3 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="select-all"
                                    checked={selectedItems.size === cart.length && cart.length > 0}
                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
                                />
                                <label htmlFor="select-all" className="text-sm font-medium text-gray-700">
                                    {t('cart.select-all')} ({getSelectedItemsCount()} из {cart.length})
                                </label>
                            </div>
                            <div className="text-sm text-gray-600">
                                {selectedItems.size > 0 && `${t('cart.selected')}: ${getSelectedItemsCount()}`}
                            </div>
                        </div>

                        {cart.map(item => (
                            <CartItem
                                key={item.uuid}
                                item={item}
                                onQuantityChange={onCartItemQuantityChange}
                                onRemove={handleCartItemRemove}
                                isSelected={selectedItems.has(item.uuid)}
                                onSelect={(isSelected) => handleItemSelect(item.uuid, isSelected)}
                            />
                        ))}

                        <div className="cart-total-price-container pb-4">
                            <TotalPrice 
                                onSubmit={handleSubmit} 
                                price={calculateTotalPrice()}
                                selectedItemsCount={getSelectedItemsCount()}
                                totalItemsCount={cart.length}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
