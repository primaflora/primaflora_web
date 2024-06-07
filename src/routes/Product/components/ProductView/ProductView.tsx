import { useState } from 'react';
import { useLikes } from '../../../../common/hooks/useLikes';
import { Service } from '../../../../common/services';
import { useToast } from '../../../../common/toast';
import { Button, Like } from '../../../../components/buttons';
import { Line, Row } from '../../../../components/common';
import { CommentSection } from './components/CommentSection/CommentSection';
import './styles.css';
import { TProductViewProps } from './types';
import { useUserData } from '../../../../store/tools';

export const ProductView = ({ product }: TProductViewProps) => {
    const { isAuth, user } = useUserData();
    const { notifySuccess, notifyError } = useToast();
    const { addLike, removeLike } = useLikes();
    const [isLike, setIsLike] = useState<boolean>(!!product.like);

    const handleLike = async () => {
        if (!isAuth) {
            notifyError('Error while tring to like product. (Not authorized!)');
            return;
        }

        const like = await Service.ProductService.setLike({
            productUuid: product.uuid,
        });
        addLike(like.data);
        setIsLike(true);
        product.like = like.data;
        notifySuccess(`Ви додали ${product.title} до списку побажань`);
    };

    const handleDislike = () => {
        if (!isAuth) {
            notifyError(
                'Error while tring to dislike product. (Not authorized!)',
            );
            return;
        }

        if (!product.like) {
            notifyError('Error while tring to dislike product');
            return;
        }

        Service.LikesService.deleteLike({ likeUuid: product.like.uuid });
        removeLike(product.id);
        setIsLike(false);
        notifySuccess(`Ви видалили ${product.title} зі списку побажань`);
    };

    const handleMoveToCart = () => {
        if (!isAuth) {
            notifyError(
                'Error while tring to add product to the cart. (Not authorized!)',
            );
            return;
        }

        if (!user) {
            notifyError(
                'Error while tring to add product to cart. (Cannot find user uuid!)',
            );
            return;
        }

        Service.CartService.postCreate({
            quantity: 1,
            userUId: user?.uuid,
            productUId: product.uuid,
        })
            .then(() => {
                notifySuccess(`Ви додали ${product.title} до корзини`);
            })
            .catch(err => {
                console.log(err);
            });
    };

    return (
        <div className="mt-10">
            <h1 className="category-name">{product.category.name}</h1>
            <div className="product-view-container">
                <img
                    className="product-avatar"
                    src={product.photo_url}
                    alt={product.title}
                />
                <div>
                    <h1 className="product-title">{product.title}</h1>
                    <ul className="product-description">
                        <li>
                            має поживну та протизапальну дію при порушеннях
                            опорно-рухового апарату;
                        </li>
                        <li>
                            має поживну та протизапальну дію при порушеннях
                            опорно-рухового апарату;
                        </li>
                        <li>
                            має поживну та протизапальну дію при порушеннях
                            опорно-рухового апарату;
                        </li>
                        <li>
                            має поживну та протизапальну дію при порушеннях
                            опорно-рухового апарату;
                        </li>
                    </ul>

                    <Row
                        style={{
                            justifyContent: 'space-between',
                            marginTop: 50,
                            marginBottom: 50,
                        }}>
                        <h1 className="text-black text-xl">
                            Rating: {product.rating} / 5
                        </h1>
                        <Like
                            isLiked={isLike}
                            onLike={handleLike}
                            onDislike={handleDislike}
                        />
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
                            filled={false}
                            text="В КОШИК"
                        />
                    </Row>
                </div>
            </div>

            <Line />
            {renderDescription(product.desc)}
            <Line />

            <CommentSection comments={product.comments} />
        </div>
    );
};

export const renderDescription = (desc: Object) => {
    const formatKey = (key: string): string => {
        if (!key) return '';

        const res = key.replace(/_/g, ' ');
        return res.charAt(0).toUpperCase() + res.slice(1);
    };

    const formatValue = (value: string): string => {
        if (!value) return '';

        if (typeof value === 'object') {
            return 'object type';
        }

        if (typeof value === 'boolean') {
            return value ? 'Так' : 'Ні';
        }

        return value;
    };

    return (
        <div>
            {Object.entries(desc).map(([key, value]) => {
                // if array
                if (typeof value === 'object' && Array.isArray(value)) {
                    console.log('Is Array');
                    return (
                        <h4>
                            <strong>{formatKey(key)}</strong>:{' '}
                            <ul className="pl-4">
                                {value.map((item, index) => (
                                    <h1 className="flex">{item}, </h1>
                                    // <li
                                    //     className='before:content-["•"]'
                                    //     key={index}>
                                    //     {item}
                                    // </li>
                                ))}
                            </ul>
                        </h4>
                    );
                }

                // if object
                if (typeof value === 'object') {
                    return renderDescription(value);
                }

                return (
                    <h4 className="pb-2">
                        <strong>{formatKey(key)}</strong>: {formatValue(value)}
                    </h4>
                );
            })}
        </div>
    );
};
