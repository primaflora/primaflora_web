import { Images } from '../../assets';
import { Button, Like } from '../buttons';
import { Row } from '../common';
import './styles.css';
import { TCardPreviewProps } from './types';

export const CardPreview: React.FC<TCardPreviewProps> = ({ card }) => {
    return (
        <div className="card">
            {card.photo_url && <img src={card.photo_url} alt={card.title || 'Product Image'} />}
            {card.title && <h1 className="card-title">{card.title}</h1>}
            {card.shortDesc && <p className="card-description">{card.shortDesc}</p>}

            <Row style={{ justifyContent: 'space-between' }}>
                {card.rating !== undefined && <p className="small-text">Rating: {card.rating} / 5</p>}

                {card.comments !== undefined && (
                    <div className="flex flex-row">
                        <p className="small-text pr-4">{card.comments}</p>
                        <img src={Images.CommentIcon} alt="comment" />
                    </div>
                )}
            </Row>

            <Row
                style={{
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    marginBottom: 10,
                    marginTop: 10,
                }}>
                <div>
                    {card.percent_discount !== undefined && card.price_currency !== undefined && (
                        <p className="card-price-old">
                            {card.price_currency} грн.
                        </p>
                    )}
                    {card.price_currency !== undefined && (
                        <p className="card-price-main">
                            {card.percent_discount !== undefined
                                ? (card.price_currency * ((100 - card.percent_discount) / 100)).toFixed(2)
                                : card.price_currency}{' '}
                            грн.
                        </p>
                    )}
                </div>
                <Like
                    isLiked={true}
                    onLike={() => {}}
                    onDislike={() => {}}
                />
            </Row>
            <Button
                text="В&nbsp;КОШИК"
                filled={false}
                style={{ width: '100%', alignSelf: 'end' }}
                onClick={() => {}}
            />
        </div>
    );
};