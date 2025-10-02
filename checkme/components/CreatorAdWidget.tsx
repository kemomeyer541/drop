// src/components/CreatorAdWidget.tsx
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";

// Same creator names and data as CommunityHubFeed
const CREATOR_NAMES = [
  "PixelSmith", "VerseWriter", "CodeCrafter", "SynthMaster", "NovaMuse", "ArtisanAva", "EchoKnox", "ProtoPunk", 
  "GlyphGuru", "CollabCat", "BugHunter", "SnapSage", "DevDruid", "GameGarden", "PhotoPhantom", "BrushBloom", 
  "ZineZebra", "LoomLark", "ByteBarista", "PaperPirate", "RetroRanger", "PolyPanda", "CloudCarver", "LoopLord",
  "ShaderFox", "BeatBuddy", "MemeDealer", "InkWizard", "VectorVoid", "DigitalDove", "CraftyCrow", "AudioArk",
  "VisualViper", "StoryStorm", "FontForge", "ColorCrash", "LayerLion", "FrameFox", "MotionMuse", "SoundSage",
  "DesignDragon", "ArtAtlas", "CreativeCub", "MakerMoon", "BuilderBee", "PaintPaw", "SketchSky", "DoodleDuck",
  "RenderRaven", "ModernMoth", "TechTiger", "CraftCat", "MixMagic", "EditElf", "FilterFish", "EffectEagle",
  "StudioStag", "WorkspaceWolf", "CanvasChief", "PalettePanda", "BrushBear", "PenPenguin", "ToolTurtle", "AppApe",
  "BeanCoinInvestor", "Shrekonomics", "SadBoyEnergy", "HotSauceWizard", "DankMoth", "BuggedOutGoose", 
  "urmomsfinancialadvisor", "BeatHarderThnMyMeat", "thisguyfuqs", "YeetMachine9000", "socool", "SmokingBigDoinks", 
  "steverimjobs", "ShrekOnXans", "PostNutClarity", "JpegWarrior", "StankSock", "McNutt", "Tenderloin69",
  "DumpsterDuck", "BetaMaleGod", "JuulCough", "OnlyFrogs", "DownBadWizard", "ChairSniffer", "iLickBatteries", 
  "HighCollegeDropout", "SkibidiInMe", "CertifiedStepBro", "Error420Blaze", "RawDoggedByLife", "GoatedWithTheSauce", 
  "HotSingleInUrArea", "UncleSpork", "VapeChrist", "ZuccDaddy", "Tom", "DumpsterDaddy", "LigmaSurvivor",
  "BananaLord", "ShrimpOnRoids", "ToasterBath", "CrotchGoblin", "ThugPug", "LeanMachine", "TurboYEET", "Stan", 
  "Shartacus", "SniffingPens", "DustOFF", "BenadrylNightmare", "InfiniteShrimp", "SandyClappedCheeks", 
  "LordFarquaadsPlug", "ShrekTheThirdLeg", "YeetussDeletuss", "Backshots4Jesus", "HititrawnCode", "GravyTrain", 
  "GooseOnTheLoose", "VibeGoblin", "ThiccerThanSnickers", "BigMacWithNoDrip", "ChugJugMommy", "ChugJugDaddy", 
  "ObamaPrism", "TwoPumpKing", "SoggyDorito", "LimpBis", "BeatEnderDragonNaked", "ChairSmash", "SigmaGrindsetNPC", 
  "BoofedMyHomework", "SpicyTendies", "BeefCurtain", "MilkToast", "ChewbaccaOnCrack", "ClitYeastWood", 
  "BetaFishAlphaMale", "GlizzyGoblin", "NPCOverlord", "ManletMage", "NutellaWaterfall", "RanchMommy", 
  "NightstandLotion", "UwUOnMyTaxes", "ShlongMcDong", "DiscordKitten", "SnorlaxInsulin", "BillSpanks",
  "BreadstickBandit", "CrustSocks", "PPPooper", "HotdogWater", "REEEEEE", "IwriteStuff", "TwilightRacoonFanFic", 
  "SendMeStickers", "AnimeThighTax", "TunaCan", "LoafOfGod", "MeatOnTheBeat", "DrakesMiddleSchooler", 
  "ReleaseTheFiles", "OnTheFlightList", "KickstartMyFart", "GoobyGirl", "LeftHandStranger", "Doodler",
  "GigaRat", "CLAMSLAM", "GirthQuake", "StepSis", "UwUNextTuesday", "HotCheetoFingers", "OnlyToes", 
  "BratzDollFromHell", "ThighsOfFury", "FeralHelloKitty", "SussyCoder", "ToxicLipGloss", "AnimeMILF", 
  "SkrrtSkirt", "PastelDumpster", "SadBaddie", "YeetAndDelete", "MoistMermaid", "ThiccPixie", "GothGF", 
  "RunescapeGF", "MemeFurnace", "Sk8erboi", "Twerkules", "SoggyPanties", "MenaceInMascara", "SadGirlVibes", 
  "UwuGothGF", "ChungusKitten", "SnaccGremlin", "Zoomies", "PeachBandit", "QuantumToad", "LinkInBio", 
  "KittenWithAnAK", "BabyBatBitch", "SimpStress", "CumLaudeDropout", "FartBarbie", "StepSisWithWifi", 
  "SpicySobbing", "CockroachCutie", "VapeInMyBra", "DumpSterKitten", "RatchetRapunzel", "HoeOnMain", 
  "CherryGlock", "BananaHoe", "HelloClitty", "PissBaby", "AstroSlut", "HotGirlAnxiety", "DonttalkToMe",
  "Crippling", "IHaveMesothelioma", "InfiniteRest", "DiscordMOD", "PutTheMemesINTHEBAG", "TellmeULoveMe", 
  "ThighGap", "Simp", "OnlyGups", "LilFishy", "TinyTordus", "lilbirb", "RatPack", "TrashPanda", "FeralRaccoon", 
  "PantryRAT", "StealurDad", "YouWouldnt", "DoItForTheVine", "OneOfUsNeeds2Change", "IThotWeWereFriends", 
  "LifeSavings2CURFeet", "Whateven", "DoA360", "CoughingupVapeJuice", "Slime", "FapGod", "toebane", "cursedchair",
  "hotdogwizard", "sleepy_goth", "glizzygremlin", "frogfella", "notyourdad", "spicyshrimp", "yeetwizard", 
  "grandmacloud", "tax_evasion_420", "milkymayo", "skibidi_worm", "shrekdaddy", "breadlord", "beatharderthanmymeat", 
  "clown_boi", "bananaking", "toecollector", "pixel_goblin", "sadworm", "eggdealer", "mothmom", "dumpsterdiva", 
  "basicblorbos", "bonkpolice", "memepriest", "susygoblin", "flavortown", "wifiskeleton", "data_lord", "chaoschild"
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

type CreatorAd = {
  name: string;
  handle: string;
  quote: string;
  avatarBg: string;
  trustScore: number;
  followers: number;
};

export function CreatorAdWidget() {
  const [currentAd, setCurrentAd] = useState<CreatorAd | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const generateRandomCreatorAd = (): CreatorAd => {
    const creator = CREATOR_NAMES[Math.floor(Math.random() * CREATOR_NAMES.length)];
    const quote = CREATOR_QUOTES[Math.floor(Math.random() * CREATOR_QUOTES.length)];
    const avatarBg = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];
    
    // Use creator name as seed for consistent values
    let seed = 0;
    for (let i = 0; i < creator.length; i++) {
      seed += creator.charCodeAt(i);
    }
    
    return {
      name: creator,
      handle: creator.toLowerCase().replace(/([A-Z])/g, (match, letter, index) => 
        index > 0 ? '_' + letter.toLowerCase() : letter.toLowerCase()),
      quote,
      avatarBg,
      trustScore: 75 + (seed % 20), // 75-95 range
      followers: 100 + ((seed * 23) % 49900) // 100-50k range
    };
  };

  useEffect(() => {
    // Set initial ad
    setCurrentAd(generateRandomCreatorAd());

    // Cycle ads every 8-12 seconds
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentAd(generateRandomCreatorAd());
        setIsVisible(true);
      }, 300); // Fade transition time
    }, 8000 + Math.random() * 4000); // 8-12 second intervals

    return () => clearInterval(interval);
  }, []);

  if (!currentAd) return null;

  return (
    <div
      className={`rounded border p-4 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      style={{
        backgroundColor: '#0F1520',
        borderColor: '#1A2531'
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 style={{ color: '#FFB039', fontSize: '14px', fontWeight: '600' }}>
          Creator Spotlight
        </h3>
        <Badge variant="ad" title="Paid placement">Ad</Badge>
      </div>

      {/* Creator Info */}
      <div className="flex items-start gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
          style={{ backgroundColor: currentAd.avatarBg }}
        >
          {currentAd.name.charAt(0)}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold" style={{ color: '#E6ECF3' }}>
            {currentAd.name}
          </h4>
          <p className="text-xs mb-1" style={{ color: '#A9B7C6' }}>
            @{currentAd.handle}
          </p>
          <div className="flex gap-3 text-xs" style={{ color: '#A9B7C6' }}>
            <span>{currentAd.trustScore}% Trust</span>
            <span>{currentAd.followers.toLocaleString()} followers</span>
          </div>
        </div>
      </div>

      {/* Quote */}
      <div
        className="rounded p-3 mb-3 text-sm italic"
        style={{
          backgroundColor: "rgba(255,255,255,0.05)",
          color: "#E6ECF3",
          border: "1px solid rgba(255,255,255,0.1)"
        }}
      >
        "{currentAd.quote}"
      </div>

      {/* CTA Button */}
      <button
        className="w-full py-2 px-4 rounded text-sm font-medium transition-colors flex items-center justify-center"
        style={{
          backgroundColor: "#FFB039",
          color: "#000",
          border: "none",
          minHeight: "36px",
          whiteSpace: "nowrap"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#E09A2B";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#FFB039";
        }}
      >
        View Profile
      </button>
    </div>
  );
}