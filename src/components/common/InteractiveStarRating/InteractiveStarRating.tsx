import React, { useState } from 'react';
import { Star } from 'lucide-react';
import './styles.css';

interface InteractiveStarRatingProps {
    rating: number;
    onRatingChange: (rating: number) => void;
    size?: 'small' | 'medium' | 'large';
    disabled?: boolean;
}

export const InteractiveStarRating: React.FC<InteractiveStarRatingProps> = ({
    rating,
    onRatingChange,
    size = 'medium',
    disabled = false,
}) => {
    const [hoveredRating, setHoveredRating] = useState<number | null>(null);

    const getSizeConfig = () => {
        switch (size) {
            case 'small':
                return { starSize: 16, gap: 2 };
            case 'medium':
                return { starSize: 20, gap: 4 };
            case 'large':
                return { starSize: 24, gap: 6 };
            default:
                return { starSize: 20, gap: 4 };
        }
    };

    const { starSize, gap } = getSizeConfig();
    const displayRating = hoveredRating !== null ? hoveredRating : rating;

    const handleStarClick = (starIndex: number) => {
        if (!disabled) {
            onRatingChange(starIndex);
        }
    };

    const handleStarHover = (starIndex: number) => {
        if (!disabled) {
            setHoveredRating(starIndex);
        }
    };

    const handleMouseLeave = () => {
        if (!disabled) {
            setHoveredRating(null);
        }
    };

    const renderStars = () => {
        const stars = [];

        for (let i = 1; i <= 5; i++) {
            const isFilled = i <= displayRating;
            
            stars.push(
                <Star
                    key={i}
                    size={starSize}
                    className={`interactive-star ${isFilled ? 'filled' : 'empty'} ${disabled ? 'disabled' : 'clickable'}`}
                    onClick={() => handleStarClick(i)}
                    onMouseEnter={() => handleStarHover(i)}
                    fill={isFilled ? '#FFD700' : 'transparent'}
                    stroke={isFilled ? '#FFD700' : '#DDD'}
                    style={{ 
                        marginRight: i < 5 ? `${gap}px` : '0',
                        cursor: disabled ? 'default' : 'pointer'
                    }}
                />
            );
        }

        return stars;
    };

    return (
        <div 
            className={`interactive-star-rating ${size}`}
            onMouseLeave={handleMouseLeave}
        >
            {renderStars()}
        </div>
    );
};