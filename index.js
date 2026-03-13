import Game from './game.js';
import { renderBoard, updateStatus, initializeBoards } from './dom.js';

const game = Game();
let gameStarted = false;

function handleEnemyBoardClick(event) {
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

document.addEventListener('DOMContentLoaded', () => {
    initializeBoards();
    placeRandomShips();
    
    document.getElementById('enemy-board').addEventListener('click', handleEnemyBoardClick);
    document.getElementById('reset-btn').addEventListener('click', placeRandomShips);
    document.getElementById('place-ships-btn').addEventListener('click', placeRandomShips);
});
