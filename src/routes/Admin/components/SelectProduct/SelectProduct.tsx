import { useState } from 'react';
import { ProductSelector } from './components/ProductSelector';
import './styles.css';
import { Row } from '../../../../components/common';
import { TComment, TProduct, TProductFull } from '../../../../common/services/category/types/common';
import { Service } from '../../../../common/services';
import { CommentSection } from '../../../Product/components/ProductView/components/CommentSection';
import { CommentConstructor } from './components/CommentConstructor';
import { CardPreview } from '../../../../components/CardPreview/CardPreview';
import { TCommentElement } from './components/CommentConstructor/types';
import { useUserData } from '../../../../store/tools';
import { Button } from '../../../../components/buttons';
import { useToast } from '../../../../common/toast';

export const SelectProduct = () => {
    const { user } = useUserData();
    const { notifyError, notifySuccess } = useToast();
    const [selectedProuct, setSelectedProduct] = useState<TProductFull | null>();
    const [comments, setComments] = useState<TComment[]>([]);

    const handleSelectProduct = (product: TProduct) => {
        Service.
            ProductService
            .getOneByUid({ uuid: product.uuid })
            .then(res => {
                if (!res.data) return;

                setSelectedProduct(res.data);
                setComments(res.data.comments);
            })
    }

    const handleApply = (newComments: TCommentElement[]) => {
        const filtered = newComments.filter(comment => (comment.rating !== '' || comment.text !== ''));
        const commentsToAdd = filtered.map(comment => {
                return { ...comment , user } as TComment;
        })
        setComments(commentsToAdd);
    }

    const handleLoadComments = () => {
        if (!selectedProuct) return;

        comments.map(comment => {
            Service.ProductService.createComment({ 
                productId: selectedProuct.id,
                text: comment.text,
                rating: Number(comment.rating)  
            })
            .then(() => notifySuccess('Comment created!'))
            .catch(() => notifyError('Cannot create comment!'))
        });
    }

    const handleDelete = () => {
        if (!selectedProuct) return;

        Service.ProductService.delete({ uuid: selectedProuct.uuid })
            .then(res => notifySuccess("Product Deleted Successful"))
            .catch(err => notifyError("Failed to delete product!"));

    }

    return (
        <div className="select-product-main-container">
            <h1>Select product, to delete it or create comment</h1>
            <Row style={{ alignItems: 'start', border: '1px solid black', padding: '15px', borderRadius: '7px', marginBottom: '20px' }} >
                <div className='select-product-inner-conatiner'>
                    <ProductSelector onProductSelect={handleSelectProduct} />
                    { selectedProuct && <CommentConstructor onApply={handleApply} /> }
                </div>

                {selectedProuct && (
                    <div className='select-product-preview'>
                        <CardPreview card={selectedProuct}/> 
                        <CommentSection comments={comments} />
                    </div>
                )}
            </Row>

            <Row style={{ gap: '15px' }}>
                { comments.length !== 0 && <Button text='Load Comments!' onClick={handleLoadComments} /> }
                { selectedProuct && <Button 
                                        backgroundColor='red'
                                        text='Delete Product!'
                                        onClick={handleDelete} 
                                     /> 
                }
            </Row> 
        </div>
    )
}
