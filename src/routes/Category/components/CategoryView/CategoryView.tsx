import { useEffect, useState } from 'react';
import { useUserData } from '../../../../store/tools';
import './styles.css';
import { TProduct } from '../../../../common/services/category/types/common';
import { Service } from '../../../../common/services';
import { ProductsSection } from '../../../../components/ProductsSection';

export const CategoryView = () => {
    const { pickedSubcategory } = useUserData();
    const [products, setProducts] = useState<TProduct[]>([]);

    useEffect(() => {
        if (!pickedSubcategory) {
            return;
        }

        console.log('Selected => ', pickedSubcategory);

        Service.CategoryService.getCategoryWithProducts({
            subcategoryId: pickedSubcategory.id,
        }).then(res => {
            setProducts(res.data.products);
            console.log('Products => ', res.data.products);
        });
    }, [pickedSubcategory]);

    if (pickedSubcategory) {
        return (
            <div className="category-view-container">
                <ProductsSection
                    title={pickedSubcategory.name}
                    products={products}
                />
            </div>
        );
    }
};
