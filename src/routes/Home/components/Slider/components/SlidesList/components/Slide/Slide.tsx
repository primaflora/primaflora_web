import React, { useContext } from 'react';
import './styles.css';
import { TSlideProps } from './types';
import { SliderContext } from '../../../../Slider';

export const Slide = ({ slide, number }: TSlideProps) => {
    const { slideIndex } = useContext(SliderContext);

    return (
        <div className={`slide ${slideIndex === number ? 'selected' : 'hide'}`}>
            <p className="slider-text">
                {slide.title}
            </p>
            <img
                src={slide.imageUrl}
                alt="nature"
                className="slide-image"
            />
        </div>
    );
};
