import { useEffect, useState } from 'react';
import { useUserData } from '../../../../store/tools';
import { useProductSeries } from '../../../../common/hooks/useProductSeries';
import './styles.css';
import { TProduct } from '../../../../common/services/category/types/common';
import { Service } from '../../../../common/services';
import { ProductsSection } from '../../../../components/ProductsSection';
import { SEOHead } from '../../../../components/common';

export const CategoryView = () => {
    const { pickedSubcategory } = useUserData();
    const { setProductSeries } = useProductSeries();
    const [products, setProducts] = useState<TProduct[]>([]);
    const [loadedCategoryId, setLoadedCategoryId] = useState<number | null>(null);

    useEffect(() => {
        if (!pickedSubcategory || !pickedSubcategory.id) {
            return;
        }

        // Избегаем повторных запросов для той же категории
        if (loadedCategoryId === pickedSubcategory.id) {
            return;
        }

        console.log('Selected => ', pickedSubcategory);
        console.log('Loading products for category:', pickedSubcategory.id);

        Service.CategoryService.getCategoryWithProducts({
            subcategoryId: pickedSubcategory.id,
        }).then(res => {
            const categoryProducts = res.data.products || [];
            // Сортируем товары так же, как в ProductsSection
            const sortedProducts = categoryProducts
                .slice()
                .sort((a, b) => a.title.localeCompare(b.title));
                
            setProducts(categoryProducts); // для отображения оставляем исходный порядок
            setLoadedCategoryId(pickedSubcategory.id);
            
            // Сохраняем ОТСОРТИРОВАННЫЕ товары в хук для навигации
            if (sortedProducts.length > 0) {
                console.log('CategoryView: saving SORTED products to global hook, count:', sortedProducts.length);
                setProductSeries(sortedProducts);
            }
            
            console.log('Products loaded => ', categoryProducts.length);
        }).catch(error => {
            console.error('Error loading category products:', error);
            setProducts([]);
            setLoadedCategoryId(null);
        });
    }, [pickedSubcategory, loadedCategoryId]);

    if (pickedSubcategory) {
        const categoryName = (pickedSubcategory as any).name || 'Категория';
        return (
            <div className="category-view-container">
                <SEOHead 
                    title={`${categoryName} - Primaflora`}
                    description={`Купити ${categoryName.toLowerCase()} в інтернет-магазині Primaflora. Великий вибір квітів та рослин з доставкою.`}
                />
                <ProductsSection
                    title={categoryName}
                    products={products}
                />
            </div>
        );
    }
    
    return null;
};
