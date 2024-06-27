import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Images } from '../../assets';
import { Service } from '../../common/services';
import { useToast } from '../../common/toast';
import { Button, Like } from '../buttons';
import { Row } from '../common';
import './styles.css';
import { TCardProps } from './types';
import { useUserData } from '../../store/tools';
import { useTranslation } from 'react-i18next';

export const Card = ({ card }: TCardProps) => {
    const { t } = useTranslation();
    const { user, isAuth } = useUserData();
    const { notifySuccess, notifyError } = useToast();
    const [like, setLike] = useState<{ id: number; uuid: string } | null>(
        card.like,
    );

    const handleLike = async () => {
        console.log('IsAuthed => ', isAuth);
        if (!isAuth) {
            notifyError('Error while tring to like product. (Not authorized!)');
            return;
        }

        const like = await Service.ProductService.setLike({
            productUuid: card.uuid,
        });
        setLike(like.data);
        notifySuccess(t('messages.add-like', { title: card.title }));
    };

    const handleDislike = () => {
        console.log('cardLike: ', card.like);
        console.log('like: ', like);
        if (!like) {
            notifyError('Error while tring to dislike product');
            return;
        }

        Service.LikesService.deleteLike({ likeUuid: like.uuid });
        setLike(null);
        notifySuccess(t('messages.remove-like', { title: card.title }));
    };

    const handleAddToCart = () => {
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
            productUId: card.uuid,
        })
            .then(() => {
                notifySuccess(t('messages.add-cart', { title: card.title }));
            })
            .catch(err => {
                console.log(err);
            });
    };

    return (
        <div className="card">
            <Link to={`/product/${card.uuid}`}>
                <img src={card.photo_url} alt={card.title} />
            </Link>
            <h1 className="card-title">{card.title}</h1>
            <p className="card-description">{card?.shortDesc}</p>

            <Row style={{ justifyContent: 'space-between' }}>
                <p className="small-text">Rating: {card.rating} / 5</p>

                <div className="flex flex-row">
                    <p className="small-text pr-4">{card.comments}</p>
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
                <Like
                    isLiked={!!like}
                    onLike={handleLike}
                    onDislike={handleDislike}
                />
            </Row>
            <Button
                text="В&nbsp;КОШИК"
                filled={false}
                style={{ width: '100%', alignSelf: 'end' }}
                onClick={handleAddToCart}
            />
        </div>
    );
};
