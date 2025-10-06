// Main Application State
const appState = {
    tarotCards: [],
    adinkraSymbols: [],
    spreads: [],
    currentSpread: null,
    drawnCards: []
};

// Initialize the application
async function init() {
    try {
        // Load data
        await loadData();
        
        // Setup event listeners
        setupEventListeners();
        
        // Initialize views
        renderDeckView();
        renderSymbolsView();
        renderSpreadsSelector();
        
        console.log('App initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
        showError('Failed to load application data');
    }
}

// Load JSON data
async function loadData() {
    try {
        // Load tarot cards
        const cardsResponse = await fetch('data/tarot-cards.json');
        const cardsData = await cardsResponse.json();
        
        // Flatten the cards structure
        appState.tarotCards = [
            ...cardsData.major_arcana,
            ...cardsData.minor_arcana.wands,
            ...cardsData.minor_arcana.cups,
            ...cardsData.minor_arcana.swords,
            ...cardsData.minor_arcana.pentacles
        ];
        
        // Load Adinkra symbols
        const symbolsResponse = await fetch('data/adinkra-symbols.json');
        const symbolsData = await symbolsResponse.json();
        appState.adinkraSymbols = symbolsData.symbols;
        
        // Load spreads
        const spreadsResponse = await fetch('data/spreads.json');
        const spreadsData = await spreadsResponse.json();
        appState.spreads = spreadsData.spreads;
        
    } catch (error) {
        console.error('Error loading data:', error);
        throw error;
    }
}

// Setup event listeners
function setupEventListeners() {
    // Navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const view = e.target.dataset.view;
            showView(view);
        });
    });
    
    // Deck filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            const filter = e.target.dataset.filter;
            filterDeck(filter);
        });
    });
    
    // Spread selector
    const spreadSelect = document.getElementById('spread-type');
    spreadSelect.addEventListener('change', (e) => {
        const spreadId = e.target.value;
        if (spreadId) {
            appState.currentSpread = appState.spreads.find(s => s.id === spreadId);
            displaySpreadInfo();
            document.getElementById('draw-cards-btn').disabled = false;
        } else {
            appState.currentSpread = null;
            document.getElementById('draw-cards-btn').disabled = true;
        }
    });
    
    // Draw cards button
    document.getElementById('draw-cards-btn').addEventListener('click', drawCards);
    
    // Reset spread button
    document.getElementById('reset-spread-btn').addEventListener('click', resetSpread);
    
    // Modal close
    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('card-modal').classList.remove('active');
    });
    
    // Close modal on outside click
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('card-modal');
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// Show specific view
window.showView = function(viewName) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    
    // Show selected view
    const selectedView = document.getElementById(`${viewName}-view`);
    if (selectedView) {
        selectedView.classList.add('active');
    }
    
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.view === viewName) {
            btn.classList.add('active');
        }
    });
};

// Render deck view
function renderDeckView(filter = 'all') {
    const cardGrid = document.getElementById('card-grid');
    cardGrid.innerHTML = '';
    
    let filteredCards = appState.tarotCards;
    
    if (filter !== 'all') {
        if (filter === 'major') {
            filteredCards = appState.tarotCards.filter(card => card.arcana === 'Major');
        } else {
            filteredCards = appState.tarotCards.filter(card => 
                card.suit && card.suit.toLowerCase() === filter
            );
        }
    }
    
    filteredCards.forEach(card => {
        const cardElement = createCardElement(card);
        cardGrid.appendChild(cardElement);
    });
}

// Create card element
function createCardElement(card) {
    const cardDiv = document.createElement('div');
    cardDiv.className = 'card-item';
    cardDiv.innerHTML = `
        <h3>${card.name}</h3>
        <p class="card-arcana">${card.arcana} Arcana${card.suit ? ` - ${card.suit}` : ''}</p>
        <p class="card-symbol">Adinkra: ${card.adinkra_meaning}</p>
    `;
    
    cardDiv.addEventListener('click', () => showCardDetail(card));
    
    return cardDiv;
}

// Show card detail in modal
function showCardDetail(card) {
    const modal = document.getElementById('card-modal');
    const cardDetail = document.getElementById('card-detail');
    
    // Find the Adinkra symbol
    const symbol = appState.adinkraSymbols.find(s => s.name === card.adinkra_symbol);
    
    cardDetail.innerHTML = `
        <h2>${card.name}</h2>
        <div class="detail-section">
            <h3>Card Information</h3>
            <p><strong>Arcana:</strong> ${card.arcana}${card.suit ? ` - ${card.suit}` : ''}</p>
            ${card.number !== undefined ? `<p><strong>Number:</strong> ${card.number}</p>` : ''}
            ${card.court ? `<p><strong>Court:</strong> ${card.court}</p>` : ''}
        </div>
        
        <div class="detail-section">
            <h3>Keywords</h3>
            <div class="keywords">
                ${card.keywords.map(kw => `<span class="keyword-tag">${kw}</span>`).join('')}
            </div>
        </div>
        
        <div class="detail-section">
            <h3>Upright Meaning</h3>
            <p>${card.upright}</p>
        </div>
        
        <div class="detail-section">
            <h3>Reversed Meaning</h3>
            <p>${card.reversed}</p>
        </div>
        
        <div class="detail-section">
            <h3>Adinkra Symbol: ${symbol ? symbol.name : card.adinkra_symbol}</h3>
            <p><strong>Meaning:</strong> ${card.adinkra_meaning}</p>
            ${symbol ? `
                <p><strong>Symbolism:</strong> ${symbol.symbolism}</p>
                <p><strong>Proverb:</strong> <em>"${symbol.proverb}"</em></p>
                <p><strong>Translation:</strong> ${symbol.literal_translation}</p>
            ` : ''}
        </div>
    `;
    
    modal.classList.add('active');
}

// Filter deck
function filterDeck(filter) {
    renderDeckView(filter);
}

// Render symbols view
function renderSymbolsView() {
    const symbolsGrid = document.getElementById('symbols-grid');
    symbolsGrid.innerHTML = '';
    
    appState.adinkraSymbols.forEach(symbol => {
        const symbolElement = createSymbolElement(symbol);
        symbolsGrid.appendChild(symbolElement);
    });
}

// Create symbol element
function createSymbolElement(symbol) {
    const symbolDiv = document.createElement('div');
    symbolDiv.className = 'symbol-item';
    symbolDiv.innerHTML = `
        <h3>${symbol.name.replace(/_/g, ' ')}</h3>
        <p class="symbol-meaning"><strong>${symbol.meaning}</strong></p>
        <p class="symbol-symbolism">${symbol.symbolism}</p>
        <div class="symbol-proverb">
            "${symbol.proverb}"<br>
            <small>${symbol.literal_translation}</small>
        </div>
    `;
    
    return symbolDiv;
}

// Render spreads selector
function renderSpreadsSelector() {
    const spreadSelect = document.getElementById('spread-type');
    spreadSelect.innerHTML = '<option value="">-- Select a spread --</option>';
    
    appState.spreads.forEach(spread => {
        const option = document.createElement('option');
        option.value = spread.id;
        option.textContent = spread.name;
        spreadSelect.appendChild(option);
    });
}

// Display spread info
function displaySpreadInfo() {
    if (!appState.currentSpread) return;
    
    const spreadInfo = document.getElementById('spread-info');
    const spreadName = document.getElementById('spread-name');
    const spreadDescription = document.getElementById('spread-description');
    
    spreadName.textContent = appState.currentSpread.name;
    spreadDescription.textContent = appState.currentSpread.description;
    
    // Display spread layout
    displaySpreadLayout();
}

// Display spread layout
function displaySpreadLayout() {
    const spreadLayout = document.getElementById('spread-layout');
    spreadLayout.innerHTML = '';
    
    if (!appState.currentSpread) return;
    
    // Determine grid layout based on number of positions
    const positionCount = appState.currentSpread.positions.length;
    if (positionCount <= 3) {
        spreadLayout.style.gridTemplateColumns = `repeat(${positionCount}, 1fr)`;
    } else if (positionCount <= 7) {
        spreadLayout.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
    } else {
        spreadLayout.style.gridTemplateColumns = 'repeat(auto-fit, minmax(180px, 1fr))';
    }
    
    appState.currentSpread.positions.forEach((pos, index) => {
        const posElement = document.createElement('div');
        posElement.className = 'spread-position';
        posElement.dataset.position = pos.position;
        posElement.innerHTML = `
            <h4>Position ${pos.position}</h4>
            <h4>${pos.name}</h4>
            <p class="position-meaning">${pos.meaning}</p>
        `;
        spreadLayout.appendChild(posElement);
    });
}

// Draw cards
function drawCards() {
    if (!appState.currentSpread) return;
    
    // Reset drawn cards
    appState.drawnCards = [];
    
    // Create a shuffled deck
    const shuffledDeck = [...appState.tarotCards].sort(() => Math.random() - 0.5);
    
    // Draw cards for each position
    appState.currentSpread.positions.forEach((pos, index) => {
        const card = shuffledDeck[index];
        const isReversed = Math.random() < 0.3; // 30% chance of reversed
        
        appState.drawnCards.push({
            position: pos.position,
            card: card,
            reversed: isReversed
        });
    });
    
    // Display drawn cards
    displayDrawnCards();
}

// Display drawn cards
function displayDrawnCards() {
    appState.drawnCards.forEach(drawn => {
        const posElement = document.querySelector(`[data-position="${drawn.position}"]`);
        if (posElement) {
            posElement.classList.add('filled');
            
            const drawnCardDiv = document.createElement('div');
            drawnCardDiv.className = 'drawn-card';
            drawnCardDiv.innerHTML = `
                <h5>${drawn.card.name}${drawn.reversed ? ' (Reversed)' : ''}</h5>
                <button class="action-btn" style="margin-top: 10px; padding: 5px 10px; font-size: 0.9em;">
                    View Details
                </button>
            `;
            
            drawnCardDiv.querySelector('button').addEventListener('click', () => {
                showCardDetail(drawn.card);
            });
            
            posElement.appendChild(drawnCardDiv);
        }
    });
}

// Reset spread
function resetSpread() {
    appState.drawnCards = [];
    if (appState.currentSpread) {
        displaySpreadLayout();
    } else {
        document.getElementById('spread-layout').innerHTML = '';
        document.getElementById('spread-info').innerHTML = '<h3 id="spread-name"></h3><p id="spread-description"></p>';
    }
}

// Show error message
function showError(message) {
    const main = document.querySelector('.main-content');
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        background: #8b0000;
        color: white;
        padding: 20px;
        border-radius: 10px;
        text-align: center;
        margin: 20px;
    `;
    errorDiv.textContent = message;
    main.insertBefore(errorDiv, main.firstChild);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
