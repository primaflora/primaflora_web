import { useContext } from 'react';
import { TagsInputContext } from '../../TagsInput';
import { Tag } from '../Tag/Tag';
import './styles.css';

export const TagsViewer = () => {
    const { selectedTags } = useContext(TagsInputContext);

    return (
        <div className='tags-viewer-inner'>
            {
                selectedTags.map(tag => {
                    return <Tag key={tag.value} tag={tag}/>
                })
            }
        </div>
    )
}