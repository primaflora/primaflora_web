import { Card } from '../Card';
import './styles.css';
import { TProductsSectionProps } from './types';

export const ProductsSection = ({ title, products }: TProductsSectionProps) => {
    // Сортируем товары и сохраняем отсортированный массив
    const sortedProducts = products
        .slice() // чтобы не мутировать оригинальный массив
        .sort((a, b) => a.title.localeCompare(b.title));
    
    return (
        <div className="product-section-container">
            <p className="section-title">{title}</p>
            <div className="cards" style={{marginTop: 20}}>
                {sortedProducts.map((product, index) => (
                    <Card card={{...product, like: product.like}} index={index} key={product.uuid} />
                ))}
            </div>
        </div>
    );
};
