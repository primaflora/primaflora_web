import { convertFromRaw, convertToRaw, DraftHandleValue, Editor, EditorState, RichUtils, SelectionState } from 'draft-js';
import { CustomStyleMap, TBlockTypes, TDescriptionEditorProps, TInlineStyles, getBlockStyle } from './types';
import { useEffect, useRef, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import './styles.css';
import 'react-tooltip/dist/react-tooltip.css';


export const DescriptionEditor = ({ onEditorChange, defaultRawState }: TDescriptionEditorProps) => {
    const [editorState, setEditorState] = 
        useState<EditorState>(() => {
            const emptyState = EditorState.createEmpty();
            return emptyState;
        });
    const [currentStyle, setCurrentStyle] = 
        useState<(TInlineStyles | TBlockTypes)[]>([TInlineStyles.NORMAL]);
    const [currentBlockType, setCurrentBlockType] = 
        useState<TBlockTypes>(TBlockTypes.UNSTYLED);
    const editorRef = useRef<Editor>(null);

    useEffect(() => {
        if (!defaultRawState) return;

        const contentState = convertFromRaw(defaultRawState);
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
        updateCurrentStyle(editorState);
        updateCurrentBlockType(editorState);
    }, [defaultRawState]);
    
    const focusEdit = () => {
        editorRef.current?.focus();
    }

    const onEditorStateChange = (state: EditorState) => {
        setEditorState(state);
        updateCurrentStyle(state);
        updateCurrentBlockType(state);
    }

    const onApplyEditorState = () => {
        onEditorChange(convertToRaw(editorState.getCurrentContent()));
    }

    const onEditorCommandChange = (command: string, editorState: EditorState): DraftHandleValue =>  {
        const newState = RichUtils.handleKeyCommand(editorState, command);

        if (newState) {
            setEditorState(newState);
            return 'handled';
        }

        return 'not-handled';
    }

    const handleChangeCurrentStyle = (style: TInlineStyles | TBlockTypes) => {
        // Эта функция больше не нужна, так как состояние обновляется автоматически
        // через updateCurrentStyle при изменении editorState
    }

    const toggleInlineStyles = (style: TInlineStyles) => {
        const newEditorState = RichUtils.toggleInlineStyle(editorState, style);
        setEditorState(newEditorState);
    }

    const toggleBlockType = (style: TBlockTypes) => {
        const newEditorState = RichUtils.toggleBlockType(editorState, style);
        setEditorState(newEditorState);
    }

    const handleButtonStyleClick = (e: React.MouseEvent<HTMLButtonElement>, style: TInlineStyles) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Применяем стиль
        const newEditorState = RichUtils.toggleInlineStyle(editorState, style);
        setEditorState(newEditorState);
        
        // Не принуждаем фокус - пусть Draft.js сам управляет состоянием
    }

    const handleBlockButtonClick = (e: React.MouseEvent<HTMLButtonElement>, blockType: TBlockTypes) => {
        e.preventDefault();
        e.stopPropagation();
        
        const newEditorState = RichUtils.toggleBlockType(editorState, blockType);
        setEditorState(newEditorState);
        
        // Принудительно обновляем состояние кнопок
        setTimeout(() => {
            updateCurrentBlockType(newEditorState);
        }, 0);
    }

    useEffect(() => {
        console.log('Current style: ', currentStyle);
        console.log('Current block type: ', currentBlockType);
    }, [currentStyle, currentBlockType]);

    const updateCurrentStyle = (state: EditorState) => {
        // Получаем текущие inline стили для курсора/выделения
        const inlineStyle = state.getCurrentInlineStyle();
        
        // Обновляем только inline стили (Bold, Italic, Underline)
        const activeInlineStyles: TInlineStyles[] = [];
        if (inlineStyle.has(TInlineStyles.BOLD)) activeInlineStyles.push(TInlineStyles.BOLD);
        if (inlineStyle.has(TInlineStyles.ITALIC)) activeInlineStyles.push(TInlineStyles.ITALIC);
        if (inlineStyle.has(TInlineStyles.UNDERLINE)) activeInlineStyles.push(TInlineStyles.UNDERLINE);
        
        if (activeInlineStyles.length === 0) {
            setCurrentStyle([TInlineStyles.NORMAL]);
        } else {
            setCurrentStyle(activeInlineStyles as (TInlineStyles | TBlockTypes)[]);
        }
    };

    const updateCurrentBlockType = (state: EditorState) => {
        const selectionState: SelectionState = state.getSelection();
        const contentState = state.getCurrentContent();
        const blockKey = selectionState.getStartKey();
        const block = contentState.getBlockForKey(blockKey);
        const blockType = block.getType();
        
        // Убеждаемся, что тип блока валидный
        let validBlockType: TBlockTypes;
        switch (blockType) {
            case 'header-one':
                validBlockType = TBlockTypes.H1;
                break;
            case 'header-two':
                validBlockType = TBlockTypes.H2;
                break;
            case 'header-three':
                validBlockType = TBlockTypes.H3;
                break;
            case 'header-four':
                validBlockType = TBlockTypes.H4;
                break;
            case 'header-five':
                validBlockType = TBlockTypes.H5;
                break;
            case 'header-six':
                validBlockType = TBlockTypes.H6;
                break;
            case 'unordered-list-item':
                validBlockType = TBlockTypes.UL;
                break;
            case 'ordered-list-item':
                validBlockType = TBlockTypes.OL;
                break;
            case 'unstyled':
            default:
                validBlockType = TBlockTypes.UNSTYLED;
                break;
        }
        
        setCurrentBlockType(validBlockType);
    };

    return (
        <div>
            <div onClick={focusEdit} className='editor-main-container'>
                <div>
                    <div className='editor-toolbar'>
                        <button 
                            className={`toolbar-button ${editorState.getCurrentInlineStyle().has(TInlineStyles.BOLD) ? 'selected' : ''}`}
                            type='button'
                            data-tooltip-id="tip"
                            data-tooltip-content="Make text BOLD (CTRL + B)"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => handleButtonStyleClick(e, TInlineStyles.BOLD)}>
                                <b>Bold</b>
                        </button>
                        <button 
                            className={`toolbar-button ${editorState.getCurrentInlineStyle().has(TInlineStyles.ITALIC) ? 'selected' : ''}`}
                            type='button' 
                            data-tooltip-id="tip"
                            data-tooltip-content="Make text ITALIC (CTRL + I)"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => handleButtonStyleClick(e, TInlineStyles.ITALIC)}>
                                <i>Italic</i>
                            </button>
                        <button 
                            className={`toolbar-button ${editorState.getCurrentInlineStyle().has(TInlineStyles.UNDERLINE) ? 'selected' : ''}`}
                            type='button' 
                            data-tooltip-id="tip"
                            data-tooltip-content="Make text UNDERLINE (CTRL + U)"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => handleButtonStyleClick(e, TInlineStyles.UNDERLINE)}>
                                <u>Underline</u>
                            </button>
                        <button 
                            className={`toolbar-button ${currentBlockType === TBlockTypes.UL ? 'selected' : ''}`}
                            type='button' 
                            data-tooltip-id="tip"
                            data-tooltip-content="Unordered list"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => handleBlockButtonClick(e, TBlockTypes.UL)}>
                                ul
                            </button>
                        <button 
                            className={`toolbar-button ${currentBlockType === TBlockTypes.OL ? 'selected' : ''}`}
                            type='button' 
                            data-tooltip-id="tip"
                            data-tooltip-content="Ordered list"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => handleBlockButtonClick(e, TBlockTypes.OL)}>
                                ol
                        </button>
                        <button 
                            className={`toolbar-button`}
                            type='button' 
                            data-tooltip-id="tip"
                            data-tooltip-content="Click to apply current text to description"
                            onMouseDown={(e) => {
                                e.preventDefault(); // Предотвращаем потерю фокуса
                            }}
                            onClick={(e) => {
                                e.stopPropagation(); 
                                onApplyEditorState();
                            }}>
                                Apply Text
                        </button>
                    </div>
                    <div className='editor-toolbar'>
                        <button 
                            className={`toolbar-button ${currentBlockType === TBlockTypes.UNSTYLED ? 'selected' : ''}`}
                            type='button' 
                            data-tooltip-id="tip"
                            data-tooltip-content="Normal text"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => handleBlockButtonClick(e, TBlockTypes.UNSTYLED)}>
                                Normal
                        </button>
                        <button 
                            className={`toolbar-button ${currentBlockType === TBlockTypes.H1 ? 'selected' : ''}`}
                            type='button' 
                            data-tooltip-id="tip"
                            data-tooltip-content="Make current text big (H1)"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => handleBlockButtonClick(e, TBlockTypes.H1)}>
                                H1
                        </button>
                        <button 
                            className={`toolbar-button ${currentBlockType === TBlockTypes.H2 ? 'selected' : ''}`}
                            type='button' 
                            data-tooltip-id="tip"
                            data-tooltip-content="Make current text big (H2)"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => handleBlockButtonClick(e, TBlockTypes.H2)}>
                                H2
                        </button>
                        <button 
                            className={`toolbar-button ${currentBlockType === TBlockTypes.H3 ? 'selected' : ''}`}
                            type='button' 
                            data-tooltip-id="tip"
                            data-tooltip-content="Make current text normal (H3)"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => handleBlockButtonClick(e, TBlockTypes.H3)}>
                                H3
                        </button>
                        <button 
                            className={`toolbar-button ${currentBlockType === TBlockTypes.H4 ? 'selected' : ''}`}
                            type='button' 
                            data-tooltip-id="tip"
                            data-tooltip-content="Make current text normal (H4)"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => handleBlockButtonClick(e, TBlockTypes.H4)}>
                                H4
                        </button>
                        <button 
                            className={`toolbar-button ${currentBlockType === TBlockTypes.H5 ? 'selected' : ''}`}
                            type='button' 
                            data-tooltip-id="tip"
                            data-tooltip-content="Make current text small (H5)"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => handleBlockButtonClick(e, TBlockTypes.H5)}>
                                H5
                        </button>
                        <button 
                            className={`toolbar-button ${currentBlockType === TBlockTypes.H6 ? 'selected' : ''}`}
                            type='button' 
                            data-tooltip-id="tip"
                            data-tooltip-content="Make current text small (H6)"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => handleBlockButtonClick(e, TBlockTypes.H6)}>
                                H6
                        </button>
                    </div>
                </div>
                <div style={{ 
                    height: '1px', 
                    backgroundColor: '#e0e0e0', 
                    margin: '15px 0',
                    width: '100%'
                }} />
                <div className='editor-inner-continer'>
                    <Editor 
                        ref={editorRef}
                        editorState={editorState}
                        placeholder='Type here...'
                        handleKeyCommand={onEditorCommandChange}
                        onChange={onEditorStateChange}
                        customStyleMap={CustomStyleMap}
                        blockStyleFn={getBlockStyle}
                    />
                </div>

                <Tooltip id="tip" delayShow={1000} />
            </div>
        </div>
    );
}