# 🎮 2048 Game

**Organized by CP Squad in association with HacktoberFest**

Welcome to the 2048 Game project! This is a beginner-friendly open source contribution opportunity where you'll build the classic 2048 puzzle game using vanilla HTML, CSS, and JavaScript.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features to Implement](#features-to-implement)
- [Technical Requirements](#technical-requirements)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Implementation Guidelines](#implementation-guidelines)
- [Contribution Workflow](#contribution-workflow)
- [Code Standards](#code-standards)
- [Submission Checklist](#submission-checklist)
- [Resources](#resources)
- [Support](#support)

---

## 🎯 Project Overview

Build a fully functional 2048 game with a clean, modern interface that supports both light and dark themes. The game should be responsive, accessible, and provide a smooth user experience.

**Difficulty Level:** Beginner to Intermediate

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript (No frameworks or libraries)

---

## ✨ Features to Implement

### Core Gameplay
- 4x4 game grid
- Tile generation (2 or 4) at random empty positions
- Arrow key controls (Up, Down, Left, Right)
- Tile merging logic (same numbers combine)
- Score tracking and display
- Win condition (reaching 2048 tile)
- Game over detection (no valid moves remaining)
- "New Game" button to restart
- Smooth tile animations for movements and merges

### Theme System
- Light theme (default)
- Dark theme
- Theme toggle button
- Persistent theme preference (saved in browser)
- Smooth theme transition animations

### Additional Features (Optional Enhancements)
- Best score tracking (high score)
- "Continue" option after winning
- Undo last move functionality
- Mobile touch/swipe support
- Sound effects (mute/unmute option)
- Different board sizes (3x3, 5x5)

---

## 🛠 Technical Requirements

### Mandatory
- **Pure HTML, CSS, JavaScript only** - No frameworks, libraries, or external dependencies
- **Single page application** - All code in one HTML file or separate files (index.html, style.css, script.js)
- **Responsive design** - Must work on desktop, tablet, and mobile devices
- **Cross-browser compatibility** - Test on Chrome, Firefox, Safari, and Edge
- **No external APIs or CDNs** - All code must be self-contained

### File Structure
```
2048-game/
│
├── index.html          # Main HTML file
├── style.css           # Stylesheet with light/dark themes
├── script.js           # Game logic and functionality
└── README.md          # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Basic knowledge of HTML, CSS, and JavaScript
- A code editor (VS Code, Sublime Text, etc.)
- Git installed on your machine
- A GitHub account

### Setup Instructions

1. **Fork the Repository**
   ```bash
   # Click the 'Fork' button on the repository page
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
   cd REPO_NAME/2048-game
   ```

3. **Create a New Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # Example: git checkout -b feature/dark-theme
   ```

4. **Start Coding!**
   - Open `index.html` in your browser
   - Make changes and refresh to see updates

---

## 📁 Project Structure

### index.html
- Semantic HTML5 structure
- Game container with grid cells
- Score display area
- Control buttons (New Game, Theme Toggle)
- Meta tags for responsiveness

### style.css
- CSS Grid or Flexbox for layout
- CSS custom properties (variables) for theming
- Smooth animations using CSS transitions
- Media queries for responsiveness
- Light theme styles (default)
- Dark theme styles (with `.dark-theme` class)

### script.js
- Game state management
- Grid initialization
- Tile movement logic
- Merge calculation
- Score tracking
- Event listeners (keyboard, buttons)
- Theme toggle functionality
- Local storage for persistence

---

## 💡 Implementation Guidelines

### Game Logic

**Grid Representation**
```javascript
// Use a 2D array to represent the grid
let grid = [
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0]
];
```

**Movement Algorithm**
1. Filter out zeros from the row/column
2. Merge adjacent equal values
3. Fill remaining positions with zeros
4. Update the grid and UI

**Win/Loss Conditions**
- Win: Any tile reaches 2048
- Loss: No empty cells AND no adjacent tiles with same value

### Theme Implementation

**CSS Variables Approach**
```css
:root {
  --bg-color: #faf8ef;
  --text-color: #776e65;
  --grid-bg: #bbada0;
  /* ... more variables */
}

.dark-theme {
  --bg-color: #1a1a1a;
  --text-color: #f0f0f0;
  --grid-bg: #2c2c2c;
  /* ... dark theme overrides */
}
```

**Theme Toggle**
- Use JavaScript to add/remove `dark-theme` class from body
- Save preference in `localStorage`
- Apply saved theme on page load

### Animations
- Tile appearance: scale or fade-in effect
- Tile movement: smooth position transitions
- Tile merge: pop or pulse animation
- Use CSS `transition` and `@keyframes`

---

## 🔄 Contribution Workflow

### Step-by-Step Process

1. **Choose a Feature**
   - Check the [Issues](link-to-issues) tab for open tasks
   - Comment on an issue to claim it
   - Wait for assignment before starting work

2. **Write Code**
   - Follow the code standards below
   - Test thoroughly in multiple browsers
   - Ensure responsive design works

3. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add: dark theme implementation"
   ```

4. **Push to Your Fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template with details
   - Link the related issue (e.g., "Closes #5")

6. **Address Review Comments**
   - Respond to feedback
   - Make requested changes
   - Push updates to the same branch

---

## 📏 Code Standards

### HTML
- Use semantic tags (`<header>`, `<main>`, `<section>`)
- Include proper ARIA labels for accessibility
- Validate using [W3C Validator](https://validator.w3.org/)

### CSS
- Use meaningful class names (BEM methodology preferred)
- Group related properties together
- Add comments for complex sections
- Maintain consistent indentation (2 spaces)
- Avoid `!important` unless absolutely necessary

### JavaScript
- Use `const` and `let` instead of `var`
- Write descriptive variable and function names
- Add comments for complex logic
- Use ES6+ features (arrow functions, template literals)
- Handle errors gracefully
- No `console.log()` in final submission (or use conditionally)

### Example Naming Conventions
```javascript
// Variables: camelCase
let currentScore = 0;

// Functions: camelCase with verb
function initializeGame() { }

// Constants: UPPER_SNAKE_CASE
const GRID_SIZE = 4;

// Classes: PascalCase
class GameManager { }
```

---

## ✅ Submission Checklist

Before submitting your PR, ensure:

- Code runs without errors in console
- Game logic works correctly (test all movements)
- Both themes work properly
- Theme preference persists on reload
- Responsive on mobile, tablet, and desktop
- Tested on at least 2 different browsers
- Code is well-commented
- No unused code or files
- Follows the code standards
- Git history is clean (meaningful commit messages)

---

## 📚 Resources

### Game Mechanics
- [Original 2048 Game](https://play2048.co/) - Play to understand the mechanics
- [2048 Game Rules](https://en.wikipedia.org/wiki/2048_(video_game)) - Wikipedia explanation

### Technical Documentation
- [MDN Web Docs - JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [MDN Web Docs - CSS Grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
- [MDN Web Docs - LocalStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

### Design Inspiration
- [Color Palettes](https://coolors.co/)
- [CSS Animations](https://animate.style/)
- [Dark Mode Best Practices](https://web.dev/prefers-color-scheme/)

### Tools
- [Can I Use](https://caniuse.com/) - Browser compatibility checker
- [CSS Validator](https://jigsaw.w3.org/css-validator/)
- [JSHint](https://jshint.com/) - JavaScript code quality tool

---

## 🆘 Support

### Need Help?

- **Stuck on logic?** Reach out to other contributors
- **Found a bug?** Create an issue with steps to reproduce
- **Have questions?** Reach out to the maintainers:
  - Email: cpsquad@charusat.ac.in
  - Or contact Bhumi Shah (6352281640) or Priyanshi Gajiwala (70167 55944)

### Community Guidelines

- Be respectful and inclusive
- Help other contributors when possible
- Ask questions - there are no dumb questions!

---

## 🏆 Recognition

All contributors will be:
- Listed in the project README
- Mentioned in CP Squad's social media announcements

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](link-to-license) file for details.

---

## 🎉 Happy Coding!

We're excited to have you contribute to this project! Remember, every expert was once a beginner. Don't hesitate to ask questions and learn along the way.

**Organized with ❤️ by CP Squad**

---

*Last Updated: October 2025*
