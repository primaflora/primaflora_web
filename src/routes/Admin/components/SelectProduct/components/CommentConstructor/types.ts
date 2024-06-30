export type TCommentElementProps = {
    onChange: (comment: TCommentElement) => void,
    onRemove: (uuid: string) => void,
    uuid: string;
}

export type TCommentElement = {
    text: string;
    rating: string;
    uuid: string;
}

export type TCommentConstuctorProps = {
    onApply: (comments: TCommentElement[]) => void
}