import React from 'react';
import './styles.css';
import { TRowProps } from './types';

export const Row = ({ children, style }: TRowProps) => {
    return (
        <div className="row" style={style}>
            {children}
        </div>
    );
};
