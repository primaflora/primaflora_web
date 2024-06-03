import React, { useState } from 'react';
import { TSvgProps } from './types';

const onPressColor = '#51C72F80';

const LeftArrow = ({
    color = '#454545',
    fillOpacity = 0.2,
    width = 40,
    height = 40,
    onClick,
    className,
}: TSvgProps) => {
    const [pressed, setPressed] = useState<boolean>(false);

    const handleMouseDown = () => {
        setPressed(true);
    };

    const handleMouseUp = () => {
        setPressed(false);
    };

    return (
        <svg
            className={className}
            width={width}
            height={height}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={onClick}
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchEnd={handleMouseUp}
            style={{ cursor: onClick ? 'pointer' : 'default' }}>
            <path
                d="M20 36C28.8366 36 36 28.8366 36 20C36 11.1634 28.8366 4 20 4C11.1634 4 4 11.1634 4 20C4 28.8366 11.1634 36 20 36ZM20 7C27.1797 7 33 12.8203 33 20C33 27.1797 27.1797 33 20 33C12.8203 33 7 27.1797 7 20C7 12.8203 12.8203 7 20 7Z"
                fill={pressed ? onPressColor : color}
                fillOpacity={pressed ? 1 : fillOpacity}
            />
            <path
                d="M23.4648 15.2659L21.0561 12.8572L13.4648 20.4485L21.0562 28.0398L23.4648 25.6311L18.2822 20.4485L23.4648 15.2659Z"
                fill={pressed ? onPressColor : color}
                fillOpacity={pressed ? 1 : fillOpacity}
            />
        </svg>
    );
};

export default LeftArrow;
