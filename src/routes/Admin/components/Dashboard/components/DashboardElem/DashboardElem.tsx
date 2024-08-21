import { NavLink } from 'react-router-dom';
import { TDashboardElemProps } from './types.ts';
import './styles.css';
import { Link } from 'react-router-dom';

export const DashboardElem = ({ title, icon, link, dropdownElems }: TDashboardElemProps) => {
    return (
        <NavLink to={link} className={({isActive}) => isActive ? 'dashboard-elem active' : 'dashboard-elem' }>
            <div className='dashboard-elem-border' />

            <img src={icon} width={24} alt={title} />
            <h1 className='dashboard-elem-text'>{title}</h1>

            {
                dropdownElems &&
                    <div className='dashboard-elem-dropdown'>
                        {
                            dropdownElems.length !== 0 && dropdownElems.map((elem) => {
                                return (
                                    <Link to={elem.link} className='dashboard-elem-dropdown-elem'>
                                        <div className='dashboard-elem-dropdown-elem-border' />
                                        <h1>{elem.label}</h1>
                                    </Link>
                                )
                            })
                        }
                    </div>
            }
        </NavLink>
    );
};
