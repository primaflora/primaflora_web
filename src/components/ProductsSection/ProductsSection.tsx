import { Card } from '../Card';
import './styles.css';
import { TProductsSectionProps } from './types';

export const ProductsSection = ({ title, products }: TProductsSectionProps) => {
    return (
        <div className="product-section-container">
            <p className="section-title">{title}</p>
            <div className="cards">
                {products
                .slice() // чтобы не мутировать оригинальный массив
                .sort((a, b) => a.title.localeCompare(b.title)).map(product => (
                    <Card card={{...product, like: product.like}} key={product.uuid} />
                ))}
            </div>
        </div>
    );
};
