import { createContext, useEffect, useState } from 'react';
import { TagInputField } from './components/TagInputField';
import { Tag, TagInputProps, TagsInputContextProps } from './types';
import './styles.css';
import { TagsViewer } from './components/TagsViewer';

export const TagsInputContext = createContext<TagsInputContextProps>({
    selectedTags: [],
    removeTag: () => {},
    selectTag: () => {}
});

export const TagsInput = ({ tags, selectedTags, onTagAdd, onTagRemove }: TagInputProps) => {
    const selectTag = (tag: Tag) => {
        if (selectedTags.find(t => t.value === tag.value)) {
            return;
        }
        onTagAdd(tag);
    }

    const removeTag = (tag: Tag) => {
        onTagRemove(tag);
    }

    return (
        <TagsInputContext.Provider value={{ 
            selectedTags, 
            removeTag, 
            selectTag 
            }}>
            <div style={{ width: '100%' }}>
                <div className='tags-input-container'>
                    <TagInputField tags={tags}/>
                </div>
                <div className='tags-viewer-container'>
                    <TagsViewer/>
                </div>
            </div>
        </TagsInputContext.Provider>
    )
}