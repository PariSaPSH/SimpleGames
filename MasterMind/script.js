let gameMode = '';
let numSlots = 4;
let numColors = 6;
let secretCode = [];
let currentGuess = [];
let selectedColor = 'c-0';

function createPicker() {
    const picker = document.getElementById('dynamic-picker');
    picker.innerHTML = '';

    for (let i = 0; i < numColors; i++) {
        let opt = document.createElement('div');
        opt.className = `color-opt c-${i}`;
        if (`c-${i}` === selectedColor) opt.classList.add('selected');
        opt.onclick = () => selectColor(`c-${i}`);
        picker.appendChild(opt);
    }
}

function selectColor(color) {
    selectedColor = color;
    document.querySelectorAll('.color-opt').forEach(opt => {
        opt.classList.toggle('selected', opt.classList.contains(color));
    });
}

function initSetup(mode) {
    gameMode = mode;
    document.getElementById('config-area').classList.remove('hidden');
    document.getElementById('top-header').classList.remove('hidden');
    document.getElementById('play-controls').classList.add('hidden');
    refreshSetup();
}

function refreshSetup() {
    numSlots = parseInt(document.getElementById('slot-count').value);
    numColors = parseInt(document.getElementById('color-count').value);
    createPicker();

    if (gameMode === 'pvp') {
        document.getElementById('pvp-setter').classList.remove('hidden');
        renderSecretInputs();
    } else {
        document.getElementById('pvp-setter').classList.add('hidden');
    }
}

function renderSecretInputs() {
    const container = document.getElementById('secret-inputs');
    container.innerHTML = '';
    secretCode = Array(numSlots).fill(null);

    for (let i = 0; i < numSlots; i++) {
        let div = document.createElement('div');
        div.className = 'peg';
        div.onclick = () => {
            div.className = 'peg ' + selectedColor;
            secretCode[i] = selectedColor;
        };
        container.appendChild(div);
    }
}

function startGame() {
    if (gameMode === 'pvc') {
        secretCode = Array.from({ length: numSlots }, () => `c-${Math.floor(Math.random() * numColors)}`);
    } else if (secretCode.includes(null)) {
        alert("Please set the full secret code first!");
        return;
    }

    document.getElementById('setup').classList.add('hidden');
    document.getElementById('game').classList.remove('hidden');
    document.getElementById('play-controls').classList.remove('hidden');
    resetGuessRow();
}

function resetGuessRow() {
    currentGuess = Array(numSlots).fill(null);
    const board = document.getElementById('board');
    const row = document.createElement('div');
    row.className = 'row active-row';

    const sDiv = document.createElement('div');
    sDiv.className = 'slots';

    for (let i = 0; i < numSlots; i++) {
        let peg = document.createElement('div');
        peg.className = 'peg';
        peg.onclick = function() {
            if (!row.classList.contains('active-row')) return;
            peg.className = 'peg ' + selectedColor;
            currentGuess[i] = selectedColor;
        };
        sDiv.appendChild(peg);
    }

    const fDiv = document.createElement('div');
    fDiv.className = 'feedback';

    for (let i = 0; i < numSlots; i++) {
        let dot = document.createElement('div');
        dot.className = 'check';
        fDiv.appendChild(dot);
    }

    row.appendChild(sDiv);
    row.appendChild(fDiv);
    board.appendChild(row);
}

function submitGuess() {
    if (currentGuess.includes(null)) {
        document.getElementById('status').innerText = "Fill all slots first!";
        return;
    }

    const result = calculateScore(secretCode, currentGuess);
    updateFeedbackUI(result);

    if (result.black === numSlots) {
        document.getElementById('status').innerText = "CONGRATULATIONS!";
        document.getElementById('status').style.color = "#2ecc71";
        document.querySelector('.active-row').classList.remove('active-row');
    } else {
        document.getElementById('status').innerText = "";
        document.querySelector('.active-row').classList.remove('active-row');
        resetGuessRow();
    }
}

function calculateScore(code, guess) {
    let black = 0, white = 0;
    let cCopy = [...code], gCopy = [...guess];

    for (let i = 0; i < numSlots; i++) {
        if (gCopy[i] === cCopy[i]) {
            black++;
            cCopy[i] = gCopy[i] = null;
        }
    }

    for (let i = 0; i < numSlots; i++) {
        if (gCopy[i] !== null) {
            let idx = cCopy.indexOf(gCopy[i]);
            if (idx !== -1) {
                white++;
                cCopy[idx] = null;
            }
        }
    }

    return { black, white };
}

function updateFeedbackUI(result) {
    const activeRow = document.querySelector('.active-row');
    if (!activeRow) return;

    const dots = activeRow.querySelectorAll('.check');
    let idx = 0;

    for (let i = 0; i < result.black; i++) dots[idx++].classList.add('correct');
    for (let i = 0; i < result.white; i++) dots[idx++].classList.add('wrong-pos');
}
