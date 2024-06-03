import { Button } from '../../../../components/buttons';
import { Row } from '../../../../components/common';
import './styles.css';
import { TTotalPriceProps } from './types';

export const TotalPrice = ({ price }: TTotalPriceProps) => {
    return (
        <div className="total-price-container py-6 pl-6">
            <Row style={{ justifyContent: 'space-between' }}>
                <div className="flex flex-col items-start">
                    <h1 className="total-price-title">Разом</h1>
                    <div>
                        <h1 className="total-price-value">
                            {price}{' '}
                            <span className="total-price-value-currency">
                                грн.
                            </span>
                        </h1>
                    </div>
                </div>
                <Button
                    text="ОФОРМИТИ ЗАМОВЛЕННЯ"
                    filled
                    onClick={() => {}}
                    style={{
                        borderTopLeftRadius: 7,
                        borderBottomLeftRadius: 7,
                    }}
                />
            </Row>
        </div>
    );
};
