import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { X, Upload, Star, Globe, Lock, Eye, Move } from 'lucide-react';

interface DropMenuProps {
  onClose: () => void;
  position?: { x: number; y: number };
}

export function DropMenu({ onClose, position = { x: 0, y: 0 } }: DropMenuProps) {
  const [price, setPrice] = useState<number>(25);
  const [visibility, setVisibility] = useState<'global' | 'profile'>('global');
  const [hasFile, setHasFile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState(position);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      const rect = e.currentTarget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setCurrentPosition({
        x: Math.max(0, Math.min(window.innerWidth - 340, e.clientX - dragOffset.x)),
        y: Math.max(0, Math.min(window.innerHeight - 600, e.clientY - dragOffset.y))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleUpload = () => {
    setHasFile(true);
    console.log('File upload triggered');
  };

  const handleDrop = () => {
    console.log('Drop created:', { price, visibility });
    onClose();
  };

  return (
    <div 
      className={`fixed z-50 ${isDragging ? 'dragging' : ''}`}
      style={{ 
        left: currentPosition.x,
        top: currentPosition.y,
        transform: 'none' // Remove the centering transform
      }}
      onMouseDown={handleMouseDown}
    >
      <Card 
        className="dropsource-card"
        style={{ width: '320px', cursor: isDragging ? 'grabbing' : 'default' }}
      >
        {/* Header with drag handle */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700 drag-handle" style={{ cursor: 'grab' }}>
          <div className="flex items-center gap-2">
            <Move className="w-4 h-4 dropsource-text-secondary" />
            <h3 className="font-semibold dropsource-text-primary">Create Drop</h3>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="dropsource-toolbar-button p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          {/* Upload Section */}
          <div>
            <label className="block text-sm font-medium dropsource-text-primary mb-2">
              Upload Content
            </label>
            {!hasFile ? (
              <button
                onClick={handleUpload}
                className="w-full border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-teal-400 transition-colors"
              >
                <Upload className="w-8 h-8 mx-auto mb-2 dropsource-text-secondary" />
                <p className="dropsource-text-secondary text-sm">
                  Click to upload audio, lyrics, or project file
                </p>
              </button>
            ) : (
              <div className="dropsource-surface p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center">
                    <Upload className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium dropsource-text-primary">summer_vibes_demo.mp3</h4>
                    <p className="text-xs dropsource-text-secondary">2.4 MB • Ready to drop</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Price Section */}
          <div>
            <label className="block text-sm font-medium dropsource-text-primary mb-2">
              Price
            </label>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="dropsource-input flex-1"
                min="1"
                max="1000"
              />
              <span className="dropsource-text-secondary text-sm">stars</span>
            </div>
          </div>

          {/* Visibility Section */}
          <div>
            <label className="block text-sm font-medium dropsource-text-primary mb-2">
              Visibility
            </label>
            <Select value={visibility} onValueChange={(value: 'global' | 'profile') => setVisibility(value)}>
              <SelectTrigger className="dropsource-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dropsource-panel">
                <SelectItem value="global" className="dropsource-text-primary hover:dropsource-surface">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Global - Everyone can see
                  </div>
                </SelectItem>
                <SelectItem value="profile" className="dropsource-text-primary hover:dropsource-surface">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Profile Only - Friends and followers
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          {hasFile && (
            <div className="border border-gray-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs dropsource-text-secondary">Preview</span>
                <Badge className="text-xs dropsource-text-primary">
                  {visibility === 'global' ? 'Public' : 'Private'}
                </Badge>
              </div>
              <div className="dropsource-surface p-3 rounded">
                <h4 className="font-medium dropsource-text-primary">Summer Vibes Demo</h4>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold">{price}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3 dropsource-text-secondary" />
                    <span className="text-xs dropsource-text-secondary">
                      {visibility === 'global' ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={onClose}
              className="flex-1 dropsource-btn-secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDrop}
              disabled={!hasFile}
              className="flex-1 dropsource-btn-primary"
            >
              Create Drop
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}