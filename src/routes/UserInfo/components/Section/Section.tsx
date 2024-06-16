import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import './styles.css';
import { TSectionProps } from './types';
import { Row } from '../../../../components/common/Row';
import { Button } from '../../../../components/buttons';
import { useToast } from '../../../../common/toast';

export const Section = ({ title, content, button }: TSectionProps) => {
    const [isUpdate, setIsUpdate] = useState<boolean>(false);
    const [newValue, setNewValue] = useState<string>('');
    const [isPressing, setIsPressing] = useState(false);
    const pressTimer = useRef<NodeJS.Timeout | null>(null);
    const { notifySuccess } = useToast();

    useEffect(() => {
        return () => {
            if (pressTimer.current) {
                clearTimeout(pressTimer.current);
            }
        };
    }, []);

    const handleUpdate = () => {
        setIsUpdate(true);
        setNewValue(content);
    };

    const handleSaveChanges = () => {
        console.log(`New ${title}: `, newValue);
        setIsUpdate(false);
        //TODO: Save new data locally and on server
        button?.onUpdate(newValue);
    };

    const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setNewValue(e.target.value);
    };

    const truncate = (str: string) => {
        return str.length > 32 ? str.substring(0, 32) + '...' : str;
    };

    const startPress = () => {
        setIsPressing(true);
        // Start the timeout to execute the long press action
        pressTimer.current = setTimeout(() => {
            onLongPress();
        }, 1000);
    };

    const stopPress = () => {
        setIsPressing(false);
        // Clear the timeout if the press is released before the delay
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
        }
        pressTimer.current = null;
    };

    const onLongPress = () => {
        navigator.clipboard.writeText(content);
        notifySuccess(
            `${title.replace(/[()]/g, '')} скопійовано в буфер обміну`,
        );
    };

    return (
        <div
            className="section"
            style={{ opacity: isPressing ? 0.7 : 1 }}
            onMouseDown={startPress}
            onMouseUp={stopPress}
            onMouseLeave={stopPress} // Handle the case where the cursor leaves the button
            onTouchStart={startPress}
            onTouchEnd={stopPress}
            onTouchCancel={stopPress} // Handle the case where the touch event is interrupted
        >
            <Row style={{ justifyContent: 'space-between' }}>
                <h1 className="title">{title}</h1>
                {button && (
                    <>
                        <div className="section-button-pc">
                            <Button
                                text={isUpdate ? 'Зберегти' : button.text}
                                style={{
                                    width: '13rem',
                                    borderRadius: '7px',
                                    borderTopRightRadius: '0',
                                    borderBottomRightRadius: '0',
                                }}
                                onClick={
                                    isUpdate ? handleSaveChanges : handleUpdate
                                }
                            />
                        </div>
                        <div className="section-button-mob">
                            <Button
                                text={isUpdate ? 'Зберегти' : button.text}
                                style={{
                                    padding: '4px 30px',
                                    borderRadius: '7px',
                                    borderTopRightRadius: '0',
                                    borderBottomRightRadius: '0',
                                    backgroundColor: 'rgb(81, 199, 47)',
                                    border: 'none',
                                }}
                                onClick={
                                    isUpdate ? handleSaveChanges : handleUpdate
                                }
                            />
                        </div>
                    </>
                )}
            </Row>
            {isUpdate ? (
                <input value={newValue} onChange={handleTextChange} />
            ) : (
                <div>
                    <p className="content-text">{content}</p>
                    <p className="content-text-mob">{truncate(content)}</p>
                </div>
            )}
        </div>
    );
};
