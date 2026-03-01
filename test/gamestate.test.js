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

  it('should start with 3 lives', () => {
    assertEqual(gameState.getLives(), 3);
  });

  it('should return current lives count with getLives()', () => {
    assertEqual(gameState.getLives(), 3);
    gameState.loseLife();
    assertEqual(gameState.getLives(), 2);
    gameState.addLife();
    assertEqual(gameState.getLives(), 3);
  });

  it('should decrement lives when loseLife() is called', () => {
    assertEqual(gameState.getLives(), 3);
    gameState.loseLife();
    assertEqual(gameState.getLives(), 2);
    gameState.loseLife();
    assertEqual(gameState.getLives(), 1);
  });

  it('should return true when loseLife() is called with lives remaining', () => {
    const result = gameState.loseLife();
    assertTrue(result);
    assertEqual(gameState.getLives(), 2);
  });

  it('should return false when loseLife() is called with 0 lives', () => {
    gameState.setLives(1);
    const result1 = gameState.loseLife();
    assertFalse(result1);
    assertEqual(gameState.getLives(), 0);

    const result2 = gameState.loseLife();
    assertFalse(result2);
    assertEqual(gameState.getLives(), 0);
  });

  it('should not decrement lives below 0', () => {
    gameState.setLives(0);
    gameState.loseLife();
    assertEqual(gameState.getLives(), 0);
    gameState.loseLife();
    assertEqual(gameState.getLives(), 0);
  });

  it('should increment lives when addLife() is called', () => {
    assertEqual(gameState.getLives(), 3);
    gameState.addLife();
    assertEqual(gameState.getLives(), 4);
    gameState.addLife();
    assertEqual(gameState.getLives(), 5);
  });

  it('should return new lives count after addLife()', () => {
    const result = gameState.addLife();
    assertEqual(result, 4);
    assertEqual(gameState.getLives(), 4);
  });

  it('should set lives directly with setLives()', () => {
    gameState.setLives(5);
    assertEqual(gameState.getLives(), 5);
    gameState.setLives(1);
    assertEqual(gameState.getLives(), 1);
    gameState.setLives(0);
    assertEqual(gameState.getLives(), 0);
  });

  it('should return new lives count after setLives()', () => {
    const result = gameState.setLives(7);
    assertEqual(result, 7);
  });

  it('should throw error when setLives() called with negative number', () => {
    assertThrows(() => {
      gameState.setLives(-1);
    });
  });

  it('should throw error when setLives() called with non-number', () => {
    assertThrows(() => {
      gameState.setLives('3');
    });
  });

  it('should automatically transition to GAME_OVER when lives reach 0 during PLAYING', () => {
    gameState.setState(GameStates.PLAYING);
    assertEqual(gameState.getState(), GameStates.PLAYING);

    gameState.loseLife();
    assertEqual(gameState.getState(), GameStates.PLAYING);
    assertEqual(gameState.getLives(), 2);

    gameState.loseLife();
    assertEqual(gameState.getState(), GameStates.PLAYING);
    assertEqual(gameState.getLives(), 1);

    gameState.loseLife();
    assertEqual(gameState.getLives(), 0);
    assertEqual(gameState.getState(), GameStates.GAME_OVER);
  });

  it('should automatically transition to GAME_OVER when setLives(0) during PLAYING', () => {
    gameState.setState(GameStates.PLAYING);
    assertEqual(gameState.getState(), GameStates.PLAYING);

    gameState.setLives(0);
    assertEqual(gameState.getLives(), 0);
    assertEqual(gameState.getState(), GameStates.GAME_OVER);
  });

  it('should not trigger GAME_OVER transition when not in PLAYING state', () => {
    assertEqual(gameState.getState(), GameStates.START);
    gameState.setLives(0);
    assertEqual(gameState.getLives(), 0);
    assertEqual(gameState.getState(), GameStates.START);
  });

  it('should emit lifeChange event when loseLife() is called', () => {
    let eventData = null;
    gameState.on('lifeChange', (data) => {
      eventData = data;
    });

    gameState.loseLife();

    assertTrue(eventData !== null);
    assertEqual(eventData.previous, 3);
    assertEqual(eventData.current, 2);
  });

  it('should emit lifeChange event when addLife() is called', () => {
    let eventData = null;
    gameState.on('lifeChange', (data) => {
      eventData = data;
    });

    gameState.addLife();

    assertTrue(eventData !== null);
    assertEqual(eventData.previous, 3);
    assertEqual(eventData.current, 4);
  });

  it('should emit lifeChange event when setLives() is called', () => {
    let eventData = null;
    gameState.on('lifeChange', (data) => {
      eventData = data;
    });

    gameState.setLives(7);

    assertTrue(eventData !== null);
    assertEqual(eventData.previous, 3);
    assertEqual(eventData.current, 7);
  });
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

  // TODO: Add snapshot tests
});

// Run all tests if this file is executed directly
if (typeof module !== 'undefined' && require.main === module) {
  run().then(success => {
    process.exit(success ? 0 : 1);
  });
}
