import { useNavigate } from 'react-router-dom';
import { usePickedSubcategory } from '../../../common/hooks/usePickedSubcategory';
import {
    TCategory,
    TSubcategory,
} from '../../../common/services/category/types/common';
import { useUserData } from '../../../store/tools';
import './styles.css';

export const SideBar = () => {
    const { categories } = useUserData();
    const { setPickedSubcategory } = usePickedSubcategory();
    const navigate = useNavigate();

    const handleClickSubcategory = (pickedSubcategory: TSubcategory) => {
        setPickedSubcategory(pickedSubcategory);
        navigate(`/category/${pickedSubcategory.uuid}`);
    }

    return (
        <div className="sidebar">
            {categories.map((category: TCategory) => (
                <div className="category-list" key={category.uuid}>
                    <Category category={category} />
                    <div className="subcategory-list">
                        {category.childrens.map((subcategory: TSubcategory) => (
                            <Subcategory
                                onClick={() => handleClickSubcategory(subcategory)}
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

const Category = ({ category }: { category: TCategory }) => {
    return <p className="category-title">{category.name.toUpperCase()}</p>;
};

const Subcategory = ({ subcategory, onClick }: { subcategory: TSubcategory, onClick: () => void }) => {
    return (
        <p
            className="subcategory-title"
            onClick={onClick}>
            {subcategory.name}
        </p>
    );
};
