import React, { useContext } from 'react';
import './styles.css';
import { TSlideProps } from './types';
import { SliderContext } from '../../../../Slider';

export const Slide = ({ slide, number }: TSlideProps) => {
    const { slideIndex } = useContext(SliderContext);
    console.log(slide)
    
    // Формируем полный URL для изображения
    const getImageUrl = (imageUrl: string) => {
        if (imageUrl.startsWith('http')) {
            return imageUrl; // Уже полный URL
        }
        return `${process.env.REACT_APP_HOST_URL}${imageUrl}`; // Добавляем базовый URL
    };
    
    return (
        <div className={`slide ${slideIndex === number ? 'selected' : 'hide'}`}
        style={{ cursor: slide.link ? 'pointer' : 'default'}}>
            <a
        href={slide.link || '#'}
        className="slide-inner"
        rel="noopener noreferrer"
      >
            <img
                src={getImageUrl(slide.imageUrl)}
                alt="nature"
                className="h-[345px] w-full object-cover"
            />
            <p className="slider-text" style={{ color: slide.textColor }}>
                {slide.title}
            </p></a>
        </div>
    );
};
