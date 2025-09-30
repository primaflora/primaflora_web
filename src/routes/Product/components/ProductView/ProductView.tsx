import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLikes } from '../../../../common/hooks/useLikes';
import { useCartStatus } from '../../../../common/hooks/useCartStatus';
import { useProductSeries } from '../../../../common/hooks/useProductSeries';
import { Service } from '../../../../common/services';
import { useToast } from '../../../../common/toast';
import { Button, Like } from '../../../../components/buttons';
import { Line, Row, StarRating } from '../../../../components/common';
import { LogInModal } from '../../../../components/common/Modals/LogInModal/LogInModal';
import { ImageMagnifier } from '../../../../components/ImageMagnifier';
import { CommentSection } from './components/CommentSection/CommentSection';
import './styles.css';
import { TProductViewProps } from './types';
import { useUserData } from '../../../../store/tools';
import { StyledDraftText } from '../../../../components/StyledDraftText';
import { stateFromHTML } from 'draft-js-import-html';
import { convertToRaw } from 'draft-js'
import LeftArrow from '../../../Home/components/Slider/components/Arrows/components/Arrows/LeftArrow';
import RightArrow from '../../../Home/components/Slider/components/Arrows/components/Arrows/RightArrow';
import { TProduct } from '../../../../common/services/category/types/common';
import { SEOHead } from '../../../../components/common';
import NotifyIcon from '../../../../assets/svg/NotifyIcon';

export const ProductView = ({ product }: TProductViewProps) => {
    const { isAuth, user } = useUserData();
    const { notifySuccess, notifyError } = useToast();
    const { addLike, removeLike } = useLikes();
    const { isInCart, addToCart } = useCartStatus(product.uuid);
    const [isLike, setIsLike] = useState<boolean>(!!product.like);
    const [isLogInModalOpen, setIsLogInModalOpen] = useState(false);
    const [seriesLoaded, setSeriesLoaded] = useState(false);
    const navigate = useNavigate();
    
    // Используем упрощенный хук для управления навигацией
    const {
        getProductByIndex,
        getCurrentIndex,
        getProductsCount,
        currentIndex,
        products,
        setCurrentProductIndex
    } = useProductSeries();

    // Получаем количество товаров
    const productsCount = products.length;


    // Функция для перехода к предыдущему товару
    const goToPreviousProduct = () => {
        console.log('🔄 goToPreviousProduct BEFORE:', { 
            currentIndex, 
            productsCount, 
            canGoPrev: currentIndex > 0,
            productsArray: products?.slice(0, 3) // показываем первые 3 для отладки
        });
        
        if (currentIndex > 0) {
            const newIndex = currentIndex - 1;
            const prevProduct = getProductByIndex(newIndex);
            console.log('🔄 goToPreviousProduct:', { 
                newIndex, 
                prevProduct: prevProduct ? { uuid: prevProduct.uuid, title: prevProduct.title } : null
            });
            if (prevProduct) {
                console.log('📍 Setting new index and navigating...');
                setCurrentProductIndex(newIndex); // Обновляем индекс в Redux
                navigate(`/product/${prevProduct.uuid}`);
                console.log('✅ Navigation completed to index:', newIndex);
            }
        } else {
            console.log('❌ Cannot go to previous: currentIndex <= 0');
        }
    };

    // Функция для перехода к следующему товару
    const goToNextProduct = () => {
        console.log('🔄 goToNextProduct BEFORE:', { 
            currentIndex, 
            productsCount, 
            canGoNext: currentIndex < productsCount - 1,
            productsArray: products?.slice(0, 3) // показываем первые 3 для отладки
        });
        
        if (currentIndex < productsCount - 1) {
            const newIndex = currentIndex + 1;
            const nextProduct = getProductByIndex(newIndex);
            console.log('🔄 goToNextProduct:', { 
                newIndex, 
                nextProduct: nextProduct ? { uuid: nextProduct.uuid, title: nextProduct.title } : null
            });
            if (nextProduct) {
                console.log('📍 Setting new index and navigating...');
                setCurrentProductIndex(newIndex); // Обновляем индекс в Redux
                navigate(`/product/${nextProduct.uuid}`);
                console.log('✅ Navigation completed to index:', newIndex);
            }
        } else {
            console.log('❌ Cannot go to next: currentIndex >= productsCount - 1');
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
        if (!isAuth) {
            // notifyError('Для добавления в избранное необходимо войти в аккаунт');
            setIsLogInModalOpen(true);
            return;
        }

        const like = await Service.ProductService.setLike({
            productUuid: product.uuid,
        });
        addLike(like.data);
        setIsLike(true);
        product.like = like.data;
        notifySuccess(`Ві додали ${product.title} до списку побажань`);
    };

    const handleDislike = () => {
        if (!isAuth) {
            // notifyError('Для удаления из избранного необходимо войти в аккаунт');
            setIsLogInModalOpen(true);
            return;
        }

        if (!product.like) {
            notifyError('Error while tring to dislike product');
            return;
        }

        Service.LikesService.deleteLike({ productUuid: product.uuid });
        removeLike(product.id);
        setIsLike(false);
        notifySuccess(`Ви видалили ${product.title} зі списку побажань`);
    };

    const handleMoveToCart = async () => {
        if (!product.inStock) {
            notifyError('Товар немає в наявності');
            return;
        }

        if (!isAuth) {
            notifyError('Для добавления в корзину необходимо войти в аккаунт');
            setIsLogInModalOpen(true);
            return;
        }

        try {
            await addToCart(1);
            notifySuccess(`Ви додали ${product.title} до корзини`);
        } catch (err) {
            console.log(err);
            notifyError('Ошибка при добавлении товара в корзину');
        }
    };

    const handleCloseLogInModal = () => {
        setIsLogInModalOpen(false);
    };

    const handleMoveToSignUp = () => {
        setIsLogInModalOpen(false);
        // Здесь можно добавить логику для открытия модала регистрации, если нужно
    };

    const handleNotifyClick = () => {
        notifySuccess('Уведомления пока не реализованы');
        // TODO: Здесь можно добавить логику для показа уведомлений
    };

    return (
        <div className="">
            <SEOHead 
                title={product.seoTitle || `${product.title} - Primaflora`}
                description={product.seoDescription || `Купити ${product.title} в інтернет-магазині Primaflora. ${product.shortDesc || ''}`}
            />
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <h1 className="category-name">
                    {product.categories.map(category => {
                        console.log(category)
                        return category.translate[0].name;
                    }).join(', ') || 'No Categories'}
                </h1>
                <div style={{
                    display: 'flex',
                    gap: 10,
                    alignItems: 'center',
                }}>
                    <button 
                        onClick={goToPreviousProduct}
                        disabled={productsCount === 0 || currentIndex <= 0}
                        style={{
                            opacity: (productsCount === 0 || currentIndex <= 0) ? 0.5 : 1,
                            cursor: (productsCount === 0 || currentIndex <= 0) ? 'not-allowed' : 'pointer',
                            background: 'none',
                            border: 'none',
                            padding: 8,
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <LeftArrow/>
                    </button>
                    <span style={{ fontSize: '14px', color: '#666' }}>
                        {productsCount > 0 && currentIndex >= 0 
                            ? `${currentIndex + 1} / ${productsCount}` 
                            : ''
                        }
                    </span>
                    <button 
                        onClick={goToNextProduct}
                        disabled={productsCount === 0 || currentIndex >= productsCount - 1}
                        style={{
                            opacity: (productsCount === 0 || currentIndex >= productsCount - 1) ? 0.5 : 1,
                            cursor: (productsCount === 0 || currentIndex >= productsCount - 1) ? 'not-allowed' : 'pointer',
                            background: 'none',
                            border: 'none',
                            padding: 8,
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <RightArrow/>
                    </button>
                </div>
            </div>
            <div className="product-view-container">
                <ImageMagnifier
                    src={getImageUrl(product.photo_url)}
                    alt={product.title}
                    className="product-avatar"
                    magnifierSize={250}
                    zoomLevel={2.5}
                />
                <div>
                    <h1 className="product-title">{product.title}</h1>
                    <ul className="product-description">
                        {
                            product.descriptionPoints?.map((item: string) => (
                                <li>{item}</li>
                            ))
                        }
                        {/* {product.shortDesc} */}
                    </ul>

                    <Row
                        style={{
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 50,
                            marginBottom: 50,
                        }}>
                        <StarRating rating={product.rating} size="medium" />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {isAuth && (
                                <NotifyIcon 
                                    style={{ cursor: 'pointer' }} 
                                    onClick={handleNotifyClick}
                                />
                            )}
                            <Like
                                isLiked={isLike}
                                onLike={handleLike}
                                onDislike={handleDislike}
                            />
                        </div>
                    </Row>

                    <Row style={{ justifyContent: 'space-between' }}>
                        <div>
                            {product.percent_discount && (
                                <p className="product-price-old">
                                    {product.price_currency} грн.
                                </p>
                            )}
                            <p className="product-price-main">
                                {product.percent_discount
                                    ? product.price_currency *
                                      ((100 - product.percent_discount) / 100)
                                    : product.price_currency}
                                {''}
                                <span className="product-current-currency">
                                    грн.
                                </span>
                            </p>
                        </div>
                        <Button
                            onClick={handleMoveToCart}
                            filled={isInCart}
                            text={!product.inStock ? "Немає в наявності" : (isInCart ? "В кошику" : "В КОШИК")}
                            style={{
                                backgroundColor: isInCart ? '#72BF44' : (!product.inStock ? '#ccc' : undefined),
                                color: (isInCart || !product.inStock) ? 'white' : undefined,
                                border: (isInCart || !product.inStock) ? 'none' : undefined,
                                cursor: !product.inStock ? 'not-allowed' : undefined
                            }}
                            isClickable={!isInCart && product.inStock}
                        />
                    </Row>
                </div>
            </div>

            <Line />
                <StyledDraftText rawState={convertToRaw(stateFromHTML(product.desc))}/>
            <Line />

            <CommentSection comments={product.comments} canComment={product.canComment} />
            
            <LogInModal
                isOpen={isLogInModalOpen}
                onClose={handleCloseLogInModal}
                onMoveToSignUp={handleMoveToSignUp}
            />
        </div>
    );
};