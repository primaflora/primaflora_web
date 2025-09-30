import React from 'react';
import './styles.css';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = '4px',
  className = '',
  style = {}
}) => {
  return (
    <div
      className={`skeleton ${className}`}
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
    />
  );
};

export const ProductSkeleton: React.FC = () => {
  return (
    <div className="product-skeleton-container">
      <Skeleton height="32px" width="200px" style={{ marginBottom: '24px' }} />
      
      <div className="product-skeleton-main">
        <Skeleton height="400px" width="400px" className="product-skeleton-image" />
        
        <div className="product-skeleton-content">
          <Skeleton height="40px" width="300px" style={{ marginBottom: '16px' }} />
          <Skeleton height="20px" width="100%" style={{ marginBottom: '8px' }} />
          <Skeleton height="20px" width="90%" style={{ marginBottom: '8px' }} />
          <Skeleton height="20px" width="80%" style={{ marginBottom: '24px' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '50px 0' }}>
            <Skeleton height="24px" width="120px" />
            <Skeleton height="40px" width="40px" borderRadius="50%" />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Skeleton height="20px" width="80px" style={{ marginBottom: '8px' }} />
              <Skeleton height="32px" width="120px" />
            </div>
            <Skeleton height="48px" width="120px" />
          </div>
        </div>
      </div>
      
      <div style={{ margin: '40px 0' }}>
        <Skeleton height="1px" width="100%" />
      </div>
      
      <div style={{ marginBottom: '40px' }}>
        <Skeleton height="20px" width="100%" style={{ marginBottom: '12px' }} />
        <Skeleton height="20px" width="95%" style={{ marginBottom: '12px' }} />
        <Skeleton height="20px" width="85%" />
      </div>
      
      <div style={{ margin: '40px 0' }}>
        <Skeleton height="1px" width="100%" />
      </div>
      
      <div>
        <Skeleton height="24px" width="150px" style={{ marginBottom: '16px' }} />
        <Skeleton height="100px" width="100%" />
      </div>
    </div>
  );
};

export const CategoryUpperViewSkeleton: React.FC = () => {
  return (
    <div className="category-upper-skeleton">
      <div className="category-skeleton-content">
        <Skeleton height="20px" width="100%" style={{ marginBottom: '8px' }} />
        <Skeleton height="20px" width="80%" style={{ marginBottom: '8px' }} />
        <Skeleton height="20px" width="60%" />
      </div>
      <Skeleton height="200px" width="300px" className="category-skeleton-image" />
    </div>
  );
};

export const SideBarSkeleton: React.FC = () => {
  return (
    <div className="sidebar-skeleton">
      {[1, 2, 3].map((i) => (
        <div key={i} className="sidebar-category-skeleton">
          <Skeleton height="24px" width="80%" style={{ marginBottom: '12px' }} />
          {[1, 2, 3].map((j) => (
            <Skeleton key={j} height="18px" width="60%" style={{ marginBottom: '8px', marginLeft: '16px' }} />
          ))}
        </div>
      ))}
    </div>
  );
};