import React from 'react';
import { TSubcategoryWithProducts } from '../../common/services/product/types/getRandomBySubcategories';
import { Card } from '../Card';
import './styles.css';

interface SubcategorySectionProps {
    subcategoryData: TSubcategoryWithProducts;
}

export const SubcategorySection: React.FC<SubcategorySectionProps> = ({ subcategoryData }) => {
    const { subcategory, products } = subcategoryData;
    
    // Функция для формирования полного URL изображения
    const getImageUrl = (imageUrl: string) => {
        if (!imageUrl) return '';
        if (imageUrl.startsWith('http')) {
            return imageUrl; // Уже полный URL
        }
        return `${process.env.REACT_APP_HOST_URL}${imageUrl}`; // Добавляем базовый URL
    };

    return (
        <div className="subcategory-section">
            {/* Заголовок подкатегории */}
            <div className="subcategory-header">
                <div className="subcategory-info">
                    <h2 className="subcategory-section-title">{subcategory.name}</h2>
                </div>
            </div>

            {/* Сетка товаров */}
            <div className="cards">
                {products.map(product => (
                    <Card 
                        key={product.uuid} 
                        card={{
                            ...product,
                            // Преобразуем TProductShort в TProduct формат для Card компонента
                            desc: product.shortDesc,
                            descriptionPoints: [],
                            like: null,
                            categoryIds: [], // Добавляем недостающее поле
                            // Добавляем недостающие поля из TBasicDataBaseData
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }} 
                    />
                ))}
            </div>
        </div>
    );
};