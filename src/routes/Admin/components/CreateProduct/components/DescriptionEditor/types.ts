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
}

export type TDescriptionEditorProps = {
    onEditorChange: (r: RawDraftContentState) => void;
    defaultRawState?: RawDraftContentState;
}

export const CustomFontStyleMap = {
    'H6': {
        fontSize: '11px',
        fontWeight: 700
    },
    'H5': {
        fontSize: '13px',
        fontWeight: 700
    },
    'H4': {
        fontSize: '17px',
        fontWeight: 700
    },
    'H3': {
        fontSize: '20px',
        fontWeight: 700
    },
    'H2': {
        fontSize: '23px',
        fontWeight: 700
    },
    'H1': {
        fontSize: '26px',
        fontWeight: 700
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

export const CustomStyleMap = {...CustomFontStyleMap, ...CustomDefaultStyle};

export type TFontStyle = 'H1' | 'H2' | 'H3' | 'H4' | 'H5' | 'H6'