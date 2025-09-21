import React, { useState } from 'react';
import { FloatingCard } from '../FloatingCard';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Star, Sparkles, Crown, Gem } from 'lucide-react';

interface MintingMenuProps {
  onClose: () => void;
  onMinimize: () => void;
  initialPosition: { x: number; y: number };
  width: number;
  height: number;
  zIndex: number;
  onPositionChange: (position: { x: number; y: number }) => void;
  onSizeChange: (size: { width: number; height: number }) => void;
  onFocus: () => void;
}

interface Rarity {
  id: string;
  name: string;
  cost: number;
  probability: number;
  color: string;
  icon: React.ReactNode;
  type: 'sticker' | 'card';
  description: string;
}

const rarities: Rarity[] = [
  {
    id: 'common',
    name: 'Common',
    cost: 10,
    probability: 60,
    color: 'text-gray-400 border-gray-400',
    icon: <Star className="w-4 h-4" />,
    type: 'sticker',
    description: 'Basic collectible sticker'
  },
  {
    id: 'uncommon',
    name: 'Uncommon',
    cost: 25,
    probability: 25,
    color: 'text-green-400 border-green-400',
    icon: <Sparkles className="w-4 h-4" />,
    type: 'sticker',
    description: 'Enhanced sticker with special effects'
  },
  {
    id: 'rare',
    name: 'Rare',
    cost: 50,
    probability: 10,
    color: 'text-blue-400 border-blue-400',
    icon: <Gem className="w-4 h-4" />,
    type: 'sticker',
    description: 'Premium sticker with unique artwork'
  },
  {
    id: 'epic',
    name: 'Epic',
    cost: 100,
    probability: 4,
    color: 'text-purple-400 border-purple-400',
    icon: <Crown className="w-4 h-4" />,
    type: 'card',
    description: 'Collectible card with premium features'
  },
  {
    id: 'legendary',
    name: 'Legendary',
    cost: 250,
    probability: 1,
    color: 'text-yellow-400 border-yellow-400',
    icon: <Crown className="w-4 h-4 text-yellow-400" />,
    type: 'card',
    description: 'Ultra-rare card with exclusive benefits'
  }
];

export function MintingMenu({
  onClose,
  onMinimize,
  initialPosition,
  width,
  height,
  zIndex,
  onPositionChange,
  onSizeChange,
  onFocus
}: MintingMenuProps) {
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [userStars] = useState(1847); // Mock user star balance
  const [previewImage] = useState('/api/placeholder/200/200'); // Mock preview

  const handleMint = (rarityId: string) => {
    const rarity = rarities.find(r => r.id === rarityId);
    if (rarity && userStars >= rarity.cost) {
      console.log(`Minting ${rarity.name} for ${rarity.cost} stars`);
      // Handle minting logic
    }
  };

  return (
    <FloatingCard
      title="Mint Collectible"
      onClose={onClose}
      onMinimize={onMinimize}
      initialPosition={initialPosition}
      width={width}
      height={height}
      zIndex={zIndex}
      onPositionChange={onPositionChange}
      onSizeChange={onSizeChange}
      onFocus={onFocus}
    >
      <div className="p-6 h-full">
        {/* User Balance */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-current" />
            <span className="font-semibold dropsource-text-primary">
              {userStars.toLocaleString()} Stars
            </span>
          </div>
          <Badge className="dropsource-btn-secondary text-xs">
            Available Balance
          </Badge>
        </div>

        {/* Preview Section */}
        <div className="mb-6">
          <h3 className="font-semibold dropsource-text-primary mb-3">Preview</h3>
          <div className="dropsource-surface p-4 rounded text-center">
            <div className="w-24 h-24 mx-auto mb-3 bg-gradient-to-br from-purple-500 to-blue-500 rounded flex items-center justify-center">
              <span className="text-3xl">🎵</span>
            </div>
            <h4 className="font-medium dropsource-text-primary">Summer Vibes</h4>
            <p className="text-sm dropsource-text-secondary">Ready to mint</p>
          </div>
        </div>

        {/* Rarity Selection */}
        <div className="mb-6">
          <h3 className="font-semibold dropsource-text-primary mb-3">Choose Rarity</h3>
          <div className="space-y-3 max-h-64 overflow-y-auto dropsource-custom-scrollbar">
            {rarities.map((rarity) => (
              <div
                key={rarity.id}
                className={`dropsource-surface p-4 rounded cursor-pointer transition-all border ${
                  selectedRarity === rarity.id ? 'border-teal-400' : 'border-transparent'
                } ${userStars < rarity.cost ? 'opacity-50' : 'hover:border-gray-500'}`}
                onClick={() => userStars >= rarity.cost && setSelectedRarity(rarity.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {rarity.icon}
                    <span className={`font-semibold ${rarity.color}`}>
                      {rarity.name}
                    </span>
                    <Badge className={`text-xs ${
                      rarity.type === 'card' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'dropsource-btn-ghost'
                    }`}>
                      {rarity.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="font-semibold dropsource-text-primary text-sm">
                      {rarity.cost}
                    </span>
                  </div>
                </div>
                
                <p className="text-xs dropsource-text-secondary mb-2">
                  {rarity.description}
                </p>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="dropsource-text-tertiary">
                    Drop Rate: {rarity.probability}%
                  </span>
                  {userStars < rarity.cost && (
                    <span className="text-red-400">Insufficient Stars</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mint Button */}
        <div className="space-y-3">
          {selectedRarity && (
            <div className="dropsource-surface p-3 rounded">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm dropsource-text-secondary">Selected:</span>
                <span className={`font-semibold ${rarities.find(r => r.id === selectedRarity)?.color}`}>
                  {rarities.find(r => r.id === selectedRarity)?.name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm dropsource-text-secondary">Cost:</span>
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-400 fill-current" />
                  <span className="font-semibold dropsource-text-primary">
                    {rarities.find(r => r.id === selectedRarity)?.cost}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <div className="flex gap-2">
            <Button
              onClick={onClose}
              className="flex-1 dropsource-btn-secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={() => selectedRarity && handleMint(selectedRarity)}
              disabled={!selectedRarity}
              className="flex-1 dropsource-btn-primary"
            >
              Mint Collectible
            </Button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-xs dropsource-text-tertiary text-center">
            Minting creates a unique collectible from your creation ✨
          </p>
        </div>
      </div>
    </FloatingCard>
  );
}