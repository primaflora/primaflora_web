import React, { useContext } from 'react';
import './styles.css';
import { SliderContext } from '../../Slider';
import { Dot } from './components/Dot';

export const Dots = () => {
    const { slidesCount } = useContext(SliderContext);

    const renderDots = (dotsCount: number) => {
        const dots = [];

        for (let i = 0; i < dotsCount; i++) {
            dots.push(<Dot key={`Dot-${i}`} number={i} />);
        }

        return dots;
    };

    return (
        <div className="contents">
            <div className="dots-container">
                {renderDots(slidesCount)}
            </div>
        </div>
    );
};
