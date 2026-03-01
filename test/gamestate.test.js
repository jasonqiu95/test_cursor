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

  // TODO: Add snapshot tests
});

// Run all tests if this file is executed directly
if (typeof module !== 'undefined' && require.main === module) {
  run().then(success => {
    process.exit(success ? 0 : 1);
  });
}
