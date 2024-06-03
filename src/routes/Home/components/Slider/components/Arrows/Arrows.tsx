import { useContext } from 'react';
import { SliderContext } from '../../Slider';
import LeftArrow from './components/Arrows/LeftArrow';
import RightArrow from './components/Arrows/RightArrow';

export const Arrows = () => {
    const { changeSlide } = useContext(SliderContext);

    return (
        <div className="absolute z-10 w-full h-full flex justify-between p-6 items-center">
            <LeftArrow className="" onClick={() => changeSlide(-1)} />
            <RightArrow className="" onClick={() => changeSlide(1)} />
        </div>
    );
};
