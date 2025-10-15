"use strict";
// 2048 script stub. Implement game logic per README.

(() => {
  // Score tracking with localStorage persistence for best score
  const BEST_SCORE_KEY = "bestScore";

  // Get DOM elements if present
  const currentScoreEl = document.getElementById("current-score");
  const bestScoreEl = document.getElementById("best-score");

  // Internal state
  let currentScore = 0;
  let bestScore = 0;

  // Initialize best score from localStorage
  try {
    const saved = localStorage.getItem(BEST_SCORE_KEY);
    if (saved !== null) {
      const parsed = Number(saved);
      bestScore = Number.isFinite(parsed) ? parsed : 0;
    }
  } catch (_) {
    // Ignore storage errors (private mode, blocked, etc.)
    bestScore = 0;
  }

  // Reflect initial values in UI
  if (currentScoreEl) currentScoreEl.textContent = String(currentScore);
  if (bestScoreEl) bestScoreEl.textContent = String(bestScore);

  // Public-ish function to be called by game logic when score changes
  // This function ONLY updates score state and UI; it doesn't implement game rules
  function updateScore(newScore) {
    if (!Number.isFinite(newScore) || newScore < 0) return;
    currentScore = newScore;
    if (currentScoreEl) currentScoreEl.textContent = String(currentScore);

    if (currentScore > bestScore) {
      bestScore = currentScore;
      if (bestScoreEl) bestScoreEl.textContent = String(bestScore);
      try {
        localStorage.setItem(BEST_SCORE_KEY, String(bestScore));
      } catch (_) {
        // Silently ignore persistence issues
      }
    }
  }

  // Expose updateScore for future game logic (without polluting global too much)
  // Minimal exposure: attach to window under a scoped namespace
  window.game2048 = Object.assign(window.game2048 || {}, { updateScore });
})();
