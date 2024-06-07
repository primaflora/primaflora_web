import { useState } from 'react';
import { Images } from '../../../../assets';
import { Row } from '../../../../components/common';
import { QuantityPicker } from '../QuantityPicker';
import './styles.css';
import { TCartItemProps } from './types';

// TODO: add quantity and price
export const CartItem = ({
    item,
    onQuantityChange,
    onRemove,
}: TCartItemProps) => {
    const [quantity, setQuantity] = useState(item.quantity);

    const handleQuantityChange = (value: number) => {
        if (value < 1) {
            return;
        }

        setQuantity(value);
        onQuantityChange(item.product.uuid, value);
    };

    return (
        <div className="w-full flex flex-row p-4 item-cart-border">
            <img
                src={item.product.photo_url}
                alt={item.product.title}
                className="item-cart-image"
            />
            <div className="w-full flex flex-col justify-between">
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
                    <h2 className="item-cart-desc">Some text desc</h2>
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
                                {item.product.price_currency} грн.
                            </p>
                        )}
                        <p className="card-price-main">
                            {item.product.percent_discount
                                ? item.product.price_currency *
                                  ((100 - item.product.percent_discount) / 100)
                                : item.product.price_currency}{' '}
                            грн.
                        </p>
                    </div>
                </div>

                {/* For mobile */}
                <div className="cart-item-price-quantity-container-mob">
                    <QuantityPicker
                        quantity={quantity}
                        onQuantityChange={handleQuantityChange}
                    />
                    <div>
                        <Row style={{ justifyContent: 'end' }}>
                            {item.product.percent_discount && (
                                <p className="card-price-old">
                                    {item.product.price_currency} грн.
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
                                {''}грн.
                            </p>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    );
};
