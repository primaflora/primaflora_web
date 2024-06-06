import { Images } from '../../../assets';
import { Button } from '../../buttons';
import { Row } from '../Row';
import './styles.css';

export const CatalogStripeMob = () => {
    return (
        <Row style={{ gap: 10, paddingTop: 10 }}>
            {/* TODO: redirect to delivery page */}
            <Button
                imageUrl={Images.DeliveryIconMob}
                onClick={() => {}}
                filled
                style={{ borderRadius: '7px', padding: 8 }}
            />
            {/* TODO: redirect to catalog page */}
            <Button
                text="КАТАЛОГ ПРОДУКЦІЇ"
                onClick={() => {}}
                filled
                style={{ borderRadius: '7px', width: '100%' }}
            />
        </Row>
    );
};
