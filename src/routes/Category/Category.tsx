import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePickedSubcategory } from '../../common/hooks/usePickedSubcategory';
import { CategoryUpperView } from '../../components/common/CategoryUpperView';
import { SideBar } from '../../components/common/SideBar';
import { useUserData } from '../../store/tools';
import { CategoryView } from './components/CategoryView';
import './styles.css';
import { CatalogStripeMob } from '../../components/common/CatalogStripeMob';
import { useDispatch } from 'react-redux';
import { productSliceActions } from '../../store/modules/product/reducer';

export const Category = () => {
    const { uuid } = useParams();
    const { pickedSubcategory, categories } = useUserData();
    const { setPickedSubcategory } = usePickedSubcategory();
    const dispatch = useDispatch();
    // if user go the link of the category (so he do not pikedCategory), we should set it
    useEffect(() => {
        // if categories have not loaded yet
        if (categories.length === 0) return;

        if (!pickedSubcategory) {
            for (const category of categories) {
                const currentCategory = category.childrens.find(c => c.uuid === uuid);
                if (currentCategory) {
                    setPickedSubcategory(currentCategory);
                    break;
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories]);

    useEffect(() => {
        dispatch(productSliceActions.setSelectedProduct(null));
        // Скролл к началу страницы при переходе на категорию
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [uuid]) // Добавляем uuid в зависимости, чтобы скролл работал при смене категории

    return (
        <div className="home-container py-[40px]">
            <div className="flex">
                <SideBar />
                <div className="category-main-container">
                    <div className="catalog-stripe-mob-container pb-5">
                        <CatalogStripeMob />
                    </div>
                    <CategoryUpperView/>
                    <CategoryView />
                </div>
            </div>
        </div>
    );
};
