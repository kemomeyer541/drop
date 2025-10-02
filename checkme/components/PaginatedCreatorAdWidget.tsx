import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import CreatorSpotlight from './CreatorSpotlight';

// Same creator names and data as existing widget
const CREATOR_NAMES = [
  "PixelSmith", "VerseWriter", "CodeCrafter", "SynthMaster", "NovaMuse", "ArtisanAva", "EchoKnox", "ProtoPunk", 
  "GlyphGuru", "CollabCat", "BugHunter", "SnapSage", "DevDruid", "GameGarden", "PhotoPhantom", "BrushBloom", 
  "ZineZebra", "LoomLark", "ByteBarista", "PaperPirate", "RetroRanger", "PolyPanda", "CloudCarver", "LoopLord",
  "ShaderFox", "BeatBuddy", "MemeDealer", "InkWizard", "VectorVoid", "DigitalDove", "CraftyCrow", "AudioArk",
  "VisualViper", "StoryStorm", "FontForge", "ColorCrash", "LayerLion", "FrameFox", "MotionMuse", "SoundSage",
  "DesignDragon", "ArtAtlas", "CreativeCub", "MakerMoon", "BuilderBee", "PaintPaw", "SketchSky", "DoodleDuck",
  "RenderRaven", "ModernMoth", "TechTiger", "CraftCat", "MixMagic", "EditElf", "FilterFish", "EffectEagle",
  "StudioStag", "WorkspaceWolf", "CanvasChief", "PalettePanda", "BrushBear", "PenPenguin", "ToolTurtle", "AppApe"
];

const CREATOR_QUOTES = [
  "Daily pixel practice. Comms open.",
  "Free sticker every Friday—come grab one.",
  "Portfolio revamped—critique welcome!",
  "Turning ideas into interactive art since 2020.",
  "Beats that hit different. DM for collabs.",
  "Cursed content creator. You've been warned.",
  "Lowkey the best sticker dealer on this site.",
  "Making memes that cure depression.",
  "Professional shitposter. Amateur artist.",
  "Your mom's favorite content creator.",
  "Accidentally famous. Send help.",
  "Chaotic neutral energy only.",
  "Making art that makes your therapist concerned.",
  "Turning trauma into content since forever.",
  "Feral but in a cute way.",
  "Basement dweller with good WiFi.",
  "Chronically online and proud.",
  "Making weird stuff for weird people.",
  "Certified disaster bisexual.",
  "Goblin mode: permanently activated.",
  "Unhinged but harmless.",
  "Your local cryptid artist.",
  "Making content that shouldn't exist.",
  "Blessed and cursed simultaneously.",
  "Vibes are immaculate. Content is questionable.",
  "Professional disappointment.",
  "Making art with my remaining brain cell.",
  "Chaos incarnate. Tips appreciated.",
  "Local menace to society.",
  "Accidentally started three art movements."
];

const AVATAR_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', 
  '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA', '#F1948A', '#85C1E9',
  '#D7BDE2', '#A3E4D7', '#F9E79F', '#FADBD8', '#D5DBDB', '#AED6F1'
];

const SPECIALTIES = [
  ['UI/UX', 'Mobile Apps'],
  ['Beat Production', 'Sampling'],
  ['Pixel Art', 'Game Dev'],
  ['Typography', 'Branding'],
  ['Animation', '3D Art'],
  ['Photography', 'Photo Editing'],
  ['Illustration', 'Character Design'],
  ['Web Design', 'Frontend'],
  ['Music Production', 'Sound Design'],
  ['Digital Art', 'Concept Art']
];

type Creator = {
  id: string;
  name: string;
  handle: string;
  trust: number;
  followers: number;
  bio: string;
  avatarUrl?: string;
  ctaUrl?: string;
  isVerified?: boolean;
  isSponsored?: boolean;
  recentWork?: string;
  specialties?: string[];
};

export function PaginatedCreatorAdWidget() {
  const [creators, setCreators] = useState<Creator[]>([]);

  const generateCreators = () => {
    const generatedCreators: Creator[] = [];
    const usedNames = new Set<string>();
    
    // Generate 6 unique creators for cycling
    while (generatedCreators.length < 6) {
      const name = CREATOR_NAMES[Math.floor(Math.random() * CREATOR_NAMES.length)];
      if (usedNames.has(name)) continue;
      
      usedNames.add(name);
      const quote = CREATOR_QUOTES[Math.floor(Math.random() * CREATOR_QUOTES.length)];
      const avatarBg = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
      const specialty = SPECIALTIES[Math.floor(Math.random() * SPECIALTIES.length)];
      
      // Use name as seed for consistent values
      let seed = 0;
      for (let i = 0; i < name.length; i++) {
        seed += name.charCodeAt(i);
      }
      
      const handle = name.toLowerCase().replace(/([A-Z])/g, (match, letter, index) => 
        index > 0 ? '_' + letter.toLowerCase() : letter.toLowerCase());
      
      generatedCreators.push({
        id: `creator-${generatedCreators.length + 1}`,
        name,
        handle,
        trust: 75 + (seed % 20), // 75-95 range
        followers: 100 + ((seed * 23) % 49900), // 100-50k range
        bio: quote,
        isVerified: Math.random() > 0.7, // 30% chance of verification
        isSponsored: Math.random() > 0.5, // 50% chance of sponsorship
        recentWork: `Latest ${specialty[0].toLowerCase()} project`,
        specialties: specialty,
        ctaUrl: `/u/${handle}`
      });
    }
    
    return generatedCreators;
  };

  useEffect(() => {
    setCreators(generateCreators());
  }, []);

  const handleCreatorClick = (creator: Creator) => {
    console.log('Creator clicked:', creator);
    // Handle navigation to creator profile
  };

  if (creators.length === 0) return null;

  return (
    <CreatorSpotlight 
      creators={creators} 
      onCreatorClick={handleCreatorClick}
    />
  );
}