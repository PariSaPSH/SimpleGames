let selectedNum = null;
let solution = [];
let puzzle = [];

function generateSudoku() {
    const board = Array(81).fill(0);

    function isValid(board, pos, num) {
        const row = Math.floor(pos / 9);
        const col = pos % 9;

        for (let i = 0; i < 9; i++) {
            if (board[row * 9 + i] === num || board[i * 9 + col] === num) return false;
        }

        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[(startRow + i) * 9 + (startCol + j)] === num) return false;
            }
        }

        return true;
    }

    function solve(board) {
        for (let i = 0; i < 81; i++) {
            if (board[i] === 0) {
                const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);

                for (let num of nums) {
                    if (isValid(board, i, num)) {
                        board[i] = num;
                        if (solve(board)) return true;
                        board[i] = 0;
                    }
                }
                return false;
            }
        }
        return true;
    }

    solve(board);
    solution = [...board];

    const diff = document.getElementById('difficulty').value;
    const attempts = { easy: 30, medium: 45, hard: 55 }[diff];

    puzzle = [...board];
    for (let i = 0; i < attempts; i++) {
        let idx = Math.floor(Math.random() * 81);
        puzzle[idx] = 0;
    }
}

function createGrid() {
    const gridEl = document.getElementById('grid');
    gridEl.innerHTML = '';

    for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';

        if (puzzle[i] !== 0) {
            cell.textContent = puzzle[i];
            cell.classList.add('fixed');
        }

        cell.onclick = () => fillCell(cell, i);
        gridEl.appendChild(cell);
    }
}

function selectNumber(num) {
    selectedNum = num;

    document.querySelectorAll('.num-btn').forEach(btn => {
        btn.classList.toggle(
            'active',
            parseInt(btn.textContent) === num || (num === 0 && btn.textContent === '⌫')
        );
    });
}

function fillCell(cell, idx) {
    if (cell.classList.contains('fixed') || selectedNum === null) return;

    if (selectedNum === 0) {
        cell.textContent = '';
        cell.classList.remove('error');
        return;
    }

    cell.textContent = selectedNum;

    if (selectedNum !== solution[idx]) {
        cell.classList.add('error');
    } else {
        cell.classList.remove('error');
    }

    checkWin();
}

function checkWin() {
    const cells = document.querySelectorAll('.cell');
    const current = Array.from(cells).map(c => parseInt(c.textContent) || 0);

    if (current.every((val, i) => val === solution[i])) {
        alert("Congratulations! You solved it!");
    }
}

function newGame() {
    generateSudoku();
    createGrid();
}

newGame();
