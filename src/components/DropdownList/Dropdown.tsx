import { useState } from 'react';
import { TDropdownListElem, TDropdownProps } from './types';
import './styles.css';
import { Images } from '../../assets';

export const Dropdown = ({ title, list, onSelect }: TDropdownProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<TDropdownListElem | null>(null);

    const handleToggleDownlist = () => {
        setIsOpen(!isOpen);
    }

    const handleSelectItem = (item: TDropdownListElem) => {
        setSelectedItem(item);
        setIsOpen(false);
        onSelect(item);
    }

    return (
        <div className='dropdown-main-container'>
            <div className={`dropdown-button ${isOpen && 'dropdown-button-open'}`} onClick={handleToggleDownlist}>
                {selectedItem ? selectedItem.title : title}
                <img
                    className={`dropdown-icon ${
                        isOpen ? 'icon-rotate' : ''
                    }`}
                    src={Images.ArrowListDownIconWhite}
                    alt="down"
                />
            </div>
            { isOpen && <DropdownList list={list} onSelect={handleSelectItem} /> }
        </div>
    )
}

type TDropdownListProps = {
    list: TDropdownListElem[];
    onSelect: (value: TDropdownListElem) => void;
}

export const DropdownList = ({ list, onSelect }: TDropdownListProps) => {
    return (
        <div className='dropdown-list-main-container'>
            {
                list.map(elem => {
                    return <div 
                        key={elem.value}
                        className='dropdown-list-element'
                        onClick={() => onSelect(elem)}>
                            {elem.title}
                        </div>
                })
            }
        </div>
    )
}