import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Star, Sparkles, Crown, Gem, X, Palette, Coins } from 'lucide-react';

interface MintingMenuFullscreenProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Rarity {
  id: string;
  name: string;
  cost: number;
  probability: number;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  type: 'sticker' | 'card';
  description: string;
}

const rarities: Rarity[] = [
  {
    id: 'common',
    name: 'Common',
    cost: 25,
    probability: 60,
    color: 'text-gray-300',
    bgColor: 'rgba(156, 163, 175, 0.1)',
    icon: <Star className="w-6 h-6" />,
    type: 'sticker',
    description: 'Basic collectible sticker with simple design'
  },
  {
    id: 'uncommon',
    name: 'Uncommon',
    cost: 50,
    probability: 25,
    color: 'text-green-400',
    bgColor: 'rgba(34, 197, 94, 0.1)',
    icon: <Sparkles className="w-6 h-6" />,
    type: 'sticker',
    description: 'Enhanced sticker with special effects and animations'
  },
  {
    id: 'rare',
    name: 'Rare',
    cost: 100,
    probability: 10,
    color: 'text-blue-400',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    icon: <Gem className="w-6 h-6" />,
    type: 'sticker',
    description: 'Premium sticker with unique artwork and effects'
  },
  {
    id: 'epic',
    name: 'Epic',
    cost: 200,
    probability: 4,
    color: 'text-purple-400',
    bgColor: 'rgba(147, 51, 234, 0.1)',
    icon: <Crown className="w-6 h-6" />,
    type: 'card',
    description: 'Collectible card with premium features and exclusive benefits'
  },
  {
    id: 'legendary',
    name: 'Legendary',
    cost: 500,
    probability: 1,
    color: 'text-yellow-400',
    bgColor: 'rgba(251, 191, 36, 0.1)',
    icon: <Crown className="w-6 h-6" />,
    type: 'card',
    description: 'Ultra-rare card with exclusive benefits and special privileges'
  }
];

export function MintingMenuFullscreen({ isOpen, onClose }: MintingMenuFullscreenProps) {
  const [selectedRarity, setSelectedRarity] = useState<string | null>(null);
  const [userStars] = useState(2847); // Mock user star balance - matching TopNav
  const [isProcessing, setIsProcessing] = useState(false);
  const [customName, setCustomName] = useState('');
  const [padContent, setPadContent] = useState('');

  // Capture pad content when menu opens
  useEffect(() => {
    if (isOpen) {
      // Try to get content from LyricsEditor
      const editorElement = document.querySelector('.lyrics-editor textarea, .lyrics-editor [contenteditable]');
      if (editorElement) {
        const content = editorElement.textContent || editorElement.value || '';
        setPadContent(content.slice(0, 100) + (content.length > 100 ? '...' : ''));
      }
    }
  }, [isOpen]);

  const handleMint = async (rarityId: string) => {
    const rarity = rarities.find(r => r.id === rarityId);
    if (rarity && userStars >= rarity.cost && customName.trim()) {
      setIsProcessing(true);
      // Simulate minting process
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log(`Minting ${rarity.name} "${customName}" for ${rarity.cost} stars`);
      console.log('Content captured:', padContent);
      setIsProcessing(false);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{
            background: 'rgba(11, 15, 20, 0.95)',
            backdropFilter: 'blur(20px)'
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-6xl mx-4 h-full max-h-[90vh] overflow-hidden"
            style={{
              background: 'var(--dropsource-panel)',
              border: '1px solid var(--dropsource-border)',
              borderRadius: 'var(--radius-sharp)'
            }}
          >
            {/* Header */}
            <div 
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: 'var(--dropsource-border)' }}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
                  <Coins className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h1 
                    className="font-bold"
                    style={{ 
                      fontSize: 'var(--text-2xl)', 
                      color: 'var(--dropsource-primary)' 
                    }}
                  >
                    Mint Collectible Sticker
                  </h1>
                  <p style={{ color: 'var(--dropsource-secondary)', fontSize: 'var(--text-sm)' }}>
                    Transform your creation into a unique collectible
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                {/* User Balance */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-400/10 border border-yellow-400/20">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span 
                    className="font-semibold"
                    style={{ color: 'var(--dropsource-primary)', fontSize: 'var(--text-lg)' }}
                  >
                    {userStars.toLocaleString()}
                  </span>
                  <span style={{ color: 'var(--dropsource-secondary)', fontSize: 'var(--text-sm)' }}>
                    Stars
                  </span>
                </div>
                
                <button 
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-red-600/20 transition-colors border border-transparent hover:border-red-400/30"
                >
                  <X className="w-6 h-6" style={{ color: 'var(--dropsource-secondary)' }} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex h-full">
              {/* Left Side - Preview */}
              <div className="flex-1 p-6 border-r" style={{ borderColor: 'var(--dropsource-border)' }}>
                <h2 
                  className="font-semibold mb-4"
                  style={{ 
                    fontSize: 'var(--text-xl)', 
                    color: 'var(--dropsource-primary)' 
                  }}
                >
                  Preview
                </h2>
                
                <div className="flex flex-col items-center justify-center h-2/3 space-y-6">
                  {/* Large Preview */}
                  <div 
                    className="w-64 h-64 rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #7C5CFF 0%, #2D81F7 50%, #25BFA6 100%)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 2px 8px rgba(255,255,255,0.1)'
                    }}
                  >
                    <div className="text-8xl mb-4 filter drop-shadow-lg">🎵</div>
                    <div className="text-center">
                      <h3 
                        className="font-bold text-white text-xl mb-2"
                        style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                      >
                        Summer Vibes
                      </h3>
                      <p 
                        className="text-white/80 text-sm"
                        style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
                      >
                        Your Original Creation
                      </p>
                    </div>
                  </div>
                  
                  {/* Preview Info */}
                  <div className="text-center space-y-2">
                    <p style={{ color: 'var(--dropsource-primary)', fontSize: 'var(--text-lg)' }}>
                      Ready to mint as collectible
                    </p>
                    <p style={{ color: 'var(--dropsource-secondary)', fontSize: 'var(--text-sm)' }}>
                      Each rarity level offers different features and drop rates
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Side - Rarity Selection */}
              <div className="flex-1 p-6">
                <h2 
                  className="font-semibold mb-6"
                  style={{ 
                    fontSize: 'var(--text-xl)', 
                    color: 'var(--dropsource-primary)' 
                  }}
                >
                  Choose Rarity Level
                </h2>
                
                <div className="space-y-4 h-full overflow-y-auto dropsource-custom-scrollbar pr-2">
                  {rarities.map((rarity) => (
                    <motion.div
                      key={rarity.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-6 rounded-xl cursor-pointer transition-all border-2 ${
                        selectedRarity === rarity.id 
                          ? 'border-teal-400 shadow-lg shadow-teal-400/20' 
                          : 'border-transparent hover:border-gray-500/30'
                      } ${userStars < rarity.cost ? 'opacity-50 cursor-not-allowed' : ''}`}
                      style={{ 
                        background: rarity.bgColor,
                        backdropFilter: 'blur(8px)'
                      }}
                      onClick={() => userStars >= rarity.cost && setSelectedRarity(rarity.id)}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className={rarity.color}>
                            {rarity.icon}
                          </div>
                          <div>
                            <h3 className={`font-bold text-lg ${rarity.color}`}>
                              {rarity.name}
                            </h3>
                            <Badge 
                              className={`text-xs mt-1 ${
                                rarity.type === 'card' 
                                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-black' 
                                  : 'bg-gray-600 text-gray-200'
                              }`}
                            >
                              {rarity.type.toUpperCase()}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-2 mb-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span 
                              className="font-bold text-lg"
                              style={{ color: 'var(--dropsource-primary)' }}
                            >
                              {rarity.cost}
                            </span>
                          </div>
                          <p 
                            className="text-xs"
                            style={{ color: 'var(--dropsource-tertiary)' }}
                          >
                            {rarity.probability}% drop rate
                          </p>
                        </div>
                      </div>
                      
                      <p 
                        className="text-sm leading-relaxed"
                        style={{ color: 'var(--dropsource-secondary)' }}
                      >
                        {rarity.description}
                      </p>
                      
                      {userStars < rarity.cost && (
                        <div className="mt-3 text-red-400 text-sm font-medium">
                          Insufficient Stars (Need {(rarity.cost - userStars).toLocaleString()} more)
                        </div>
                      )}
                    </motion.div>
                  ))}
                  
                  {/* Action Buttons */}
                  <div className="pt-6 space-y-4">
                    {selectedRarity && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-lg"
                        style={{ 
                          background: 'var(--dropsource-surface)',
                          border: '1px solid var(--dropsource-border)'
                        }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span style={{ color: 'var(--dropsource-secondary)' }}>Selected:</span>
                          <span className={`font-semibold ${rarities.find(r => r.id === selectedRarity)?.color}`}>
                            {rarities.find(r => r.id === selectedRarity)?.name}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span style={{ color: 'var(--dropsource-secondary)' }}>Cost:</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span 
                              className="font-semibold"
                              style={{ color: 'var(--dropsource-primary)' }}
                            >
                              {rarities.find(r => r.id === selectedRarity)?.cost}
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                    
                    <div className="flex gap-4">
                      <Button
                        onClick={onClose}
                        className="flex-1 dropsource-btn-secondary"
                        disabled={isProcessing}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => selectedRarity && handleMint(selectedRarity)}
                        disabled={!selectedRarity || isProcessing}
                        className="flex-1 dropsource-btn-primary relative overflow-hidden"
                      >
                        {isProcessing ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Minting...
                          </div>
                        ) : (
                          <>
                            <Coins className="w-4 h-4 mr-2" />
                            Mint Collectible
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}