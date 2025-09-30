import React from 'react';
import { TComment } from '../../common/services/category/types/common';
import './styles.css';

interface CommentsListProps {
    comments: TComment[];
    title?: string;
}

export const CommentsList: React.FC<CommentsListProps> = ({ 
    comments, 
    title = 'Отзывы покупателей' 
}) => {
    if (!comments || comments.length === 0) {
        return (
            <div className="comments-list">
                <h3 className="comments-list__title">{title}</h3>
                <p className="comments-list__empty">
                    Пока нет отзывов. Будьте первым, кто оценит этот товар!
                </p>
            </div>
        );
    }

    const renderStars = (rating: number) => {
        return (
            <div className="comment-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span
                        key={star}
                        className={`comment-star ${rating >= star ? 'filled' : ''}`}
                    >
                        ★
                    </span>
                ))}
                <span className="comment-rating-number">({rating})</span>
            </div>
        );
    };

    return (
        <div className="comments-list">
            <h3 className="comments-list__title">
                {title} ({comments.length})
            </h3>
            
            <div className="comments-list__items">
                {comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                        <div className="comment-item__header">
                            <div className="comment-item__user">
                                <div className="comment-item__avatar">
                                    {comment.user.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="comment-item__username">
                                    {comment.user.name}
                                </span>
                            </div>
                            {renderStars(comment.rating)}
                        </div>
                        
                        <div className="comment-item__content">
                            <p className="comment-item__text">{comment.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};