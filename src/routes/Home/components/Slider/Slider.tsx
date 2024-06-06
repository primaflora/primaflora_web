import React, { useState } from 'react';
import { Arrows } from './components/Arrows';
import { Dots } from './components/Dots';
import { SlidesList } from './components/SlidesList/SlidesList';
import './styles.css';
import { TSliderContextProps } from './types';

const Image =
    'https://s3-alpha-sig.figma.com/img/bb62/2936/ff95f19a676cebf13cd969fbbfa2ee12?Expires=1717977600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=NbFoztJ-SxQAlvb1FtDJeXNS4meadspFKaFRWp3aOKEtV1HWeHURq~ya1urSdvfgNahUUAkMKGRv84q0Uqw~B9SYz-6RUKqfE8fZryBZqi2tlMELLaQ~OWCYRcpSOWJCN2VQPrA0rAeAgOPShWnyv1mbxNVITrdZoQ5jkEAl9w0nlHOFhBmjGz2dKcecZgD0tIUOmf-3KtVrU2Ym4zB8i~AZDGOgJVXSjWjWvq7YZqx26V6hoCFRlA-5LKzVS8lYel-KWf0itcgVBl6Y1FqJGqGnjFDJExZpzLij9Tvr8ak6V2a7hmrUDIG2QY7~u84IgnkOExi2yuqpPJTyI3NRdw__';

export const SliderContext = React.createContext<TSliderContextProps>({
    slidesCount: 0,
    slideIndex: 0,
    slides: [],
    goToSlide: () => {},
    changeSlide: () => {},
});

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
                className="flex relative w-full items-center overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}>
                <Arrows />
                <SlidesList />
                <Dots />
            </div>
        </SliderContext.Provider>
    );
};
