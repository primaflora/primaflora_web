import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './common/hooks/useAuth/useAuth';
import { useCategories } from './common/hooks/useCategories';
import { Service } from './common/services';
import { StorageService } from './common/storage/storage.service';
import { Toast } from './common/toast';
import { Footer, Header } from './components/common';
import { Home, LogIn, UserInfo } from './routes';
import { Cart } from './routes/Cart/Cart';
import { Category } from './routes/Category';
import { Likes } from './routes/Likes';
import { Product } from './routes/Product';
import './index.css';
import './common/i18n';

function App() {
    const { setIsAuth, setUserData } = useAuth();
    const { setCategories } = useCategories();

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

    const loadUserData = () => {
        Service.UserService.getUserByToken({ loadInvitedUser: true })
            .then(res => setUserData(res.data))
            .catch(err => console.log(err));
    };

    const loadCategories = () => {
        Service.CategoryService.getAll()
            .then(res => setCategories(res.data))
            .catch(err => console.log(err));
    };

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
