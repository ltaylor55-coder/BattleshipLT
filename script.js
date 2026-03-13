// Ship Factory
function Ship(length) {
    let hits = 0;
    function hit() { if (hits < length) hits++; }
    function isSunk() { return hits >= length; }
    function getHits() { return hits; }
    return { length, hit, isSunk, getHits };
}

// Gameboard Factory
function Gameboard() {
    const board = Array(10).fill().map(() => Array(10).fill(null));
    const missedAttacks = [];
    const ships = [];

    function isValidCoordinate(row, col) {
        return row >= 0 && row < 10 && col >= 0 && col < 10;
    }

    function placeShip(row, col, length, isVertical = false) {
        if (!isValidCoordinate(row, col)) return false;
        if (isVertical) {
            if (row + length > 10) return false;
            for (let i = 0; i < length; i++) {
                if (board[row + i][col] !== null) return false;
            }
            const ship = Ship(length);
            ships.push(ship);
            for (let i = 0; i < length; i++) {
                board[row + i][col] = { ship, index: i };
            }
        } else {
            if (col + length > 10) return false;
            for (let i = 0; i < length; i++) {
                if (board[row][col + i] !== null) return false;
            }
            const ship = Ship(length);
            ships.push(ship);
            for (let i = 0; i < length; i++) {
                board[row][col + i] = { ship, index: i };
            }
        }
        return true;
    }

    function receiveAttack(row, col) {
        if (!isValidCoordinate(row, col)) return false;
        if (board[row][col] === null) {
            missedAttacks.push([row, col]);
            board[row][col] = 'miss';
            return 'miss';
        }
        if (board[row][col] === 'hit' || board[row][col] === 'miss') return false;
        
        const cell = board[row][col];
        cell.ship.hit();
        board[row][col] = 'hit';
        return 'hit';
    }

    function allShipsSunk() {
        return ships.every(ship => ship.isSunk());
    }

    function getBoard() {
        return board.map(row => [...row]);
    }

    return { placeShip, receiveAttack, allShipsSunk, getBoard };
}

// Player Factory
function Player(type = 'real') {
    const gameboard = Gameboard();
    const attacks = new Set();

    function attack(row, col, opponentBoard) {
        if (type === 'real') {
            const key = `${row},${col}`;
            if (attacks.has(key)) return false;
            attacks.add(key);
            return opponentBoard.receiveAttack(row, col);
        }
        return false;
    }

    function randomAttack(opponentBoard) {
        if (type !== 'computer') return false;
        let row, col, key;
        do {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
            key = `${row},${col}`;
        } while (attacks.has(key));
        attacks.add(key);
        return opponentBoard.receiveAttack(row, col);
    }

    function getGameboard() { return gameboard; }
    function placeShip(row, col, length, isVertical) {
        return gameboard.placeShip(row, col, length, isVertical);
    }

    return { type, attack, randomAttack, getGameboard, placeShip };
}

// Game
function Game() {
    let player1 = Player('real');
    let player2 = Player('computer');
    let currentPlayer = player1;
    let gameOver = false;

    function switchPlayer() {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    }

    function playTurn(row, col) {
        if (gameOver) return { gameOver: true };
        const opponent = currentPlayer === player1 ? player2 : player1;
        let result;

        if (currentPlayer.type === 'real') {
            result = currentPlayer.attack(row, col, opponent.getGameboard());
        } else {
            result = currentPlayer.randomAttack(opponent.getGameboard());
        }

        if (!result) return { success: false };

        if (opponent.getGameboard().allShipsSunk()) {
            gameOver = true;
            return { success: true, result, gameOver: true, winner: currentPlayer.type };
        }

        switchPlayer();
        return { success: true, result, gameOver: false };
    }

    function getCurrentPlayer() { return currentPlayer; }
    function getPlayerBoards() {
        return {
            player1: player1.getGameboard().getBoard(),
            player2: player2.getGameboard().getBoard()
        };
    }
    function reset() {
        player1 = Player('real');
        player2 = Player('computer');
        currentPlayer = player1;
        gameOver = false;
    }

    return { playTurn, getCurrentPlayer, getPlayerBoards, reset, player1, player2 };
}

// DOM functions
function renderBoard(elementId, board, showShips = true) {
    const container = document.getElementById(elementId);
    container.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            
            const cellValue = board[i][j];
            
            if (cellValue === 'hit') {
                cell.classList.add('hit');
                cell.textContent = 'X';
            } else if (cellValue === 'miss') {
                cell.classList.add('miss');
                cell.textContent = 'O';
            } else if (showShips && cellValue !== null) {
                cell.classList.add('ship');
            }
            container.appendChild(cell);
        }
    }
}

function updateStatus(message) {
    document.getElementById('status-message').textContent = message;
}

// Initialize game
const game = Game();
let gameStarted = false;

function renderGame() {
    const boards = game.getPlayerBoards();
    renderBoard('player-board', boards.player1, true);
    renderBoard('enemy-board', boards.player2, false);
}

function placeRandomShips() {
    game.reset();
    gameStarted = false;
    const ships = [5, 4, 3, 3, 2];
    
    ships.forEach(length => {
        let placed = false;
        while (!placed) {
            const row = Math.floor(Math.random() * 10);
            const col = Math.floor(Math.random() * 10);
            const isVertical = Math.random() > 0.5;
            placed = game.player1.placeShip(row, col, length, isVertical);
        }
    });
    
    ships.forEach(length => {
        let placed = false;
        while (!placed) {
            const row = Math.floor(Math.random() * 10);
            const col = Math.floor(Math.random() * 10);
            const isVertical = Math.random() > 0.5;
            placed = game.player2.placeShip(row, col, length, isVertical);
        }
    });
    
    renderGame();
    updateStatus("Your turn! Click on enemy board to attack");
}

function computerTurn() {
    if (game.getCurrentPlayer().type !== 'computer') return;
    const result = game.playTurn();
    if (result.success) {
        renderGame();
        if (result.gameOver) {
            updateStatus(`${result.winner} wins!`);
            gameStarted = false;
        } else {
            updateStatus("Your turn! Click on enemy board to attack");
        }
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    placeRandomShips();
    
    document.getElementById('enemy-board').addEventListener('click', (event) => {
        const cell = event.target;
        if (!cell.classList.contains('cell')) return;
        
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        
        if (game.getCurrentPlayer().type !== 'real' || gameStarted) return;
        
        const result = game.playTurn(row, col);
        
        if (result.success) {
            gameStarted = true;
            renderGame();
            
            if (result.gameOver) {
                updateStatus(`${result.winner} wins!`);
                gameStarted = false;
            } else {
                updateStatus("Computer's turn...");
                setTimeout(computerTurn, 1000);
            }
        }
    });
    
    document.getElementById('reset-btn').addEventListener('click', placeRandomShips);
    document.getElementById('place-ships-btn').addEventListener('click', placeRandomShips);
});