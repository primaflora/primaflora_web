import { EditorState, RawDraftContentState } from "draft-js";

export enum TInlineStyles {
    NORMAL = 'NORMAL',
    BOLD = 'BOLD',
    ITALIC = 'ITALIC',
    UNDERLINE = 'UNDERLINE',
}

export enum TBlockTypes {
    UL = 'unordered-list-item',
    OL = 'ordered-list-item',
    H1 = 'header-one',
    H2 = 'header-two', 
    H3 = 'header-three',
    H4 = 'header-four',
    H5 = 'header-five',
    H6 = 'header-six',
    UNSTYLED = 'unstyled',
}

export type TDescriptionEditorProps = {
    onEditorChange: (r: RawDraftContentState) => void;
    defaultRawState?: RawDraftContentState;
}

// Теперь заголовки будут настраиваться через blockStyleFn, а не через inline стили
export const CustomInlineStyleMap = {
    'BOLD': {
        fontWeight: 'bold'
    },
    'ITALIC': {
        fontStyle: 'italic'
    },
    'UNDERLINE': {
        textDecoration: 'underline'
    }
}

export const CustomDefaultStyle = {
    'DEFAULT': {
        fontSize: '15px',
        fontWeight: 400,
        fontFamily: 'sans-serif',
        color: 'black',
        textDecoration: 'none',
    },
}

export const CustomStyleMap = {...CustomInlineStyleMap, ...CustomDefaultStyle};

// Функция для настройки стилей блоков (заголовков)
export const getBlockStyle = (block: any): string => {
    switch (block.getType()) {
        case 'header-one':
            return 'header-one';
        case 'header-two':
            return 'header-two';
        case 'header-three':
            return 'header-three';
        case 'header-four':
            return 'header-four';
        case 'header-five':
            return 'header-five';
        case 'header-six':
            return 'header-six';
        default:
            return '';
    }
};

// Удаляем TFontStyle, так как теперь заголовки - это block types