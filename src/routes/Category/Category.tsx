import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePickedSubcategory } from '../../common/hooks/usePickedSubcategory';
import { CategoryUpperView } from '../../components/common/CategoryUpperView';
import { SideBar } from '../../components/common/SideBar';
import { useUserData } from '../../store/tools';
import { CategoryView } from './components/CategoryView';
import './styles.css';

export const Category = () => {
    const { uuid } = useParams();
    const { pickedSubcategory, categories } = useUserData();
    const { setPickedSubcategory } = usePickedSubcategory();

    // if user go the link of the category (so he do not pikedCategory), we should set it
    useEffect(() => {
        // if categories have not loaded yet
        if (categories.length === 0) return;

        if (!pickedSubcategory) {
            for (const category of categories) {
                setPickedSubcategory(category.childrens.find(c => c.uuid === uuid)!);
                break;
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categories]);

    return (
        <div className="home-container main-global-padding py-10">
            <div className="flex">
                <SideBar />
                <div className="w-full ml-10">
                    <CategoryUpperView />
                    <CategoryView />
                </div>
            </div>
        </div>
    );
};
