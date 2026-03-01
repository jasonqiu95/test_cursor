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

  it('on() registers a callback that gets called on emit', () => {
    let callCount = 0;
    let receivedData = null;

    gameState.on('testEvent', (data) => {
      callCount++;
      receivedData = data;
    });

    gameState.emit('testEvent', { value: 42 });

    assertEqual(callCount, 1);
    assertDeepEqual(receivedData, { value: 42 });
  });

  it('on() throws error if callback is not a function', () => {
    assertThrows(() => {
      gameState.on('testEvent', 'not a function');
    }, Error);

    assertThrows(() => {
      gameState.on('testEvent', null);
    }, Error);

    assertThrows(() => {
      gameState.on('testEvent', 123);
    }, Error);
  });

  it('off() removes a specific callback', () => {
    let callCount = 0;
    const callback = () => { callCount++; };

    gameState.on('testEvent', callback);
    gameState.emit('testEvent');
    assertEqual(callCount, 1);

    gameState.off('testEvent', callback);
    gameState.emit('testEvent');
    assertEqual(callCount, 1); // Should still be 1, not 2
  });

  it('off() only removes the specified callback', () => {
    let count1 = 0;
    let count2 = 0;
    const callback1 = () => { count1++; };
    const callback2 = () => { count2++; };

    gameState.on('testEvent', callback1);
    gameState.on('testEvent', callback2);

    gameState.off('testEvent', callback1);
    gameState.emit('testEvent');

    assertEqual(count1, 0);
    assertEqual(count2, 1);
  });

  it('off() handles non-existent event gracefully', () => {
    // Should not throw
    gameState.off('nonExistentEvent', () => {});
  });

  it('emit() calls all registered callbacks', () => {
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;

    gameState.on('testEvent', () => { count1++; });
    gameState.on('testEvent', () => { count2++; });
    gameState.on('testEvent', () => { count3++; });

    gameState.emit('testEvent');

    assertEqual(count1, 1);
    assertEqual(count2, 1);
    assertEqual(count3, 1);
  });

  it('emit() handles non-existent event gracefully', () => {
    // Should not throw
    gameState.emit('nonExistentEvent', { data: 'test' });
  });

  it('on() returns an unsubscribe function', () => {
    let callCount = 0;
    const unsubscribe = gameState.on('testEvent', () => { callCount++; });

    assertEqual(typeof unsubscribe, 'function');

    gameState.emit('testEvent');
    assertEqual(callCount, 1);

    unsubscribe();
    gameState.emit('testEvent');
    assertEqual(callCount, 1); // Should still be 1
  });

  it('unsubscribe function removes only that specific callback', () => {
    let count1 = 0;
    let count2 = 0;

    const unsubscribe1 = gameState.on('testEvent', () => { count1++; });
    gameState.on('testEvent', () => { count2++; });

    unsubscribe1();
    gameState.emit('testEvent');

    assertEqual(count1, 0);
    assertEqual(count2, 1);
  });

  it('multiple listeners for same event all receive data', () => {
    const receivedData = [];

    gameState.on('testEvent', (data) => { receivedData.push(data); });
    gameState.on('testEvent', (data) => { receivedData.push(data); });
    gameState.on('testEvent', (data) => { receivedData.push(data); });

    const testData = { message: 'hello' };
    gameState.emit('testEvent', testData);

    assertEqual(receivedData.length, 3);
    assertDeepEqual(receivedData[0], testData);
    assertDeepEqual(receivedData[1], testData);
    assertDeepEqual(receivedData[2], testData);
  });

  it('removeAllListeners() removes all listeners for specific event', () => {
    let count1 = 0;
    let count2 = 0;

    gameState.on('event1', () => { count1++; });
    gameState.on('event1', () => { count1++; });
    gameState.on('event2', () => { count2++; });

    gameState.removeAllListeners('event1');

    gameState.emit('event1');
    gameState.emit('event2');

    assertEqual(count1, 0);
    assertEqual(count2, 1);
  });

  it('removeAllListeners() without argument removes all listeners for all events', () => {
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;

    gameState.on('event1', () => { count1++; });
    gameState.on('event2', () => { count2++; });
    gameState.on('event3', () => { count3++; });

    gameState.removeAllListeners();

    gameState.emit('event1');
    gameState.emit('event2');
    gameState.emit('event3');

    assertEqual(count1, 0);
    assertEqual(count2, 0);
    assertEqual(count3, 0);
  });

  it('event callbacks receive correct data objects', () => {
    let receivedData = null;

    gameState.on('stateChange', (data) => {
      receivedData = data;
    });

    gameState.setState(GameStates.PLAYING);

    assertTrue(receivedData !== null);
    assertEqual(receivedData.from, GameStates.START);
    assertEqual(receivedData.to, GameStates.PLAYING);
    assertEqual(typeof receivedData.lives, 'number');
    assertEqual(typeof receivedData.score, 'number');
  });

  it('callbacks receive correct data for scoreChange event', () => {
    let receivedData = null;

    gameState.on('scoreChange', (data) => {
      receivedData = data;
    });

    gameState.addScore(100);

    assertTrue(receivedData !== null);
    assertEqual(receivedData.previous, 0);
    assertEqual(receivedData.current, 100);
    assertEqual(receivedData.delta, 100);
  });

  it('callbacks receive correct data for lifeChange event', () => {
    let receivedData = null;

    gameState.on('lifeChange', (data) => {
      receivedData = data;
    });

    gameState.loseLife();

    assertTrue(receivedData !== null);
    assertEqual(receivedData.previous, 3);
    assertEqual(receivedData.current, 2);
  });

  it('callbacks receive correct data for comboChange event', () => {
    let receivedData = null;

    gameState.on('comboChange', (data) => {
      receivedData = data;
    });

    gameState.increaseCombo();

    assertTrue(receivedData !== null);
    assertEqual(receivedData.previous, 0);
    assertEqual(receivedData.current, 1);
    assertEqual(typeof receivedData.multiplier, 'number');
    assertEqual(typeof receivedData.multiplierIncreased, 'boolean');
  });

  it('callbacks receive correct data for waveChange event', () => {
    let receivedData = null;

    gameState.on('waveChange', (data) => {
      receivedData = data;
    });

    gameState.nextWave();

    assertTrue(receivedData !== null);
    assertEqual(receivedData.previous, 1);
    assertEqual(receivedData.current, 2);
  });

  it('error in one callback does not prevent other callbacks from executing', () => {
    let count1 = 0;
    let count2 = 0;
    let count3 = 0;

    gameState.on('testEvent', () => { count1++; });
    gameState.on('testEvent', () => {
      count2++;
      throw new Error('Intentional error');
    });
    gameState.on('testEvent', () => { count3++; });

    // Should not throw
    gameState.emit('testEvent');

    assertEqual(count1, 1);
    assertEqual(count2, 1);
    assertEqual(count3, 1); // This should still execute
  });

  it('error in callback does not crash the system', () => {
    gameState.on('testEvent', () => {
      throw new Error('Intentional error');
    });

    // Should not throw - errors are caught and logged
    gameState.emit('testEvent');

    // System should still be functional
    let callCount = 0;
    gameState.on('anotherEvent', () => { callCount++; });
    gameState.emit('anotherEvent');
    assertEqual(callCount, 1);
  });

  it('multiple errors in different callbacks do not crash the system', () => {
    let successCount = 0;

    gameState.on('testEvent', () => { throw new Error('Error 1'); });
    gameState.on('testEvent', () => { successCount++; });
    gameState.on('testEvent', () => { throw new Error('Error 2'); });
    gameState.on('testEvent', () => { successCount++; });

    gameState.emit('testEvent');

    assertEqual(successCount, 2);
  });

  it('can reuse the same callback for different events', () => {
    let callCount = 0;
    const callback = () => { callCount++; };

    gameState.on('event1', callback);
    gameState.on('event2', callback);
    gameState.on('event3', callback);

    gameState.emit('event1');
    gameState.emit('event2');
    gameState.emit('event3');

    assertEqual(callCount, 3);
  });

  it('can register the same callback multiple times for same event', () => {
    let callCount = 0;
    const callback = () => { callCount++; };

    gameState.on('testEvent', callback);
    gameState.on('testEvent', callback);

    gameState.emit('testEvent');

    assertEqual(callCount, 2);
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
