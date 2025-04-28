import React from 'react';
import './style.css';
import { TButtonProps } from './types';

export const Button = ({
    text,
    imageUrl,
    onClick,
    style,
    backgroundColor = '#72BF44',
    filled = true,
    small = false,
    isClickable = true,
    type = 'button',
}: TButtonProps) => {
    return (
        <button
            disabled={!isClickable}
            onClick={onClick}
            type={type}
            style={{
                padding: small ? '5px 30px' : '11px 60px',
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
