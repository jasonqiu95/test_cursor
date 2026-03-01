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

  // TODO: Add wave tracking tests
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

  it('should return an object with state, lives, score, and wave properties', () => {
    const snapshot = gameState.getSnapshot();

    assertTrue(typeof snapshot === 'object', 'Snapshot should be an object');
    assertTrue('state' in snapshot, 'Snapshot should have state property');
    assertTrue('lives' in snapshot, 'Snapshot should have lives property');
    assertTrue('score' in snapshot, 'Snapshot should have score property');
    assertTrue('wave' in snapshot, 'Snapshot should have wave property');
  });

  it('should return snapshot values that match current state', () => {
    const snapshot = gameState.getSnapshot();

    assertEqual(snapshot.state, gameState.getState(), 'Snapshot state should match current state');
    assertEqual(snapshot.lives, gameState.getLives(), 'Snapshot lives should match current lives');
    assertEqual(snapshot.score, gameState.getScore(), 'Snapshot score should match current score');
    assertEqual(snapshot.wave, gameState.getWave(), 'Snapshot wave should match current wave');
  });

  it('should return snapshot that is independent of internal state', () => {
    const snapshot = gameState.getSnapshot();

    // Modify the snapshot
    snapshot.lives = 99;
    snapshot.score = 9999;
    snapshot.wave = 100;
    snapshot.state = 'INVALID';

    // Verify internal state is unchanged
    assertEqual(gameState.getLives(), 3, 'Lives should not be affected by snapshot modification');
    assertEqual(gameState.getScore(), 0, 'Score should not be affected by snapshot modification');
    assertEqual(gameState.getWave(), 1, 'Wave should not be affected by snapshot modification');
    assertEqual(gameState.getState(), GameStates.START, 'State should not be affected by snapshot modification');
  });

  it('should reflect correct values after state changes', () => {
    gameState.setState(GameStates.PLAYING);
    let snapshot = gameState.getSnapshot();
    assertEqual(snapshot.state, GameStates.PLAYING, 'Snapshot should reflect state change to PLAYING');

    gameState.addScore(100);
    snapshot = gameState.getSnapshot();
    assertEqual(snapshot.score, 100, 'Snapshot should reflect score increase');

    gameState.loseLife();
    snapshot = gameState.getSnapshot();
    assertEqual(snapshot.lives, 2, 'Snapshot should reflect life loss');

    gameState.nextWave();
    snapshot = gameState.getSnapshot();
    assertEqual(snapshot.wave, 2, 'Snapshot should reflect wave increment');
  });

  it('should reflect correct values after multiple state modifications', () => {
    // Make multiple changes
    gameState.setState(GameStates.PLAYING);
    gameState.setScore(500);
    gameState.setLives(5);
    gameState.nextWave();
    gameState.nextWave();

    const snapshot = gameState.getSnapshot();

    assertEqual(snapshot.state, GameStates.PLAYING, 'Snapshot should reflect PLAYING state');
    assertEqual(snapshot.score, 500, 'Snapshot should reflect score of 500');
    assertEqual(snapshot.lives, 5, 'Snapshot should reflect 5 lives');
    assertEqual(snapshot.wave, 3, 'Snapshot should reflect wave 3');
  });

  it('should reflect correct values after reset', () => {
    // Make changes
    gameState.setState(GameStates.PLAYING);
    gameState.addScore(1000);
    gameState.loseLife();
    gameState.nextWave();

    // Reset and take snapshot
    gameState.reset();
    const snapshot = gameState.getSnapshot();

    assertEqual(snapshot.state, GameStates.START, 'Snapshot should show START state after reset');
    assertEqual(snapshot.lives, 3, 'Snapshot should show 3 lives after reset');
    assertEqual(snapshot.score, 0, 'Snapshot should show 0 score after reset');
    assertEqual(snapshot.wave, 1, 'Snapshot should show wave 1 after reset');
  });

  it('should create independent snapshots on multiple calls', () => {
    const snapshot1 = gameState.getSnapshot();

    gameState.addScore(100);
    const snapshot2 = gameState.getSnapshot();

    // First snapshot should still have original values
    assertEqual(snapshot1.score, 0, 'First snapshot should remain unchanged');
    // Second snapshot should have updated values
    assertEqual(snapshot2.score, 100, 'Second snapshot should reflect new score');
  });
});

// Run all tests if this file is executed directly
if (typeof module !== 'undefined' && require.main === module) {
  run().then(success => {
    process.exit(success ? 0 : 1);
  });
}
