export type TDropdownProps = {
    title: string;
    list: TDropdownListElem[];
    onSelect: (value: TDropdownListElem) => void;
}

export type TDropdownListElem = {
    title: string;
    value: string;
}