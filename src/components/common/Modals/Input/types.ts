export type TInputModalProps = {
    title: string;
    placeholder: string;
    type?: string;
    formDataFieldName?: string;
    onChange?: (value: string, fieldName: string) => void;
    width?: string;
};
