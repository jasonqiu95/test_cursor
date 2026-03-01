/**
 * Test Utilities Index
 * Central export point for all test utilities
 */

// Import utilities
const gameStateFactory = typeof require !== 'undefined'
  ? require('./game-state-factory.js')
  : window.GameStateFactory || {};

const timeHelpers = typeof require !== 'undefined'
  ? require('./time-helpers.js')
  : window.TimeHelpers || {};

// Re-export everything
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ...gameStateFactory,
    ...timeHelpers
  };
}

// For browser environments
if (typeof window !== 'undefined') {
  window.TestUtils = {
    ...gameStateFactory,
    ...timeHelpers
  };
}
