import { Main } from './components/Main/Main';
import { SideBar } from '../../components/common/SideBar';
import './styles.css';

export const Home = () => {
    return (
        <div className="home-container main-global-padding py-10 max-lg:py-0">
            <div className="flex">
                <SideBar />
                <Main />
            </div>
        </div>
    );
};
