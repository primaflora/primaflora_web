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
            <div className="flex flex-row gap-2 absolute bottom-3 right-0 left-0 justify-center z-10">
                {renderDots(slidesCount)}
            </div>
        </div>
    );
};
