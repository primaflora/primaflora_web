import { Images } from '../../../../../../assets';
import { Row } from '../../../../../../components/common';
import { CommentForm } from '../../../../../../components/CommentForm';
import { TCommentsSectionProps } from './types';
import { Comment } from '../Comment';
import { useUserData } from '../../../../../../store/tools';
import { Service } from '../../../../../../common/services';
import { useDispatch } from 'react-redux';
import { productSliceActions } from '../../../../../../store/modules/product/reducer';
import { useState } from 'react';
import './styles.css';

export const CommentSection = ({ comments, canComment = false }: TCommentsSectionProps) => {
    const { isAuth } = useUserData();
    const dispatch = useDispatch();
    const [currentComments, setCurrentComments] = useState(comments);
    
    // Получаем UUID продукта из store или props
    const productUuid = window.location.pathname.split('/').pop() || '';

    const handleCommentAdded = () => {
        // Обновляем данные продукта после добавления комментария
        if (productUuid) {
            Service.ProductService.getOneByUid({ uuid: productUuid }).then(res => {
                if (res.data) {
                    setCurrentComments(res.data.comments);
                    dispatch(productSliceActions.setSelectedProduct(res.data));
                }
            }).catch(err => {
                console.log('Error refetching product after comment:', err);
            });
        }
    };

    return (
        <div className="comments">
            <Row style={{ justifyContent: 'start' }}>
                <h1 className="comments-title pr-24">Відгуки</h1>
                <Row style={{ width: 'fit-content' }}>
                    <p className="small-text pr-4">{currentComments.length}</p>
                    <img src={Images.CommentIcon} alt="comment" />
                </Row>
            </Row>

            {/* Форма для добавления комментария (только для авторизованных пользователей с правом canComment) */}
            {isAuth && canComment && (
                <CommentForm 
                    productUuid={productUuid} 
                    onCommentAdded={handleCommentAdded} 
                />
            )}

            {currentComments.map(comment => (
                <Comment key={comment.uuid} comment={comment} />
            ))}
        </div>
    );
};
