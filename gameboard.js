
import Ship from './ship.js';

export default function Gameboard() {
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

  function getMissedAttacks() {
    return [...missedAttacks];
  }

  function getBoard() {
    return board.map(row => [...row]);
  }

  return {
    placeShip,
    receiveAttack,
    allShipsSunk,
    getMissedAttacks,
    getBoard
  };
}