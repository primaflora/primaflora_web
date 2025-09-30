import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Service } from '../../common/services';
import { TOrder, TOrderStatus } from '../../common/services/order/types/common';
import { Button } from '../../components/buttons';
import { Row } from '../../components/common';
import { ProductSkeleton } from '../../components/common';
import './styles.css';

export const OrderHistory = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [orders, setOrders] = useState<TOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadOrderHistory();
    }, []);

    const loadOrderHistory = async () => {
        try {
            setLoading(true);
            const orderHistory = await Service.OrderService.getMyOrderHistory('ukr');
            setOrders(orderHistory);
        } catch (err: any) {
            console.error('Error loading order history:', err);
            setError('Не вдалося завантажити історію замовлень');
        } finally {
            setLoading(false);
        }
    };

    const getStatusText = (status: TOrderStatus): string => {
        const statusMap = {
            pending: 'Очікує оплати',
            paid: 'Оплачено',
            shipped: 'Відправлено',
            completed: 'Завершено',
            canceled: 'Скасовано'
        };
        return statusMap[status] || status;
    };

    const getStatusColor = (status: TOrderStatus): string => {
        const colorMap = {
            pending: '#f59e0b',
            paid: '#10b981',
            shipped: '#3b82f6',
            completed: '#059669',
            canceled: '#ef4444'
        };
        return colorMap[status] || '#6b7280';
    };

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('uk-UA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getImageUrl = (imageUrl: string) => {
        if (!imageUrl) return '';
        if (imageUrl.startsWith('http')) {
            return imageUrl;
        }
        return `${process.env.REACT_APP_HOST_URL}${imageUrl}`;
    };

    if (loading) {
        return (
            <div className="main-global-padding pt-6">
                <div className="order-history-header">
                    <Button
                        text="← Назад"
                        onClick={() => navigate('/user-info')}
                        style={{ marginBottom: '20px' }}
                    />
                    <h1 className="order-history-title">Історія замовлень</h1>
                </div>
                <ProductSkeleton />
            </div>
        );
    }

    if (error) {
        return (
            <div className="main-global-padding pt-6">
                <div className="order-history-header">
                    <Button
                        text="← Назад"
                        onClick={() => navigate('/user-info')}
                        style={{ marginBottom: '20px' }}
                    />
                    <h1 className="order-history-title">Історія замовлень</h1>
                </div>
                <div className="order-history-error">
                    <p>{error}</p>
                    <Button text="Спробувати знову" onClick={loadOrderHistory} />
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="main-global-padding pt-6">
                <div className="order-history-header">
                    <Button
                        text="← Назад"
                        onClick={() => navigate('/user-info')}
                        style={{ marginBottom: '20px' }}
                    />
                    <h1 className="order-history-title">Історія замовлень</h1>
                </div>
                <div className="order-history-empty">
                    <p>У вас поки немає замовлень</p>
                    <Button text="Перейти до каталогу" onClick={() => navigate('/')} />
                </div>
            </div>
        );
    }

    return (
        <div className="main-global-padding pt-6">
            <div className="order-history-header">
                <Button
                    text="← Назад"
                    onClick={() => navigate('/user-info')}
                    style={{ marginBottom: '20px' }}
                />
                <h1 className="order-history-title">Історія замовлень</h1>
            </div>

            <div className="order-history-list">
                {orders.map((order) => (
                    <div key={order.uuid} className="order-card">
                        <div className="order-card-header">
                            <div className="order-info">
                                <h3 className="order-number">Замовлення #{order.id}</h3>
                                <p className="order-date">{formatDate(order.createdAt)}</p>
                            </div>
                            <div className="order-status-price">
                                <span 
                                    className="order-status" 
                                    style={{ color: getStatusColor(order.status) }}
                                >
                                    {getStatusText(order.status)}
                                </span>
                                <span className="order-total">{order.totalPrice} грн</span>
                            </div>
                        </div>

                        <div className="order-items">
                            {order.items.map((item) => (
                                <div key={item.id} className="order-item">
                                    <img 
                                        src={getImageUrl(item.product.photo_url)} 
                                        alt={item.product.title}
                                        className="order-item-image"
                                    />
                                    <div className="order-item-details">
                                        <h4 className="order-item-title">{item.product.title}</h4>
                                        <p className="order-item-desc">{item.product.shortDesc}</p>
                                        <div className="order-item-quantity-price">
                                            <span>Кількість: {item.quantity}</span>
                                            <span>Ціна: {item.price} грн</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {order.invoiceId && (
                            <div className="order-invoice">
                                <p>ID рахунку: {order.invoiceId}</p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};