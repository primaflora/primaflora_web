import React, { useState } from 'react';
import { TSvgProps } from './types';

const onPressColor = '#51C72F80';

const RightArrow = ({
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
                d="M20 4C11.1634 4 4 11.1634 4 20C4 28.8366 11.1634 36 20 36C28.8366 36 36 28.8366 36 20C36 11.1634 28.8366 4 20 4ZM20 33C12.8203 33 7 27.1797 7 20C7 12.8203 12.8203 7 20 7C27.1797 7 33 12.8203 33 20C33 27.1797 27.1797 33 20 33Z"
                fill={pressed ? onPressColor : color}
                fillOpacity={pressed ? 1 : fillOpacity}
            />
            <path
                d="M16.5361 24.7341L18.9449 27.1428L26.5361 19.5515L18.9448 11.9602L16.5362 14.3689L21.7188 19.5515L16.5361 24.7341Z"
                fill={pressed ? onPressColor : color}
                fillOpacity={pressed ? 1 : fillOpacity}
            />
        </svg>
    );
};

export default RightArrow;
