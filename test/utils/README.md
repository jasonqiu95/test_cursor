# Test Utilities

Comprehensive test utilities for the Space Invaders game.

## Game State Factory

Create game state scenarios for testing:

```javascript
const { createInitialGameState, createPlayingGameState, createMockPlayer } = require('./game-state-factory.js');

// Create initial game state
const state = createInitialGameState();

// Create playing state with custom values
const playingState = createPlayingGameState({ lives: 2, score: 1000 });

// Create mock game entities
const player = createMockPlayer();
const bullet = createMockBullet(100, 200, 'up');
const alien = createMockAlien(50, 50, 2);
```

## Time Helpers

Simulate game loops and time progression:

```javascript
const { MockTimer, GameLoopSimulator, createTimeTestEnv } = require('./time-helpers.js');

// Create test environment
const env = createTimeTestEnv();

// Advance time
env.advanceTime(1000); // 1 second
env.advanceSeconds(5); // 5 seconds

// Simulate game loop
env.gameLoop.onUpdate((deltaTime) => {
  // Your update logic
});
env.runFrames(60); // Run 60 frames
```

## Available Functions

### Game State Factory
- `createInitialGameState()` - Fresh game state
- `createPlayingGameState()` - Game in progress
- `createLowLivesGameState()` - Critical situation
- `createHighComboGameState()` - High combo active
- `createGameOverState()` - Game over state
- `createMockPlayer()` - Mock player entity
- `createMockBullet()` - Mock bullet entity
- `createMockAlien()` - Mock alien entity
- `createGameScenario()` - Complete game scenario

### Time Helpers
- `MockTimer` - Control time for testing
- `GameLoopSimulator` - Simulate game loop execution
- `DeltaTimeCalculator` - Calculate delta times
- `CooldownTimer` - Test cooldown mechanics
- `createTimeTestEnv()` - Complete timing test environment
