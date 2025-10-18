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

// Instructions Modal Elements
const howToPlayBtn = document.getElementById("how-to-play");
const instructionsModal = document.getElementById("instructions-modal");
const closeInstructionsBtn = document.getElementById("close-instructions");

let grid = [];
let score = 0;
let bestScore = 0;
let gameWon = false;

// === Initialize Game ===
document.addEventListener("DOMContentLoaded", () => {
  startNewGame();
  
  // Show instructions modal on first visit
  if (!localStorage.getItem("2048_instructions_shown")) {
    instructionsModal.style.display = "flex";
    localStorage.setItem("2048_instructions_shown", "true");
  }
});

newGameBtn.addEventListener("click", startNewGame);
tryAgainBtn.addEventListener("click", () => startNewGame());
continueBtn.addEventListener("click", () => {
  messageBox.style.display = "none"; // Hide win message
});

// Instructions Modal Event Listeners
howToPlayBtn.addEventListener("click", () => {
  instructionsModal.style.display = "flex";
});

closeInstructionsBtn.addEventListener("click", () => {
  instructionsModal.style.display = "none";
});

// Close modal when clicking outside
instructionsModal.addEventListener("click", (e) => {
  if (e.target === instructionsModal) {
    instructionsModal.style.display = "none";
  }
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

// === Arrow Key Handling (simplified placeholder) ===
document.addEventListener("keydown", (e) => {
  if (!["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) return;

  // FUTURE: Add move + merge logic here
  // For now, just spawn a random tile after key press
  const moved = spawnRandomTile();
  if (moved) renderGrid();

  // Check win condition (2048)
  if (!gameWon && grid.some(row => row.includes(2048))) {
    gameWon = true;
    messageText.textContent = "You Win!";
    messageBox.style.display = "flex";
  }

  // Check game over
  if (isGameOver()) {
    messageText.textContent = "Game Over!";
    messageBox.style.display = "flex";
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
