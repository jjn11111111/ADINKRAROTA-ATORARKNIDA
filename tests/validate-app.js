const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');

function readJson(relativePath) {
    return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}

function flattenCards(cardsData) {
    return [
        ...cardsData.major_arcana,
        ...cardsData.minor_arcana.wands,
        ...cardsData.minor_arcana.cups,
        ...cardsData.minor_arcana.swords,
        ...cardsData.minor_arcana.pentacles
    ];
}

function validateData() {
    const cardsData = readJson('public/data/tarot-cards.json');
    const symbolsData = readJson('public/data/adinkra-symbols.json');
    const spreadsData = readJson('public/data/spreads.json');
    const cards = flattenCards(cardsData);
    const symbolNames = new Set(symbolsData.symbols.map(symbol => symbol.name));

    assert(cards.length === 78, `Expected 78 tarot cards, found ${cards.length}`);
    assert(cardsData.major_arcana.length === 22, 'Expected 22 Major Arcana cards');

    for (const suit of ['wands', 'cups', 'swords', 'pentacles']) {
        assert(cardsData.minor_arcana[suit].length === 14, `Expected 14 ${suit} cards`);
    }

    cards.forEach(card => {
        for (const field of ['id', 'name', 'arcana', 'keywords', 'upright', 'reversed', 'adinkra_symbol', 'adinkra_meaning']) {
            assert(card[field] !== undefined, `${card.name || 'Unknown card'} missing ${field}`);
        }

        assert(Array.isArray(card.keywords) && card.keywords.length > 0, `${card.name} must have keywords`);
        assert(symbolNames.has(card.adinkra_symbol), `${card.name} references missing Adinkra symbol ${card.adinkra_symbol}`);
    });

    spreadsData.spreads.forEach(spread => {
        assert(spread.id && spread.name && spread.description, `Spread ${spread.id || spread.name} missing metadata`);
        assert(Array.isArray(spread.positions) && spread.positions.length > 0, `${spread.name} must define positions`);
        spread.positions.forEach((position, index) => {
            assert(position.position === index + 1, `${spread.name} position ${index + 1} is numbered incorrectly`);
            assert(position.name && position.meaning, `${spread.name} position ${index + 1} missing details`);
        });
    });
}

function validateHtmlContracts() {
    const html = fs.readFileSync(path.join(root, 'public/index.html'), 'utf8');
    const appSource = fs.readFileSync(path.join(root, 'public/js/app.js'), 'utf8');

    const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map(match => match[1]));
    const referencedIds = new Set([...appSource.matchAll(/getElementById\('([^']+)'\)/g)].map(match => match[1]));
    referencedIds.forEach(id => {
        assert(ids.has(id), `app.js references missing HTML id #${id}`);
    });

    ['home', 'deck', 'spread', 'guidebook', 'symbols'].forEach(view => {
        assert(html.includes(`data-view="${view}"`), `Missing navigation button for ${view}`);
        assert(ids.has(`${view}-view`), `Missing view section #${view}-view`);
    });
}

function createElement(tagName = 'div') {
    const element = {
        tagName: tagName.toUpperCase(),
        children: [],
        dataset: {},
        style: {},
        _innerHTML: '',
        classList: {
            values: new Set(),
            add(...names) {
                names.forEach(name => this.values.add(name));
            },
            remove(...names) {
                names.forEach(name => this.values.delete(name));
            },
            contains(name) {
                return this.values.has(name);
            }
        },
        appendChild(child) {
            child.parentNode = this;
            this.children.push(child);
            return child;
        },
        remove() {
            if (!this.parentNode) return;
            this.parentNode.children = this.parentNode.children.filter(child => child !== this);
            this.parentNode = null;
        },
        addEventListener() {},
        querySelector(selector) {
            if (selector === 'button') {
                return this.children.find(child => child.tagName === 'BUTTON') || null;
            }

            if (selector.startsWith('.')) {
                const className = selector.slice(1);
                return this.children.find(child => child.classList.contains(className)) || null;
            }

            return null;
        }
    };

    Object.defineProperty(element, 'className', {
        get() {
            return [...this.classList.values].join(' ');
        },
        set(value) {
            this.classList.values = new Set(String(value).split(/\s+/).filter(Boolean));
        }
    });

    Object.defineProperty(element, 'innerHTML', {
        get() {
            return this._innerHTML;
        },
        set(value) {
            this._innerHTML = value;
            this.children = [];

            if (String(value).includes('<button')) {
                this.appendChild(createElement('button'));
            }
        }
    });

    return element;
}

function validateSpreadRedrawBehavior() {
    const appSource = fs.readFileSync(path.join(root, 'public/js/app.js'), 'utf8');
    const start = appSource.indexOf('const appState =');
    const end = appSource.indexOf('// Show error message');
    const spreadSource = appSource.slice(start, end);
    const spreadLayout = createElement('div');
    const elementsById = new Map([['spread-layout', spreadLayout]]);
    const sandbox = {
        console,
        document: {
            createElement,
            getElementById(id) {
                return elementsById.get(id) || createElement();
            },
            querySelector(selector) {
                const match = selector.match(/^\[data-position="(\d+)"\]$/);
                if (!match) return null;
                return spreadLayout.children.find(child => String(child.dataset.position) === match[1]) || null;
            }
        },
        window: {}
    };

    vm.createContext(sandbox);
    vm.runInContext(`${spreadSource}; window.__test = { appState, drawCards };`, sandbox);

    sandbox.window.__test.appState.tarotCards = flattenCards(readJson('public/data/tarot-cards.json'));
    sandbox.window.__test.appState.currentSpread = readJson('public/data/spreads.json').spreads.find(spread => spread.id === 'three-card');

    sandbox.window.__test.drawCards();
    assert(spreadLayout.children.length === 3, 'Three-card spread should render three positions');
    assert(spreadLayout.children.every(position => position.querySelector('.drawn-card')), 'First draw should fill every position');

    sandbox.window.__test.drawCards();
    assert(spreadLayout.children.length === 3, 'Redrawing should not append duplicate spread positions');
    spreadLayout.children.forEach(position => {
        const drawnCards = position.children.filter(child => child.classList.contains('drawn-card'));
        assert(drawnCards.length === 1, 'Redrawing should leave exactly one drawn card per position');
    });
}

validateData();
validateHtmlContracts();
validateSpreadRedrawBehavior();

console.log('Application validation passed');
