import { Images } from '../../../assets';
import { useUserData } from '../../../store/tools';
import { CategoryUpperViewSkeleton } from '../LoadingSkeleton';
import './styles.css';

export const CategoryUpperView = () => {
    const { pickedSubcategory } = useUserData();

    // Функция для формирования полного URL изображения
    const getImageUrl = (imageUrl: string) => {
        if (!imageUrl) return '';
        if (imageUrl.startsWith('http')) {
            return imageUrl; // Уже полный URL
        }
        return `${process.env.REACT_APP_HOST_URL}${imageUrl}`; // Добавляем базовый URL
    };

    // Показываем скелетон, если категория еще не загружена
    if (!pickedSubcategory) {
        return <CategoryUpperViewSkeleton />;
    }

    return (
        <div className="main-container">
            <div className="text-container">
                <p className="text">{(pickedSubcategory as any)?.name || ''}</p>
            </div>

            <img
                src={getImageUrl(pickedSubcategory?.image || '')}
                className="category-image"
                alt="category"
            />
        </div>
    );
};
