export type Tag = {
    value: string;
    label: string;
}

export type TagInputProps = {
    tags: Tag[];
    selectedTags: Tag[];
    onTagAdd: (tags: Tag) => void;
    onTagRemove: (tag: Tag) => void;
}

export type TagsInputContextProps = {
    selectedTags: Tag[];
    removeTag: (tag: Tag) => void;
    selectTag: (tag: Tag) => void;
}