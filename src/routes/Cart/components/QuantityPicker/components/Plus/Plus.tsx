import { FC } from 'react';
import './styles.css';
import { PlusProps } from './types';

const Plus: FC<PlusProps> = ({ onClick }) => {
    return (
        <svg
            className="plus-icon"
            viewBox="0 0 32 32"
            xmlns="http://www.w3.org/2000/svg"
            onClick={onClick}>
            <path d="M30.3998 14.4H17.6V1.5999C17.6 0.716892 16.8832 0 15.9999 0C15.1168 0 14.4 0.716892 14.4 1.5999V14.4H1.5999C0.716892 14.4 0 15.1168 0 15.9999C0 16.8832 0.716892 17.6 1.5999 17.6H14.4V30.3998C14.4 31.2831 15.1168 32 15.9999 32C16.8832 32 17.6 31.2831 17.6 30.3998V17.6H30.3998C31.2831 17.6 32 16.8832 32 15.9999C32 15.1168 31.2831 14.4 30.3998 14.4Z" />
        </svg>
    );
};

export default Plus;
