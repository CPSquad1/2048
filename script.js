// === Constants & DOM Elements ===
const GRID_SIZE = 4;
const gridCells = document.querySelectorAll(".grid-cell");
const newGameBtn = document.getElementById("new-game");
const tryAgainBtn = document.getElementById("retry");
const continueBtn = document.getElementById("continue");
const messageBox = document.getElementById("message");
const messageText = messageBox.querySelector("p");
const scoreElement = document.getElementById("score");
const bestScoreElement = document.getElementById("best-score");
const toggleBtn = document.getElementById('theme-toggle');

let grid = [];
let score = 0;
let bestScore = 0;
let gameWon = false;

// === Initialize Game ===
document.addEventListener("DOMContentLoaded", () => {
  startNewGame();
  // Focus the game container for keyboard events
  document.querySelector('.game-container').focus();
  // Set initial theme
  document.body.classList.toggle('dark-theme', localStorage.getItem('theme') === 'dark');
  updateThemeButton();
});

newGameBtn.addEventListener("click", startNewGame);
tryAgainBtn.addEventListener("click", startNewGame);
continueBtn.addEventListener("click", () => {
  messageBox.style.display = "none";
  gameWon = false; // Allow continuing after win
});

// === Start / Reset Game ===
function startNewGame() {
  grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
  score = 0;
  gameWon = false;
  updateScore();
  messageBox.style.display = "none";

  // Spawn two starting tiles
  spawnRandomTile();
  spawnRandomTile();

  renderGrid();
}

// === Core Utility Functions ===
function getEmptyCells() {
  const empty = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) empty.push({ row: r, col: c });
    }
  }
  return empty;
}

function spawnRandomTile() {
  const emptyCells = getEmptyCells();
  if (emptyCells.length === 0) return false;

  const { row, col } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const newValue = Math.random() < 0.9 ? 2 : 4;
  grid[row][col] = newValue;
  return true;
}

// === Rendering ===
function renderGrid() {
  gridCells.forEach((cell, index) => {
    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const value = grid[row][col];

    cell.textContent = value === 0 ? "" : value;
    cell.style.backgroundColor = getTileColor(value);
    cell.style.color = value <= 4 ? "#776e65" : "#f9f6f2";
  });
}

// Tile colors
function getTileColor(value) {
  const colors = {
    0: "#cdc1b4",
    2: "#eee4da",
    4: "#ede0c8",
    8: "#f2b179",
    16: "#f59563",
    32: "#f67c5f",
    64: "#f65e3b",
    128: "#edcf72",
    256: "#edcc61",
    512: "#edc850",
    1024: "#edc53f",
    2048: "#edc22e",
  };
  return colors[value] || "#3c3a32";
}

// === Score Handling ===
function updateScore() {
  scoreElement.textContent = score;
  if (score > bestScore) {
    bestScore = score;
    bestScoreElement.textContent = bestScore;
  }
}

// === Move and Merge Functions ===
function moveTiles(direction) {
  let moved = false;
  const oldGrid = JSON.stringify(grid);
  
  // Transpose the grid for vertical moves
  if (direction === 'ArrowUp' || direction === 'ArrowDown') {
    grid = grid[0].map((_, i) => grid.map(row => row[i]));
  }
  
  // Process each row
  for (let i = 0; i < GRID_SIZE; i++) {
    let row = grid[i];
    
    // Filter out zeros
    let nonZeros = row.filter(cell => cell !== 0);
    
    // Merge tiles
    if (direction === 'ArrowRight' || direction === 'ArrowDown') {
      for (let j = nonZeros.length - 1; j > 0; j--) {
        if (nonZeros[j] === nonZeros[j - 1]) {
          nonZeros[j] *= 2;
          score += nonZeros[j];
          nonZeros.splice(j - 1, 1);
          j--; // Skip next to prevent double merging
        }
      }
      // Pad with zeros at the beginning
      while (nonZeros.length < GRID_SIZE) nonZeros.unshift(0);
    } else {
      for (let j = 0; j < nonZeros.length - 1; j++) {
        if (nonZeros[j] === nonZeros[j + 1]) {
          nonZeros[j] *= 2;
          score += nonZeros[j];
          nonZeros.splice(j + 1, 1);
        }
      }
      // Pad with zeros at the end
      while (nonZeros.length < GRID_SIZE) nonZeros.push(0);
    }
    
    // Update the row
    grid[i] = nonZeros;
  }
  
  // Transpose back for vertical moves
  if (direction === 'ArrowUp' || direction === 'ArrowDown') {
    grid = grid[0].map((_, i) => grid.map(row => row[i]));
  }
  
  // Check if grid changed
  moved = oldGrid !== JSON.stringify(grid);
  return moved;
}

// === Arrow Key Handling ===
document.addEventListener("keydown", (e) => {
  if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) {
    e.preventDefault();
    const moved = moveTiles(e.key);
    
    if (moved) {
      spawnRandomTile();
      renderGrid();
      updateScore();
      
      // Check win condition (2048)
      if (!gameWon && grid.some(row => row.includes(2048))) {
        gameWon = true;
        messageText.textContent = "You Win! Click 'New Game' to play again.";
        messageBox.style.display = "flex";
      }
      
      // Check game over
      if (isGameOver()) {
        messageText.textContent = "Game Over! Click 'New Game' to play again.";
        messageBox.style.display = "flex";
      }
    }
  }
});

// === Game Over Check ===
function isGameOver() {
  if (getEmptyCells().length > 0) return false;

  // Check for possible merges
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const current = grid[r][c];
      if ((r < GRID_SIZE-1 && grid[r+1][c] === current) ||
          (c < GRID_SIZE-1 && grid[r][c+1] === current)) {
        return false;
      }
    }
  }
  return true; // No empty cells and no possible merges
}

 // === Theme Toggle ===
function updateThemeButton() {
  const isDark = document.body.classList.contains('dark-theme');
  toggleBtn.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  updateThemeButton();
});

// Initialize theme button
updateThemeButton();