import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './common/i18n';
import { Service } from './common/services';
import { StorageService } from './common/storage/storage.service';
import { Toast } from './common/toast';
import { Footer, Header } from './components/common';
import './index.css';
import { Home, LogIn, UserInfo } from './routes';
import { Cart } from './routes/Cart/Cart';
import { Category } from './routes/Category';
import { Likes } from './routes/Likes';
import { Product } from './routes/Product';
import { useAuth } from './common/hooks/useAuth/useAuth';
import { useLoadCategories } from './components/loader/categories.loader';
import { useLoadUserData } from './components/loader/user-data.loader';

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
            </Routes>

            <Footer />
            <Toast />
        </div>
    );
}

export default App;
