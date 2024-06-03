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
                className="h-full w-full object-cover items-center"
            />
            <p className="absolute top-0 bottom-0 left-20 flex items-center text-black">
                {slide.text}
            </p>
        </div>
    );
};
