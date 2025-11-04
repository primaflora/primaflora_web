import React from 'react';
import { TSubcategoryWithProducts } from '../../common/services/product/types/getRandomBySubcategories';
import { Card } from '../Card';
import './styles.css';
import { Link } from 'react-router-dom';

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
                    <Link to={`/category/${subcategory.uuid}`} className="subcategory-link">дивитись ще →</Link>
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
                            // like уже приходит с бекенда
                            categoryIds: [], // Добавляем недостающее поле
                            // Используем категории товара, если они есть, иначе добавляем информацию о подкатегории
                            categories: product.categories?.map((cat: any) => ({
                                id: cat.id,
                                uuid: cat.uuid,
                                image: '',
                                translate: [{ 
                                    language: cat.translate[0]?.language || 'ukr', 
                                    name: cat.translate[0]?.name || '',
                                    desc: (cat.translate[0] as any)?.desc || '' // Используем any для доступа к desc
                                }],
                                language: cat.translate[0]?.language || 'ukr',
                                label: cat.label,
                                labelColor: cat.labelColor,
                                createdAt: new Date(),
                                updatedAt: new Date()
                            })) || (subcategory.label ? [{
                                id: subcategory.id,
                                uuid: subcategory.uuid,
                                image: subcategory.image,
                                label: subcategory.label,
                                labelColor: subcategory.labelColor,
                                translate: [{ 
                                    language: 'ukr', 
                                    name: subcategory.name,
                                    desc: (subcategory as any).desc || '' // Добавляем обязательное поле desc
                                }],
                                language: 'ukr',
                                createdAt: new Date(),
                                updatedAt: new Date()
                            }] : []),
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