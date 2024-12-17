import './styles.css';
import { TCategoryTagProps } from './types';

export const CategoryTag = ({ title, link }: TCategoryTagProps) => {
    return (
        <div className="table-category-tag" style={{marginRight: 2}}>
            <a href={link}>{title}</a>
        </div>
    );
}