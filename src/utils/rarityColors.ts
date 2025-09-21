// DropSource Rarity Color System - Updated per spec
// Elite = deep royal blue gradient (#6A00AD → #3D94FF)
// Rare = bright violet/pink gradient (#B450C7 → #FF70A6)

export const RARITY_COLORS = {
  Common: {
    background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)',
    border: '#22C55E',
    text: '#DCFCE7',
    glow: 'rgba(34, 197, 94, 0.3)'
  },
  Rare: {
    background: 'linear-gradient(135deg, #B450C7 0%, #FF70A6 100%)', // Updated bright violet/pink
    border: '#FF70A6',
    text: '#FDF2F8',
    glow: 'rgba(255, 112, 166, 0.3)'
  },
  Premium: {
    background: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    border: '#3B82F6',
    text: '#DBEAFE',
    glow: 'rgba(59, 130, 246, 0.3)'
  },
  Elite: {
    background: 'linear-gradient(135deg, #6A00AD 0%, #3D94FF 100%)', // Updated deep royal blue
    border: '#3D94FF',
    text: '#EFF6FF',
    glow: 'rgba(61, 148, 255, 0.3)'
  },
  Legendary: {
    background: 'linear-gradient(135deg, #F59E0B 0%, #DC2626 100%)', // Orange-gold gradient
    border: '#F59E0B',
    text: '#FEF3C7',
    glow: 'rgba(245, 158, 11, 0.3)'
  }
};

export const getRarityStyle = (rarity: keyof typeof RARITY_COLORS) => {
  const colors = RARITY_COLORS[rarity];
  return {
    background: colors.background,
    border: `1px solid ${colors.border}`,
    color: colors.text,
    boxShadow: `0 0 20px ${colors.glow}`,
    textShadow: `0 0 8px ${colors.glow}`
  };
};

export const getRarityLabel = (rarity: keyof typeof RARITY_COLORS, isCard: boolean = false) => {
  if (isCard && (rarity === 'Elite' || rarity === 'Legendary')) {
    return `${rarity} Card`;
  }
  return rarity;
};