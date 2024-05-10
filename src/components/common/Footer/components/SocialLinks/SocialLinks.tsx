import React from 'react';
import { Images } from '../../../../../assets';
import { Row } from '../../../Row/Row';

export const SocialLinks = () => {
    return (
        <Row>
            <a href="http://viber.com" target="_blank" rel="noreferrer">
                <img src={Images.ViberIcon} alt="Viber" />
            </a>
            <a href="https://web.telegram.org/" target="_blank" rel="noreferrer">
                <img src={Images.TelegramIcon} alt="Telegram" />
            </a>
            <a href="http://youtube.com" target="_blank" rel="noreferrer">
                <img src={Images.YoutubeIcon} alt="Youtube" />
            </a>
            <a href="http://facebook.com" target="_blank" rel="noreferrer">
                <img src={Images.FacebookIcon} alt="Facebook" />
            </a>
            <a href="http://instagram.com" target="_blank" rel="noreferrer">
                <img src={Images.InstagramIcon} alt="Instagram" />
            </a>
        </Row>
    );
};
