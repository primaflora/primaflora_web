export type TDropdownProps = {
    title: string;
    list: TDropdownListElem[];
    multiSelect?: boolean;
    onSelect: (value: TDropdownListElem) => void;
}

export type TDropdownListElem = {
    title: string;
    value: string;
}