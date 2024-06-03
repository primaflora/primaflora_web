import React, { FC } from 'react';
import './styles.css';
import { MinusProps } from './types';

const Minus: FC<MinusProps> = ({ onClick }) => {
    return (
        <svg
            className="minus-icon"
            viewBox="0 0 32 4"
            xmlns="http://www.w3.org/2000/svg"
            onClick={onClick}>
            <path d="M30.3998 3.20009H1.5999C0.716892 3.20009 0 2.4832 0 1.60019C0 0.716892 0.716892 0 1.5999 0H30.3998C31.2831 0 32 0.716892 32 1.60019C32 2.4832 31.2831 3.20009 30.3998 3.20009Z" />
        </svg>
    );
};

export default Minus;
