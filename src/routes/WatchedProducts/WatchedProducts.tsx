import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ProductWatchAPI, ProductWatchDto } from '../../common/api/product-watch.api';
import { useToast } from '../../common/toast';
import { Button } from '../../components/buttons';
import './styles.css';

export const WatchedProducts = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { notifySuccess, notifyError } = useToast();
    const [watchedProducts, setWatchedProducts] = useState<ProductWatchDto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWatchedProducts();
    }, []);

    const loadWatchedProducts = async () => {
        try {
            setLoading(true);
            const products = await ProductWatchAPI.getUserWatches();
            setWatchedProducts(products);
        } catch (error) {
            console.error('Error loading watched products:', error);
            notifyError('Помилка завантаження відстежуваних товарів');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveWatch = async (productUuid: string) => {
        try {
            await ProductWatchAPI.removeWatch(productUuid);
            setWatchedProducts(prev => prev.filter(item => item.productUuid !== productUuid));
            notifySuccess('Товар видалено з відстежуваних');
        } catch (error) {
            console.error('Error removing watch:', error);
            notifyError('Помилка при видаленні товару з відстеження');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('uk-UA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="main-global-padding pt-6">
                <div className="flex justify-center items-center" style={{ minHeight: '200px' }}>
                    <p>Завантаження...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="main-global-padding pt-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Відстежувані товари</h1>
                <Button
                    text="← Назад"
                    onClick={() => navigate('/user')}
                    filled={false}
                    style={{ 
                        borderRadius: '7px', 
                        border: '2px solid #72BF44', 
                        color: '#72BF44',
                        padding: '8px 16px'
                    }}
                />
            </div>

            {watchedProducts.length === 0 ? (
                <div className="text-center" style={{ padding: '40px 0' }}>
                    <h3>У вас немає відстежуваних товарів</h3>
                    <p style={{ color: '#666', marginTop: '10px' }}>
                        Щоб додати товар у відстеження, натисніть на іконку дзвіночка біля товару, якого немає в наявності
                    </p>
                    <Button
                        text="Переглянути товари"
                        onClick={() => navigate('/')}
                        filled
                        style={{ borderRadius: '7px', marginTop: '20px' }}
                    />
                </div>
            ) : (
                <div className="watched-products-list">
                    {watchedProducts.map((item) => (
                        <div key={item.uuid} className="watched-product-item">
                            <div className="watched-product-info">
                                <h4>Товар: {item.productUuid}</h4>
                                <p style={{ color: '#666', fontSize: '14px' }}>
                                    Додано: {formatDate(item.createdAt)}
                                </p>
                                {item.isNotified && item.notifiedAt && (
                                    <p style={{ color: '#72BF44', fontSize: '14px', fontWeight: 'bold' }}>
                                        ✓ Уведомлення надіслано: {formatDate(item.notifiedAt)}
                                    </p>
                                )}
                                {!item.isNotified && (
                                    <p style={{ color: '#orange', fontSize: '14px' }}>
                                        ⏳ Очікуємо поповнення
                                    </p>
                                )}
                            </div>
                            <div className="watched-product-actions">
                                <Button
                                    text="Переглянути"
                                    onClick={() => navigate(`/product/${item.productUuid}`)}
                                    filled={false}
                                    style={{ 
                                        borderRadius: '7px', 
                                        border: '1px solid #ccc', 
                                        color: '#333',
                                        padding: '6px 12px',
                                        marginRight: '8px'
                                    }}
                                />
                                <Button
                                    text="Видалити"
                                    onClick={() => handleRemoveWatch(item.productUuid)}
                                    filled={false}
                                    style={{ 
                                        borderRadius: '7px', 
                                        border: '1px solid #ff4444', 
                                        color: '#ff4444',
                                        padding: '6px 12px'
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};