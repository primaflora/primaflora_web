import React, { useState } from 'react';
import { Service } from '../../common/services';
import { useToast } from '../../common/toast';
import { Button } from '../buttons';
import { InteractiveStarRating } from '../common';
import './styles.css';

interface CommentFormProps {
    productUuid: string;
    onCommentAdded: () => void;
}

export const CommentForm: React.FC<CommentFormProps> = ({ productUuid, onCommentAdded }) => {
    const [text, setText] = useState('');
    const [rating, setRating] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { notifySuccess, notifyError } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!text.trim()) {
            notifyError('Пожалуйста, введите текст комментария');
            return;
        }

        setIsSubmitting(true);
        
        try {
            await Service.ProductService.createComment(productUuid, {
                text: text.trim(),
                rating
            });
            
            notifySuccess('Комментарий успешно добавлен!');
            setText('');
            setRating(5);
            onCommentAdded();
        } catch (error) {
            console.error('Error creating comment:', error);
            notifyError('Ошибка при добавлении комментария');
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <div className="comment-form">
            <h3 className="comment-form__title">Оставить отзыв</h3>
            <form onSubmit={handleSubmit}>
                <div className="comment-form__rating">
                    <label className="comment-form__label">Оценка:</label>
                    <InteractiveStarRating 
                        rating={rating}
                        onRatingChange={setRating}
                        size="medium"
                        disabled={isSubmitting}
                    />
                    <span className="comment-form__rating-text">{rating} из 5</span>
                </div>
                
                <div className="comment-form__text">
                    <label className="comment-form__label">Комментарий:</label>
                    <textarea
                        className="comment-form__textarea"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Поделитесь своим мнением о товаре..."
                        rows={4}
                        disabled={isSubmitting}
                        maxLength={500}
                    />
                    <div className="comment-form__counter">
                        {text.length}/500 символов
                    </div>
                </div>
                
                <Button
                    text={isSubmitting ? 'Отправляем...' : 'Отправить отзыв'}
                    onClick={() => {}}
                    type="submit"
                    filled
                    isClickable={!isSubmitting && text.trim().length > 0}
                    style={{
                        backgroundColor: '#72BF44',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '12px 24px',
                        width: '100%',
                        opacity: isSubmitting || !text.trim() ? 0.6 : 1
                    }}
                />
            </form>
        </div>
    );
};