import { ParticlePreset } from './ParticleLayer';

export const PARTICLE_CATALOG: { 
  key: ParticlePreset; 
  label: string; 
  emoji: string; 
  group: "Calm"|"Playful"|"Sci-Fi"|"Nature"; 
  description: string;
}[] = [
  // Calm - Atmospheric background effects
  { key:"starfield",    label:"Starfield",    emoji:"🌌", group:"Calm",   description:"Streaming stars with occasional meteors" },
  { key:"aurora",       label:"Aurora",       emoji:"🌃", group:"Calm",   description:"Northern lights dancing across dark sky" },
  { key:"smoke",        label:"Mystic Smoke", emoji:"💨", group:"Calm",   description:"Ambient haze drifting softly" },
  { key:"snow",         label:"Snow",         emoji:"❄️", group:"Calm",   description:"Gentle snowfall with wind effects" },
  { key:"bubbles",      label:"Bubbles",      emoji:"🫧", group:"Calm",   description:"Floating soap bubbles rising up" },

  // Playful - Fun celebratory effects
  { key:"confetti",     label:"Confetti",     emoji:"🎉", group:"Playful", description:"Colorful celebration confetti" },
  { key:"emojiRain",    label:"Emoji Rain",   emoji:"😊", group:"Playful", description:"Musical emojis falling from sky" },
  { key:"butterflies",  label:"Butterflies",  emoji:"🦋", group:"Playful", description:"Butterflies with flapping wings" },
  { key:"starsRain",    label:"Stars Rain",   emoji:"✨", group:"Playful", description:"Twinkling stars falling down" },
  { key:"sparkles",     label:"Sparkles",     emoji:"⭐", group:"Playful", description:"Quick celebratory shimmer" },

  // Sci-Fi - Futuristic tech effects
  { key:"matrixDigits", label:"Matrix",       emoji:"🟩", group:"Sci-Fi",  description:"Green digital rain columns" },
  { key:"meteors",      label:"Meteors",      emoji:"☄️", group:"Sci-Fi",  description:"Fast-moving space meteors" },
  { key:"electric",     label:"Electric",     emoji:"⚡", group:"Sci-Fi",  description:"Lightning bolts flashing" },
  { key:"neonTriangles",label:"Neon",         emoji:"🔺", group:"Sci-Fi",  description:"Glowing neon geometric shapes" },
  { key:"coinsRain",    label:"Coins",        emoji:"🪙", group:"Sci-Fi",  description:"Golden coins for achievements" },

  // Nature - Natural organic effects
  { key:"sakura",       label:"Sakura",       emoji:"🌸", group:"Nature",  description:"Cherry blossom petals falling" },
  { key:"heartsRain",   label:"Hearts",       emoji:"💗", group:"Nature",  description:"Romantic hearts floating down" },
  { key:"fireflies",    label:"Fireflies",    emoji:"🪲", group:"Nature",  description:"Glowing bugs with gentle movement" },
  { key:"rain",         label:"Rain",         emoji:"🌧️", group:"Nature",  description:"Fast diagonal raindrops" },
  { key:"musicNotes",   label:"Music Notes",  emoji:"🎵", group:"Nature",  description:"Musical notation symbols" },
  { key:"paperPlanes",  label:"Paper Planes", emoji:"✈️", group:"Nature",  description:"Paper airplanes gliding across" },
];