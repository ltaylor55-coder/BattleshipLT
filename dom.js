// dom.js
export function renderBoard(elementId, board, showShips = true) {
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

export function updateStatus(message) {
  const statusElement = document.getElementById('status-message');
  if (statusElement) {
    statusElement.textContent = message;
  }
}

export function initializeBoards() {
  const emptyBoard = Array(10).fill().map(() => Array(10).fill(null));
  renderBoard('player-board', emptyBoard, true);
  renderBoard('enemy-board', emptyBoard, false);
}