import { useEffect, useState } from 'react';
import './styles.css';
import { TLanguageElement } from './types';
import { Images } from '../../../../../assets';
import { ELanguages } from '../../../../../common/i18n';
import { useTranslation } from 'react-i18next';

export const LanguageSelector = () => {
    const { i18n } = useTranslation();
    const [selectedLanguage, setSelectedLanguage] = useState<ELanguages>(
        ELanguages.RUS,
    );
    const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(false);

    useEffect(() => {
        i18n.changeLanguage(selectedLanguage.toString());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLanguage]);

    const selectFlag = () => {
        switch (selectedLanguage) {
            case ELanguages.RUS:
                return Images.RusFlag;
            case ELanguages.UKR:
                return Images.UkrFlag;

            default:
                break;
        }
    };

    const handleOpenSelector = () => {
        setIsSelectorOpen(!isSelectorOpen);
    };

    const handleLanguageChange = (languageKey: string) => {
        setSelectedLanguage(ELanguages[languageKey as TLanguageElement]);
    };

    return (
        <div
            className="language-selector-main-container"
            onClick={handleOpenSelector}>
            {isSelectorOpen && (
                <LanguageSelectorList
                    language={selectedLanguage}
                    onLanguageChange={handleLanguageChange}
                />
            )}

            <div
                className={`language-selector-inner-container ${
                    isSelectorOpen && 'selector-open'
                }`}>
                <h1 className="text-m text-black self-center">
                    {selectedLanguage.toUpperCase()}
                </h1>
                <img src={selectFlag()} width={35} alt="language" />
                <img
                    className={`dropdown-icon ${
                        isSelectorOpen ? 'icon-rotate' : ''
                    }`}
                    src={Images.ArrowListDownIcon}
                    alt="down"
                />
            </div>
        </div>
    );
};

type TLanguageSelectorListProps = {
    language: ELanguages;
    onLanguageChange: (languageKey: string) => void;
};

const LanguageSelectorList = ({
    language,
    onLanguageChange,
}: TLanguageSelectorListProps) => {
    return (
        <div className="language-selector-list">
            {Object.keys(ELanguages).map(key => {
                const elem = ELanguages[key as TLanguageElement];
                return (
                    <div
                        key={key}
                        className="language-selector-list-element"
                        onClick={() => onLanguageChange(key)}>
                        <h1>{elem.toUpperCase()}</h1>
                        {elem === language ? (
                            <img
                                src={Images.CheckMarkGreen}
                                width={20}
                                alt="checkmark"
                            />
                        ) : (
                            ''
                        )}
                    </div>
                );
            })}
        </div>
    );
};
