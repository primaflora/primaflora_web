import React from 'react';
import { StarIcon } from 'lucide-react';
import './styles.css';

interface StarRatingProps {
    rating: number;
    maxRating?: number;
    size?: 'small' | 'medium' | 'large';
}

export const StarRating: React.FC<StarRatingProps> = ({ 
    rating, 
    maxRating = 5, 
    size = 'small' 
}) => {
    const stars = [];
    
    // Для отладки
    // console.log('StarRating - rating:', rating, 'type:', typeof rating);
    
    const getStarSize = () => {
        switch (size) {
            case 'small': return 16;
            case 'medium': return 20;
            case 'large': return 24;
            default: return 16;
        }
    };
    
    for (let i = 1; i <= maxRating; i++) {
        const isFilled = i <= Math.floor(rating);
        const isHalfFilled = i === Math.ceil(rating) && rating % 1 !== 0;
        
        // console.log(`Star ${i}: isFilled=${isFilled}, isHalfFilled=${isHalfFilled}, rating=${rating}`);
        
        stars.push(
            <div key={i} className={`star-wrapper ${size}`}>
                <StarIcon 
                    size={getStarSize()}
                    fill={isFilled ? '#fbbf24' : isHalfFilled ? '#fbbf24' : '#e5e7eb'}
                    stroke={isFilled || isHalfFilled ? '#f59e0b' : '#d1d5db'}
                    strokeWidth={1}
                />
                {isHalfFilled && (
                    <div 
                        className="star-half-overlay"
                        style={{
                            width: '50%',
                            height: '100%',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            overflow: 'hidden'
                        }}
                    >
                        <StarIcon 
                            size={getStarSize()}
                            fill="#fbbf24"
                            stroke="#f59e0b"
                            strokeWidth={1}
                        />
                    </div>
                )}
            </div>
        );
    }
    
    return (
        <div className="star-rating">
            {stars}
        </div>
    );
};