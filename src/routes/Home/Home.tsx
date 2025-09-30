import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SignInModal } from '../../components/common/Modals/SignInModal';
import { SideBar } from '../../components/common/SideBar';
import { Main } from './components/Main/Main';
import './styles.css';
import { usePickedSubcategory } from '../../common/hooks/usePickedSubcategory';
import { useDispatch } from 'react-redux';
import { productSliceActions } from '../../store/modules/product/reducer';
import { SEOHead } from '../../components/common';

export const Home = () => {
    const navigate = useNavigate();
    const inviteCode = useParams().inviteCode as string;
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const { clearPickedSubcategory } = usePickedSubcategory();
    const dispatch = useDispatch();

    useEffect(() => {
        if (inviteCode) {
            handleSignUpOpen();
        }
    });

    useEffect(() => {
        clearPickedSubcategory();
        dispatch(productSliceActions.setSelectedProduct(null));
    }, []);

    const handleSignInModalClose = () => {
        setIsSignUpModalOpen(false);
        navigate('/');
    };

    const handleSignUpOpen = () => {
        setIsSignUpModalOpen(true);
    };

    const handleMoveToLogIn = () => {};

    return (
        <div className="home-container py-10 max-lg:py-0">
            <SEOHead />
            <div className="flex">
                <SideBar />
                <Main />
            </div>
            <SignInModal
                inviteCode={inviteCode}
                isOpen={isSignUpModalOpen}
                onClose={handleSignInModalClose}
                onMoveToLogIn={handleMoveToLogIn}
            />
        </div>
    );
};
