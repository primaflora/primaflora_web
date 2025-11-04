import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Images } from '../../assets';
import { Service } from '../../common/services';
import { useToast } from '../../common/toast';
import { useCartStatus } from '../../common/hooks/useCartStatus';
import { useLikes } from '../../common/hooks/useLikes';
import { useProductSeries } from '../../common/hooks/useProductSeries';
import { Button, Like } from '../buttons';
import { Row, StarRating } from '../common';
import { LogInModal } from '../common/Modals/LogInModal/LogInModal';
import ProductLabel from '../ProductLabel';
import './styles.css';
import { TCardProps } from './types';
import { useUserData } from '../../store/tools';
import { useTranslation } from 'react-i18next';
import NotifyIcon from '../../assets/svg/NotifyIcon';
import { ProductWatchAPI } from '../../common/api/product-watch.api';

export const Card = ({ card, index }: TCardProps) => {
    const { t } = useTranslation();
    const { user, isAuth } = useUserData();
    const { notifySuccess, notifyError } = useToast();
    const { addLike, removeLike } = useLikes();
    const { isInCart, addToCart, removeFromCart } = useCartStatus(card.uuid);
    const { setCurrentProductIndex } = useProductSeries();
    
    // Для отладки
    console.log('Card - product data:', card);
    console.log('Card - categoryIds:', card.categoryIds);
    const [like, setLike] = useState<{ id: number; uuid: string } | null>(
        card.like,
    );
    const [isLogInModalOpen, setIsLogInModalOpen] = useState(false);
    const [isWatching, setIsWatching] = useState(false);
    const [watchLoading, setWatchLoading] = useState(false);

    // Проверяем, отслеживает ли пользователь этот товар
    useEffect(() => {
        if (isAuth && !card.inStock) {
            checkWatchingStatus();
        }
    }, [isAuth, card.inStock, card.uuid]);

    const checkWatchingStatus = async () => {
        try {
            const response = await ProductWatchAPI.isWatching(card.uuid);
            setIsWatching(response.isWatching);
        } catch (error) {
            console.error('Error checking watch status:', error);
        }
    };

    // Функция для формирования полного URL изображения
    const getImageUrl = (imageUrl: string) => {
        if (!imageUrl) return '';
        if (imageUrl.startsWith('http')) {
            return imageUrl; // Уже полный URL
        }
        return `${process.env.REACT_APP_HOST_URL}${imageUrl}`; // Добавляем базовый URL
    };

    const handleLike = async () => {
        console.log('IsAuthed => ', isAuth);
        if (!isAuth) {
            // notifyError('Для добавления в избранное необходимо войти в аккаунт');
            setIsLogInModalOpen(true);
            return;
        }

        // Проверяем, не добавлен ли уже товар в избранное
        if (like) {
            notifyError('Товар вже в списку побажань');
            return;
        }

        try {
            const likeResponse = await Service.ProductService.setLike({
                productUuid: card.uuid,
            });
            addLike(likeResponse.data); // Обновляем глобальное состояние
            setLike(likeResponse.data); // Обновляем локальное состояние
            notifySuccess(t('messages.add-like', { title: card.title }));
        } catch (error) {
            console.error('Error adding like:', error);
            notifyError('Помилка при додаванні до побажань');
        }
    };

    const handleDislike = async () => {
        console.log('cardLike: ', card.like);
        console.log('like: ', like);
        if (!like) {
            notifyError('Помилка при видаленні з побажань');
            return;
        }

        if (!isAuth) {
            setIsLogInModalOpen(true);
            return;
        }

        try {
            await Service.LikesService.deleteLike({ productUuid: card.uuid });
            // removeLike expects the like id (not the product id). Use the local like.id if available.
            removeLike(like.id);
            setLike(null); // Обновляем локальное состояние
            notifySuccess(t('messages.remove-like', { title: card.title }));
        } catch (error) {
            console.error('Error removing like:', error);
            notifyError('Помилка при видаленні з побажань');
        }
    };

    // Если prop card.like изменился (например, был обогащен извне), синхронизируем локальное состояние
    useEffect(() => {
        setLike(card.like);
    }, [card.like]);

    const handleCartAction = async () => {
        if (!card.inStock) {
            notifyError('Товар немає в наявності');
            return;
        }

        if (!isAuth) {
            setIsLogInModalOpen(true);
            return;
        }

        try {
            if (isInCart) {
                // Если товар уже в корзине, удаляем его
                await removeFromCart();
                notifySuccess(t('messages.remove-cart', { title: card.title }));
            } else {
                // Если товара нет в корзине, добавляем его
                await addToCart(1);
                notifySuccess(t('messages.add-cart', { title: card.title }));
            }
        } catch (err) {
            console.log(err);
            notifyError(isInCart ? 'Помилка при видаленні товару з кошика' : 'Помилка при додаванні товару до кошика');
        }
    };

    const handleCloseLogInModal = () => {
        setIsLogInModalOpen(false);
    };

    const handleMoveToSignUp = () => {
        setIsLogInModalOpen(false);
        // Здесь можно добавить логику для открытия модала регистрации, если нужно
    };

    const handleNotifyClick = async () => {
        if (watchLoading) return;
        
        setWatchLoading(true);
        try {
            if (isWatching) {
                await ProductWatchAPI.removeWatch(card.uuid);
                setIsWatching(false);
                notifySuccess('Ви відписалися від уведомлень про цей товар');
            } else {
                await ProductWatchAPI.addWatch(card.uuid);
                setIsWatching(true);
                notifySuccess('Ви підписалися на уведомлення про поповнення товару');
            }
        } catch (error) {
            console.error('Error toggling watch:', error);
            notifyError('Помилка при зміні статусу відстеження товару');
        } finally {
            setWatchLoading(false);
        }
    };

    const handleCardClick = async () => {
        // Устанавливаем текущий индекс товара напрямую
        if (index !== undefined) {
            console.log('Card click: setting current product index to', index);
            setCurrentProductIndex(index);
        }

        // Если это товар из уведомлений, отмечаем его как просмотренный
        if (isAuth && card.isFromNotifications && card.inStock) {
            try {
                await ProductWatchAPI.markAsViewed(card.uuid);
                console.log('Product marked as viewed automatically:', card.uuid);
                // Обновляем глобальные уведомления через небольшую задержку
                setTimeout(() => {
                    // Можно импортировать refreshAvailableProducts если нужно
                    window.dispatchEvent(new CustomEvent('refreshAvailableProducts'));
                }, 500);
            } catch (error) {
                console.error('Error marking product as viewed:', error);
            }
        }
    };

    // Получаем информацию о специальных лейблах для плашек
    const getSpecialLabel = () => {
        console.log(`[${card.title}] Полные данные карточки:`, card);
        
        if (!card.categories || card.categories.length === 0) {
            console.log(`[${card.title}] Нет категорий для отображения лейбла`);
            return null;
        }

        console.log(`[${card.title}] Проверяем категории:`, card.categories);

        // Специальные категории с их лейблами и цветами
        const specialCategories: Record<string, { label: string; labelColor: string }> = {
            'ТОП продажів': { label: 'Топ продажів', labelColor: '#72BF44' },
            'Акції': { label: 'Акція', labelColor: '#FF4141' },
            'Актуально зараз': { label: 'Актуально зараз', labelColor: '#9747FF' }
        };

        // Проверяем каждую категорию товара
        for (const category of card.categories) {
            console.log(`[${card.title}] Обрабатываем категорию:`, category);
            
            // Проверяем есть ли translate массив
            if (category.translate && category.translate.length > 0) {
                const categoryName = category.translate[0].name;
                console.log(`[${card.title}] Название категории из translate:`, categoryName);
                
                if (categoryName && specialCategories[categoryName]) {
                    console.log(`[${card.title}] ✅ Найдена специальная категория:`, categoryName, specialCategories[categoryName]);
                    return specialCategories[categoryName];
                }
            }
            
            // Проверяем прямое имя категории (если нет translate) - используем any для отладки
            if ((category as any).name_ukr) {
                console.log(`[${card.title}] Название категории из name_ukr:`, (category as any).name_ukr);
                
                if (specialCategories[(category as any).name_ukr]) {
                    console.log(`[${card.title}] ✅ Найдена специальная категория через name_ukr:`, (category as any).name_ukr, specialCategories[(category as any).name_ukr]);
                    return specialCategories[(category as any).name_ukr];
                }
            }
            
            // Проверяем name
            if ((category as any).name) {
                console.log(`[${card.title}] Название категории из name:`, (category as any).name);
                
                if (specialCategories[(category as any).name]) {
                    console.log(`[${card.title}] ✅ Найдена специальная категория через name:`, (category as any).name, specialCategories[(category as any).name]);
                    return specialCategories[(category as any).name];
                }
            }
        }

        // Если нет специальной категории, проверяем обычный лейбл подкатегории
        const firstCategory = card.categories[0];
        if (firstCategory && firstCategory.label) {
            console.log(`[${card.title}] Используем обычный лейбл подкатегории:`, firstCategory.label);
            return {
                label: firstCategory.label,
                labelColor: firstCategory.labelColor || '#72BF44'
            };
        }

        console.log(`[${card.title}] Лейбл не найден`);
        return null;
    };

    const specialLabel = getSpecialLabel();
    console.log(`[${card.title}] specialLabel результат:`, specialLabel);

    return (
        <div className="card">
            {/* Отображение специальной плашки */}
            {specialLabel && (
                <ProductLabel 
                    label={specialLabel.label} 
                    labelColor={specialLabel.labelColor} 
                />
            )}
            <Link to={`/product/${card.uuid}`} onClick={handleCardClick} style={{ position: 'relative' }}>
                <img src={getImageUrl(card.photo_url)} alt={card.title} className="card-image" />
                {!card.inStock && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        textAlign: 'center',
                        borderRadius: '8px 8px 0 0'
                    }}>
                        Немає в наявності
                    </div>
                )}
            </Link>
            <h1 className="card-title">{card.title}</h1>
            <p className="card-description">{card?.shortDesc}</p>

            <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <StarRating rating={card.rating} size="small" />

                <div className="flex flex-row items-center">
                    <p className="small-text pr-2">{card.commentsCount || 0}</p>
                    <img src={Images.CommentIcon} alt="comment" />
                </div>
            </Row>

            <Row
                style={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginBottom: 10,
                    marginTop: 10,
                }}>
                <div>
                    {card.percent_discount && (
                        <p className="card-price-old">
                            {card.price_currency} грн.
                        </p>
                    )}
                    <p className="card-price-main">
                        {card.percent_discount
                            ? card.price_currency *
                              ((100 - card.percent_discount) / 100)
                            : card.price_currency}{' '}
                        грн.
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isAuth && !card.inStock && (
                        <div 
                            style={{ 
                                cursor: watchLoading ? 'not-allowed' : 'pointer',
                                opacity: watchLoading ? 0.5 : 1,
                                position: 'relative'
                            }}
                            onClick={handleNotifyClick}
                            title={isWatching ? 'Відписатися від уведомлень' : 'Підписатися на уведомлення'}
                        >
                            <NotifyIcon
                                style={{ 
                                    fill: isWatching ? '#72BF44' : '#ccc',
                                    stroke: isWatching ? '#72BF44' : '#ccc'
                                }}
                            />
                            {isWatching && (
                                <div style={{
                                    position: 'absolute',
                                    top: -2,
                                    right: -2,
                                    width: 6,
                                    height: 6,
                                    backgroundColor: '#72BF44',
                                    borderRadius: '50%'
                                }} />
                            )}
                        </div>
                    )}
                    <Like
                        isLiked={!!like}
                        onLike={handleLike}
                        onDislike={handleDislike}
                    />
                </div>
            </Row>
            <Button
                text={!card.inStock ? 'Немає в наявності' : (isInCart ? 'В кошику' : t('product.move-to-cart'))}
                filled={isInCart}
                style={{ 
                    width: '100%', 
                    borderRadius: 7, 
                    alignSelf: 'end', 
                    padding: "7px 0",
                    backgroundColor: !card.inStock ? '#ccc' : (isInCart ? '#E74C3C' : '#72BF44'),
                    color: (isInCart || !card.inStock) ? 'white' : 'white',
                    border: 'none',
                    cursor: !card.inStock ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.3s ease'
                }}
                onClick={handleCartAction}
                isClickable={card.inStock}
            />
            
            <LogInModal
                isOpen={isLogInModalOpen}
                onClose={handleCloseLogInModal}
                onMoveToSignUp={handleMoveToSignUp}
            />
        </div>
    );
};
