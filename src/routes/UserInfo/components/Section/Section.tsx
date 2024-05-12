import React from 'react';
import './styles.css';
import { TSectionProps } from './types';
import { Row } from '../../../../components/common/Row';
import { Button } from '../../../../components/buttons';

export const Section = ({ title, content, button }: TSectionProps) => {
    return (
        <div className="section">
            <Row style={{ justifyContent: 'space-between' }}>
                <h1 className="title">{title}</h1>
                {button && (
                    <Button
                        text={button.text}
                        style={{ width: '13rem' }}
                        onClick={button.onClick}
                    />
                )}
            </Row>
            <p className="content-text">{content}</p>
        </div>
    );
};
