import { Card } from '../Card';
import './styles.css';
import { TProductsSectionProps } from './types';

export const ProductsSection = ({ title, products }: TProductsSectionProps) => {
    return (
        <div className="product-section-container">
            <p className="section-title">{title}</p>
            <div className="cards" style={{marginTop: 20}}>
                {products.map((product, index) => (
                    <Card card={product} index={index} key={product.uuid} />
                ))}
            </div>
        </div>
    );
};
