import React, { ChangeEvent, useState } from 'react';
import { Images } from '../../../../assets';
import './styles.css';
import { TPanelBodyProps, TPanelButtonProps, TPanelCheckboxProps, TPanelContainerProps, TPanelFormInputProps, TPanelFormProps, TPanelHeaderProps, TPanelInputProps, TPanelLink, TPanelListActionRowProps, TPanelListProps, TPanelNotificationProps, TPanelSortTypeSelectorProps, TPanelTipProps, TPanelTitleProps, TSortType } from './types';
import { Link as RouterLink } from 'react-router-dom';
import { Panel } from '.';

export const Container = ({ style, children }: TPanelContainerProps) => {
    return (
        <div className='panel-container' style={style}>
            {children}
        </div>
    );
}

export const Header = ({ title, style, children }: TPanelHeaderProps) => {
    return (
        <div className='panel-header-container' style={style}>
            <h1 className='panel-header-text'>{title}</h1>
            {children}
        </div>
    );
}

export const Body = ({ style, children }: TPanelBodyProps) => {
    return (
        <div className='panel-main-container' style={style}>
            {children}
        </div>
    );
}

/**
 * Renders the body of the panel component. 
 * The body is a form that can contain child components and a submit event handler.
 *
 * @param {Object} props - The properties for the component.
 * @param {Object} props.style - The style object for the component.
 * @param {React.ReactNode} props.children - The children to be rendered inside the component.
 * @param {(e: React.FormEvent<HTMLFormElement>) => void} props.onSubmit - The submit event handler for the form.
 * @return {JSX.Element} The rendered panel body.
 */
export const Form = ({ style, children, onSubmit }: TPanelFormProps) => {
    return (
        <form className='panel-form-container' style={style} onSubmit={onSubmit}>
            {children}
        </form>
    );
}

export const Tip = ({ style,  children }: TPanelTipProps) => {
    return (
        <div className='panel-tip-container' style={style}>
            <img src={Images.LightbublIcon} alt="Tip" />
            <h1 className='panel-tip-text'>{children}</h1>
        </div>
    );
}

export const Notification = ({ style,  children, onRemove }: TPanelNotificationProps) => {
    return (
        <div className='panel-notification-container' style={style}>
            <h1 className='panel-notification-text'>{children}</h1>
            <button onClick={onRemove}>
                <img width={10} height={10} src={Images.CrossIcon} />
            </button>
        </div>
    );
}

export const Input = ({ inputName, placeholder, style, defaultValue, onTextChange, type = 'text' }: TPanelInputProps) => {
    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (onTextChange) onTextChange(e.target.value);
    }
    
    return (
        <input
            required
            defaultValue={defaultValue}
            name={inputName}
            type={type}
            style={style}
            className='panel-input'
            onChange={handleTextChange}
            placeholder={placeholder}
        />
    );
}

export const FormInput = ({ style, title, defaultValue, onTextChange, name, type = 'text', isTextArea = false }: TPanelFormInputProps) => {
    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        if (onTextChange) onTextChange(e.target.value);
    }
    
    return (
        <div className='panel-form-input-container' style={style}>
            <h1>{title}</h1>
            {
                isTextArea 
                ? <textarea 
                    defaultValue={defaultValue} 
                    className='panel-form-input-textarea' 
                    onChange={handleTextChange}
                    placeholder='' 
                    rows={5} 
                    name={name ? name : title} /> 
                : <Input 
                    placeholder='' 
                    onTextChange={onTextChange}
                    defaultValue={defaultValue} 
                    inputName={name ? name : title} 
                    type={type}  />
            }
        </div>
    );
}

/**
 * @typedef {"submit" | "reset" | "button"} ButtonType
 * 
 * Renders a button component with the specified text, type, and click event handler.
 * To make ```<Panel.Body>``` ( that works like ```<form>```) work, you must pass a 'submit' to ```{type}```.
 *
 * @param {Object} props - The properties for the button.
 * @param {string} props.text - The text to display on the button.
 * @param {boolean} props.small - Render the button as a small one (false is default).
 * @param {boolean} props.isFilled - Render the button with a filled background or not (True is default).
 * @param {ButtonType} [props.type='button'] - The type of the button.
 * @param {Function} props.onClick - The click event handler for the button.
 * @return {JSX.Element} The rendered button component.
 */
export const Button = ({ text, type = 'button', style, small = false, isFilled = true, onClick }: TPanelButtonProps) => {
    return (
        <button 
            type={type} 
            style={style}
            className={`panel-button 
                ${small ? 'panel-button-small' : ''} 
                ${isFilled ? '' : 'panel-button-unfilled'}`} 
            onClick={onClick} >
            <h1 className='panel-button-text text-white'>{text}</h1>
        </button>
    );
}

export const Link = ({ text, to }: TPanelLink) => {
    return (
        <RouterLink to={to} className='panel-link'>{text}</RouterLink>
    );
}

export const Checkbox = ({ label, state, onChange }: TPanelCheckboxProps) => {
    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.checked);
    }

    return (
        <div className='panel-checkbox-container'>
            <input type="checkbox" checked={state} className='panel-checkbox' name={label && 'checkbox'} onChange={handleCheckboxChange}/>
            {/* <img src={Images.CheckmarkIcon} alt='checkmark' className='panel-checkmark' /> */}
            {label && <label htmlFor={label} >{label}</label>}
        </div>
    );
}

export const Title = ({ text }: TPanelTitleProps) => {
    return (
        <h1 className='panel-title'>{text}</h1>
    );
}

export const SortTypeSelector = ({onSortChange}: TPanelSortTypeSelectorProps) => {
    const [state, setState] = useState<TSortType>('ASC');
    
    const handleSelectorChange = (newState: TSortType) => {
        setState(newState);
        onSortChange(newState);
    }

    return (
        <div className='panel-sort-type-selector-container'>
            <div 
                className={`panel-sort-triangle triangle-up ${state === 'ASC' ? 'sort-selector-active-up' : ''}`} 
                onClick={() => handleSelectorChange('ASC')}/>
            <div 
                className={`panel-sort-triangle triangle-down ${state === 'DESC' ? 'sort-selector-active-down' : ''}`} 
                onClick={() => handleSelectorChange('DESC')}/>
        </div>
    );
}

/**
 * Renders a list component with dynamic headers and data.
 *
 * @param {boolean} isLoading - Flag to indicate if data is loading
 * @param {Array<{ label: string, value: string }>} header - Array of header labels and values
 * @param {number[]} headersWidth - Array of header widths in percentage
 * @param {T[]} data - Array of data elements
 * @param {(sortBy: string, sortType: TSortType) => void} onSortChange - Function to handle sorting
 * @param {(checked: boolean, index: number) => void} onCheckmarkUpdate - Function to handle checkmark update
 * @param {(entry: T, index: number) => React.ReactNode} children - Function to render children elements
 * @return {React.ReactNode} The JSX element representing the list component
 */
export const List = <T,>({ 
    isLoading, 
    header, 
    headersWidth,
    data,
    onSortChange, 
    onCheckmarkUpdate, 
    children 
}: TPanelListProps<T>) => {
    const getCurrentWidth = (index: number) => {
        return headersWidth?.find(elem => elem.columnIndex === index);
    }

    return (
        <table className='panel-list'>
            <thead>
                <tr>
                    <th style={{ paddingLeft: '10px' }}><Checkbox onChange={onCheckmarkUpdate} /></th>
                    {header.map((elem, index) => {
                        const currentWidth = getCurrentWidth(index);

                        return (
                            <th 
                                key={elem.label} 
                                style={ currentWidth && { 
                                    width: `${currentWidth.widthPercent}%`,
                                }}>
                                <div className='panel-list-header-elem-container'>
                                    <button 
                                        className='panel-list-header-button' 
                                        onClick={() => onSortChange(elem.value, 'ASC')}>{elem.label}</button>
                                    <SortTypeSelector 
                                        onSortChange={(sortType) => onSortChange(elem.value, sortType)} />
                                </div>
                            </th>
                        );
                    })}
                </tr>
            </thead>
            <tbody>
            {isLoading ? (
                            <div>
                                <h1>Loading...</h1>
                            </div>
                        ) : (
                            data.map((entry, index) => (
                            <React.Fragment key={index}>
                                {children(entry, index)}
                            </React.Fragment>
                            ))
                        )}
            </tbody>
        </table>
    );
}

export const TableActionList = ({ style, options, onApply }: TPanelListActionRowProps) => {
    const [selected, setSelected] = 
        useState<{ label: string, value: string }>({ label: 'Bulk Action', value: '-' });

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        if (event.target.value === '-') {
            return;
        }

        const newValue = event.target.value as string;
        const newOption = options.find(elem => elem.value === newValue) as { label: string, value: string };
        setSelected(newOption);
    }

    return (
        <div style={style}>
            <select value={selected?.value} onChange={handleSelectChange} style={{ height: '32px' }}>
                <option value={'-'}>Bulk Action</option>
                {
                    options.map(elem => <option value={elem.value}>{elem.label}</option>)
                }
            </select>
            <Panel.Button text={'Apply'} small isFilled={false} onClick={() => onApply(selected)} />
        </div>
    );
}