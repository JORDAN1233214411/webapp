// Calculator Class
class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.updateDisplay();
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
        this.updateDisplay();
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        this.currentOperand = this.currentOperand.toString() + number.toString();
        this.updateDisplay();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;

        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '−':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            case '%':
                computation = prev % current;
                break;
            default:
                return;
        }

        this.currentOperand = computation;
        this.operation = undefined;
        this.previousOperand = '';
        this.updateDisplay();
    }

    // Scientific Functions
    squareRoot() {
        const current = parseFloat(this.currentOperand);
        if (!isNaN(current)) {
            this.currentOperand = Math.sqrt(current);
            this.updateDisplay();
        }
    }

    square() {
        const current = parseFloat(this.currentOperand);
        if (!isNaN(current)) {
            this.currentOperand = current * current;
            this.updateDisplay();
        }
    }

    reciprocal() {
        const current = parseFloat(this.currentOperand);
        if (!isNaN(current) && current !== 0) {
            this.currentOperand = 1 / current;
            this.updateDisplay();
        }
    }

    factorial() {
        const current = parseInt(this.currentOperand);
        if (!isNaN(current) && current >= 0) {
            let result = 1;
            for (let i = 2; i <= current; i++) {
                result *= i;
            }
            this.currentOperand = result;
            this.updateDisplay();
        }
    }

    sine() {
        const current = parseFloat(this.currentOperand);
        if (!isNaN(current)) {
            this.currentOperand = Math.sin(current * Math.PI / 180);
            this.updateDisplay();
        }
    }

    cosine() {
        const current = parseFloat(this.currentOperand);
        if (!isNaN(current)) {
            this.currentOperand = Math.cos(current * Math.PI / 180);
            this.updateDisplay();
        }
    }

    tangent() {
        const current = parseFloat(this.currentOperand);
        if (!isNaN(current)) {
            this.currentOperand = Math.tan(current * Math.PI / 180);
            this.updateDisplay();
        }
    }

    log() {
        const current = parseFloat(this.currentOperand);
        if (!isNaN(current) && current > 0) {
            this.currentOperand = Math.log10(current);
            this.updateDisplay();
        }
    }

    ln() {
        const current = parseFloat(this.currentOperand);
        if (!isNaN(current) && current > 0) {
            this.currentOperand = Math.log(current);
            this.updateDisplay();
        }
    }

    power() {
        if (this.currentOperand === '') return;
        this.operation = '^';
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.updateDisplay();
    }

    computePower() {
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (!isNaN(prev) && !isNaN(current)) {
            this.currentOperand = Math.pow(prev, current);
            this.operation = undefined;
            this.previousOperand = '';
            this.updateDisplay();
        }
    }

    appendPi() {
        this.currentOperand = this.currentOperand.toString() + Math.PI.toString();
        this.updateDisplay();
    }

    appendE() {
        this.currentOperand = this.currentOperand.toString() + Math.E.toString();
        this.updateDisplay();
    }

    toggleSign() {
        const current = parseFloat(this.currentOperand);
        if (!isNaN(current)) {
            this.currentOperand = (current * -1).toString();
            this.updateDisplay();
        }
    }

    updateDisplay() {
        const decimalPlaces = localStorage.getItem('decimalPlaces') || 'all';
        let current = this.currentOperand.toString();
        let previous = this.previousOperand.toString();

        // Format current operand
        if (decimalPlaces !== 'all') {
            const num = parseFloat(current);
            if (!isNaN(num)) {
                current = num.toFixed(parseInt(decimalPlaces));
            }
        }

        // Format previous operand
        if (decimalPlaces !== 'all') {
            const num = parseFloat(previous);
            if (!isNaN(num)) {
                previous = num.toFixed(parseInt(decimalPlaces));
            }
        }

        this.currentOperandElement.innerText = current || '0';
        this.previousOperandElement.innerText = `${previous} ${this.operation || ''}`.trim();
    }
}

// Settings Manager
class SettingsManager {
    constructor() {
        this.defaults = {
            scientificMode: false,
            theme: 'blue-green',
            glowIntensity: 100,
            brightness: 100,
            decimalPlaces: 'all',
            fontSize: 36,
            buttonSound: true
        };
        this.settings = this.loadSettings();
    }

    loadSettings() {
        const saved = localStorage.getItem('calculatorSettings');
        return saved ? JSON.parse(saved) : { ...this.defaults };
    }

    saveSettings() {
        localStorage.setItem('calculatorSettings', JSON.stringify(this.settings));
    }

    getSetting(key) {
        return this.settings[key] !== undefined ? this.settings[key] : this.defaults[key];
    }

    setSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
    }

    resetToDefaults() {
        this.settings = { ...this.defaults };
        this.saveSettings();
    }

    applySettings() {
        // Apply theme
        const theme = this.getSetting('theme');
        document.body.className = `theme-${theme}`;

        // Apply glow intensity
        const glowIntensity = this.getSetting('glowIntensity');
        const glowFactor = glowIntensity / 100;
        document.documentElement.style.setProperty('--glow-intensity', glowFactor);

        // Apply brightness
        const brightness = this.getSetting('brightness');
        const displayContainer = document.querySelector('.display-container');
        if (displayContainer) {
            displayContainer.style.filter = `brightness(${brightness}%)`;
        }

        // Apply font size
        const fontSize = this.getSetting('fontSize');
        const currentOperand = document.getElementById('currentOperand');
        if (currentOperand) {
            currentOperand.style.fontSize = `${fontSize}px`;
        }

        // Apply scientific mode
        const scientificMode = this.getSetting('scientificMode');
        const buttonGrid = document.getElementById('buttonGrid');
        if (scientificMode) {
            buttonGrid.classList.add('scientific');
        } else {
            buttonGrid.classList.remove('scientific');
        }
    }
}

// Sound Manager
class SoundManager {
    playClickSound() {
        if (!localStorage.getItem('buttonSound') || localStorage.getItem('buttonSound') === 'true') {
            this.playTone();
        }
    }

    playTone() {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();

            oscillator.connect(gain);
            gain.connect(audioContext.destination);

            oscillator.frequency.value = 800;
            oscillator.type = 'sine';

            gain.gain.setValueAtTime(0.1, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);

            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Audio context not supported
        }
    }
}

// Initialize
let calculator;
let settingsManager;
let soundManager;

document.addEventListener('DOMContentLoaded', () => {
    const previousOperandElement = document.getElementById('previousOperand');
    const currentOperandElement = document.getElementById('currentOperand');

    calculator = new Calculator(previousOperandElement, currentOperandElement);
    settingsManager = new SettingsManager();
    soundManager = new SoundManager();

    // Apply saved settings
    settingsManager.applySettings();

    // Render buttons
    renderButtons();

    // Setup event listeners
    setupEventListeners();
});

function renderButtons() {
    const buttonGrid = document.getElementById('buttonGrid');
    const scientificMode = settingsManager.getSetting('scientificMode');

    const basicButtons = [
        { text: 'C', action: 'clear', class: 'btn-clear' },
        { text: '⌫', action: 'delete', class: 'btn-delete' },
        { text: '÷', action: 'divide', class: 'btn-operator' },
        { text: '×', action: 'multiply', class: 'btn-operator' },
        { text: '7', action: 'number', class: 'btn-number' },
        { text: '8', action: 'number', class: 'btn-number' },
        { text: '9', action: 'number', class: 'btn-number' },
        { text: '−', action: 'subtract', class: 'btn-operator' },
        { text: '4', action: 'number', class: 'btn-number' },
        { text: '5', action: 'number', class: 'btn-number' },
        { text: '6', action: 'number', class: 'btn-number' },
        { text: '+', action: 'add', class: 'btn-operator' },
        { text: '1', action: 'number', class: 'btn-number' },
        { text: '2', action: 'number', class: 'btn-number' },
        { text: '3', action: 'number', class: 'btn-number' },
        { text: '=', action: 'equals', class: 'btn-equals' },
        { text: '0', action: 'number', class: 'btn-number' },
        { text: '.', action: 'number', class: 'btn-number' },
        { text: '%', action: 'modulo', class: 'btn-operator' }
    ];

    const scientificButtons = [
        { text: 'sin', action: 'sine', class: 'btn-scientific' },
        { text: 'cos', action: 'cosine', class: 'btn-scientific' },
        { text: 'tan', action: 'tangent', class: 'btn-scientific' },
        { text: 'log', action: 'log', class: 'btn-scientific' },
        { text: 'ln', action: 'ln', class: 'btn-scientific' },
        { text: '√', action: 'squareRoot', class: 'btn-scientific' },
        { text: 'x²', action: 'square', class: 'btn-scientific' },
        { text: 'x^y', action: 'power', class: 'btn-scientific' },
        { text: '1/x', action: 'reciprocal', class: 'btn-scientific' },
        { text: 'n!', action: 'factorial', class: 'btn-scientific' },
        { text: 'π', action: 'pi', class: 'btn-scientific' },
        { text: 'e', action: 'e', class: 'btn-scientific' },
        { text: '+/−', action: 'toggleSign', class: 'btn-scientific' }
    ];

    buttonGrid.innerHTML = '';

    if (scientificMode) {
        // Add scientific buttons first
        scientificButtons.forEach(btn => {
            const button = createButton(btn);
            buttonGrid.appendChild(button);
        });
    }

    // Add basic buttons
    basicButtons.forEach(btn => {
        const button = createButton(btn);
        buttonGrid.appendChild(button);
    });
}

function createButton(btnData) {
    const button = document.createElement('button');
    button.textContent = btnData.text;
    button.className = btnData.class;
    button.addEventListener('click', () => handleButtonClick(btnData.action, btnData.text));
    return button;
}

function handleButtonClick(action, text) {
    soundManager.playClickSound();

    switch (action) {
        case 'number':
            calculator.appendNumber(text);
            break;
        case 'clear':
            calculator.clear();
            break;
        case 'delete':
            calculator.delete();
            break;
        case 'add':
            calculator.chooseOperation('+');
            break;
        case 'subtract':
            calculator.chooseOperation('−');
            break;
        case 'multiply':
            calculator.chooseOperation('×');
            break;
        case 'divide':
            calculator.chooseOperation('÷');
            break;
        case 'modulo':
            calculator.chooseOperation('%');
            break;
        case 'equals':
            if (calculator.operation === '^') {
                calculator.computePower();
            } else {
                calculator.compute();
            }
            break;
        case 'squareRoot':
            calculator.squareRoot();
            break;
        case 'square':
            calculator.square();
            break;
        case 'reciprocal':
            calculator.reciprocal();
            break;
        case 'factorial':
            calculator.factorial();
            break;
        case 'sine':
            calculator.sine();
            break;
        case 'cosine':
            calculator.cosine();
            break;
        case 'tangent':
            calculator.tangent();
            break;
        case 'log':
            calculator.log();
            break;
        case 'ln':
            calculator.ln();
            break;
        case 'power':
            calculator.power();
            break;
        case 'pi':
            calculator.appendPi();
            break;
        case 'e':
            calculator.appendE();
            break;
        case 'toggleSign':
            calculator.toggleSign();
            break;
    }
}

function setupEventListeners() {
    // Settings button
    document.getElementById('settingsBtn').addEventListener('click', () => {
        document.getElementById('settingsModal').classList.add('show');
    });

    // Close settings
    document.getElementById('closeSettings').addEventListener('click', () => {
        document.getElementById('settingsModal').classList.remove('show');
    });

    // Scientific mode toggle
    const scientificMode = document.getElementById('scientificMode');
    scientificMode.checked = settingsManager.getSetting('scientificMode');
    scientificMode.addEventListener('change', (e) => {
        settingsManager.setSetting('scientificMode', e.target.checked);
        settingsManager.applySettings();
        renderButtons();
    });

    // Theme selection
    document.querySelectorAll('.theme-option').forEach(option => {
        const theme = option.dataset.theme;
        if (theme === settingsManager.getSetting('theme')) {
            option.classList.add('active');
        }
        option.addEventListener('click', () => {
            document.querySelectorAll('.theme-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
            settingsManager.setSetting('theme', theme);
            settingsManager.applySettings();
        });
    });

    // Glow intensity
    const glowIntensity = document.getElementById('glowIntensity');
    glowIntensity.value = settingsManager.getSetting('glowIntensity');
    glowIntensity.addEventListener('input', (e) => {
        document.getElementById('glowValue').textContent = e.target.value;
        settingsManager.setSetting('glowIntensity', e.target.value);
        settingsManager.applySettings();
    });

    // Brightness
    const brightness = document.getElementById('brightness');
    brightness.value = settingsManager.getSetting('brightness');
    brightness.addEventListener('input', (e) => {
        document.getElementById('brightnessValue').textContent = e.target.value;
        settingsManager.setSetting('brightness', e.target.value);
        settingsManager.applySettings();
    });

    // Decimal places
    const decimalPlaces = document.getElementById('decimalPlaces');
    decimalPlaces.value = settingsManager.getSetting('decimalPlaces');
    decimalPlaces.addEventListener('change', (e) => {
        settingsManager.setSetting('decimalPlaces', e.target.value);
        calculator.updateDisplay();
    });

    // Font size
    const fontSize = document.getElementById('fontSize');
    fontSize.value = settingsManager.getSetting('fontSize');
    fontSize.addEventListener('input', (e) => {
        document.getElementById('fontSizeValue').textContent = e.target.value;
        settingsManager.setSetting('fontSize', e.target.value);
        settingsManager.applySettings();
    });

    // Button sound toggle
    const buttonSound = document.getElementById('buttonSound');
    buttonSound.checked = settingsManager.getSetting('buttonSound');
    buttonSound.addEventListener('change', (e) => {
        settingsManager.setSetting('buttonSound', e.target.checked);
    });

    // Reset button
    document.getElementById('resetBtn').addEventListener('click', () => {
        if (confirm('Reset all settings to defaults?')) {
            settingsManager.resetToDefaults();
            location.reload();
        }
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        if (document.getElementById('settingsModal').classList.contains('show')) return;

        if (/^[0-9.]$/.test(e.key)) {
            calculator.appendNumber(e.key);
            soundManager.playClickSound();
        } else if (e.key === '+') {
            e.preventDefault();
            calculator.chooseOperation('+');
            soundManager.playClickSound();
        } else if (e.key === '-') {
            e.preventDefault();
            calculator.chooseOperation('−');
            soundManager.playClickSound();
        } else if (e.key === '*') {
            e.preventDefault();
            calculator.chooseOperation('×');
            soundManager.playClickSound();
        } else if (e.key === '/') {
            e.preventDefault();
            calculator.chooseOperation('÷');
            soundManager.playClickSound();
        } else if (e.key === '%') {
            calculator.chooseOperation('%');
            soundManager.playClickSound();
        } else if (e.key === 'Enter' || e.key === '=') {
            e.preventDefault();
            if (calculator.operation === '^') {
                calculator.computePower();
            } else {
                calculator.compute();
            }
            soundManager.playClickSound();
        } else if (e.key === 'Backspace') {
            e.preventDefault();
            calculator.delete();
            soundManager.playClickSound();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            calculator.clear();
            soundManager.playClickSound();
        }
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        const modal = document.getElementById('settingsModal');
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
}
