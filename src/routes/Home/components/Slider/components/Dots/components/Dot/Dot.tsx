import React, { useContext } from 'react';
import './styles.css';
import { TDotProps } from './types';
import { SliderContext } from '../../../../Slider';

export const Dot = ({ number }: TDotProps) => {
    const { slideIndex, goToSlide } = useContext(SliderContext);

    return (
        <button
            className={`dot ${slideIndex === number ? 'selected' : ''}`}
            onClick={() => goToSlide(number)}
        />
    );
};
