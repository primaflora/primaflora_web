import { useEffect, useState } from 'react';
import { Row } from '../../../../../../components/common';
import { Images } from '../../../../../../assets';
import { TCommentConstuctorProps, TCommentElement, TCommentElementProps } from './types';
import { InputModal } from '../../../../../../components/common/Modals/Input/InputModal';
import { v4 as uuidv4 } from 'uuid';
import './styles.css';
import { Button } from '../../../../../../components/buttons';

export const CommentConstructor = ({ onApply }: TCommentConstuctorProps) => {
    const [comments, setComments] = useState<TCommentElement[]>([]);

    const handleAddRow = () => {
        setComments(prevState => [ ...prevState, { text: '', rating: '', uuid: uuidv4() } as TCommentElement ]);
    }

    const handleRemoveRow = (uuid: string) => {
        setComments(prevState => prevState.filter(comment => comment.uuid !== uuid));
    }

    const handleChange = (changes: TCommentElement) => {
        setComments(prevState => prevState.map((value, key) => {
            if (value.uuid !== changes.uuid) return value;

            return changes;
        }));
    }

    const handleApply = () => {
        onApply(comments);
    }

    return (
        <div className='comment-constructor-main-container'>
            <Row>
                <h1>Comment Constructor</h1>
                <button 
                    type='button' 
                    className='add-row-description-constructor'
                    onClick={handleAddRow}
                >
                    +
                </button>
            </Row>
            <div className="comment-constructor-inner-container">
                {
                    comments.map(comment => {
                        return <CommentConstructorElement 
                                    key={comment.uuid}
                                    uuid={comment.uuid}
                                    onRemove={handleRemoveRow}
                                    onChange={handleChange}/>
                    })
                }
            </div>
            <Button text='Apply' onClick={handleApply} />
        </div>
    )
}

export type TCommentConstructorElementProps = {

}
const CommentConstructorElement = ({ uuid, onChange, onRemove }: TCommentElementProps) => {
    const [data, setData] = useState<TCommentElement>({ 
        text: '',
        rating: '', 
        uuid 
    });

    useEffect(() => {
        onChange(data);
    }, [data]);

    const handleChange = (value: string, type: 'text' | 'rating') => {
        setData(prevState => ({ ...prevState, [type]: value } as TCommentElement));
    } 

    return (
        <div className='comment-constructor-element'>
            <button className='trash-button' type='button' onClick={() => onRemove(uuid)}>
                <img src={Images.TrashIcon} alt='remove'/>
            </button>
            <div className='w-[30%]'>
                <InputModal title='Rating' placeholder='5, 4, 3, 2, 1' onChange={(value) => handleChange(value, 'rating')} />
            </div>
            <div className='w-[70%]'>
                <InputModal title='Value' placeholder='Комментарій' onChange={(value) => handleChange(value, 'text')} />
            </div>
        </div>
    )
}