import './styles.css';
import { SocialLinks } from './components/SocialLinks';
import { LanguageSelector } from './components/LanguageSelector';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
    const { t } = useTranslation();

    return (
        <div className="footer-main-container">
            <hr />
            <div className="footer-inner-container layout">
                <SocialLinks />
                <div className="footer-contacts">
                    <p>+ 38 (093) 826-51-99</p>
                    <p>info.primaflora@gmail.com</p>
                </div>
            </div>
            <hr />

            <div className="footer-bottom-container layout">
                <p className="footer-bottom-text">
                    {t('footer.bottom-title')} ®
                </p>

                <div className="language-selector-container">
                    <LanguageSelector />
                </div>
            </div>
        </div>
    );
};
