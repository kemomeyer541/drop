import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { X, Minus, Move, Maximize2 } from 'lucide-react';
import { Resizable } from 're-resizable';

interface FloatingCardProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  initialPosition: { x: number; y: number };
  width?: number;
  height?: number;
  onPositionChange?: (position: { x: number; y: number }) => void;
  onSizeChange?: (size: { width: number; height: number }) => void;
  zIndex?: number;
  onFocus?: () => void;
}

export function FloatingCard({
  title,
  children,
  onClose,
  onMinimize,
  initialPosition,
  width = 400,
  height = 500,
  onPositionChange,
  onSizeChange,
  zIndex = 50,
  onFocus,
}: FloatingCardProps) {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [size, setSize] = useState({ width, height });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [snapIndicator, setSnapIndicator] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [previousSize, setPreviousSize] = useState({ width, height });
  const [previousPosition, setPreviousPosition] = useState(initialPosition);
  const [isFocused, setIsFocused] = useState(false);
  
  const cardRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  // Snap zones configuration
  const SNAP_THRESHOLD = 20;
  const HEADER_HEIGHT = 64; // Height of the main header bar
  const SNAP_ZONES = {
    top: HEADER_HEIGHT + 10,
    bottom: window.innerHeight - 10,
    left: 10,
    right: window.innerWidth - 10,
  };

  const getSnapPosition = useCallback((x: number, y: number, cardWidth: number, cardHeight: number) => {
    let snapX = x;
    let snapY = y;
    let indicator = null;

    // Ensure card doesn't go above header
    if (y < HEADER_HEIGHT) {
      snapY = HEADER_HEIGHT;
      indicator = 'top';
    }

    // Snap to edges
    if (Math.abs(x) < SNAP_THRESHOLD) {
      snapX = SNAP_ZONES.left;
      indicator = 'left';
    } else if (Math.abs(x + cardWidth - window.innerWidth) < SNAP_THRESHOLD) {
      snapX = window.innerWidth - cardWidth - SNAP_ZONES.left;
      indicator = 'right';
    }

    if (Math.abs(y - HEADER_HEIGHT) < SNAP_THRESHOLD) {
      snapY = SNAP_ZONES.top;
      indicator = indicator ? `${indicator}-top` : 'top';
    } else if (Math.abs(y + cardHeight - window.innerHeight) < SNAP_THRESHOLD) {
      snapY = window.innerHeight - cardHeight - SNAP_ZONES.left;
      indicator = indicator ? `${indicator}-bottom` : 'bottom';
    }

    // Constrain to viewport
    snapX = Math.max(SNAP_ZONES.left, Math.min(snapX, window.innerWidth - cardWidth - SNAP_ZONES.left));
    snapY = Math.max(HEADER_HEIGHT, Math.min(snapY, window.innerHeight - cardHeight - SNAP_ZONES.left));

    return { x: snapX, y: snapY, indicator };
  }, [HEADER_HEIGHT, SNAP_THRESHOLD]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only allow dragging from the header area, and not on interactive elements
    const target = e.target as HTMLElement;
    
    // Debug logging
    console.log('FloatingCard mousedown on:', target.tagName, target.className);
    
    // Prevent dragging from interactive elements
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      console.log('Prevented drag: button element');
      return;
    }
    if (target.tagName === 'INPUT' || target.closest('input')) {
      console.log('Prevented drag: input element');
      return;
    }
    if (target.tagName === 'SELECT' || target.closest('select')) {
      console.log('Prevented drag: select element');
      return;
    }
    if (target.tagName === 'A' || target.closest('a')) {
      console.log('Prevented drag: link element');
      return;
    }
    if (target.closest('[data-no-drag]')) {
      console.log('Prevented drag: data-no-drag area');
      return;
    }
    if (target.closest('.auction-content')) {
      console.log('Prevented drag: auction content area');
      return;
    }
    if (target.closest('.menu-content')) {
      console.log('Prevented drag: menu content area');
      return;
    }
    
    // Only start drag if clicking directly on the header area
    if (!dragRef.current?.contains(target)) {
      console.log('Prevented drag: not in drag ref area');
      return;
    }
    
    // Additional check: ensure we're in the header and not content
    const isHeaderClick = target === dragRef.current || 
                         dragRef.current.contains(target) || 
                         target.classList.contains('move-handle') ||
                         target.closest('.move-handle');
    
    if (!isHeaderClick) {
      console.log('Prevented drag: not a header click');
      return;
    }
    
    console.log('Starting drag for:', title);
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  }, [title]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !cardRef.current) return;

    // Prevent text selection during drag
    e.preventDefault();
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    const snapResult = getSnapPosition(newX, newY, size.width, size.height);
    
    // Smooth position update with requestAnimationFrame
    requestAnimationFrame(() => {
      if (isDragging) { // Double-check we're still dragging
        setPosition({ x: snapResult.x, y: snapResult.y });
        setSnapIndicator(snapResult.indicator);
      }
    });
  }, [isDragging, dragOffset, size, getSnapPosition]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setSnapIndicator(null);
    
    // Persist position when dragging ends
    if (onPositionChange) {
      onPositionChange(position);
    }
  }, [position, onPositionChange]);

  const handleMaximize = useCallback(() => {
    if (isMaximized) {
      // Restore
      const newSize = previousSize;
      const newPosition = previousPosition;
      setSize(newSize);
      setPosition(newPosition);
      setIsMaximized(false);
      
      if (onSizeChange) onSizeChange(newSize);
      if (onPositionChange) onPositionChange(newPosition);
    } else {
      // Maximize
      setPreviousSize(size);
      setPreviousPosition(position);
      const newSize = { 
        width: window.innerWidth - 40, 
        height: window.innerHeight - HEADER_HEIGHT - 40 
      };
      const newPosition = { x: 20, y: HEADER_HEIGHT + 20 };
      setSize(newSize);
      setPosition(newPosition);
      setIsMaximized(true);
      
      if (onSizeChange) onSizeChange(newSize);
      if (onPositionChange) onPositionChange(newPosition);
    }
  }, [isMaximized, size, position, previousSize, previousPosition, HEADER_HEIGHT, onSizeChange, onPositionChange]);

  const handleCardFocus = useCallback(() => {
    setIsFocused(true);
    if (onFocus) {
      onFocus();
    }
  }, [onFocus]);

  const handleCardBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  // Persist size changes
  const handleResizeStop = useCallback((e: any, direction: any, ref: any, d: any) => {
    const newSize = {
      width: size.width + d.width,
      height: size.height + d.height,
    };
    setSize(newSize);
    if (onSizeChange) {
      onSizeChange(newSize);
    }
  }, [size, onSizeChange]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const snapResult = getSnapPosition(position.x, position.y, size.width, size.height);
      setPosition({ x: snapResult.x, y: snapResult.y });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position, size, getSnapPosition]);

  return (
    <>
      {/* Snap indicator */}
      {snapIndicator && (
        <div
          className="fixed z-40 dropsource-snap-indicator rounded-lg pointer-events-none"
          style={{
            left: position.x,
            top: position.y,
            width: size.width,
            height: size.height,
          }}
        />
      )}
      
      {/* Floating card */}
      <Resizable
        size={{ width: size.width, height: size.height }}
        onResizeStop={handleResizeStop}
        onResizeStart={() => setIsResizing(true)}
        onResize={() => setIsResizing(true)}
        minWidth={280}
        minHeight={180}
        maxWidth={window.innerWidth - 40}
        maxHeight={window.innerHeight - HEADER_HEIGHT - 40}
        enable={{
          top: !isMaximized,
          right: !isMaximized,
          bottom: !isMaximized,
          left: !isMaximized,
          topRight: !isMaximized,
          bottomRight: !isMaximized,
          bottomLeft: !isMaximized,
          topLeft: !isMaximized,
        }}
        className={`fixed select-none ${isDragging ? 'dragging' : ''} ${isFocused ? 'dropsource-panel-focused' : ''}`}
        style={{
          left: position.x,
          top: position.y,
          zIndex: isFocused ? zIndex + 10 : zIndex,
          transition: isDragging || isResizing ? 'none' : 'all var(--transition-fast)',
          '--floating-z-index': isFocused ? zIndex + 10 : zIndex,
        } as React.CSSProperties}
        onMouseDown={handleCardFocus}
        tabIndex={0}
        data-floating-menu="true"
      >
        <div
          ref={cardRef}
          className="dropsource-floating-card w-full h-full"
          style={{
            borderRadius: 'var(--radius-sharp)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.16), 0 2px 8px rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Header with drag handle */}
          <div
            ref={dragRef}
            className={`flex items-center justify-between border-b select-none move-handle ${
              isDragging ? 'dropsource-surface cursor-grabbing' : 'dropsource-panel cursor-grab'
            }`}
            style={{
              padding: 'calc(var(--spacing-unit) * 1.5) calc(var(--spacing-unit) * 2)',
              borderBottomColor: 'var(--dropsource-border)',
              borderTopLeftRadius: 'var(--radius-sharp)',
              borderTopRightRadius: 'var(--radius-sharp)',
              transition: 'background-color var(--transition-fast)',
              minHeight: '48px',
              userSelect: 'none',
            }}
            onMouseDown={handleMouseDown}
          >
            <div className="flex items-center dropsource-spacing-xs move-handle">
              <Move className="w-4 h-4 dropsource-text-tertiary dropsource-icon-outlined move-handle" />
              <h3 className="dropsource-text-primary select-none move-handle" style={{ 
                fontSize: 'var(--text-sm)', 
                fontWeight: '500',
                letterSpacing: '0.02em'
              }}>
                {title}
              </h3>
            </div>
            <div className="flex items-center dropsource-spacing-xs">
              <button
                onClick={onMinimize}
                className="dropsource-toolbar-button dropsource-focus-visible"
                style={{
                  width: '28px',
                  height: '28px',
                  padding: '0',
                }}
                title="Minimize"
              >
                <Minus className="w-3 h-3 dropsource-icon-outlined" />
              </button>
              <button
                onClick={handleMaximize}
                className="dropsource-toolbar-button dropsource-focus-visible"
                style={{
                  width: '28px',
                  height: '28px',
                  padding: '0',
                }}
                title={isMaximized ? "Restore" : "Maximize"}
              >
                <Maximize2 className="w-3 h-3 dropsource-icon-outlined" />
              </button>
              <button
                onClick={onClose}
                className="dropsource-toolbar-button dropsource-focus-visible hover:border-red-500 hover:text-red-400"
                style={{
                  width: '28px',
                  height: '28px',
                  padding: '0',
                }}
                title="Close"
              >
                <X className="w-3 h-3 dropsource-icon-outlined" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden" style={{ height: `calc(100% - 48px)` }}>
            <div className="h-full overflow-y-auto dropsource-custom-scrollbar" style={{ 
              padding: 'calc(var(--spacing-unit) * 2)'
            }}>
              {children}
            </div>
          </div>
        </div>
      </Resizable>
    </>
  );
}