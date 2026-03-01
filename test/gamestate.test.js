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

  it('should initialize with combo of 0', () => {
    assertEqual(gameState.getCombo(), 0);
  });

  it('should increment combo with increaseCombo()', () => {
    assertEqual(gameState.getCombo(), 0);

    gameState.increaseCombo();
    assertEqual(gameState.getCombo(), 1);

    gameState.increaseCombo();
    assertEqual(gameState.getCombo(), 2);

    gameState.increaseCombo();
    assertEqual(gameState.getCombo(), 3);
  });

  it('should return new combo value from increaseCombo()', () => {
    const result = gameState.increaseCombo();
    assertEqual(result, 1);

    const result2 = gameState.increaseCombo();
    assertEqual(result2, 2);
  });

  it('should reset combo to 0 with resetCombo()', () => {
    gameState.increaseCombo();
    gameState.increaseCombo();
    gameState.increaseCombo();
    assertEqual(gameState.getCombo(), 3);

    gameState.resetCombo();
    assertEqual(gameState.getCombo(), 0);
  });

  it('should return multiplier of 1x at combo 0-4', () => {
    assertEqual(gameState.getMultiplier(), 1); // combo 0

    gameState.increaseCombo();
    assertEqual(gameState.getMultiplier(), 1); // combo 1

    gameState.increaseCombo();
    assertEqual(gameState.getMultiplier(), 1); // combo 2

    gameState.increaseCombo();
    assertEqual(gameState.getMultiplier(), 1); // combo 3

    gameState.increaseCombo();
    assertEqual(gameState.getMultiplier(), 1); // combo 4
  });

  it('should return multiplier of 2x at combo 5-9', () => {
    for (let i = 0; i < 5; i++) {
      gameState.increaseCombo();
    }
    assertEqual(gameState.getMultiplier(), 2); // combo 5

    gameState.increaseCombo();
    assertEqual(gameState.getMultiplier(), 2); // combo 6

    gameState.increaseCombo();
    assertEqual(gameState.getMultiplier(), 2); // combo 7

    gameState.increaseCombo();
    assertEqual(gameState.getMultiplier(), 2); // combo 8

    gameState.increaseCombo();
    assertEqual(gameState.getMultiplier(), 2); // combo 9
  });

  it('should return multiplier of 3x at combo 10-14', () => {
    for (let i = 0; i < 10; i++) {
      gameState.increaseCombo();
    }
    assertEqual(gameState.getMultiplier(), 3); // combo 10

    for (let i = 0; i < 4; i++) {
      gameState.increaseCombo();
    }
    assertEqual(gameState.getMultiplier(), 3); // combo 14
  });

  it('should calculate multiplier correctly for higher combos', () => {
    // 4x at combo 15-19
    for (let i = 0; i < 15; i++) {
      gameState.increaseCombo();
    }
    assertEqual(gameState.getMultiplier(), 4);

    // 5x at combo 20-24
    for (let i = 0; i < 5; i++) {
      gameState.increaseCombo();
    }
    assertEqual(gameState.getMultiplier(), 5);

    // 10x at combo 45
    for (let i = 0; i < 25; i++) {
      gameState.increaseCombo();
    }
    assertEqual(gameState.getMultiplier(), 10);
  });

  it('should emit comboChange event when combo increases', () => {
    let eventData = null;

    gameState.on('comboChange', (data) => {
      eventData = data;
    });

    gameState.increaseCombo();

    assertEqual(eventData.previous, 0);
    assertEqual(eventData.current, 1);
    assertEqual(eventData.multiplier, 1);
    assertFalse(eventData.multiplierIncreased);
  });

  it('should emit comboChange event with multiplierIncreased when reaching 5 combo', () => {
    let eventData = null;

    gameState.on('comboChange', (data) => {
      eventData = data;
    });

    // Increase combo to 4
    for (let i = 0; i < 4; i++) {
      gameState.increaseCombo();
    }

    // This should increase multiplier from 1x to 2x
    gameState.increaseCombo();

    assertEqual(eventData.previous, 4);
    assertEqual(eventData.current, 5);
    assertEqual(eventData.multiplier, 2);
    assertTrue(eventData.multiplierIncreased);
  });

  it('should emit comboChange event with multiplierIncreased when reaching 10 combo', () => {
    let eventData = null;

    gameState.on('comboChange', (data) => {
      eventData = data;
    });

    // Increase combo to 9
    for (let i = 0; i < 9; i++) {
      gameState.increaseCombo();
    }

    // This should increase multiplier from 2x to 3x
    gameState.increaseCombo();

    assertEqual(eventData.previous, 9);
    assertEqual(eventData.current, 10);
    assertEqual(eventData.multiplier, 3);
    assertTrue(eventData.multiplierIncreased);
  });

  it('should emit comboChange event when combo resets', () => {
    let eventData = null;

    gameState.on('comboChange', (data) => {
      eventData = data;
    });

    // Build up combo
    for (let i = 0; i < 7; i++) {
      gameState.increaseCombo();
    }

    // Reset combo
    gameState.resetCombo();

    assertEqual(eventData.previous, 7);
    assertEqual(eventData.current, 0);
    assertEqual(eventData.multiplier, 1);
    assertFalse(eventData.multiplierIncreased);
  });

  it('should not emit comboChange event when resetting already 0 combo', () => {
    let eventCalled = false;

    gameState.on('comboChange', () => {
      eventCalled = true;
    });

    gameState.resetCombo();

    assertFalse(eventCalled);
  });

  it('should track combo and multiplier status correctly through multiple cycles', () => {
    const events = [];

    gameState.on('comboChange', (data) => {
      events.push({
        combo: data.current,
        multiplier: data.multiplier,
        increased: data.multiplierIncreased
      });
    });

    // Build combo to 5
    for (let i = 0; i < 5; i++) {
      gameState.increaseCombo();
    }

    // Reset
    gameState.resetCombo();

    // Build combo to 10
    for (let i = 0; i < 10; i++) {
      gameState.increaseCombo();
    }

    // Verify we have all events
    assertEqual(events.length, 16); // 5 increases + 1 reset + 10 increases

    // Verify multiplier increased at combo 5 (index 4)
    assertEqual(events[4].combo, 5);
    assertEqual(events[4].multiplier, 2);
    assertTrue(events[4].increased);

    // Verify reset event
    assertEqual(events[5].combo, 0);
    assertEqual(events[5].multiplier, 1);
    assertFalse(events[5].increased);

    // Verify multiplier increased at combo 5 again (index 10)
    assertEqual(events[10].combo, 5);
    assertEqual(events[10].multiplier, 2);
    assertTrue(events[10].increased);

    // Verify multiplier increased at combo 10 (index 15)
    assertEqual(events[15].combo, 10);
    assertEqual(events[15].multiplier, 3);
    assertTrue(events[15].increased);
  });
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
