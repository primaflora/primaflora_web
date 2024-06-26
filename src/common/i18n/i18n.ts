import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ukr from './locales/ukr/translation.json';
import rus from './locales/rus/translation.json';
import { StorageService } from '../storage/storage.service';

const resources = {
    ukr: { translation: ukr },
    rus: { translation: rus },
};

i18n.use(initReactI18next).init({
    resources,
    lng: StorageService.getLanguage() || 'ukr',
});

export default i18n;
