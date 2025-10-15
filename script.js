// Game State
let board = [];
let score = 0;
let bestScore = 0;

// DOM Elements
const gridContainer = document.getElementById('grid-container');
const scoreElement = document.getElementById('score');
const bestScoreElement = document.getElementById('best-score');
const newGameBtn = document.getElementById('new-game-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const gameMessage = document.getElementById('game-message');
const messageText = document.getElementById('message-text');
const restartBtn = document.getElementById('restart-btn');

// Initialize Game
function init() {
    // Load best score from localStorage
    loadBestScore();
    
    // Load theme preference
    loadTheme();
    
    // Create grid cells
    createGrid();
    
    // Start new game
    newGame();
    
    // Event listeners
    newGameBtn.addEventListener('click', newGame);
    restartBtn.addEventListener('click', () => {
        hideMessage();
        newGame();
    });
    themeToggleBtn.addEventListener('click', toggleTheme);
    document.addEventListener('keydown', handleKeyPress);
}

// Load best score from localStorage
function loadBestScore() {
    const savedBestScore = localStorage.getItem('2048-best-score');
    if (savedBestScore) {
        bestScore = parseInt(savedBestScore, 10);
        bestScoreElement.textContent = bestScore;
    }
}

// Save best score to localStorage
function saveBestScore() {
    localStorage.setItem('2048-best-score', bestScore.toString());
}

// Update best score if current score is higher
function updateBestScore() {
    if (score > bestScore) {
        bestScore = score;
        bestScoreElement.textContent = bestScore;
        saveBestScore();
    }
}

// Load theme preference
function loadTheme() {
    const savedTheme = localStorage.getItem('2048-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggleBtn.textContent = '☀️ Light Mode';
    }
}

// Toggle theme
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    themeToggleBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
    localStorage.setItem('2048-theme', isDark ? 'dark' : 'light');
}

// Create grid cells
function createGrid() {
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.classList.add('grid-cell');
        gridContainer.appendChild(cell);
    }
}

// Start new game
function newGame() {
    // Reset board
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    
    // Reset score
    score = 0;
    updateScore();
    
    // Add two initial tiles
    addRandomTile();
    addRandomTile();
    
    // Update display
    updateBoard();
}

// Add random tile (2 or 4)
function addRandomTile() {
    const emptyCells = [];
    
    // Find all empty cells
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 0) {
                emptyCells.push({ row, col });
            }
        }
    }
    
    // If no empty cells, return
    if (emptyCells.length === 0) return;
    
    // Pick random empty cell
    const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    
    // Add tile (90% chance of 2, 10% chance of 4)
    board[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
}

// Update score display
function updateScore() {
    scoreElement.textContent = score;
    updateBestScore();
}

// Update board display
function updateBoard() {
    // Remove existing tiles
    const existingTiles = gridContainer.querySelectorAll('.tile');
    existingTiles.forEach(tile => tile.remove());
    
    // Get cell size
    const gridCells = gridContainer.querySelectorAll('.grid-cell');
    if (gridCells.length === 0) return;
    
    const cellSize = gridCells[0].offsetWidth;
    const gap = 15;
    
    // Create tiles
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const value = board[row][col];
            if (value !== 0) {
                const tile = document.createElement('div');
                tile.classList.add('tile', `tile-${value}`);
                tile.textContent = value;
                
                // Position tile
                const top = row * (cellSize + gap);
                const left = col * (cellSize + gap);
                tile.style.top = `${top}px`;
                tile.style.left = `${left}px`;
                tile.style.width = `${cellSize}px`;
                tile.style.height = `${cellSize}px`;
                
                gridContainer.appendChild(tile);
            }
        }
    }
}

// Handle keyboard input
function handleKeyPress(event) {
    // Prevent default arrow key behavior
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
    }
    
    let moved = false;
    const previousBoard = JSON.stringify(board);
    
    switch (event.key) {
        case 'ArrowUp':
            moved = moveUp();
            break;
        case 'ArrowDown':
            moved = moveDown();
            break;
        case 'ArrowLeft':
            moved = moveLeft();
            break;
        case 'ArrowRight':
            moved = moveRight();
            break;
        default:
            return;
    }
    
    // Check if board changed
    if (moved && JSON.stringify(board) !== previousBoard) {
        addRandomTile();
        updateBoard();
        updateScore();
        
        // Check win/lose conditions
        if (hasWon()) {
            showMessage('You Win! 🎉');
        } else if (isGameOver()) {
            showMessage('Game Over! 😢');
        }
    }
}

// Move tiles up
function moveUp() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
        let merged = [false, false, false, false];
        for (let row = 1; row < 4; row++) {
            if (board[row][col] !== 0) {
                let currentRow = row;
                while (currentRow > 0) {
                    if (board[currentRow - 1][col] === 0) {
                        board[currentRow - 1][col] = board[currentRow][col];
                        board[currentRow][col] = 0;
                        currentRow--;
                        moved = true;
                    } else if (board[currentRow - 1][col] === board[currentRow][col] && !merged[currentRow - 1]) {
                        board[currentRow - 1][col] *= 2;
                        score += board[currentRow - 1][col];
                        board[currentRow][col] = 0;
                        merged[currentRow - 1] = true;
                        moved = true;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    return moved;
}

// Move tiles down
function moveDown() {
    let moved = false;
    for (let col = 0; col < 4; col++) {
        let merged = [false, false, false, false];
        for (let row = 2; row >= 0; row--) {
            if (board[row][col] !== 0) {
                let currentRow = row;
                while (currentRow < 3) {
                    if (board[currentRow + 1][col] === 0) {
                        board[currentRow + 1][col] = board[currentRow][col];
                        board[currentRow][col] = 0;
                        currentRow++;
                        moved = true;
                    } else if (board[currentRow + 1][col] === board[currentRow][col] && !merged[currentRow + 1]) {
                        board[currentRow + 1][col] *= 2;
                        score += board[currentRow + 1][col];
                        board[currentRow][col] = 0;
                        merged[currentRow + 1] = true;
                        moved = true;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    return moved;
}

// Move tiles left
function moveLeft() {
    let moved = false;
    for (let row = 0; row < 4; row++) {
        let merged = [false, false, false, false];
        for (let col = 1; col < 4; col++) {
            if (board[row][col] !== 0) {
                let currentCol = col;
                while (currentCol > 0) {
                    if (board[row][currentCol - 1] === 0) {
                        board[row][currentCol - 1] = board[row][currentCol];
                        board[row][currentCol] = 0;
                        currentCol--;
                        moved = true;
                    } else if (board[row][currentCol - 1] === board[row][currentCol] && !merged[currentCol - 1]) {
                        board[row][currentCol - 1] *= 2;
                        score += board[row][currentCol - 1];
                        board[row][currentCol] = 0;
                        merged[currentCol - 1] = true;
                        moved = true;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    return moved;
}

// Move tiles right
function moveRight() {
    let moved = false;
    for (let row = 0; row < 4; row++) {
        let merged = [false, false, false, false];
        for (let col = 2; col >= 0; col--) {
            if (board[row][col] !== 0) {
                let currentCol = col;
                while (currentCol < 3) {
                    if (board[row][currentCol + 1] === 0) {
                        board[row][currentCol + 1] = board[row][currentCol];
                        board[row][currentCol] = 0;
                        currentCol++;
                        moved = true;
                    } else if (board[row][currentCol + 1] === board[row][currentCol] && !merged[currentCol + 1]) {
                        board[row][currentCol + 1] *= 2;
                        score += board[row][currentCol + 1];
                        board[row][currentCol] = 0;
                        merged[currentCol + 1] = true;
                        moved = true;
                        break;
                    } else {
                        break;
                    }
                }
            }
        }
    }
    return moved;
}

// Check if player has won (reached 2048)
function hasWon() {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 2048) {
                return true;
            }
        }
    }
    return false;
}

// Check if game is over
function isGameOver() {
    // Check for empty cells
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            if (board[row][col] === 0) {
                return false;
            }
        }
    }
    
    // Check for possible merges
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const current = board[row][col];
            
            // Check right
            if (col < 3 && board[row][col + 1] === current) {
                return false;
            }
            
            // Check down
            if (row < 3 && board[row + 1][col] === current) {
                return false;
            }
        }
    }
    
    return true;
}

// Show game message
function showMessage(message) {
    messageText.textContent = message;
    gameMessage.classList.add('show');
}

// Hide game message
function hideMessage() {
    gameMessage.classList.remove('show');
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', init);
