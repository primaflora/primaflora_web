import { Tag } from "../../../../types"

export type TagsListProps = {
    tags: Tag[]
    currentTag?: Tag;
    onTagSelected: (tag: Tag) => void;
}