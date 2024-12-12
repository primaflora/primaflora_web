import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { StorageService } from './common/storage/storage.service';
import { Toast } from './common/toast';
import { Footer, Header } from './components/common';
import { Home, LogIn, UserInfo } from './routes';
import { Cart } from './routes/Cart/Cart';
import { Category } from './routes/Category';
import { Likes } from './routes/Likes';
import { Product } from './routes/Product';
import { useAuth } from './common/hooks/useAuth/useAuth';
import { useLoadCategories } from './components/loader/categories.loader';
import { useLoadUserData } from './components/loader/user-data.loader';
import './common/i18n';
import './index.css';
import { Admin } from './routes/Admin';
import { AdminComments } from './routes/Admin/routes/Comments';
import { AdminProduct, ProductsTable } from './routes/Admin/routes/Product';
import { AdminProductEdit } from './routes/Admin/routes/Product/components/EditProduct';
import { useUserData } from './store/tools';
import AdminCreateCategories from './routes/Admin/routes/Categories/components/AdminCreateCategories';
import AdminCategoriesTable from './routes/Admin/routes/Categories/components/AdminCategoriesTable';
import AdminSubcategoryEdit from './routes/Admin/routes/Categories/components/AdminSubcategoryEdit';

function App() {
    const { setIsAuth } = useAuth();
    const { load: loadUserData } = useLoadUserData();
    const { load: loadCategories } = useLoadCategories();

    useEffect(() => {
        if (
            StorageService.getToken('accessToken') ||
            StorageService.getToken('refreshToken')
        ) {
            setIsAuth(true);
            loadUserData();
        }
        loadCategories();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="app-main-container">
            <Header />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/category/:uuid" element={<Category />} />
                <Route path="/product/:uuid" element={<Product />} />
                <Route path="/likes" element={<Likes />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/user-info" element={<UserInfo />} />
                <Route path="/auth/log-in" element={<LogIn />} />
                <Route
                    path="/auth/sign-up/invite/:inviteCode"
                    element={<Home />}
                />
                <Route path="/admin-page" element={<Admin/>}>
                    <Route path="products">
                        <Route path='create' element={<AdminProduct/>}/>
                        <Route path='edit/:uuid' element={<AdminProductEdit/>}/>
                        <Route path='table' element={<ProductsTable/>}/>
                    </Route>
                    <Route path="comments" element={<AdminComments/>}/>
                    <Route path="categories">
                        <Route path='create' element={<AdminCreateCategories/>}/>
                        <Route path='table' element={<AdminCategoriesTable/>}/>
                        <Route path='subcategory/edit/:subcategoryId' element={<AdminSubcategoryEdit/>}/>
                    </Route>
                </Route>
            </Routes>

            <Footer />
            <Toast />
        </div>
    );
}

export default App;
