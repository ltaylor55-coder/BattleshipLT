
import Gameboard from './gameboard.js';

export default function Player(type = 'real') {
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

  function getGameboard() {
    return gameboard;
  }

  function getAttacks() {
    return new Set(attacks);
  }

  function placeShip(row, col, length, isVertical) {
    return gameboard.placeShip(row, col, length, isVertical);
  }

  return {
    type,
    attack,
    randomAttack,
    getGameboard,
    getAttacks,
    placeShip
  };
}