import React, { useState, useRef, useEffect, useCallback } from 'react';
import './styles.css';

interface ImageMagnifierProps {
    src: string;
    alt?: string;
    className?: string;
    magnifierSize?: number;
    zoomLevel?: number;
}

export const ImageMagnifier: React.FC<ImageMagnifierProps> = ({
    src,
    alt = '',
    className = '',
    magnifierSize = 200,
    zoomLevel = 2.5,
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const imageRef = useRef<HTMLImageElement>(null);
    const animationFrameRef = useRef<number>();

    useEffect(() => {
        const updateImageSize = () => {
            if (imageRef.current) {
                const rect = imageRef.current.getBoundingClientRect();
                setImageSize({
                    width: rect.width,
                    height: rect.height,
                });
            }
        };

        // Обновляем размер изображения когда оно загружается
        if (imageRef.current) {
            if (imageRef.current.complete) {
                updateImageSize();
            } else {
                imageRef.current.addEventListener('load', updateImageSize);
            }
        }
        
        window.addEventListener('resize', updateImageSize);
        
        return () => {
            window.removeEventListener('resize', updateImageSize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (imageRef.current) {
                imageRef.current.removeEventListener('load', updateImageSize);
            }
        };
    }, [src]);

    useEffect(() => {
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLImageElement>) => {
        if (!imageRef.current || imageSize.width === 0) return;

        // Отменяем предыдущий кадр анимации если он есть
        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        // Используем requestAnimationFrame для плавности
        animationFrameRef.current = requestAnimationFrame(() => {
            if (!imageRef.current) return;

            const rect = imageRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Убеждаемся, что координаты находятся в границах изображения
            // Добавляем небольшой отступ от краев для стабильности
            const margin = 5;
            const clampedX = Math.max(margin, Math.min(x, imageSize.width - margin));
            const clampedY = Math.max(margin, Math.min(y, imageSize.height - margin));

            // Позиция курсора относительно изображения
            setPosition({ x: clampedX, y: clampedY });

            // Позиция увеличительного стекла
            const magnifierX = e.clientX + 30;
            const magnifierY = e.clientY - magnifierSize / 2;

            // Проверяем границы экрана с буфером
            const buffer = 20;
            let adjustedX = magnifierX;
            let adjustedY = magnifierY;

            // Горизонтальное позиционирование с улучшенной логикой
            if (magnifierX + magnifierSize + buffer > window.innerWidth) {
                // Пытаемся разместить слева
                adjustedX = e.clientX - magnifierSize - 30;
                
                // Если слева тоже не помещается, размещаем как можно ближе к центру
                if (adjustedX < buffer) {
                    const centerX = e.clientX - magnifierSize / 2;
                    adjustedX = Math.max(buffer, Math.min(centerX, window.innerWidth - magnifierSize - buffer));
                }
            }

            // Вертикальное позиционирование
            if (magnifierY < buffer) {
                adjustedY = buffer;
            } else if (magnifierY + magnifierSize + buffer > window.innerHeight) {
                adjustedY = window.innerHeight - magnifierSize - buffer;
            }

            setMagnifierPosition({ x: adjustedX, y: adjustedY });
        });
    }, [imageSize.width, imageSize.height, magnifierSize]);

    const handleMouseEnter = () => {
        if (imageSize.width > 0 && imageSize.height > 0) {
            setIsVisible(true);
        }
    };

    const handleMouseLeave = () => {
        setIsVisible(false);
    };

    return (
        <div className="image-magnifier-container">
            <img
                ref={imageRef}
                src={src}
                alt={alt}
                className={`image-magnifier-source ${className}`}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            />
            
            {isVisible && imageSize.width > 0 && (
                <div
                    className="image-magnifier-glass"
                    style={{
                        position: 'fixed',
                        left: magnifierPosition.x,
                        top: magnifierPosition.y,
                        width: magnifierSize,
                        height: magnifierSize,
                        backgroundImage: `url(${src})`,
                        backgroundSize: `${imageSize.width * zoomLevel}px ${imageSize.height * zoomLevel}px`,
                        backgroundPosition: `-${Math.max(0, Math.min(
                            position.x * zoomLevel - magnifierSize / 2,
                            imageSize.width * zoomLevel - magnifierSize
                        ))}px -${Math.max(0, Math.min(
                            position.y * zoomLevel - magnifierSize / 2,
                            imageSize.height * zoomLevel - magnifierSize
                        ))}px`,
                        backgroundRepeat: 'no-repeat',
                        zIndex: 1000,
                    }}
                />
            )}
        </div>
    );
};