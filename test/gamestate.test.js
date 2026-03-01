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

  it('should initialize score to 0', () => {
    assertEqual(gameState.getScore(), 0, 'Initial score should be 0');
  });

  it('should return current score with getScore()', () => {
    assertEqual(gameState.getScore(), 0, 'Should return initial score');
    gameState.score = 100; // Set directly for this test
    assertEqual(gameState.getScore(), 100, 'Should return updated score');
  });

  it('should add points with addScore()', () => {
    gameState.addScore(10);
    assertEqual(gameState.getScore(), 10, 'Should add 10 points');

    gameState.addScore(25);
    assertEqual(gameState.getScore(), 35, 'Should add 25 more points (total 35)');

    gameState.addScore(0);
    assertEqual(gameState.getScore(), 35, 'Should handle adding 0 points');
  });

  it('should set score directly with setScore()', () => {
    gameState.setScore(100);
    assertEqual(gameState.getScore(), 100, 'Should set score to 100');

    gameState.setScore(50);
    assertEqual(gameState.getScore(), 50, 'Should set score to 50');

    gameState.setScore(0);
    assertEqual(gameState.getScore(), 0, 'Should set score to 0');
  });

  it('should reject negative scores in addScore()', () => {
    assertThrows(
      () => gameState.addScore(-10),
      Error,
      'Should reject negative score'
    );
    assertEqual(gameState.getScore(), 0, 'Score should remain unchanged');
  });

  it('should reject negative scores in setScore()', () => {
    gameState.setScore(50);
    assertThrows(
      () => gameState.setScore(-10),
      Error,
      'Should reject negative score'
    );
    assertEqual(gameState.getScore(), 50, 'Score should remain unchanged');
  });

  it('should reject non-numeric scores in addScore()', () => {
    assertThrows(
      () => gameState.addScore('10'),
      Error,
      'Should reject string score'
    );
    assertThrows(
      () => gameState.addScore(null),
      Error,
      'Should reject null score'
    );
    assertThrows(
      () => gameState.addScore(undefined),
      Error,
      'Should reject undefined score'
    );
    assertEqual(gameState.getScore(), 0, 'Score should remain unchanged');
  });

  it('should reject non-numeric scores in setScore()', () => {
    assertThrows(
      () => gameState.setScore('100'),
      Error,
      'Should reject string score'
    );
    assertThrows(
      () => gameState.setScore(null),
      Error,
      'Should reject null score'
    );
    assertThrows(
      () => gameState.setScore(undefined),
      Error,
      'Should reject undefined score'
    );
    assertEqual(gameState.getScore(), 0, 'Score should remain unchanged');
  });

  it('should emit scoreChange event with correct delta when adding score', () => {
    let eventData = null;
    gameState.on('scoreChange', (data) => {
      eventData = data;
    });

    gameState.addScore(15);

    assertTrue(eventData !== null, 'Event should be emitted');
    assertEqual(eventData.previous, 0, 'Previous score should be 0');
    assertEqual(eventData.current, 15, 'Current score should be 15');
    assertEqual(eventData.delta, 15, 'Delta should be 15');
  });

  it('should emit scoreChange event with correct delta when setting score', () => {
    gameState.setScore(50);

    let eventData = null;
    gameState.on('scoreChange', (data) => {
      eventData = data;
    });

    gameState.setScore(100);

    assertTrue(eventData !== null, 'Event should be emitted');
    assertEqual(eventData.previous, 50, 'Previous score should be 50');
    assertEqual(eventData.current, 100, 'Current score should be 100');
    assertEqual(eventData.delta, 50, 'Delta should be 50');
  });

  it('should emit scoreChange event with negative delta when score decreases', () => {
    gameState.setScore(100);

    let eventData = null;
    gameState.on('scoreChange', (data) => {
      eventData = data;
    });

    gameState.setScore(75);

    assertTrue(eventData !== null, 'Event should be emitted');
    assertEqual(eventData.previous, 100, 'Previous score should be 100');
    assertEqual(eventData.current, 75, 'Current score should be 75');
    assertEqual(eventData.delta, -25, 'Delta should be -25');
  });

  it('should emit scoreChange event multiple times with correct deltas', () => {
    const events = [];
    gameState.on('scoreChange', (data) => {
      events.push(data);
    });

    gameState.addScore(10);
    gameState.addScore(20);
    gameState.setScore(50);

    assertEqual(events.length, 3, 'Should emit 3 events');

    assertEqual(events[0].delta, 10, 'First delta should be 10');
    assertEqual(events[0].previous, 0, 'First previous should be 0');
    assertEqual(events[0].current, 10, 'First current should be 10');

    assertEqual(events[1].delta, 20, 'Second delta should be 20');
    assertEqual(events[1].previous, 10, 'Second previous should be 10');
    assertEqual(events[1].current, 30, 'Second current should be 30');

    assertEqual(events[2].delta, 20, 'Third delta should be 20');
    assertEqual(events[2].previous, 30, 'Third previous should be 30');
    assertEqual(events[2].current, 50, 'Third current should be 50');
  });
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

  // TODO: Add snapshot tests
});

// Run all tests if this file is executed directly
if (typeof module !== 'undefined' && require.main === module) {
  run().then(success => {
    process.exit(success ? 0 : 1);
  });
}
