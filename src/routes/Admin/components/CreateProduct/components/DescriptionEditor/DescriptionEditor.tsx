import { convertFromRaw, convertToRaw, DraftHandleValue, Editor, EditorState, RichUtils, SelectionState } from 'draft-js';
import { CustomStyleMap, TBlockTypes, TDescriptionEditorProps, TFontStyle, TInlineStyles } from './types';
import { useEffect, useRef, useState } from 'react';
import { Tooltip } from 'react-tooltip';
import './styles.css';
import 'react-tooltip/dist/react-tooltip.css';


export const DescriptionEditor = ({ onEditorChange, defaultRawState }: TDescriptionEditorProps) => {
    const [editorState, setEditorState] = 
        useState<EditorState>(EditorState.createEmpty());
    const [currentStyle, setCurrentStyle] = 
        useState<(TInlineStyles | TFontStyle | TBlockTypes)[]>([TInlineStyles.NORMAL]);
    const editorRef = useRef<Editor>(null);

    useEffect(() => {
        if (!defaultRawState) return;

        const contentState = convertFromRaw(defaultRawState);
        const editorState = EditorState.createWithContent(contentState);
        setEditorState(editorState);
    }, [defaultRawState]);
    
    const focusEdit = () => {
        editorRef.current?.focus();
    }

    const onEditorStateChange = (state: EditorState) => {
        setEditorState(state);
        updateCurrentStyle(state);
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

    const handleChangeCurrentStyle = (style: TInlineStyles | TFontStyle | TBlockTypes) => {
        // Remove all styles and select only TInlineStyles.NORMAL
        if (style === TInlineStyles.NORMAL) {
            setCurrentStyle([TInlineStyles.NORMAL]);
            return;
        }

        // change operation type
        if (currentStyle.includes(style)) {
            // Remove specified style if it's already selected
            setCurrentStyle(prevState => prevState.filter(value => value !== style));
        } else {
            // Add specified style if it's not selected
            setCurrentStyle(prevState => [...prevState, style]);
        }
    }

    const toggleInlineStyles = (style: TInlineStyles | TFontStyle) => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, style));
    }

    const toggleBlockType = (style: TBlockTypes) => {
        setEditorState(RichUtils.toggleBlockType(editorState, style));
        handleChangeCurrentStyle(style);
    }

    const handleButtonStyleClick = (e: React.MouseEvent<HTMLButtonElement>, style: TInlineStyles | TFontStyle) => {
        e.stopPropagation();
        handleChangeCurrentStyle(style);
        toggleInlineStyles(style);
    }

    useEffect(() => {
        console.log('Current style: ', currentStyle);
    }, [currentStyle]);

    const updateCurrentStyle = (state: EditorState) => {
        const selectionState: SelectionState = state.getSelection();
        if (selectionState.isCollapsed()) {
            const contentState = state.getCurrentContent();
            const blockKey = selectionState.getStartKey();
            const block = contentState.getBlockForKey(blockKey);
            const offset = selectionState.getStartOffset();
        
            if (offset > 0) {
                const styles: Array<string> = block.getInlineStyleAt(offset - 1).toJS();
                setCurrentStyle(styles as (TInlineStyles | TFontStyle | TBlockTypes)[]);
            } else {
                setCurrentStyle([TInlineStyles.NORMAL]);
            }
        }
    };

    return (
        <div>
            <div onClick={focusEdit} className='editor-main-container'>
                <div>
                    <div className='editor-toolbar'>
                        <button 
                            className={`toolbar-button ${currentStyle.includes(TInlineStyles.BOLD) ? 'selected' : ''}`}
                            type='button'
                            data-tooltip-id="tip"
                            data-tooltip-content="Make text BOLD (CTRL + B)"
                            onClick={(e) => handleButtonStyleClick(e, TInlineStyles.BOLD)}>
                                <b>Bold</b>
                        </button>
                        <button 
                            className={`toolbar-button ${currentStyle.includes(TInlineStyles.ITALIC) ? 'selected' : ''}`}
                            type='button' 
                            data-tooltip-id="tip"
                            data-tooltip-content="Make text ITALIC (CTRL + I)"
                            onClick={(e) => handleButtonStyleClick(e, TInlineStyles.ITALIC)}>
                                <i>Italic</i>
                            </button>
                        <button 
                            className={`toolbar-button ${currentStyle.includes(TInlineStyles.UNDERLINE) ? 'selected' : ''}`}
                            type='button' 
                            data-tooltip-id="tip"
                            data-tooltip-content="Make text UNDERLINE (CTRL + U)"
                            onClick={(e) => handleButtonStyleClick(e, TInlineStyles.UNDERLINE)}>
                                <u>Underline</u>
                            </button>
                        <button 
                            className={`toolbar-button ${currentStyle.includes(TBlockTypes.UL) ? 'selected' : ''}`}
                            type='button' 
                            data-tooltip-id="tip"
                            data-tooltip-content="Unordered list"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleBlockType(TBlockTypes.UL)
                            }}>
                                ul
                            </button>
                        <button 
                            className={`toolbar-button ${currentStyle.includes(TBlockTypes.OL) ? 'selected' : ''}`}
                            type='button' 
                            data-tooltip-id="tip"
                            data-tooltip-content="Ordered list"
                            onClick={(e) => {
                                e.stopPropagation(); 
                                toggleBlockType(TBlockTypes.OL)
                            }}>
                                ol
                        </button>
                        <button 
                            className={`toolbar-button`}
                            type='button' 
                            data-tooltip-id="tip"
                            data-tooltip-content="Click to apply current text to description"
                            onClick={(e) => {
                                e.stopPropagation(); 
                                onApplyEditorState();
                            }}>
                                Apply Text
                        </button>
                    </div>
                    <div className='editor-toolbar'>
                        <button 
                            className={`toolbar-button ${currentStyle.includes('H1') ? 'selected' : ''}`}
                            type='button' 
                            data-tooltip-id="tip"
                            data-tooltip-content="Make current text big (H1)"
                            onClick={(e) => handleButtonStyleClick(e, 'H1')}>
                                H1
                        </button>
                        <button 
                            className={`toolbar-button ${currentStyle.includes('H2') ? 'selected' : ''}`}
                            type='button' 
                            data-tooltip-id="tip"
                            data-tooltip-content="Make current text big (H2)"
                            onClick={(e) => handleButtonStyleClick(e, 'H2')}>
                                H2
                        </button>
                        <button 
                            className={`toolbar-button ${currentStyle.includes('H3') ? 'selected' : ''}`}
                            type='button' 
                            data-tooltip-id="tip"
                            data-tooltip-content="Make current text normal (H3)"
                            onClick={(e) => handleButtonStyleClick(e, 'H3')}>
                                H3
                        </button>
                        <button 
                            className={`toolbar-button ${currentStyle.includes('H4') ? 'selected' : ''}`}
                            type='button' 
                            data-tooltip-id="tip"
                            data-tooltip-content="Make current text normal (H4)"
                            onClick={(e) => handleButtonStyleClick(e, 'H4')}>
                                H4
                        </button>
                        <button 
                            className={`toolbar-button ${currentStyle.includes('H5') ? 'selected' : ''}`}
                            type='button' 
                            data-tooltip-id="tip"
                            data-tooltip-content="Make current text small (H5)"
                            onClick={(e) => handleButtonStyleClick(e, 'H5')}>
                                H5
                        </button>
                        <button 
                            className={`toolbar-button ${currentStyle.includes('H6') ? 'selected' : ''}`}
                            type='button' 
                            data-tooltip-id="tip"
                            data-tooltip-content="Make current text small (H6)"
                            onClick={(e) => handleButtonStyleClick(e, 'H6')}>
                                H6
                        </button>
                    </div>
                </div>
                <hr/>
                <div className='editor-inner-continer'>
                    <Editor 
                        ref={editorRef}
                        editorState={editorState}
                        placeholder='Type here...'
                        handleKeyCommand={onEditorCommandChange}
                        onChange={onEditorStateChange}
                        customStyleMap={CustomStyleMap}
                    />
                </div>

                <Tooltip id="tip" delayShow={1000} />
            </div>
        </div>
    );
}