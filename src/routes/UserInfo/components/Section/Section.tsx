import React, { ChangeEvent, useState } from 'react';
import './styles.css';
import { TSectionProps } from './types';
import { Row } from '../../../../components/common/Row';
import { Button } from '../../../../components/buttons';

export const Section = ({ title, content, button }: TSectionProps) => {
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [newValue, setNewValue] = useState<string>('');

    const handleUpdate = () => {
        setIsUpdate(true);
        setNewValue(content);
    }

    const handleSaveChanges = () => {
        console.log(`New ${title}: `, newValue);
        setIsUpdate(false);
        //TODO: Save new data locally and on server
        button?.onUpdate(newValue);
    } 

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setNewValue(e.target.value);
    }

    return (
        <div className="section">
            <Row style={{ justifyContent: 'space-between' }}>
                <h1 className="title">{title}</h1>
                {button && (
                    <Button
                        text={isUpdate ? "Зберегти" : button.text}
                        style={{ width: '13rem' }}
                        onClick={isUpdate ? handleSaveChanges : handleUpdate}
                    />
                )}
            </Row>
            {
                isUpdate ?
                <input value={newValue} onChange={handleTextChange}/>
                :
                <p className="content-text">{content}</p>
            }
        </div>
    );
};
