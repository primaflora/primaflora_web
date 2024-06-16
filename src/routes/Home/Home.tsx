import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SignInModal } from '../../components/common/Modals/SignInModal';
import { SideBar } from '../../components/common/SideBar';
import { Main } from './components/Main/Main';
import './styles.css';

export const Home = () => {
    const navigate = useNavigate();
    const inviteCode = useParams().inviteCode as string;
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

    useEffect(() => {
        if (inviteCode) {
            handleSignUpOpen();
        }
    });

    const handleSignInModalClose = () => {
        setIsSignUpModalOpen(false);
        navigate('/');
    };

    const handleSignUpOpen = () => {
        setIsSignUpModalOpen(true);
    };

    const handleMoveToLogIn = () => {};

    return (
        <div className="home-container main-global-padding py-10 max-lg:py-0">
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
