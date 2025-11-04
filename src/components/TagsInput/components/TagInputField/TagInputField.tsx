import { useContext, useEffect, useState, useRef } from 'react';
import './styles.css';
import { TagInputFieldProps } from './types';
import { TagsList } from './components/TagsList';
import { Tag } from '../../types';
import { TagsInputContext } from '../../TagsInput';

export const TagInputField = ({ tags }: TagInputFieldProps) => {
    const [text, setText] = useState<string>('');
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [suggestedTags, setSuggestedTags] = useState<Tag[]>(tags);
    const [currentTag, setCurrentTag] = useState<Tag>(); // needed for list navigation by arrows
    const { selectTag } = useContext(TagsInputContext);
    const isMouseOverList = useRef(false);

    const handleTextChange = (newText: string) => {
        setText(newText);
        updateSuggestedTags(newText);

        if (newText.length > 0) {
            setShowSuggestions(true);
        } else {
            // Если текст пустой, но поле в фокусе, показываем все категории
            setSuggestedTags(tags);
            setShowSuggestions(true);
            setCurrentTag(undefined);
        }
    }

    const handleSubmitInput = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // select first suggested tag
        if (text.length > 0) {
            setText('');
            setShowSuggestions(false);
            selectTag(currentTag ? currentTag : suggestedTags[0]);
            setCurrentTag(undefined);
        }
    }

    const handleTagListSelected = (tag: Tag) => {
        setText('');
        setShowSuggestions(false);
        selectTag(tag);
        setCurrentTag(undefined);
    }

    const handleFocus = () => {
        // При фокусе показываем все доступные категории
        setSuggestedTags(tags);
        setShowSuggestions(true);
    }

    const handleBlur = () => {
        // Задержка, чтобы клик по элементу списка успел обработаться
        setTimeout(() => {
            // Скрываем список только если мышь не над ним
            if (!isMouseOverList.current) {
                setShowSuggestions(false);
                setCurrentTag(undefined);
            }
        }, 100);
    }

    // for list navigation by arrows
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.key) {
            case 'ArrowUp': {
                e.preventDefault();
                if (currentTag) {
                    // if user pressed ArrowUp and he already selected a tag -> go to tag - 1
                    const index = suggestedTags.indexOf(currentTag);
                    if (index > 0) {
                        setCurrentTag(suggestedTags[index - 1]);
                    }
                } else {
                    // if user pressed ArrowUp, but he didnt pick any tag -> select first one
                    setCurrentTag(suggestedTags[0]);
                }
                break;
            }
            case 'ArrowDown': {
                e.preventDefault();
                if (currentTag) {
                    const index = suggestedTags.indexOf(currentTag);
                    if (index < suggestedTags.length - 1) {
                        // if user pressed ArrowUp and he already selected a tag -> go to tag + 1
                        setCurrentTag(suggestedTags[index + 1]);
                    }
                } else {
                    // if user pressed ArrowUp, but he didnt pick any tag -> select first one
                    setCurrentTag(suggestedTags[0]);
                }
                break;
            }
        }
    }

    const updateSuggestedTags = (filterText: string) => {
        filterText = filterText.trim();
        
        if (filterText.length === 0) {
            // Если текст пустой, показываем все категории
            setSuggestedTags(tags);
            return;
        }

        const filteredTags = tags.filter(tag => tag.label.toLowerCase().includes(filterText.toLowerCase()));

        if (filteredTags.length > 0) {
            setSuggestedTags(filteredTags);
        } else {
            setSuggestedTags(tags);
        }
    }

    return (
        <form onSubmit={handleSubmitInput}>
            <input 
                type="text" 
                name='tag-input'
                className="tags-custom-input"
                value={text} 
                onChange={e => handleTextChange(e.target.value)} 
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder='Enter your tag'/>
            
            {
                showSuggestions && (
                    <div
                        onMouseEnter={() => { isMouseOverList.current = true; }}
                        onMouseLeave={() => { isMouseOverList.current = false; }}
                    >
                        <TagsList
                            tags={suggestedTags}
                            currentTag={currentTag}
                            onTagSelected={handleTagListSelected}
                        />
                    </div>
                )
            }
        </form>
    )
}