import { useState } from 'react';
import { Images } from '../../../../assets';
import { Row } from '../../../../components/common';
import { QuantityPicker } from '../QuantityPicker';
import './styles.css';
import { TCartItemProps } from './types';
import { useTranslation } from 'react-i18next';

// TODO: add quantity and price
export const CartItem = ({
    item,
    onQuantityChange,
    onRemove,
    isSelected,
    onSelect,
}: TCartItemProps) => {
    const { t } = useTranslation();
    const [quantity, setQuantity] = useState(item.quantity);

    // Функция для формирования полного URL изображения
    const getImageUrl = (imageUrl: string) => {
        if (!imageUrl) return '';
        if (imageUrl.startsWith('http')) {
            return imageUrl; // Уже полный URL
        }
        return `${process.env.REACT_APP_HOST_URL}${imageUrl}`; // Добавляем базовый URL
    };

    const handleQuantityChange = (value: number) => {
        if (value < 1) {
            return;
        }

        setQuantity(value);
        onQuantityChange(item.product.uuid, value);
    };

    return (
        <div className={`w-full flex flex-row gap-5 p-4 item-cart-border ${!isSelected ? 'opacity-60' : ''}`}>
            <div className="flex flex-col items-start gap-3">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => onSelect(e.target.checked)}
                    className="cart-checkbox mt-2"
                />
            </div>
            <img
                src={getImageUrl(item.product.photo_url)}
                alt={item.product.title}
                className="item-cart-image"
            />
            <div className="flex flex-col justify-between" style={{flex: 1}}>
                <div>
                    <Row
                        style={{
                            justifyContent: 'space-between',
                            paddingBottom: '1rem',
                        }}>
                        <h1 className="item-cart-title">
                            {item.product.title}
                        </h1>
                        <button onClick={() => onRemove(item.uuid)}>
                            <img src={Images.CrossIcon} alt="cross" />
                        </button>
                    </Row>
                    <h2 className="item-cart-desc">{item.product.shortDesc}</h2>
                </div>

                {/* For desktop */}
                <div className="cart-item-price-quantity-container">
                    <QuantityPicker
                        quantity={quantity}
                        onQuantityChange={handleQuantityChange}
                    />
                    <div className="absolute right-0 bottom-0 h-min">
                        {item.product.percent_discount && (
                            <p className="card-price-old">
                                {item.product.price_currency} {t('cart.currency')}
                            </p>
                        )}
                        <p className="card-price-main">
                            {item.product.percent_discount
                                ? item.product.price_currency *
                                  ((100 - item.product.percent_discount) / 100)
                                : item.product.price_currency}{' '}
                            {t('cart.currency')}
                        </p>
                    </div>
                </div>

                {/* For mobile */}
                <div className="cart-item-price-quantity-container-mob">
                    <div>
                        <QuantityPicker
                            quantity={quantity}
                            onQuantityChange={handleQuantityChange}
                        />
                    </div>
                    <div>
                        <Row style={{ justifyContent: 'end' }}>
                            {item.product.percent_discount && (
                                <p className="card-price-old">
                                    {item.product.price_currency} {t('cart.currency')}
                                </p>
                            )}
                        </Row>
                        <Row style={{ justifyContent: 'end' }}>
                            <p className="card-price-main">
                                {item.product.percent_discount
                                    ? item.product.price_currency *
                                      ((100 - item.product.percent_discount) /
                                          100)
                                    : item.product.price_currency}
                                {''}{t('cart.currency')}
                            </p>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    );
};
