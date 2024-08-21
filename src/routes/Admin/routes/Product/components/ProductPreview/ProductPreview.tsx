import { CardPreview } from '../../../../../../components/CardPreview/CardPreview';
import { StyledDraftText } from '../../../../../../components/StyledDraftText';
import './styles.css';
import { TProductPreviewProps } from './types';

export const ProductPreview = ({ card, descriptionRaw }: TProductPreviewProps) => {
    return (
        <div className='product-preview-container'>
            { 
                card 
                ? <CardPreview card={{...card, comments: 10, rating: 4}}/>
                : <div style={{ width: '100%', height: '500px', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}/>
            }
            {descriptionRaw && <StyledDraftText rawState={descriptionRaw} /> } 
        </div>
    )
}