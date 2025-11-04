import { useEffect, useRef } from 'react';
import { Tag } from '../../../../types';
import './styles.css';
import { TagsListProps } from './types';

export const TagsList = ({ tags, currentTag, onTagSelected }: TagsListProps) => {
    const scrollToTag = (tag: Tag) => {
        const element = document.getElementById(tag.value);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }

    useEffect(() => {
        if (currentTag) {
            scrollToTag(currentTag);
        }
    }, [currentTag]);

    return (
        <div className='tags-list-container'>
            {
                tags.map(tag => (
                    <div
                        className="tag"
                        key={tag.value}
                        id={tag.value}
                        onMouseDown={(e) => {
                            e.preventDefault(); // Предотвращает blur
                            onTagSelected(tag);
                        }}>
                        <h2 
                            className={tag.value === currentTag?.value ? 'tag-selected' : ''}>
                                {tag.label}
                        </h2>
                    </div>
                ))
            }
        </div>
    )
}