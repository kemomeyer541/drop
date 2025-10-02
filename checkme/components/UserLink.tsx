import React from 'react';

interface UserLinkProps {
  userId?: string;
  username: string;
  displayName?: string;
  handle?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent) => void;
  children?: React.ReactNode;
}

export function UserLink({ 
  userId, 
  username, 
  displayName, 
  handle,
  className = '',
  style,
  onClick,
  children
}: UserLinkProps) {
  const finalDisplayName = displayName || username;
  const finalHandle = handle || username;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (onClick) {
      onClick(e);
    } else {
      // Default behavior - could open profile drawer here
      console.log('Open profile for:', { userId, username, handle: finalHandle });
    }
  };

  // If missing required data, fall back to non-clickable text
  if (!username) {
    console.warn('UserLink missing username:', { userId, username, displayName, handle });
    return <span className={className} style={style}>{children || finalDisplayName}</span>;
  }

  return (
    <a
      href={`/profile/${finalHandle}`}
      onClick={handleClick}
      className={`cursor-pointer hover:underline ${className}`}
      style={style}
      aria-label={`Open ${finalDisplayName} profile`}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick(e as any);
        }
      }}
    >
      {children || finalDisplayName}
    </a>
  );
}