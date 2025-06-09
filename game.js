const boardSize = 4;
let board = [];
let score = 0;

const boardElement = document.getElementById('game-board');
const scoreElement = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');

function initBoard() {
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
    score = 0;
    updateScore();
    addRandomTile();
    addRandomTile();
    updateBoard();
}

function addRandomTile() {
    const emptyCells = [];
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            if (board[r][c] === 0) emptyCells.push({ r, c });
        }
    }
    if (emptyCells.length === 0) return;
    const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    board[r][c] = Math.random() < 0.9 ? 2 : 4;
}

function updateBoard() {
    boardElement.innerHTML = '';
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            const value = board[r][c];
            const tile = document.createElement('div');
            tile.className = 'tile' + (value ? ' tile-' + value : '');
            tile.textContent = value ? value : '';
            boardElement.appendChild(tile);
        }
    }
}

function updateScore() {
    scoreElement.textContent = score;
}

function transpose(matrix) {
    return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function reverseRows(matrix) {
    return matrix.map(row => row.slice().reverse());
}

function moveLeft() {
    let moved = false;
    for (let r = 0; r < boardSize; r++) {
        let row = board[r].filter(v => v);
        for (let c = 0; c < row.length - 1; c++) {
            if (row[c] === row[c + 1]) {
                row[c] *= 2;
                score += row[c];
                row[c + 1] = 0;
            }
        }
        row = row.filter(v => v);
        while (row.length < boardSize) row.push(0);
        if (!moved && row.some((v, i) => v !== board[r][i])) moved = true;
        board[r] = row;
    }
    return moved;
}

function moveRight() {
    board = reverseRows(board);
    const moved = moveLeft();
    board = reverseRows(board);
    return moved;
}

function moveUp() {
    board = transpose(board);
    const moved = moveLeft();
    board = transpose(board);
    return moved;
}

function moveDown() {
    board = transpose(board);
    board = reverseRows(board);
    const moved = moveLeft();
    board = reverseRows(board);
    board = transpose(board);
    return moved;
}

function isGameOver() {
    for (let r = 0; r < boardSize; r++) {
        for (let c = 0; c < boardSize; c++) {
            if (board[r][c] === 0) return false;
            if (c < boardSize - 1 && board[r][c] === board[r][c + 1]) return false;
            if (r < boardSize - 1 && board[r][c] === board[r + 1][c]) return false;
        }
    }
    return true;
}

function handleMove(moveFunc) {
    if (moveFunc()) {
        addRandomTile();
        updateScore();
        updateBoard();
        if (isGameOver()) {
            setTimeout(() => alert('Game Over!'), 100);
        }
    }
}

document.addEventListener('keydown', e => {
    switch (e.key) {
        case 'ArrowLeft':
            handleMove(moveLeft);
            break;
        case 'ArrowRight':
            handleMove(moveRight);
            break;
        case 'ArrowUp':
            handleMove(moveUp);
            break;
        case 'ArrowDown':
            handleMove(moveDown);
            break;
    }
});

restartBtn.addEventListener('click', initBoard);

window.onload = initBoard; 