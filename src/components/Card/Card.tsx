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

export const Card = ({ card }: TCardProps) => {
    const { user } = useUserData();
    const { notifySuccess, notifyError } = useToast();
    const [like, setLike] = useState<{ id: number; uuid: string } | null>(
        card.like,
    );

    const handleLike = async () => {
        const like = await Service.ProductService.setLike({
            productUuid: card.uuid,
        });
        setLike(like.data);
        notifySuccess(`Ви додали ${card.title} до списку побажань`);
    };

    const handleDislike = () => {
        if (!card.like || !like) {
            notifyError('Error while tring to dislike product');
            return;
        }

        Service.LikesService.deleteLike({ likeUuid: like.uuid });
        setLike(null);
        notifySuccess(`Ви видалили ${card.title} зі списку побажань`);
    };

    const handleAddToCart = () => {
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
                notifySuccess(`Ви додали ${card.title} до корзини`);
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
            {/* <p className="card-description">{card.desc}</p> */}

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
                text="В КОШИК"
                filled={false}
                style={{ width: '100%', alignSelf: 'end' }}
                onClick={handleAddToCart}
            />
        </div>
    );
};