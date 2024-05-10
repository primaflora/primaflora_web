import React from 'react';
import './styles.css';
import { SocialLinks } from './components/SocialLinks';
import { Row } from '../Row';

export const Footer = () => {
    return (
        <div className="footer-main-container">
            <hr />
            <Row style={{ padding: '30px 0' }}>
                <SocialLinks />
                <div className="footer-contacts">
                    <p>+ 38 (093) 826-51-99</p>
                    <p>info.primaflora@gmail.com</p>
                </div>
            </Row>
            <hr />

            <p className="footer-bottom-text">ЛЮБОВІ! ЗДОРОВ’Я! ЩАСТЯ ТА ДОБРА! ®</p>
        </div>
    );
};
