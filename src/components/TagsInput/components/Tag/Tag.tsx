import { TagProps } from './types';
import './styles.css';
import { Images } from '../../../../assets';
import { useContext } from 'react';
import { TagsInputContext } from '../../TagsInput';

export const Tag = ({ tag }: TagProps) => {
    const { removeTag } = useContext(TagsInputContext);

    return (
        <div className='tag-elem-container'>
            <h1 className='tag-title'>{tag.label}</h1>
            <button onClick={() => removeTag(tag)}><img src={Images.CrossWhiteIcon} /></button>
        </div>
    );
};
