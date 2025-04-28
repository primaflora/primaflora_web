import React, { useContext } from 'react';
import './styles.css';
import { TSlideProps } from './types';
import { SliderContext } from '../../../../Slider';

export const Slide = ({ slide, number }: TSlideProps) => {
    const { slideIndex } = useContext(SliderContext);

    return (
        <div className={`slide ${slideIndex === number ? 'selected' : 'hide'}`}>
            <img
                src={slide.image}
                alt="nature"
                className="h-[345px] w-full object-cover"
            />
            <p className="slider-text">
                {slide.text}
            </p>
        </div>
    );
};
