import React from 'react';
import './style.css';
import { TButtonProps } from './types';

export const Button = ({
    text,
    imageUrl,
    onClick,
    style,
    backgroundColor = 'rgba(81, 199, 47, 1)',
    filled = true,
}: TButtonProps) => {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '11px 60px',
                ...style,
                backgroundColor: filled ? backgroundColor : 'transparent',
                border: filled ? 'none' : `1px solid ${backgroundColor}`,
            }}>
            {imageUrl ? (
                <img src={imageUrl} alt="Доставка" />
            ) : (
                <p style={{ color: filled ? 'white' : backgroundColor }}>
                    {text}
                </p>
            )}
        </button>
    );
};
