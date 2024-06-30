export type DescriptionElementType = { key: string, value: string, uuid: string };
export type TDescriptionConstructorElementProps = {
    uuid: string;
    onRemove: () => void;
    onChange: (data: DescriptionElementType) => void;
}

export type TDescriptionConstructorProps = {
    onApply: (data: DescriptionElementType[]) => void;
}