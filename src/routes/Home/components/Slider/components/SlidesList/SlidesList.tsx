import { useContext } from 'react';
import { SliderContext } from '../../Slider';
import './styles.css';
import { Slide } from './components/Slide';

export const SlidesList = () => {
    const { slideIndex, slides } = useContext(SliderContext);

    return (
        <div
            className="slide-list"
            style={{ transform: `translateX(-${slideIndex * 100}%)` }}>
            {slides.map((slide, index) => (
                <Slide slide={slide} number={index} key={`Slide-${index}`} />
            ))}
        </div>
    );
};
