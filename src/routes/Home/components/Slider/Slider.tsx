import React, { useState } from 'react';
import { Arrows } from './components/Arrows';
import { Dots } from './components/Dots';
import { SlidesList } from './components/SlidesList/SlidesList';
import './styles.css';
import { TSliderContextProps } from './types';
import { Images } from '../../../../assets';

export const SliderContext = React.createContext<TSliderContextProps>({
    slidesCount: 0,
    slideIndex: 0,
    slides: [],
    goToSlide: () => {},
    changeSlide: () => {},
});

const Image = Images.SliderImage;

const slides = [
    { image: Image, text: 'Some Text 1' },
    { image: Image, text: 'Some Text 2' },
    { image: Image, text: 'Some Text 3' },
    { image: Image, text: 'Some Text 4' },
    { image: Image, text: 'Some Text 5' },
];

export const Slider = () => {
    const [slideIndex, setSlideIndex] = useState<number>(0);
    const [touchPosition, setTouchPosition] = useState<number | null>(null);

    const goToSlide = (index: number) => {
        setSlideIndex(index);
    };

    const changeSlide = (direction: 1 | -1) => {
        const goToIndex = slideIndex + direction;

        if (goToIndex < 0) {
            goToSlide(slides.length - 1);
        } else if (goToIndex >= slides.length) {
            goToSlide(0);
        } else {
            goToSlide(goToIndex);
        }
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (touchPosition) {
            const currentPosition = e.touches[0].clientX;
            const direction = touchPosition - currentPosition;

            if (direction > 10) {
                changeSlide(1);
            }

            if (direction < -10) {
                changeSlide(-1);
            }

            setTouchPosition(null);
        }
    };

    const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
        if (e) {
            const touchDown = e.touches[0].clientX;

            setTouchPosition(touchDown);
        }
    };

    return (
        <SliderContext.Provider
            value={{
                slideIndex,
                changeSlide,
                slides,
                goToSlide,
                slidesCount: slides.length,
            }}>
            <div
                className="flex relative w-full h-[345px] items-center overflow-hidden"
                style={{boxSizing: "border-box"}}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}>
                <Arrows />
                <SlidesList />
                <Dots />
            </div>
        </SliderContext.Provider>
    );
};
