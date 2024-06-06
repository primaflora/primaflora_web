import { useContext } from 'react';
import { SliderContext } from '../../Slider';
import LeftArrow from './components/Arrows/LeftArrow';
import RightArrow from './components/Arrows/RightArrow';
import './styles.css';

export const Arrows = () => {
    const { changeSlide } = useContext(SliderContext);

    return (
        <div className="arrows">
            <LeftArrow className="" onClick={() => changeSlide(-1)} />
            <RightArrow className="" onClick={() => changeSlide(1)} />
        </div>
    );
};
