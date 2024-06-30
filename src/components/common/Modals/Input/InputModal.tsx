import './styles.css';
import { TInputModalProps } from './types';

export const InputModal = ({
    title,
    type = 'text',
    placeholder,
    onChange = () => {},
    formDataFieldName = 'input',
}: TInputModalProps) => {
    return (
        <div className='input-main-container'>
            <h1 className="input-title">{title}</h1>
            <input
                className='modal-input'
                name={formDataFieldName}
                type={type}
                placeholder={placeholder}
                onChange={e => onChange(e.target.value, formDataFieldName)}
            />
        </div>
    );
};
