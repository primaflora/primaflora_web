import { Images } from '../../../assets';
import { useUserData } from '../../../store/tools';
import './styles.css';
import { TCategoryUpperViewProps } from './types';

export const CategoryUpperView = () => {
    const { pickedSubcategory } = useUserData();

    return (
        <div className="main-container">
            <div className="text-container">
                <p className="text">{pickedSubcategory?.desc}</p>
            </div>

            <img
                src={Images.CategoryImage}
                className="category-image"
                alt="category"
            />
        </div>
    );
};
