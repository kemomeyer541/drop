import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

interface EmojiPickerMenuProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
  position?: { x: number; y: number };
}

const emojiCategories = {
  'Reactions': ['🔥', '💯', '💎', '⭐', '🎵', '🎶', '👏', '💪', '🙌', '❤️', '😍', '🤩'],
  'Music': ['🎤', '🎧', '🎸', '🥁', '🎹', ' trumpet', '🎷', '🎻', '🎼', '🎵', '🎶', '🔊'],
  'Faces': ['😀', '😂', '🤣', '😊', '😎', '🤔', '😮', '😍', '🥳', '🔥', '💀', '👻'],
  'Objects': ['💰', '💎', '🏆', '👑', '⚡', '💫', '✨', '🌟', '🔮', '🎭', '🎪', '🎨']
};

export function EmojiPickerMenu({ onEmojiSelect, onClose, position = { x: 0, y: 0 } }: EmojiPickerMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string>('Reactions');

  return (
    <div 
      className="fixed"
      style={{ 
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -100%)',
        zIndex: 9999, // Higher z-index to ensure it floats above everything
        overflow: 'visible' // Ensure container doesn't clip content
      }}
    >
      <Card 
        className="dropsource-card"
        style={{ 
          width: '300px', 
          maxHeight: '400px',
          overflow: 'visible', // Allow content to overflow if needed
          zIndex: 9999 // Ensure the card itself has high z-index
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h3 className="font-semibold dropsource-text-primary">Add Reaction</h3>
          <Button
            size="sm"
            variant="ghost"
            onClick={onClose}
            className="dropsource-toolbar-button p-1"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Category Tabs */}
        <div className="flex border-b border-gray-700">
          {Object.keys(emojiCategories).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-2 text-xs transition-all ${
                activeCategory === category
                  ? 'dropsource-text-primary border-b-2 border-teal-400'
                  : 'dropsource-text-secondary hover:dropsource-text-primary'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Emoji Grid */}
        <div className="p-4">
          <div className="grid grid-cols-6 gap-2">
            {emojiCategories[activeCategory as keyof typeof emojiCategories].map((emoji, index) => (
              <button
                key={index}
                onClick={() => {
                  onEmojiSelect(emoji);
                  onClose();
                }}
                className="w-8 h-8 flex items-center justify-center text-lg hover:bg-gray-700 rounded transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}