# Quick Start Guide

Get up and running with Adinkrarota-Atorarknida in minutes!

## Instant Local Preview (No Installation Required)

The fastest way to see the app in action:

```bash
# Navigate to the public directory
cd public

# Start a simple HTTP server (Python 3)
python3 -m http.server 8000
```

Then open your browser to: **http://localhost:8000**

That's it! The application is fully functional without any build step or dependencies.

## What You'll See

### 1. Home Page
- Welcome screen introducing the deck
- Feature overview
- Quick access buttons

### 2. Full Deck View (78 Cards)
- Browse all tarot cards
- Filter by arcana or suit:
  - Major Arcana (22 cards)
  - Wands (14 cards)
  - Cups (14 cards)
  - Swords (14 cards)
  - Pentacles (14 cards)
- Click any card to see detailed information

### 3. Card Spreads
Choose from 8 different spreads:
- **Single Card Draw** - Quick daily guidance
- **Three Card Spread** - Past, Present, Future
- **Five Card Crossroads** - Decision making
- **Celtic Cross** - Comprehensive 10-card reading
- **Horseshoe Spread** - 7-card situation analysis
- **Seven Chakra Spread** - Energy alignment
- **Relationship Spread** - Partnership insights
- **Adinkra Wisdom Spread** - Special cultural fusion

### 4. Interactive Guidebook
- Introduction to the deck concept
- How to use tarot and Adinkra together
- Reading tips and techniques
- Suit meanings and correspondences

### 5. Adinkra Symbols Reference
Explore 40+ authentic Adinkra symbols:
- Meanings and symbolism
- Traditional proverbs (in Akan)
- English translations
- Cultural context

## Key Features

✨ **No Installation** - Pure HTML/CSS/JavaScript, runs in any modern browser

🎴 **Complete Deck** - All 78 traditional tarot cards with unique Adinkra pairings

🌍 **Cultural Fusion** - Western tarot meets West African wisdom

📱 **Responsive Design** - Works on desktop, tablet, and mobile

🎯 **Interactive Readings** - Draw cards, perform spreads, save insights

🔮 **3D Ready** - Three.js integration for enhanced card visualization

## Testing the Application

Run the included test script to verify everything is working:

```bash
./test-data.sh
```

This checks:
- All 78 cards are present and valid
- Adinkra symbols are correctly formatted
- Spread configurations are complete
- File structure is correct

## Example Usage

### Perform a Quick Reading

1. Click "Card Spread" in the navigation
2. Select "Three Card Spread" from the dropdown
3. Click "Draw Cards"
4. View your Past, Present, and Future cards
5. Click "View Details" on any card to learn more

### Explore a Card

1. Go to "Full Deck"
2. Click on any card (e.g., "The Fool")
3. Read the upright and reversed meanings
4. Discover the associated Adinkra symbol
5. Learn the cultural wisdom behind the pairing

### Learn About Adinkra

1. Navigate to "Adinkra Symbols"
2. Browse through 40+ symbols
3. Read the meanings and proverbs
4. Understand how they enhance tarot readings

## Customization

All data is stored in JSON files for easy customization:

- **Cards**: `public/data/tarot-cards.json`
- **Symbols**: `public/data/adinkra-symbols.json`
- **Spreads**: `public/data/spreads.json`

Edit these files to:
- Add your own interpretations
- Create custom spreads
- Include additional symbols
- Translate to other languages

## Performance

The application is lightweight and fast:
- **Total Size**: ~100KB (excluding Three.js)
- **Load Time**: <1 second on modern connections
- **No Build Step**: Direct file serving
- **No Backend Required**: Pure frontend application

## Browser Compatibility

Works in all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

Requires JavaScript enabled.

## Next Steps

### Deploy to Firebase

See [SETUP.md](SETUP.md) for complete Firebase deployment instructions.

Quick version:
```bash
npm install -g firebase-tools
firebase login
firebase init
firebase deploy
```

### Add Card Images

1. Create card images (JPG/PNG)
2. Place in `public/assets/cards/`
3. Update card data with image paths
4. Modify CSS to display images

### Enable 3D Cards

The 3D card viewer is included but needs activation:
1. Uncomment 3D demo in `index.html`
2. Add 3D viewer to card modal
3. Customize card textures and materials

### Save User Readings

To persist readings:
1. Set up Firebase Authentication
2. Enable Firestore database
3. Update `app.js` to save readings
4. Use included Firestore rules

## Support

- **Issues**: Open on GitHub
- **Documentation**: See README.md and SETUP.md
- **Data Format**: Check JSON files in `public/data/`

## Tips

💡 **Daily Practice**: Use the Single Card Draw for daily guidance

💡 **Journal**: Keep notes of your readings and insights

💡 **Learn**: Study one card and symbol per day

💡 **Explore**: Try different spreads for different questions

💡 **Share**: The app works offline - perfect for readings anywhere

---

**Enjoy your journey with Adinkrarota-Atorarknida!**

*Where ancient wisdom meets modern divination*
