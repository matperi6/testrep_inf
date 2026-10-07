const cells = [...document.querySelectorAll('.cell')];
const statusLine = document.querySelector('#game-status');
const playerX = document.querySelector('#player-x');
const playerO = document.querySelector('#player-o');
const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

let board = Array(9).fill('');
let currentPlayer = 'X';
let roundFinished = false;
const scores = { X: 0, O: 0, draw: 0 };

function updateStatus(message) {
  const mark = currentPlayer === 'X' ? '×' : '○';
  statusLine.replaceChildren(mark, document.createElement('span'));
  statusLine.lastElementChild.textContent = message;
}

function updateScoreboard() {
  document.querySelector('#score-x').textContent = scores.X;
  document.querySelector('#score-o').textContent = scores.O;
  document.querySelector('#score-draw').textContent = scores.draw;
  playerX.classList.toggle('is-active', currentPlayer === 'X' && !roundFinished);
  playerO.classList.toggle('is-active', currentPlayer === 'O' && !roundFinished);
}

function winningLineFor(mark) {
  return winningLines.find((line) => line.every((index) => board[index] === mark));
}

function playTurn(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.index);

  if (roundFinished || board[index]) return;

  board[index] = currentPlayer;
  cell.textContent = currentPlayer === 'X' ? '×' : '○';
  cell.classList.add(currentPlayer === 'X' ? 'mark-x' : 'mark-o');
  cell.setAttribute('aria-label', `Feld ${index + 1}, ${currentPlayer === 'X' ? 'Kreuz' : 'Kreis'}`);
  cell.disabled = true;

  const winningLine = winningLineFor(currentPlayer);
  if (winningLine) {
    roundFinished = true;
    scores[currentPlayer] += 1;
    winningLine.forEach((winningIndex) => cells[winningIndex].classList.add('is-winner'));
    updateStatus(`${currentPlayer === 'X' ? 'Spieler 1' : 'Spieler 2'} gewinnt!`);
    updateScoreboard();
    return;
  }

  if (board.every(Boolean)) {
    roundFinished = true;
    scores.draw += 1;
    updateStatus('Unentschieden! Gute Runde.');
    updateScoreboard();
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus(`${currentPlayer === 'X' ? 'Spieler 1' : 'Spieler 2'} ist am Zug`);
  updateScoreboard();
}

function startNewRound() {
  board = Array(9).fill('');
  currentPlayer = 'X';
  roundFinished = false;

  cells.forEach((cell, index) => {
    cell.textContent = '';
    cell.disabled = false;
    cell.classList.remove('mark-x', 'mark-o', 'is-winner');
    cell.setAttribute('aria-label', `Feld ${index + 1}, leer`);
  });

  updateStatus('Spieler 1 ist am Zug');
  updateScoreboard();
}

cells.forEach((cell) => cell.addEventListener('click', playTurn));
document.querySelector('#new-game').addEventListener('click', startNewRound);
document.querySelector('#reset-scores').addEventListener('click', () => {
  scores.X = 0;
  scores.O = 0;
  scores.draw = 0;
  startNewRound();
});

updateScoreboard();