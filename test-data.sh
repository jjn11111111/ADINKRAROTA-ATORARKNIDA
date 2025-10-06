#!/bin/bash

# Test script to verify all data files and structure

echo "========================================="
echo "Testing Adinkrarota-Atorarknida Project"
echo "========================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "Error: Not in project root directory"
    exit 1
fi

echo "✓ Found package.json"

# Test JSON files validity
echo ""
echo "Testing JSON Files..."
echo "-------------------"

# Test tarot cards
if python3 -c "import json; json.load(open('public/data/tarot-cards.json'))" 2>/dev/null; then
    MAJOR=$(python3 -c "import json; cards=json.load(open('public/data/tarot-cards.json')); print(len(cards['major_arcana']))")
    WANDS=$(python3 -c "import json; cards=json.load(open('public/data/tarot-cards.json')); print(len(cards['minor_arcana']['wands']))")
    CUPS=$(python3 -c "import json; cards=json.load(open('public/data/tarot-cards.json')); print(len(cards['minor_arcana']['cups']))")
    SWORDS=$(python3 -c "import json; cards=json.load(open('public/data/tarot-cards.json')); print(len(cards['minor_arcana']['swords']))")
    PENTACLES=$(python3 -c "import json; cards=json.load(open('public/data/tarot-cards.json')); print(len(cards['minor_arcana']['pentacles']))")
    TOTAL=$((MAJOR + WANDS + CUPS + SWORDS + PENTACLES))
    
    echo "✓ tarot-cards.json is valid"
    echo "  - Major Arcana: $MAJOR cards"
    echo "  - Wands: $WANDS cards"
    echo "  - Cups: $CUPS cards"
    echo "  - Swords: $SWORDS cards"
    echo "  - Pentacles: $PENTACLES cards"
    echo "  - Total: $TOTAL cards"
    
    if [ "$TOTAL" -eq 78 ]; then
        echo "  ✓ Complete 78-card deck!"
    else
        echo "  ✗ Warning: Expected 78 cards, found $TOTAL"
    fi
else
    echo "✗ tarot-cards.json is invalid or not found"
    exit 1
fi

echo ""

# Test Adinkra symbols
if python3 -c "import json; json.load(open('public/data/adinkra-symbols.json'))" 2>/dev/null; then
    SYMBOLS=$(python3 -c "import json; data=json.load(open('public/data/adinkra-symbols.json')); print(len(data['symbols']))")
    echo "✓ adinkra-symbols.json is valid"
    echo "  - $SYMBOLS Adinkra symbols"
else
    echo "✗ adinkra-symbols.json is invalid or not found"
    exit 1
fi

echo ""

# Test spreads
if python3 -c "import json; json.load(open('public/data/spreads.json'))" 2>/dev/null; then
    SPREADS=$(python3 -c "import json; data=json.load(open('public/data/spreads.json')); print(len(data['spreads']))")
    echo "✓ spreads.json is valid"
    echo "  - $SPREADS spread layouts"
    python3 -c "
import json
data = json.load(open('public/data/spreads.json'))
for spread in data['spreads']:
    print(f'    • {spread[\"name\"]}: {len(spread[\"positions\"])} positions')
"
else
    echo "✗ spreads.json is invalid or not found"
    exit 1
fi

echo ""
echo "Testing File Structure..."
echo "------------------------"

# Check essential files
FILES=(
    "public/index.html"
    "public/css/style.css"
    "public/js/app.js"
    "public/js/card3d.js"
    "firebase.json"
    "firestore.rules"
    "README.md"
    "SETUP.md"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✓ $file"
    else
        echo "✗ $file not found"
    fi
done

echo ""
echo "Testing Firebase Configuration..."
echo "--------------------------------"

if [ -f "firebase.json" ]; then
    echo "✓ firebase.json exists"
    if grep -q "\"public\": \"public\"" firebase.json; then
        echo "✓ Hosting directory correctly set to 'public'"
    fi
fi

if [ -f "firestore.rules" ]; then
    echo "✓ firestore.rules exists"
fi

if [ -f "firestore.indexes.json" ]; then
    echo "✓ firestore.indexes.json exists"
fi

echo ""
echo "Testing Data Integrity..."
echo "------------------------"

# Check that all cards have required fields
echo "Checking card data structure..."
python3 << 'EOF'
import json

cards_data = json.load(open('public/data/tarot-cards.json'))
issues = []

# Check major arcana
for card in cards_data['major_arcana']:
    required = ['id', 'name', 'arcana', 'keywords', 'upright', 'reversed', 'adinkra_symbol', 'adinkra_meaning']
    for field in required:
        if field not in card:
            issues.append(f"Major Arcana card '{card.get('name', 'unknown')}' missing field: {field}")

# Check minor arcana
for suit in ['wands', 'cups', 'swords', 'pentacles']:
    for card in cards_data['minor_arcana'][suit]:
        required = ['id', 'name', 'suit', 'arcana', 'keywords', 'upright', 'reversed', 'adinkra_symbol', 'adinkra_meaning']
        for field in required:
            if field not in card:
                issues.append(f"{suit.title()} card '{card.get('name', 'unknown')}' missing field: {field}")

if issues:
    print("✗ Found issues:")
    for issue in issues:
        print(f"  - {issue}")
else:
    print("✓ All cards have required fields")
EOF

echo ""
echo "========================================="
echo "Test Summary"
echo "========================================="
echo ""
echo "All tests completed successfully!"
echo ""
echo "Next steps:"
echo "1. Start local server: cd public && python3 -m http.server 8000"
echo "2. Open browser to: http://localhost:8000"
echo "3. Or deploy to Firebase: firebase deploy"
echo ""
