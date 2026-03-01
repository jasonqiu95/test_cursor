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

  it('should initialize with START state', () => {
    assertEqual(gameState.getState(), GameStates.START);
  });

  it('should initialize with 3 lives', () => {
    assertEqual(gameState.getLives(), 3);
  });

  it('should initialize with score 0', () => {
    assertEqual(gameState.getScore(), 0);
  });

  it('should initialize with combo 0', () => {
    assertEqual(gameState.getCombo(), 0);
  });

  it('should initialize with wave 1', () => {
    assertEqual(gameState.getWave(), 1);
  });
});

// ========================================
// State Transition Tests
// ========================================

describe('State Transitions', () => {
  let gameState;

  beforeEach(() => {
    gameState = new GameState();
  });

  describe('Valid Transitions', () => {
    beforeEach(() => {
      gameState = new GameState();
    });

    it('should transition from START to PLAYING', () => {
      gameState.setState(GameStates.PLAYING);
      assertEqual(gameState.getState(), GameStates.PLAYING);
    });

    it('should transition from PLAYING to GAME_OVER', () => {
      gameState.setState(GameStates.PLAYING);
      gameState.setState(GameStates.GAME_OVER);
      assertEqual(gameState.getState(), GameStates.GAME_OVER);
    });

    it('should transition from PLAYING to WIN', () => {
      gameState.setState(GameStates.PLAYING);
      gameState.setState(GameStates.WIN);
      assertEqual(gameState.getState(), GameStates.WIN);
    });

    it('should transition from GAME_OVER to START', () => {
      gameState.setState(GameStates.PLAYING);
      gameState.setState(GameStates.GAME_OVER);
      gameState.setState(GameStates.START);
      assertEqual(gameState.getState(), GameStates.START);
    });

    it('should transition from WIN to START', () => {
      gameState.setState(GameStates.PLAYING);
      gameState.setState(GameStates.WIN);
      gameState.setState(GameStates.START);
      assertEqual(gameState.getState(), GameStates.START);
    });
  });

  describe('Invalid Transitions', () => {
    beforeEach(() => {
      gameState = new GameState();
    });

    it('should throw error when transitioning from START to GAME_OVER', () => {
      assertThrows(() => {
        gameState.setState(GameStates.GAME_OVER);
      });
    });

    it('should throw error when transitioning from START to WIN', () => {
      assertThrows(() => {
        gameState.setState(GameStates.WIN);
      });
    });

    it('should throw error when transitioning from PLAYING to START', () => {
      gameState.setState(GameStates.PLAYING);
      assertThrows(() => {
        gameState.setState(GameStates.START);
      });
    });

    it('should throw error when transitioning from GAME_OVER to PLAYING', () => {
      gameState.setState(GameStates.PLAYING);
      gameState.setState(GameStates.GAME_OVER);
      assertThrows(() => {
        gameState.setState(GameStates.PLAYING);
      });
    });

    it('should throw error when transitioning from WIN to PLAYING', () => {
      gameState.setState(GameStates.PLAYING);
      gameState.setState(GameStates.WIN);
      assertThrows(() => {
        gameState.setState(GameStates.PLAYING);
      });
    });

    it('should throw error for invalid state value', () => {
      assertThrows(() => {
        gameState.setState('INVALID_STATE');
      });
    });

    it('should throw error for undefined state', () => {
      assertThrows(() => {
        gameState.setState(undefined);
      });
    });

    it('should throw error for null state', () => {
      assertThrows(() => {
        gameState.setState(null);
      });
    });
  });

  describe('setState Validation', () => {
    beforeEach(() => {
      gameState = new GameState();
    });

    it('should validate state exists in GameStates', () => {
      assertThrows(() => {
        gameState.setState('PAUSED');
      });
    });

    it('should validate transition before changing state', () => {
      const initialState = gameState.getState();
      assertThrows(() => {
        gameState.setState(GameStates.GAME_OVER);
      });
      // State should remain unchanged after failed transition
      assertEqual(gameState.getState(), initialState);
    });

    it('should emit stateChange event on valid transition', () => {
      let eventData = null;
      gameState.on('stateChange', (data) => {
        eventData = data;
      });

      gameState.setState(GameStates.PLAYING);

      assertTrue(eventData !== null);
      assertEqual(eventData.from, GameStates.START);
      assertEqual(eventData.to, GameStates.PLAYING);
    });

    it('should emit specific state event on transition', () => {
      let playingEventFired = false;
      gameState.on('playing', () => {
        playingEventFired = true;
      });

      gameState.setState(GameStates.PLAYING);

      assertTrue(playingEventFired);
    });
  });

  describe('Helper Methods', () => {
    describe('startGame()', () => {
      beforeEach(() => {
        gameState = new GameState();
      });

      it('should transition to PLAYING state', () => {
        gameState.startGame();
        assertEqual(gameState.getState(), GameStates.PLAYING);
      });

      it('should throw error if called from invalid state', () => {
        gameState.setState(GameStates.PLAYING);
        gameState.setState(GameStates.GAME_OVER);
        assertThrows(() => {
          gameState.startGame();
        });
      });
    });

    describe('endGame()', () => {
      beforeEach(() => {
        gameState = new GameState();
      });

      it('should transition to GAME_OVER state', () => {
        gameState.setState(GameStates.PLAYING);
        gameState.endGame();
        assertEqual(gameState.getState(), GameStates.GAME_OVER);
      });

      it('should throw error if called from invalid state', () => {
        assertThrows(() => {
          gameState.endGame();
        });
      });
    });

    describe('winGame()', () => {
      beforeEach(() => {
        gameState = new GameState();
      });

      it('should transition to WIN state', () => {
        gameState.setState(GameStates.PLAYING);
        gameState.winGame();
        assertEqual(gameState.getState(), GameStates.WIN);
      });

      it('should throw error if called from invalid state', () => {
        assertThrows(() => {
          gameState.winGame();
        });
      });
    });

    describe('isValidTransition()', () => {
      beforeEach(() => {
        gameState = new GameState();
      });

      it('should return true for START to PLAYING', () => {
        assertTrue(gameState.isValidTransition(GameStates.START, GameStates.PLAYING));
      });

      it('should return true for PLAYING to GAME_OVER', () => {
        assertTrue(gameState.isValidTransition(GameStates.PLAYING, GameStates.GAME_OVER));
      });

      it('should return true for PLAYING to WIN', () => {
        assertTrue(gameState.isValidTransition(GameStates.PLAYING, GameStates.WIN));
      });

      it('should return true for GAME_OVER to START', () => {
        assertTrue(gameState.isValidTransition(GameStates.GAME_OVER, GameStates.START));
      });

      it('should return true for WIN to START', () => {
        assertTrue(gameState.isValidTransition(GameStates.WIN, GameStates.START));
      });

      it('should return false for START to GAME_OVER', () => {
        assertFalse(gameState.isValidTransition(GameStates.START, GameStates.GAME_OVER));
      });

      it('should return false for START to WIN', () => {
        assertFalse(gameState.isValidTransition(GameStates.START, GameStates.WIN));
      });

      it('should return false for PLAYING to START', () => {
        assertFalse(gameState.isValidTransition(GameStates.PLAYING, GameStates.START));
      });

      it('should return false for GAME_OVER to PLAYING', () => {
        assertFalse(gameState.isValidTransition(GameStates.GAME_OVER, GameStates.PLAYING));
      });

      it('should return false for WIN to PLAYING', () => {
        assertFalse(gameState.isValidTransition(GameStates.WIN, GameStates.PLAYING));
      });

      it('should return false for invalid from state', () => {
        assertFalse(gameState.isValidTransition('INVALID', GameStates.PLAYING));
      });
    });
  });
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
