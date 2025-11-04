import { Link } from 'react-router-dom';
import { useUserData } from '../../store/tools';
import { usePickedSubcategory } from '../../common/hooks/usePickedSubcategory';
import "./CategoryBreadcrumbs.css";
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useLocation } from 'react-router-dom';

export const CategoryBreadcrumbs = () => {
  const { pickedSubcategory, categories } = useUserData();
  const selectedProduct = useSelector((state: RootState) => state.product.selectedProduct);
  const location = useLocation();
  const { setPickedSubcategory, clearPickedSubcategory } = usePickedSubcategory();

  // Определяем, находимся ли мы на главной странице
  const isHomePage = location.pathname === '/';

  // Находим родительскую категорию для pickedSubcategory
  const parentCategory = categories.find(cat =>
    cat.childrens.some(child => child.uuid === pickedSubcategory?.uuid)
  );

  return (
    <div className='breadcrump-wrapper'>
      {selectedProduct ? (
        // Страница продукта
        <nav className="breadcrumb layout">
          <Link to="/" className="breadcrumb-link">Головна</Link>
          <span className="breadcrumb-separator">/</span>
          <Link to={`/category/${pickedSubcategory?.uuid}`} className="breadcrumb-link">
            {pickedSubcategory?.name || 'Категорія'}
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{selectedProduct?.title}</span>
        </nav>
      ) : pickedSubcategory ? (
        // Страница категории
        <nav className="breadcrumb layout">
          <Link to="/" className="breadcrumb-link">Головна</Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">{pickedSubcategory?.name || 'Категорія'}</span>
        </nav>
      ) : (
        // Главная страница или другие страницы без категории
        <nav className="breadcrumb layout">
          <span className="breadcrumb-current">Головна</span>
        </nav>
      )}
    </div>
  );
};
