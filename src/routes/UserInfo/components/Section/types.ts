export type TSectionProps = {
    title: string;
    content: string;
    button?: TButtonProps;
};

export type TButtonProps = {
    text: string;
    onClick: () => void;
};
