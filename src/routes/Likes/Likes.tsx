import { useEffect, useState } from 'react';
import { Service } from '../../common/services';
import { TLike } from '../../common/services/likes';
import { ProductsSection } from '../../components/ProductsSection';
import { SideBar } from '../../components/common';
import { Slider } from '../Home/components/Slider';
import './styles.css';
import { CatalogStripeMob } from '../../components/common/CatalogStripeMob';
import { useTranslation } from 'react-i18next';
import { ProductWatchAPI } from '../../common/api/product-watch.api';
import { useUserData } from '../../store/tools';
import { refreshAvailableProducts } from '../../common/hooks/useAvailableProducts';

export const Likes = () => {
    const { t } = useTranslation();
    const { isAuth, user } = useUserData();
    const [likes, setLikes] = useState<TLike[]>([]);
    const [availableProducts, setAvailableProducts] = useState<any[]>([]);

    useEffect(() => {
        // Загружаем избранное
        Service.LikesService.getLikes().then(res => {
            setLikes(res.data);
            console.log('Likes => ', res.data);
        });

        // Загружаем товары, которые стали доступны (только для авторизованных пользователей)
        if (isAuth) {
            ProductWatchAPI.getAvailableWatchedProducts().then(products => {
                setAvailableProducts(products);
                console.log('Available watched products => ', products);
                
                // Обновляем глобальное состояние уведомлений после просмотра
                setTimeout(() => {
                    refreshAvailableProducts();
                }, 1000);
            }).catch(error => {
                console.error('Error loading available watched products:', error);
            });
        }
    }, [isAuth]);

    // Слушаем событие обновления уведомлений
    useEffect(() => {
        const handleRefresh = () => {
            if (isAuth) {
                ProductWatchAPI.getAvailableWatchedProducts().then(products => {
                    setAvailableProducts(products);
                    // Обновляем глобальное состояние
                    setTimeout(() => {
                        refreshAvailableProducts();
                    }, 100);
                }).catch(error => {
                    console.error('Error refreshing available watched products:', error);
                });
            }
        };

        window.addEventListener('refreshAvailableProducts', handleRefresh);
        return () => {
            window.removeEventListener('refreshAvailableProducts', handleRefresh);
        };
    }, [isAuth]);

    return (
        <div className="main-like-container main-global-padding">
            <div className="flex">
                <SideBar />
                <div className="like-container">
                    <div className="catalog-stripe-mob-container pb-5">
                        <CatalogStripeMob />
                    </div>
                    <Slider />
                    <div className="pt-10">
                        {/* Товары, которые стали доступны */}
                        {isAuth && availableProducts.length > 0 && (
                            <div className="pb-10">
                                <ProductsSection
                                    title="Товари знову в наявності!"
                                    products={availableProducts.map(product => ({
                                        ...product,
                                        commentsCount: 0,
                                        isFromNotifications: true // Помечаем товары из уведомлений
                                    }))}
                                />
                            </div>
                        )}

                        {/* Избранные товары */}
                        {likes.length === 0 && availableProducts.length === 0 ? (
                            <h1 className="justify-self-center text-3xl">
                                {t('global.empty')}
                            </h1>
                        ) : likes.length > 0 ? (
                            <ProductsSection
                                title={t('navigation.like-title')}
                                products={likes.map(l => ({
                                    ...l.product,
                                    like: { id: l.id, uuid: l.uuid },
                                }))}
                            />
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};
