export type TPanelAbstractProps = {
    children?: React.ReactNode,
    style?: React.CSSProperties,
}

export type TPanelContainerProps = TPanelAbstractProps;
export type TPanelBodyProps = TPanelAbstractProps;
export type TPanelTipProps = TPanelAbstractProps;

export type TPanelNotificationProps = {
    onRemove?: () => void;
} & TPanelAbstractProps;

export type TPanelHeaderProps = {
    title: string;
} & TPanelAbstractProps;

export type TPanelFormProps = {
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void,
} & TPanelAbstractProps;


export type TPanelInputProps = {
    inputName: string | undefined;
    placeholder: string;
    defaultValue?: string | number | undefined;
    style?: React.CSSProperties,
    type?: React.HTMLInputTypeAttribute;
    onTextChange?: (text: string) => void;
}

export type TPanelFormInputProps = {
    title: string;
    defaultValue?: string | number | undefined;
    type?: React.HTMLInputTypeAttribute;
    isTextArea?: boolean;
    style?: React.CSSProperties;
    name?: string;
    onTextChange?: (text: string) => void;
}

export type TPanelButtonProps = {
    text: string;
    type?: "submit" | "reset" | "button";
    small?: boolean; 
    isFilled?: boolean;
    style?: React.CSSProperties;
    onClick?: () => void;
}

export type TPanelLink = {
    text: string;
    to: string;
}

export type TPanelCheckboxProps = {
    label?: string;
    state?: boolean;
    onChange: (checked: boolean) => void;
}

export type TPanelTitleProps = {
    text: string;
}

export type TSortType = 'ASC' | 'DESC';
export type TPanelSortTypeSelectorProps = {
    onSortChange: (sortType: TSortType) => void;
}
export type THeaderElem = { label: string, value: string };
export type TPanelListProps<T> = {
    isLoading?: boolean;
    header: Array<THeaderElem>;
    data: Array<T>;
    headersWidth?: Array<{columnIndex: number, widthPercent: number}>;
    onSortChange: (sortBy: string, sortType: TSortType) => void;
    onCheckmarkUpdate: (checked: boolean) => void;
    children: (entry: T, index: number) => React.ReactNode;
}
export type TPanelListActionRowProps = {
    style?: React.CSSProperties;
    options: Array<{ label: string, value: string }>;
    onApply: (selected: { label: string, value: string }) => void;
}