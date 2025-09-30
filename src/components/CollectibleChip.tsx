import React from 'react';
import { Badge } from './ui/badge';

interface CollectibleChipProps {
  type: 'Sticker' | 'Card' | string;
  name?: string;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function CollectibleChip({ 
  type, 
  name, 
  variant = 'outline',
  className = '',
  style = {},
  onClick 
}: CollectibleChipProps) {
  const displayText = name ? `${name}` : type;
  
  // Custom styling for golden collectible chips
  const collectibleStyle: React.CSSProperties = {
    backgroundColor: 'rgba(255, 176, 57, 0.1)',
    color: '#FFB039',
    borderColor: 'rgba(255, 176, 57, 0.3)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '180px',
    height: '24px',
    display: 'inline-flex',
    alignItems: 'center',
    cursor: onClick ? 'pointer' : 'default',
    ...style
  };

  return (
    <Badge
      variant={variant}
      title={displayText} // Full text on hover
      className={`${className} hover:scale-105 transition-transform`}
      style={collectibleStyle}
      onClick={onClick}
    >
      {displayText}
    </Badge>
  );
}

// Type chip specifically for collectible types (Sticker, Card)
export function CollectibleTypeChip({ 
  type, 
  className = '', 
  onClick 
}: { 
  type: 'Sticker' | 'Card' | string; 
  className?: string; 
  onClick?: () => void; 
}) {
  return (
    <CollectibleChip
      type={type}
      className={className}
      onClick={onClick}
      style={{
        fontSize: '11px',
        padding: '4px 8px',
        height: '20px',
        maxWidth: '160px'
      }}
    />
  );
}