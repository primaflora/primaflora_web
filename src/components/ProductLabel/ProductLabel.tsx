import React from 'react';

interface ProductLabelProps {
  label: string;
  labelColor?: string;
}

const ProductLabel: React.FC<ProductLabelProps> = ({ 
  label, 
  labelColor = '#72BF44' // Зеленый цвет по умолчанию
}) => {
  if (!label) return null;

  const labelStyles: React.CSSProperties = {
    position: 'absolute',
    width: 140,
    textAlign: 'center',
    top: '3px',
    left: '3px',
    backgroundColor: labelColor,
    color: '#FFFFFF',
    padding: '6px 8px',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: '500',
    letterSpacing: '0.5px',
    zIndex: 10,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    whiteSpace: 'nowrap',
    maxWidth: 'calc(100% - 16px)',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  };

  return (
    <div style={labelStyles} title={label}>
      {label}
    </div>
  );
};

export default ProductLabel;