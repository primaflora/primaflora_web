import React from 'react';
import './styles.css';
import { TColumnProps } from './types';

export const Column = ({ children, style }: TColumnProps) => {
    return (
        <div className="column" style={style}>
            {children}
        </div>
    );
};
