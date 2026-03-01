/**
 * GameState Tests
 * Comprehensive tests for game state management including state transitions,
 * lives system, score management, combo system, wave tracking, and event system
 * Run with: node test/gamestate.test.js
 */

// Load the test runner
const TestRunner = typeof module !== 'undefined' && require
  ? require('../test-runner.js')
  : window.TestRunner;

const {
  describe,
  it,
  beforeEach,
  assertEqual,
  assertTrue,
  assertFalse,
  assertThrows,
  assertDeepEqual,
  run
} = TestRunner;

// Load GameState class
const { GameState, GameStates } = typeof module !== 'undefined' && require
  ? require('../gamestate.js')
  : window;

// ========================================
// Initialization Tests
// ========================================

describe('GameState Initialization', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  // TODO: Add initialization tests
});

// ========================================
// State Transition Tests
// ========================================

describe('State Transitions', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  // TODO: Add state transition tests
});

// ========================================
// Lives System Tests
// ========================================

describe('Lives System', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  // TODO: Add lives system tests
});

// ========================================
// Score Management Tests
// ========================================

describe('Score Management', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  // TODO: Add score management tests
});

// ========================================
// Combo System Tests
// ========================================

describe('Combo System', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  // TODO: Add combo system tests
});

// ========================================
// Wave Tracking Tests
// ========================================

describe('Wave Tracking', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  it('should initialize with wave 1', () => {
    assertEqual(gameState.getWave(), 1);
  });

  it('should return current wave with getWave()', () => {
    assertEqual(gameState.getWave(), 1);

    gameState.nextWave();
    assertEqual(gameState.getWave(), 2);

    gameState.nextWave();
    assertEqual(gameState.getWave(), 3);
  });

  it('should increment wave and return new value with nextWave()', () => {
    assertEqual(gameState.nextWave(), 2);
    assertEqual(gameState.nextWave(), 3);
    assertEqual(gameState.nextWave(), 4);
  });

  it('should emit waveChange event with previous and current values', () => {
    let eventData = null;

    gameState.on('waveChange', (data) => {
      eventData = data;
    });

    gameState.nextWave();

    assertDeepEqual(eventData, {
      previous: 1,
      current: 2
    });

    // Test second wave change
    gameState.nextWave();

    assertDeepEqual(eventData, {
      previous: 2,
      current: 3
    });
  });
});

// ========================================
// Event System Tests
// ========================================

describe('Event System', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  // TODO: Add event system tests
});

// ========================================
// Snapshot Tests
// ========================================

describe('Snapshot', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  // TODO: Add snapshot tests
});

// ========================================
// Reset Tests
// ========================================

describe('Reset', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  it('should reset all properties to initial values', () => {
    // Modify all properties
    gameState.startGame();
    gameState.addScore(1000);
    gameState.loseLife();
    gameState.increaseCombo();
    gameState.increaseCombo();
    gameState.increaseCombo();
    gameState.nextWave();
    gameState.nextWave();

    // Verify properties were changed
    assertEqual(gameState.getState(), GameStates.PLAYING);
    assertEqual(gameState.getScore(), 1000);
    assertEqual(gameState.getLives(), 2);
    assertEqual(gameState.getCombo(), 3);
    assertEqual(gameState.getWave(), 3);

    // Reset
    gameState.reset();

    // Verify all properties are back to initial values
    assertEqual(gameState.getState(), GameStates.START);
    assertEqual(gameState.getLives(), 3);
    assertEqual(gameState.getScore(), 0);
    assertEqual(gameState.getCombo(), 0);
    assertEqual(gameState.getWave(), 1);
  });

  it('should emit reset event with correct data', () => {
    let resetEmitted = false;
    let resetData = null;

    gameState.on('reset', (data) => {
      resetEmitted = true;
      resetData = data;
    });

    gameState.startGame();
    gameState.endGame();
    gameState.reset();

    assertTrue(resetEmitted);
    assertEqual(resetData.previousState, GameStates.GAME_OVER);
    assertEqual(resetData.lives, 3);
    assertEqual(resetData.score, 0);
    assertEqual(resetData.combo, 0);
    assertEqual(resetData.wave, 1);
  });

  it('should allow reset from any state', () => {
    // Reset from START
    gameState.reset();
    assertEqual(gameState.getState(), GameStates.START);

    // Reset from PLAYING
    gameState.startGame();
    gameState.reset();
    assertEqual(gameState.getState(), GameStates.START);

    // Reset from GAME_OVER
    gameState.startGame();
    gameState.endGame();
    gameState.reset();
    assertEqual(gameState.getState(), GameStates.START);

    // Reset from WIN
    gameState.startGame();
    gameState.winGame();
    gameState.reset();
    assertEqual(gameState.getState(), GameStates.START);
  });
});

// ========================================
// Integration Tests
// ========================================

describe('Integration Tests', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  it('should handle complete game lifecycle: START→PLAYING→GAME_OVER→reset→START', () => {
    const events = [];

    gameState.on('stateChange', (data) => events.push({ event: 'stateChange', data }));
    gameState.on('reset', (data) => events.push({ event: 'reset', data }));

    // START state
    assertEqual(gameState.getState(), GameStates.START);

    // START → PLAYING
    gameState.startGame();
    assertEqual(gameState.getState(), GameStates.PLAYING);
    assertEqual(events[0].event, 'stateChange');
    assertEqual(events[0].data.from, GameStates.START);
    assertEqual(events[0].data.to, GameStates.PLAYING);

    // PLAYING → GAME_OVER
    gameState.endGame();
    assertEqual(gameState.getState(), GameStates.GAME_OVER);
    assertEqual(events[1].event, 'stateChange');
    assertEqual(events[1].data.from, GameStates.PLAYING);
    assertEqual(events[1].data.to, GameStates.GAME_OVER);

    // Reset back to START
    gameState.reset();
    assertEqual(gameState.getState(), GameStates.START);
    assertEqual(events[2].event, 'reset');
    assertEqual(events[2].data.previousState, GameStates.GAME_OVER);

    // Verify can start a new game after reset
    gameState.startGame();
    assertEqual(gameState.getState(), GameStates.PLAYING);
  });

  it('should handle complete WIN lifecycle: START→PLAYING→WIN→reset→START', () => {
    assertEqual(gameState.getState(), GameStates.START);

    gameState.startGame();
    assertEqual(gameState.getState(), GameStates.PLAYING);

    gameState.winGame();
    assertEqual(gameState.getState(), GameStates.WIN);

    gameState.reset();
    assertEqual(gameState.getState(), GameStates.START);
    assertEqual(gameState.getLives(), 3);
    assertEqual(gameState.getScore(), 0);
  });

  it('should maintain state consistency across multiple transitions', () => {
    // Play game 1
    gameState.startGame();
    gameState.addScore(500);
    gameState.increaseCombo();
    gameState.loseLife();
    assertEqual(gameState.getLives(), 2);
    assertEqual(gameState.getScore(), 500);
    assertEqual(gameState.getCombo(), 1);

    // End and reset
    gameState.endGame();
    gameState.reset();
    assertEqual(gameState.getLives(), 3);
    assertEqual(gameState.getScore(), 0);
    assertEqual(gameState.getCombo(), 0);

    // Play game 2
    gameState.startGame();
    gameState.addScore(1000);
    gameState.increaseCombo();
    gameState.increaseCombo();
    assertEqual(gameState.getLives(), 3);
    assertEqual(gameState.getScore(), 1000);
    assertEqual(gameState.getCombo(), 2);

    // Win and reset
    gameState.winGame();
    gameState.reset();
    assertEqual(gameState.getLives(), 3);
    assertEqual(gameState.getScore(), 0);
    assertEqual(gameState.getCombo(), 0);
    assertEqual(gameState.getWave(), 1);

    // Play game 3
    gameState.startGame();
    assertEqual(gameState.getState(), GameStates.PLAYING);
    assertEqual(gameState.getLives(), 3);
  });

  it('should handle combined operations: lose life + score change + combo', () => {
    const events = [];
    gameState.on('lifeChange', (data) => events.push({ event: 'lifeChange', data }));
    gameState.on('scoreChange', (data) => events.push({ event: 'scoreChange', data }));
    gameState.on('comboChange', (data) => events.push({ event: 'comboChange', data }));

    gameState.startGame();

    // Combo up and add score
    gameState.increaseCombo();
    gameState.addScore(100);
    assertEqual(gameState.getCombo(), 1);
    assertEqual(gameState.getScore(), 100);

    // Continue combo and add more score
    gameState.increaseCombo();
    gameState.addScore(100);
    assertEqual(gameState.getCombo(), 2);
    assertEqual(gameState.getScore(), 200);

    // Lose life (should reset combo)
    gameState.loseLife();
    assertEqual(gameState.getLives(), 2);
    assertEqual(gameState.getScore(), 200);

    // Verify all events were emitted
    const comboEvents = events.filter(e => e.event === 'comboChange');
    const scoreEvents = events.filter(e => e.event === 'scoreChange');
    const lifeEvents = events.filter(e => e.event === 'lifeChange');

    assertEqual(comboEvents.length, 2);
    assertEqual(scoreEvents.length, 2);
    assertEqual(lifeEvents.length, 1);
  });

  it('should handle losing all lives triggers game over', () => {
    gameState.startGame();
    assertEqual(gameState.getState(), GameStates.PLAYING);

    // Lose 2 lives
    gameState.loseLife();
    gameState.loseLife();
    assertEqual(gameState.getLives(), 1);
    assertEqual(gameState.getState(), GameStates.PLAYING);

    // Lose final life should trigger game over
    gameState.loseLife();
    assertEqual(gameState.getLives(), 0);
    assertEqual(gameState.getState(), GameStates.GAME_OVER);
  });

  it('should handle combo multiplier progression with score', () => {
    gameState.startGame();

    // Build combo to 5 for 2x multiplier
    for (let i = 0; i < 5; i++) {
      gameState.increaseCombo();
    }
    assertEqual(gameState.getCombo(), 5);
    assertEqual(gameState.getMultiplier(), 2);

    // Add score
    gameState.addScore(100);
    assertEqual(gameState.getScore(), 100);

    // Build combo to 10 for 3x multiplier
    for (let i = 0; i < 5; i++) {
      gameState.increaseCombo();
    }
    assertEqual(gameState.getCombo(), 10);
    assertEqual(gameState.getMultiplier(), 3);

    // Reset combo
    gameState.resetCombo();
    assertEqual(gameState.getCombo(), 0);
    assertEqual(gameState.getMultiplier(), 1);
    assertEqual(gameState.getScore(), 100); // Score unchanged
  });

  it('should handle wave progression with state changes', () => {
    gameState.startGame();
    assertEqual(gameState.getWave(), 1);

    gameState.nextWave();
    assertEqual(gameState.getWave(), 2);

    gameState.nextWave();
    assertEqual(gameState.getWave(), 3);

    // Reset should reset wave
    gameState.reset();
    assertEqual(gameState.getWave(), 1);

    // Can continue wave progression after reset
    gameState.startGame();
    gameState.nextWave();
    assertEqual(gameState.getWave(), 2);
  });

  it('should handle multiple resets in succession', () => {
    gameState.startGame();
    gameState.addScore(500);

    gameState.reset();
    assertEqual(gameState.getScore(), 0);
    assertEqual(gameState.getState(), GameStates.START);

    gameState.reset();
    assertEqual(gameState.getScore(), 0);
    assertEqual(gameState.getState(), GameStates.START);

    gameState.reset();
    assertEqual(gameState.getScore(), 0);
    assertEqual(gameState.getState(), GameStates.START);
  });
});

// Run all tests if this file is executed directly
if (typeof module !== 'undefined' && require.main === module) {
  run().then(success => {
    process.exit(success ? 0 : 1);
  });
}
