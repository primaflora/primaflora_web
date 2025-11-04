import React, { useEffect, useState } from 'react';
import './styles.css';
import { SideBar } from '../../components/common/SideBar';
import { useParams } from 'react-router-dom';
import { CategoryUpperView } from '../../components/common/CategoryUpperView';
import { ProductView } from './components/ProductView';
import { TProductFull } from '../../common/services/category/types/common';
import { Service } from '../../common/services';
import { useUserData } from '../../store/tools';
import { usePickedSubcategory } from '../../common/hooks/usePickedSubcategory';
import { useProductSeries } from '../../common/hooks/useProductSeries';
import { useDispatch } from 'react-redux';
import { productSliceActions } from '../../store/modules/product/reducer';
import { ProductSkeleton } from '../../components/common';

export const Product = () => {
    const { pickedSubcategory, categories, isAuth } = useUserData();
    const { setPickedSubcategory } = usePickedSubcategory();
    const { uuid } = useParams();
    const [product, setProduct] = useState<TProductFull | null>(null);
    const [loading, setLoading] = useState(true);

    const dispatch = useDispatch();

    // Импортируем хук для работы с навигацией продуктов
    const { setCurrentProductIndex, products, setProductSeries } = useProductSeries();

    // TODO: fetch full product data
    useEffect(() => {
        if (!uuid) {
            setLoading(false);
            return;
        }

        setLoading(true);
        Service.ProductService.getOneByUid({ uuid }).then(res => {
            if (!res.data) {
                console.log(
                    'Cant fetch Full User Data in routes/Product/Product.tsx component by provided uuid => ',
                    uuid,
                );
                setLoading(false);
                return;
            }
            setProduct(res.data);
            dispatch(productSliceActions.setSelectedProduct(res.data));
            console.log('Full product => ', res.data);
            setLoading(false);

            // Проверяем, есть ли уже загруженные продукты для навигации
            if (products.length > 0 && res.data) {
                console.log('🔍 Products already loaded, searching for current product...');
                const currentIndex = products.findIndex((p: any) => p.uuid === res.data!.uuid);
                console.log('🔍 Current product index found:', currentIndex);
                if (currentIndex !== -1) {
                    console.log('✅ Setting current product index:', currentIndex);
                    setCurrentProductIndex(currentIndex);
                } else {
                    console.log('❌ Current product not found in existing products array');
                }
            } else if (res.data && res.data.categories.length > 0) {
                // Если продукты не загружены, загружаем их из первой категории продукта
                console.log('📦 No products loaded, loading products from product category...');
                const firstCategory = res.data.categories[0];
                console.log('📦 Loading products for category ID:', firstCategory.id);
                
                Service.CategoryService.getCategoryWithProducts({
                    subcategoryId: firstCategory.id,
                }).then(categoryRes => {
                    const categoryProducts = categoryRes.data.products || [];
                    console.log('📦 Loaded products from category:', categoryProducts.length);
                    
                    if (categoryProducts.length > 0) {
                        // Сортируем товары так же, как в CategoryView
                        const sortedProducts = categoryProducts
                            .slice()
                            .sort((a: any, b: any) => a.title.localeCompare(b.title));
                        
                        console.log('📦 Saving sorted products to navigation system');
                        setProductSeries(sortedProducts);
                        
                        // Устанавливаем категорию как активную, если она еще не выбрана
                        if (!pickedSubcategory) {
                            const categoryToSet = categories.flatMap(cat => cat.childrens)
                                .find(sub => sub.id === firstCategory.id);
                            
                            if (categoryToSet) {
                                console.log('📦 Setting category as active:', categoryToSet);
                                setPickedSubcategory(categoryToSet);
                            }
                        }
                        
                        // Находим текущий продукт в загруженном массиве
                        const currentIndex = sortedProducts.findIndex((p: any) => p.uuid === res.data!.uuid);
                        console.log('📦 Current product index in loaded array:', currentIndex);
                        
                        if (currentIndex !== -1) {
                            console.log('✅ Setting current product index:', currentIndex);
                            setCurrentProductIndex(currentIndex);
                        }
                    }
                }).catch(err => {
                    console.error('❌ Error loading category products:', err);
                });
            }
        }).catch(err => {
            console.log('Error fetching product:', err);
            setLoading(false);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [uuid, setProductSeries, setPickedSubcategory]);
    
    useEffect(() => {
        if (!pickedSubcategory && product && categories.length > 0) {
            console.log('🏷️ Setting subcategory from product categories...');
            for (const category of categories) {
                // Проверяем все категории продукта
                for (const productCategory of product.categories) {
                    const matchedSubcategory = category.childrens.find(
                        c => c.uuid === productCategory.uuid
                    );
                    if (matchedSubcategory) {
                        console.log('🏷️ Setting matched subcategory:', matchedSubcategory);
                        setPickedSubcategory(matchedSubcategory);
                        console.log('Selected category => ', matchedSubcategory);
                        return;
                    }
                }
            }
        }
    }, [product, categories, pickedSubcategory, setPickedSubcategory]);

    // Обновляем индекс текущего продукта при изменении массива продуктов
    useEffect(() => {
        if (product && products.length > 0) {
            console.log('🔄 Products array updated, updating current index...');
            const currentIndex = products.findIndex((p: any) => p.uuid === product.uuid);
            console.log('🔍 Current product index in updated array:', currentIndex);
            if (currentIndex !== -1) {
                console.log('✅ Updating current product index to:', currentIndex);
                setCurrentProductIndex(currentIndex);
            } else {
                console.log('❌ Current product not found in updated products array');
            }
        }
    }, [products, product, setCurrentProductIndex]);

    return (
        <div className="home-container py-10">
            <div className="flex">
                <SideBar />
                <div className="product-main-container">
                    <CategoryUpperView />
                    <div style={{width: "100%", height: 1, margin: "24px 0 16px", background: "#EBEFF1"}}/>
                    {loading ? (
                        <ProductSkeleton />
                    ) : product ? (
                        <ProductView product={product} />
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                            <h2>Продукт не найден</h2>
                            <p>Извините, запрашиваемый продукт не существует или был удален.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
