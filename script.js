// === Constants & DOM Elements ===
let GRID_SIZE = 4; // Make it let so we can change it
let grid = [];
let score = 0;
let bestScore = 0;
let gameWon = false;
let gridCells = []; // Will be initialized in initializeGrid

// Initialize DOM elements
const newGameBtn = document.getElementById("new-game");
const tryAgainBtn = document.getElementById("retry");
const continueBtn = document.getElementById("continue");
const messageBox = document.getElementById("message");
const messageText = messageBox ? messageBox.querySelector("p") : null;
const scoreElement = document.getElementById("score");
const bestScoreElement = document.getElementById("best-score");
const toggleBtn = document.getElementById('theme-toggle');

// Debug logging
console.log('DOM Elements initialized:', {
  newGameBtn: !!newGameBtn,
  tryAgainBtn: !!tryAgainBtn,
  continueBtn: !!continueBtn,
  messageBox: !!messageBox,
  scoreElement: !!scoreElement,
  bestScoreElement: !!bestScoreElement,
  toggleBtn: !!toggleBtn
});

// === Initialize Game ===
document.addEventListener("DOMContentLoaded", () => {
  console.log('DOM fully loaded, initializing game...');
  
  // Initialize with default grid size (4x4)
  initializeGrid(4);
  
  // Set up grid size buttons
  const sizeButtons = document.querySelectorAll('.grid-size-btn');
  console.log(`Found ${sizeButtons.length} grid size buttons`);
  
  sizeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const size = parseInt(btn.dataset.size);
      console.log('Grid size button clicked:', size);
      handleGridSizeChange(size);
    });
    
    // Log button info for debugging
    console.log(`Button ${btn.textContent} has size: ${btn.dataset.size}`);
  });
  
  // Start the game
  startNewGame();
  
  // Focus the game container for keyboard events
  const gameContainer = document.querySelector('.game-container');
  if (gameContainer) {
    gameContainer.tabIndex = 0;
    gameContainer.focus();
  }
  
  console.log('Game initialization complete');
});

newGameBtn.addEventListener("click", startNewGame);
tryAgainBtn.addEventListener("click", () => startNewGame());
continueBtn.addEventListener("click", () => {
  messageBox.style.display = "none"; // Hide win message
});

// === Grid Management ===
function initializeGrid(size) {
  const gridContainer = document.querySelector('.grid');
  if (!gridContainer) {
    console.error('Grid container not found!');
    return;
  }
  
  // Clear existing grid
  gridContainer.innerHTML = '';
  
  // Set new grid dimensions
  gridContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  gridContainer.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  
  // Create grid cells
  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement('div');
    cell.className = 'grid-cell';
    cell.textContent = '';
    gridContainer.appendChild(cell);
  }
  
  // Update grid cells reference
  gridCells = Array.from(document.querySelectorAll(".grid-cell"));
  GRID_SIZE = size;
  
  // Update active button state
  const buttons = document.querySelectorAll('.grid-size-btn');
  if (buttons.length > 0) {
    buttons.forEach(btn => {
      const isActive = parseInt(btn.dataset.size) === size;
      btn.classList.toggle('active', isActive);
      console.log(`Button ${btn.textContent} active: ${isActive}`);
    });
  } else {
    console.error('Grid size buttons not found!');
  }
  
  console.log(`Grid initialized to ${size}x${size} with ${gridCells.length} cells`);
}

// === Start / Reset Game ===
function startNewGame() {
  console.log('Starting new game with grid size:', GRID_SIZE);
  
  // Initialize grid with zeros
  grid = Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0));
  score = 0;
  gameWon = false;
  
  // Update UI
  updateScore();
  if (messageBox) messageBox.style.display = "none";
  
  // Initialize grid cells if not already done
  if (gridCells.length !== GRID_SIZE * GRID_SIZE) {
    initializeGrid(GRID_SIZE);
  }
  
  // Clear any existing tiles and spawn new ones
  clearTiles();
  spawnRandomTile();
  spawnRandomTile();
  
  renderGrid();
  console.log('New game started');
}

function clearTiles() {
  const tiles = document.querySelectorAll('.tile');
  tiles.forEach(tile => tile.remove());
}

// Handle grid size change
function handleGridSizeChange(size) {
  console.log('Changing grid size to:', size);
  if (size < 3 || size > 5) {
    console.error('Invalid grid size:', size);
    return;
  }
  
  // Only reinitialize if size actually changed
  if (size !== GRID_SIZE) {
    initializeGrid(size);
    startNewGame();
  }
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

 // === Theme toggle ===
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');

});