import { useEffect, useState } from 'react';
import { Line } from '../../../../components/common';
import { CatalogStripeMob } from '../../../../components/common/CatalogStripeMob';
import { SubcategorySection } from '../../../../components/SubcategorySection';
import { Service } from '../../../../common/services';
import { TSubcategoryWithProducts } from '../../../../common/services/product/types/getRandomBySubcategories';
import { Slider } from '../Slider';
import './styles.css';

export const Main = () => {
    const [subcategoriesData, setSubcategoriesData] = useState<TSubcategoryWithProducts[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSubcategoriesData = async () => {
            try {
                setLoading(true);
                const response = await Service.ProductService.getRandomBySubcategories();
                setSubcategoriesData(response.data);
            } catch (error) {
                console.error('Error loading subcategories data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadSubcategoriesData();
    }, []);

    return (
        <div className="main-home-container">
            <Slider />
            {/* <NewSlider /> */}
            <div className="catalog-stripe-main-mob-container">
                <CatalogStripeMob />
            </div>
            <Line />
            
            {/* Секции подкатегорий с товарами */}
            <div className="subcategories-container">
                {loading ? (
                    <div className="loading-container">
                        <p>Загрузка товаров...</p>
                    </div>
                ) : subcategoriesData.length > 0 ? (
                    subcategoriesData.map((subcategoryData) => (
                        <SubcategorySection 
                            key={subcategoryData.subcategory.uuid}
                            subcategoryData={subcategoryData}
                        />
                    ))
                ) : (
                    <div className="no-data-container">
                        <p>Нет доступных товаров</p>
                    </div>
                )}
            </div>
        </div>
    );
};
