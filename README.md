# ADINKRAROTA-ATORARKNIDA

A full 78 card tarot deck with extensive guidebook, unites the form of tarot and adinkra in an amalgamation that is greater than the sum of its parts, spreads, 3d interactions with cards and symbols.

## Features

- 🎴 **Complete 78-Card Tarot Deck** - All Major and Minor Arcana cards
- 🖼️ **Adinkra Symbol Integration** - Each card paired with meaningful West African Adinkra symbols
- 📖 **Comprehensive Guidebook** - Detailed meanings, interpretations, and wisdom
- 🎯 **Multiple Spread Layouts** - Celtic Cross, Three Card, Horseshoe, and more
- ✨ **Interactive Web Interface** - Modern, responsive design with 3D capabilities
- 🔥 **Firebase Integration** - Ready for cloud hosting and data storage

## Project Structure

```
ADINKRAROTA-ATORARKNIDA/
├── public/
│   ├── css/
│   │   └── style.css          # Main stylesheet
│   ├── js/
│   │   └── app.js             # Main application logic
│   ├── data/
│   │   ├── tarot-cards.json   # Complete deck data
│   │   ├── adinkra-symbols.json # Adinkra symbol reference
│   │   └── spreads.json       # Tarot spread configurations
│   └── index.html             # Main application page
├── firebase.json              # Firebase configuration
├── firestore.rules            # Firestore security rules
├── firestore.indexes.json     # Firestore indexes
├── package.json               # Project dependencies
└── README.md                  # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Firebase account (for deployment)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/jjn11111111/ADINKRAROTA-ATORARKNIDA.git
cd ADINKRAROTA-ATORARKNIDA
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase (optional, for deployment):
```bash
npm install -g firebase-tools
firebase login
firebase init
```

### Local Development

To run the application locally, you can use any static file server. For example:

```bash
# Using Python 3
cd public
python3 -m http.server 8000

# Or using Node.js http-server
npx http-server public -p 8000
```

Then open your browser to `http://localhost:8000`

### Firebase Deployment

1. Initialize Firebase (if not already done):
```bash
firebase init hosting
```

2. Deploy to Firebase:
```bash
npm run deploy
```

Or use:
```bash
firebase deploy
```

## Usage

### Exploring the Deck

- Navigate to the "Full Deck" section to browse all 78 cards
- Filter by Major Arcana or specific suits (Wands, Cups, Swords, Pentacles)
- Click on any card to view detailed information including Adinkra symbol meanings

### Performing a Reading

1. Go to the "Card Spread" section
2. Select a spread type (Single Card, Three Card, Celtic Cross, etc.)
3. Click "Draw Cards" to perform a reading
4. View each card's interpretation in the context of its position

### Understanding Adinkra

- Visit the "Adinkra Symbols" section to explore the meanings behind each symbol
- Learn the proverbs and cultural wisdom associated with each symbol
- Discover how these symbols enhance traditional tarot interpretations

## Data Structure

### Tarot Cards

Each card includes:
- Name and arcana type
- Keywords and meanings (upright and reversed)
- Associated Adinkra symbol and its meaning
- Suit information (for Minor Arcana)

### Adinkra Symbols

Each symbol includes:
- Name and meaning
- Symbolism and cultural significance
- Traditional proverb (in Akan)
- English translation

### Spreads

Each spread includes:
- Name and description
- Position meanings and interpretations
- Suggested use cases

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **3D Graphics**: Three.js
- **Backend**: Firebase (Hosting, Firestore)
- **Data Format**: JSON

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Tarot tradition and symbolism
- Akan people of Ghana for Adinkra symbols and wisdom
- The open-source community

## Contact

For questions or suggestions, please open an issue on GitHub.

---

*Combining ancient wisdom from two rich traditions to illuminate the path forward.*
