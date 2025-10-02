# Reddit Commission Guidelines & File Structure

## 📁 File Organization

### Stickers (Common & Rare)
```
stickers/
├── common/
│   ├── ceiling-fan-enthusiast/
│   │   ├── artwork.png (or .jpg, .svg)
│   │   ├── metadata.json
│   │   └── description.md
│   ├── spaghetti-code-sticker/
│   │   ├── artwork.png
│   │   ├── metadata.json
│   │   └── description.md
│   └── vape-cloud-skeleton/
│       ├── artwork.png
│       ├── metadata.json
│       └── description.md
└── rare/
    ├── bonk-horny-jail/
    │   ├── artwork.png
    │   ├── metadata.json
    │   └── description.md
    └── dumpster-fire-2025/
        ├── artwork.png
        ├── metadata.json
        └── description.md
```

### Cards (Epic & Legendary)
```
cards/
├── epic/
│   ├── mega-frog-pack/
│   │   ├── artwork.png
│   │   ├── metadata.json
│   │   └── description.md
│   └── hotdog-usb-drive/
│       ├── artwork.png
│       ├── metadata.json
│       └── description.md
└── legendary/
    ├── chair-sniffer-1of1/
    │   ├── artwork.png
    │   ├── metadata.json
    │   └── description.md
    └── emotional-damage-wav/
        ├── artwork.png
        ├── metadata.json
        └── description.md
```

## 📋 Metadata Template

### metadata.json
```json
{
  "id": "unique-id",
  "name": "Display Name",
  "description": "Brief description of the collectible",
  "rarity": "common|rare|epic|legendary",
  "type": "sticker|card",
  "totalSupply": 1000,
  "price": 5,
  "creator": {
    "redditUsername": "u/username",
    "displayName": "Creator Name",
    "socialLinks": {
      "reddit": "https://reddit.com/u/username",
      "twitter": "https://twitter.com/username",
      "instagram": "https://instagram.com/username"
    }
  },
  "tags": ["meme", "gaming", "music", "art"],
  "submissionDate": "2025-01-XX",
  "status": "pending|approved|rejected",
  "notes": "Any additional notes or feedback"
}
```

### description.md
```markdown
# [Collectible Name]

## Description
Brief description of what this collectible represents and why it's special.

## Inspiration
What inspired this design? Any cultural references or memes?

## Technical Details
- Dimensions: 512x512px (stickers) or 1024x768px (cards)
- Format: PNG with transparency
- Style: [describe the art style]

## Creator Notes
Any additional context or story behind the creation.
```

## 🎨 Artwork Requirements

### Stickers (Common & Rare)
- **Dimensions**: 512x512px minimum
- **Format**: PNG with transparency
- **Style**: Clean, recognizable, works at small sizes
- **Content**: Memes, characters, symbols, text

### Cards (Epic & Legendary)
- **Dimensions**: 1024x768px minimum
- **Format**: PNG with transparency
- **Style**: More detailed, collectible card aesthetic
- **Content**: Characters, scenes, detailed artwork

## 📝 Submission Process

1. **Create folder** with kebab-case name (e.g., `ceiling-fan-enthusiast`)
2. **Add artwork** in the specified format
3. **Fill metadata.json** with all required fields
4. **Write description.md** with context and inspiration
5. **Submit via Reddit** with link to folder

## 🏷️ Naming Conventions

- **Folder names**: `kebab-case` (e.g., `bonk-horny-jail`)
- **File names**: `artwork.png`, `metadata.json`, `description.md`
- **Display names**: Can be different from folder name for better UX

## ✅ Quality Checklist

- [ ] Artwork meets size requirements
- [ ] PNG format with transparency
- [ ] Metadata.json is complete and valid
- [ ] Description.md provides good context
- [ ] Folder name follows kebab-case convention
- [ ] Artwork is original or properly licensed
- [ ] Content is appropriate for the platform

## 🎯 Commission Guidelines

### What We're Looking For:
- **Memes**: Popular internet memes, references
- **Gaming**: Video game characters, references
- **Music**: Music-related imagery, instruments
- **Internet Culture**: Viral content, trends
- **Original Characters**: Unique designs that fit the vibe

### What to Avoid:
- Copyrighted characters without permission
- Offensive or inappropriate content
- Low-quality or blurry artwork
- Generic or unoriginal designs

## 💰 Compensation

- **Common Stickers**: $5-10 per approved design
- **Rare Stickers**: $10-20 per approved design  
- **Epic Cards**: $20-50 per approved design
- **Legendary Cards**: $50-100 per approved design

*Payment processed via PayPal or preferred method*

## 📞 Contact

For questions about commissions:
- Reddit: u/[your-username]
- Email: [your-email]
- Discord: [your-discord]

---

*This structure makes it easy to organize submissions and integrate them into the Drop Source platform!*

