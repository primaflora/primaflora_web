import { useTranslation } from 'react-i18next';
import { Button } from '../../../../components/buttons';
import { Row } from '../../../../components/common';
import './styles.css';
import { TTotalPriceProps } from './types';

export const TotalPrice = ({ 
    price, 
    onSubmit, 
    selectedItemsCount = 0, 
    totalItemsCount = 0 
}: TTotalPriceProps) => {
    const { t } = useTranslation();

    return (
        <div className="total-price-container py-6 pl-6">
            <Row style={{ justifyContent: 'space-between' }}>
                <div className="flex flex-col items-start">
                    <h1 className="total-price-title">
                        {t('cart.total')} 
                        {selectedItemsCount > 0 && totalItemsCount > 0 && (
                            <span className="text-sm text-gray-600 ml-2">
                                ({selectedItemsCount} из {totalItemsCount})
                            </span>
                        )}
                    </h1>
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
                    text={t('cart.make-order')}
                    small
                    filled
                    onClick={onSubmit}
                    isClickable={selectedItemsCount > 0}
                    style={{
                        borderTopLeftRadius: 7,
                        borderBottomLeftRadius: 7,
                        alignSelf: 'flex-start',
                        opacity: selectedItemsCount > 0 ? 1 : 0.5,
                    }}
                />
            </Row>
        </div>
    );
};
