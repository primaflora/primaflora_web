import { useState, useTransition } from 'react';
import { Images } from '../../../assets';
import { Button } from '../../buttons';
import { Row } from '../Row';
import { SideBar } from '../SideBar';
import './styles.css';
import { useTranslation } from 'react-i18next';

export const CatalogStripeMob = () => {
    const { t } = useTranslation();
    const [isSidebarVisible, setIsSidebarVisible] = useState(false);

    const handleSidebarClose = () => {
        setIsSidebarVisible(false);
    };

    const handleSidebarOpen = () => {
        setIsSidebarVisible(true);
    };

    return (
        <div>
            <Row
                style={{
                    gap: 10,
                    width: '100%',
                    paddingTop: 10,
                }}>
                {/* TODO: redirect to delivery page */}
                <Button
                    imageUrl={Images.DeliveryIconMob}
                    onClick={() => {}}
                    filled
                    style={{ borderRadius: '7px', padding: 8 }}
                />
                {/* TODO: redirect to catalog page */}
                <Button
                    text={t('navigation.catalog-title')}
                    onClick={handleSidebarOpen}
                    filled
                    style={{ borderRadius: '7px', width: '100%' }}
                />
            </Row>
            <div
                className={`catalog-stripe-sidebar-mob-container ${
                    isSidebarVisible ? '' : 'sidebar-mob-hidden'
                }`}>
                <div className="w-[70%]">
                    <SideBar
                        isMob
                        isOpen={isSidebarVisible}
                        onClose={handleSidebarClose}
                    />
                </div>
            </div>
        </div>
    );
};
