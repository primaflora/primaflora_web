import { Images } from '../../../../../../assets';
import { InputModal } from '../../../../../../components/common/Modals/Input/InputModal';
import { useEffect, useState } from 'react';
import { Row } from '../../../../../../components/common';
import './styles.css';
import { Button } from '../../../../../../components/buttons';
import { DescriptionElementType, TDescriptionConstructorElementProps, TDescriptionConstructorProps } from './types';
import { v4 as uuidv4 } from 'uuid';

export const DescriptionConstructor = ({ onApply }: TDescriptionConstructorProps) => {
    const [description, setDescription] = useState<DescriptionElementType[]>([]);

    const handleApply = () => {
        onApply(description)   
    }

    const handleAddRow = () => {
        setDescription(prevState => ([ ...prevState, { key: '', value: '', uuid: uuidv4() } ]))
    }

    const handleRemoveRow = (uuid: string) => {
        setDescription(prevState => prevState.filter(elem => elem.uuid !== uuid));
    }

    const handleChange = (changes: DescriptionElementType) => {
        setDescription(prevState => prevState.map((value, key) => {
            if (value.uuid !== changes.uuid) return value;

            return changes;
        }));
    }

    return (
        <div className='description-constructor-main-container'>
            <Row>
                <h1>Description Constructor</h1>
                <button 
                    type='button' 
                    className='add-row-description-constructor'
                    onClick={handleAddRow}
                >
                    +
                </button>
            </Row>
            <div>
                {
                    description.map(desc => (
                        <DescriptionConstructorElement 
                            key={desc.uuid}
                            uuid={desc.uuid}
                            onRemove={() => handleRemoveRow(desc.uuid)}
                            onChange={handleChange}
                        />
                    ))
                }
            </div>
            { description.length !== 0 ? <Button text='Apply' onClick={handleApply} /> : null}
        </div>
    )
}

const DescriptionConstructorElement = ({ uuid, onChange, onRemove }: TDescriptionConstructorElementProps) => {
    const [data, setData] = useState<DescriptionElementType>({ key: '', value: '', uuid });

    useEffect(() => {
        onChange(data);
    }, [data]);

    const handleChange = (value: string, type: 'value' | 'key') => {
        setData(prevState => ({ ...prevState, [type]: value } as DescriptionElementType));
    } 

    return (
        <div className='description-constructor-element'>
            <button className='trash-button' type='button' onClick={onRemove}>
                <img src={Images.TrashIcon} alt='remove'/>
            </button>
            <div className='w-[30%]'>
                <InputModal title='Key' placeholder='Склад' onChange={(value) => handleChange(value, 'key')} />
            </div>
            <div className='w-[70%]'>
                <InputModal title='Value' placeholder='віск бджолиний, комплекс ефірних олій...' onChange={(value) => handleChange(value, 'value')} />
            </div>
        </div>
    )
}