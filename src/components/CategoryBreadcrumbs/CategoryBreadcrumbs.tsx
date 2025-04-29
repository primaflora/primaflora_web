import { Link } from 'react-router-dom';
import { useUserData } from '../../store/tools';
import { usePickedSubcategory } from '../../common/hooks/usePickedSubcategory';
import "./CategoryBreadcrumbs.css";
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
export const CategoryBreadcrumbs = () => {
//   const { pickedSubcategory } = usePickedSubcategory();
  const { pickedSubcategory, categories } = useUserData();
//   const {selectedProduct} = useProductData()
    const selectedProduct = useSelector((state: RootState) => state.product.selectedProduct);
  console.log(selectedProduct)
  console.log(pickedSubcategory)
  const { setPickedSubcategory, clearPickedSubcategory } = usePickedSubcategory();

//   if (!pickedSubcategory) return null; // Если нет выбранной подкатегории — ничего не рендерим

  // Находим родительскую категорию для pickedSubcategory
  const parentCategory = categories.find(cat =>
    cat.childrens.some(child => child.uuid === pickedSubcategory?.uuid)
  );

  return (
    <div className='breadcrump-wrapper'>
        {
            pickedSubcategory && !selectedProduct?
            <nav className="breadcrumb layout">
                <Link to="/" className="breadcrumb-link">Головна</Link>
                <span className="breadcrumb-separator">/</span>
                <span className="breadcrumb-current">{pickedSubcategory?.name}</span>
            </nav>
            : (
                selectedProduct ? 
                <nav className="breadcrumb layout">
                    <Link to="/" className="breadcrumb-link">Головна</Link>
                    <span className="breadcrumb-separator">/</span>
                    <Link to={`/category/${pickedSubcategory?.uuid}`} className="breadcrumb-link">{pickedSubcategory?.name}</Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">{selectedProduct?.title}</span>
                </nav>
                :
                <nav className="breadcrumb layout"></nav>
            )
        }
    </div>
  );
};
