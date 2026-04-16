// ============================================================
// Enhanced History Service
// In-memory store with full prediction results and timestamps
// ============================================================

const MAX_HISTORY = 50;
const history = [];

/**
 * Add an entry to history.
 * @param {Object} entry - { symptoms, behaviors, goal, result, time }
 */
export const addHistory = (entry) => {
  history.push({
    id: history.length + 1,
    ...entry,
    time: entry.time || new Date()
  });

  // Keep only the latest entries
  if (history.length > MAX_HISTORY) {
    history.shift();
  }
};

/**
 * Get the last N history entries (default 10).
 * @param {number} limit - Number of entries to return
 * @returns {Array}
 */
export const getHistory = (limit = 50) => {
  return history.slice(-limit);
};

/**
 * Get the most recent entry.
 * @returns {Object|null}
 */
export const getLatestEntry = () => {
  return history.length > 0 ? history[history.length - 1] : null;
};

/**
 * Clear all history (useful for testing).
 */
export const clearHistory = () => {
  history.length = 0;
};