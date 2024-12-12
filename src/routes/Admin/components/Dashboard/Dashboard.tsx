import { Images } from '../../../../assets';
import { DashboardElem } from './components/DashboardElem';
import './styles.css';

export const Dashboard = () => {
    return (
        <aside className='admin-dashboard'>
            <div className='dashboard-title-container'>
                <img src={Images.AdminIcon} width={36} alt='Admin' />
                <h1 className='dashboard-title-text'>Admin Dashboard</h1>
            </div>
            <DashboardElem title='Users' icon={Images.UserIconMob} link='/admin-page/users' />
            <DashboardElem
                title='Categories'
                icon={Images.FolderIcon}
                link='/admin-page/categories/table'
                dropdownElems={[
                    {label: 'Categories Table', link: '/admin-page/categories/table'},
                    { label: 'Create Category', link: '/admin-page/categories/create' },
                ]}
            />
            <DashboardElem 
                title='Products' 
                icon={Images.AddNoteIcon}   
                link='/admin-page/products/table'
                dropdownElems={[
                    { label: 'Products Table', link: '/admin-page/products/table' },
                    { label: 'Create Product', link: '/admin-page/products/create' },
                ]} />
            <DashboardElem title='Comments' icon={Images.AddCommentIcon} link='/admin-page/comments' />
            <DashboardElem title='Orders' icon={Images.CartIconMob} link='/admin-page/orders' />
        </aside>
    );
};


// Users
// Categories
// Products
// Comments
// Ordres