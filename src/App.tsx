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
import './App.css'
import { Admin } from './routes/Admin';
import { AdminComments } from './routes/Admin/routes/Comments';
import { AdminProduct, ProductsTable } from './routes/Admin/routes/Product';
import { AdminProductEdit } from './routes/Admin/routes/Product/components/EditProduct';
import { useUserData } from './store/tools';
import AdminCreateCategories from './routes/Admin/routes/Categories/components/AdminCreateCategories';
import AdminCategoriesTable from './routes/Admin/routes/Categories/components/AdminCategoriesTable';
import AdminSubcategoryEdit from './routes/Admin/routes/Categories/components/AdminSubcategoryEdit';
import { Checkout } from './routes/Checkout/Checkout';
import { CheckoutSuccess } from './routes/CheckoutSuccess/CheckoutSuccess';
import { AdminOrders } from './routes/Admin/routes/Orders/AdminOrders';
import { CategoryBreadcrumbs } from './components/CategoryBreadcrumbs/CategoryBreadcrumbs';
import AdminSlides from './routes/Admin/routes/Slides/AdminSlides';
import { AdminImageArchive } from './routes/Admin/routes/ImageArchive';

function App() {
    const { setIsAuth } = useAuth();
    const { load: loadUserData } = useLoadUserData();
    const { load: loadCategories } = useLoadCategories();
    const { user } = useUserData();

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
                <CategoryBreadcrumbs />
            <div className='layout'>
                

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/category/:uuid" element={<Category />} />
                    <Route path="/product/:uuid" element={<Product />} />
                    <Route path="/likes" element={<Likes />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout userId={user?.uuid}/>} />
                    <Route path="/checkout/success" element={<CheckoutSuccess/>} />
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
                        <Route path="orders" element={<AdminOrders/>}/>
                        <Route path="slides" element={<AdminSlides/>}/>
                        <Route path="file-archive" element={<AdminImageArchive/>}/>
                    </Route>
                </Routes>
            </div>
            <Footer />
            <Toast />
        </div>
    );
}

export default App;
