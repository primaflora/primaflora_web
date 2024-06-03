import { Line } from '../../../../components/common';
import { Slider } from '../Slider';
import './styles';

export const Main = () => {
    return (
        <div className="w-full ml-10">
            <Slider />
            <Line />
            <b className="block mb-2">Main. Please, pick category</b>
        </div>
    );
};
