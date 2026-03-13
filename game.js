
import Player from './player.js';

export default function Game() {
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
      return { 
        success: true, 
        result, 
        gameOver: true, 
        winner: currentPlayer.type 
      };
    }

    switchPlayer();
    return { success: true, result, gameOver: false };
  }

  function getCurrentPlayer() {
    return currentPlayer;
  }

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

  return {
    playTurn,
    getCurrentPlayer,
    getPlayerBoards,
    reset,
    player1,
    player2
  };
}