import { Row } from '../../../../components/common';
import Minus from './components/Minus/Minus';
import Plus from './components/Plus/Plus';
import './styles.css';
import { TQuantityPickerProps } from './types';

export const QuantityPicker = ({
    quantity,
    onQuantityChange,
}: TQuantityPickerProps) => {
    return (
        <Row>
            <Minus onClick={() => onQuantityChange(quantity - 1)} />
            <div className="quantity-value mx-6">
                <h1 className="quantity-value-text">{quantity}</h1>
            </div>
            <Plus onClick={() => onQuantityChange(quantity + 1)} />
        </Row>
    );
};
