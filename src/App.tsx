import { Route, Routes } from 'react-router-dom';
import { Footer, Header } from './components/common';
import './index.css';
import { Home, LogIn, SignUp, UserInfo } from './routes';
import { useEffect } from 'react';
import { useAuth } from './common/hooks/useAuth/useAuth';
import { StorageService } from './common/storage/storage.service';
import { Service } from './common/services';
import 'react-toastify/dist/ReactToastify.css';

function App() {
    const { setIsAuth, setUserData } = useAuth();

    useEffect(() => {
        if (StorageService.getToken('accessToken') || StorageService.getToken('refreshToken')) {
            setIsAuth(true);
            loadUserData();
        }
    }, []);

    const loadUserData = () => {
        Service.UserService.getUserByToken()
            .then(res => setUserData(res.data))
            .catch(err => console.log(err));
    };

    return (
        <div className="app-main-container">
            <Header />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/auth/sign-up" element={<SignUp />} />
                <Route path="/auth/log-in" element={<LogIn />} />
                <Route path="/user-info" element={<UserInfo />} />
            </Routes>

            <Footer />
        </div>
    );
}

export default App;
