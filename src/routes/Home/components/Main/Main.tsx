import { Line } from '../../../../components/common';
import { CatalogStripeMob } from '../../../../components/common/CatalogStripeMob';
import { Slider } from '../Slider';
import './styles.css';

export const Main = () => {
    return (
        <div className="main-home-container">
            <Slider />
            <div className="catalog-stripe-mob-container">
                <CatalogStripeMob />
            </div>
            <Line />
            <b className="block mb-2 h-[60vh]">Main. Please, pick category</b>
        </div>
    );
};
