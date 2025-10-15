(function () {
  'use strict';

  // Storage helpers with safety guards
  const storage = {
    get(key, fallback = '0') {
      try {
        const v = localStorage.getItem(key);
        return v === null ? fallback : v;
      } catch (_) {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, String(value));
      } catch (_) {
        // ignore storage errors (e.g., quota or privacy mode)
      }
    }
  };

  // Parse integer safely
  function toInt(val, fallback = 0) {
    const n = parseInt(String(val).replace(/[^0-9-]/g, ''), 10);
    return Number.isFinite(n) ? n : fallback;
  }

  // DOM refs
  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best-score');
  const newGameBtn = document.getElementById('new-game');

  if (!scoreEl || !bestEl) {
    // If markup isn't present, do nothing.
    return;
  }

  const BEST_KEY = '2048:bestScore';

  // Initialize UI from storage
  let bestScore = toInt(storage.get(BEST_KEY, '0'), 0);
  bestEl.textContent = String(bestScore);

  // Keep a last known score to avoid redundant writes
  let lastScore = toInt(scoreEl.textContent, 0);

  function updateBestIfNeeded(current) {
    if (current > bestScore) {
      bestScore = current;
      bestEl.textContent = String(bestScore);
      storage.set(BEST_KEY, bestScore);
    }
  }

  // Observe score changes anywhere in the app (robust even if other code mutates DOM directly)
  const observer = new MutationObserver(() => {
    const current = toInt(scoreEl.textContent, 0);
    if (current !== lastScore) {
      lastScore = current;
      updateBestIfNeeded(current);
    }
  });

  observer.observe(scoreEl, { childList: true, characterData: true, subtree: true });

  // Also capture explicit custom events if the game dispatches them
  // Consumers can do: window.dispatchEvent(new CustomEvent('score:set', { detail: { value: 128 } }))
  window.addEventListener('score:set', (e) => {
    const value = toInt(e?.detail?.value, 0);
    scoreEl.textContent = String(value);
  });

  // Consumers can do: window.dispatchEvent(new CustomEvent('score:add', { detail: { delta: 4 } }))
  window.addEventListener('score:add', (e) => {
    const delta = toInt(e?.detail?.delta, 0);
    const next = toInt(scoreEl.textContent, 0) + delta;
    scoreEl.textContent = String(next);
  });

  // Expose a tiny API for convenience (optional)
  window.ScoreTracker = {
    get score() { return toInt(scoreEl.textContent, 0); },
    set score(v) { scoreEl.textContent = String(toInt(v, 0)); },
    get best() { return bestScore; },
    resetScore() { scoreEl.textContent = '0'; },
    resetBest() { bestScore = 0; bestEl.textContent = '0'; storage.set(BEST_KEY, 0); },
  };

  // New game typically resets current score but preserves best
  if (newGameBtn) {
    newGameBtn.addEventListener('click', () => {
      // Ensure best is up-to-date before reset
      updateBestIfNeeded(toInt(scoreEl.textContent, 0));
      scoreEl.textContent = '0';
    });
  }

  // If best score changes in another tab, sync it here
  window.addEventListener('storage', (e) => {
    if (e.key === BEST_KEY) {
      bestScore = toInt(e.newValue, 0);
      bestEl.textContent = String(bestScore);
    }
  });
})();
