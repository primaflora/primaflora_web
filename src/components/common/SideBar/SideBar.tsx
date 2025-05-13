import { useNavigate } from 'react-router-dom';
import { Images } from '../../../assets';
import { usePickedSubcategory } from '../../../common/hooks/usePickedSubcategory';
import {
    TCategory,
    TSubcategory,
} from '../../../common/services/category/types/common';
import { useUserData } from '../../../store/tools';
import { Row } from '../Row';
import './styles.css';
import { TSidebarProps } from './types';
import { useTranslation } from 'react-i18next';

export const SideBar = ({
    isMob = false,
    isOpen = false,
    onClose = () => {
        console.log('TODO: Close Sidebar in mob version');
    },
}: TSidebarProps) => {
    const { categories } = useUserData();
    const { setPickedSubcategory } = usePickedSubcategory();
    const navigate = useNavigate();

    const handleClickSubcategory = (pickedSubcategory: TSubcategory) => {
        setPickedSubcategory(pickedSubcategory);
        onClose();
        // navigate(`/category/${pickedSubcategory.uuid}`);
    };

    return (
        <div
            className={`sidebar ${
                isOpen ? ' sidebar-mob-open' : ' file:sidebar-mob-close'
            }`}>
            {isMob && <SideBarHeaderMob onClose={onClose} />}
            {categories.map((category: TCategory) => (
                <div className="category-list" key={category.uuid}>
                    <Category category={category} />
                    <div className="subcategory-list">
                        {category.childrens.map((subcategory: TSubcategory) => (
                            <Subcategory
                                onClick={() =>
                                    handleClickSubcategory(subcategory)
                                }
                                key={subcategory.uuid}
                                subcategory={subcategory}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

const SideBarHeaderMob = ({ onClose }: { onClose: () => void }) => {
    const { t } = useTranslation();

    return (
        <Row style={{ justifyContent: 'space-between', padding: '20px' }}>
            <h1 className="sidebar-header-mob-title">{t('navigation.catalog-title')}</h1>
            <button
                className="sidebar-header-mob-close-button"
                onClick={onClose}>
                <img src={Images.CrossIcon} alt="close" />
            </button>
        </Row>
    );
};

const Category = ({ category }: { category: TCategory }) => {
    return <p className="category-title">{category.name.toUpperCase()}</p>;
};

const Subcategory = ({
    subcategory,
    onClick,
}: {
    subcategory: TSubcategory;
    onClick: () => void;
}) => {
    return (
        <a href={`/category/${subcategory.uuid}`} className="subcategory-title" onClick={onClick}>
            {subcategory.name}
        </a>
    );
};
