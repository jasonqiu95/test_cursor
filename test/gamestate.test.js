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

  it('should emit stateChange event with correct data on setState', () => {
    let eventData = null;
    gameState.on('stateChange', (data) => {
      eventData = data;
    });

    gameState.setState(GameStates.PLAYING);

    assertTrue(eventData !== null, 'stateChange event should be emitted');
    assertEqual(eventData.from, GameStates.START, 'from state should be START');
    assertEqual(eventData.to, GameStates.PLAYING, 'to state should be PLAYING');
    assertEqual(eventData.lives, 3, 'lives should be included');
    assertEqual(eventData.score, 0, 'score should be included');
  });

  it('should emit scoreChange event with correct data on addScore', () => {
    let eventData = null;
    gameState.on('scoreChange', (data) => {
      eventData = data;
    });

    gameState.addScore(100);

    assertTrue(eventData !== null, 'scoreChange event should be emitted');
    assertEqual(eventData.previous, 0, 'previous score should be 0');
    assertEqual(eventData.current, 100, 'current score should be 100');
    assertEqual(eventData.delta, 100, 'delta should be 100');
  });

  it('should emit scoreChange event with correct data on setScore', () => {
    gameState.setScore(50); // Set initial score

    let eventData = null;
    gameState.on('scoreChange', (data) => {
      eventData = data;
    });

    gameState.setScore(200);

    assertTrue(eventData !== null, 'scoreChange event should be emitted');
    assertEqual(eventData.previous, 50, 'previous score should be 50');
    assertEqual(eventData.current, 200, 'current score should be 200');
    assertEqual(eventData.delta, 150, 'delta should be 150');
  });

  it('should emit lifeChange event with correct data on loseLife', () => {
    let eventData = null;
    gameState.on('lifeChange', (data) => {
      eventData = data;
    });

    gameState.loseLife();

    assertTrue(eventData !== null, 'lifeChange event should be emitted');
    assertEqual(eventData.previous, 3, 'previous lives should be 3');
    assertEqual(eventData.current, 2, 'current lives should be 2');
  });

  it('should emit lifeChange event with correct data on addLife', () => {
    let eventData = null;
    gameState.on('lifeChange', (data) => {
      eventData = data;
    });

    gameState.addLife();

    assertTrue(eventData !== null, 'lifeChange event should be emitted');
    assertEqual(eventData.previous, 3, 'previous lives should be 3');
    assertEqual(eventData.current, 4, 'current lives should be 4');
  });

  it('should emit lifeChange event with correct data on setLives', () => {
    let eventData = null;
    gameState.on('lifeChange', (data) => {
      eventData = data;
    });

    gameState.setLives(5);

    assertTrue(eventData !== null, 'lifeChange event should be emitted');
    assertEqual(eventData.previous, 3, 'previous lives should be 3');
    assertEqual(eventData.current, 5, 'current lives should be 5');
  });

  it('should emit comboChange event with correct data on increaseCombo', () => {
    let eventData = null;
    gameState.on('comboChange', (data) => {
      eventData = data;
    });

    gameState.increaseCombo();

    assertTrue(eventData !== null, 'comboChange event should be emitted');
    assertEqual(eventData.previous, 0, 'previous combo should be 0');
    assertEqual(eventData.current, 1, 'current combo should be 1');
    assertEqual(eventData.multiplier, 1, 'multiplier should be 1');
    assertFalse(eventData.multiplierIncreased, 'multiplier should not have increased');
  });

  it('should emit comboChange with multiplier increase at combo 5', () => {
    let eventData = null;

    // Get to combo 4
    for (let i = 0; i < 4; i++) {
      gameState.increaseCombo();
    }

    // Listen for the 5th combo increase
    gameState.on('comboChange', (data) => {
      eventData = data;
    });

    gameState.increaseCombo();

    assertTrue(eventData !== null, 'comboChange event should be emitted');
    assertEqual(eventData.previous, 4, 'previous combo should be 4');
    assertEqual(eventData.current, 5, 'current combo should be 5');
    assertEqual(eventData.multiplier, 2, 'multiplier should be 2');
    assertTrue(eventData.multiplierIncreased, 'multiplier should have increased');
  });

  it('should emit comboChange event with correct data on resetCombo', () => {
    gameState.increaseCombo();
    gameState.increaseCombo();
    gameState.increaseCombo();

    let eventData = null;
    gameState.on('comboChange', (data) => {
      eventData = data;
    });

    gameState.resetCombo();

    assertTrue(eventData !== null, 'comboChange event should be emitted');
    assertEqual(eventData.previous, 3, 'previous combo should be 3');
    assertEqual(eventData.current, 0, 'current combo should be 0');
    assertEqual(eventData.multiplier, 1, 'multiplier should be 1');
    assertFalse(eventData.multiplierIncreased, 'multiplier should not have increased');
  });

  it('should not emit comboChange when resetCombo is called with combo already at 0', () => {
    let eventEmitted = false;
    gameState.on('comboChange', () => {
      eventEmitted = true;
    });

    gameState.resetCombo(); // Combo is already 0

    assertFalse(eventEmitted, 'comboChange event should not be emitted when combo is already 0');
  });

  it('should emit waveChange event with correct data on nextWave', () => {
    let eventData = null;
    gameState.on('waveChange', (data) => {
      eventData = data;
    });

    gameState.nextWave();

    assertTrue(eventData !== null, 'waveChange event should be emitted');
    assertEqual(eventData.previous, 1, 'previous wave should be 1');
    assertEqual(eventData.current, 2, 'current wave should be 2');
  });

  it('should emit reset event with correct data on reset', () => {
    // Set up some non-default state
    gameState.setState(GameStates.PLAYING);
    gameState.addScore(500);
    gameState.loseLife();
    gameState.increaseCombo();
    gameState.nextWave();

    let eventData = null;
    gameState.on('reset', (data) => {
      eventData = data;
    });

    gameState.reset();

    assertTrue(eventData !== null, 'reset event should be emitted');
    assertEqual(eventData.previousState, GameStates.PLAYING, 'previous state should be PLAYING');
    assertEqual(eventData.lives, 3, 'lives should be reset to 3');
    assertEqual(eventData.score, 0, 'score should be reset to 0');
    assertEqual(eventData.combo, 0, 'combo should be reset to 0');
    assertEqual(eventData.wave, 1, 'wave should be reset to 1');
  });

  it('should handle multiple listeners for the same event', () => {
    let listener1Called = false;
    let listener2Called = false;

    gameState.on('scoreChange', () => {
      listener1Called = true;
    });

    gameState.on('scoreChange', () => {
      listener2Called = true;
    });

    gameState.addScore(10);

    assertTrue(listener1Called, 'first listener should be called');
    assertTrue(listener2Called, 'second listener should be called');
  });

  it('should allow unsubscribing from events', () => {
    let callCount = 0;
    const unsubscribe = gameState.on('scoreChange', () => {
      callCount++;
    });

    gameState.addScore(10);
    assertEqual(callCount, 1, 'listener should be called once');

    unsubscribe();

    gameState.addScore(10);
    assertEqual(callCount, 1, 'listener should not be called after unsubscribe');
  });

  it('should handle errors in event listeners without breaking other listeners', () => {
    let listener1Called = false;
    let listener2Called = false;

    gameState.on('scoreChange', () => {
      listener1Called = true;
      throw new Error('Test error');
    });

    gameState.on('scoreChange', () => {
      listener2Called = true;
    });

    gameState.addScore(10);

    assertTrue(listener1Called, 'first listener should be called');
    assertTrue(listener2Called, 'second listener should still be called despite error in first');
  });

  it('should emit all expected events in a typical game flow', () => {
    const events = [];

    gameState.on('stateChange', (data) => events.push({ event: 'stateChange', data }));
    gameState.on('scoreChange', (data) => events.push({ event: 'scoreChange', data }));
    gameState.on('comboChange', (data) => events.push({ event: 'comboChange', data }));
    gameState.on('lifeChange', (data) => events.push({ event: 'lifeChange', data }));
    gameState.on('waveChange', (data) => events.push({ event: 'waveChange', data }));
    gameState.on('reset', (data) => events.push({ event: 'reset', data }));

    // Simulate game flow
    gameState.setState(GameStates.PLAYING);
    gameState.addScore(100);
    gameState.increaseCombo();
    gameState.loseLife();
    gameState.nextWave();
    gameState.reset();

    assertEqual(events.length, 6, 'should emit 6 events');
    assertEqual(events[0].event, 'stateChange', 'first event should be stateChange');
    assertEqual(events[1].event, 'scoreChange', 'second event should be scoreChange');
    assertEqual(events[2].event, 'comboChange', 'third event should be comboChange');
    assertEqual(events[3].event, 'lifeChange', 'fourth event should be lifeChange');
    assertEqual(events[4].event, 'waveChange', 'fifth event should be waveChange');
    assertEqual(events[5].event, 'reset', 'sixth event should be reset');
  });
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
