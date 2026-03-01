/**
 * Test Utilities and Mocks Demo
 * Demonstrates usage of all test utilities and mocks
 * Run with: node test/utilities-demo.test.js
 */

// Load test runner
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
  run
} = TestRunner;

// Load test utilities and mocks
const {
  createMockCanvas,
  createMockDOM,
  createStorageTestEnv
} = require('./mocks/index.js');

const {
  createInitialGameState,
  createMockPlayer,
  createMockBullet,
  createMockAlien,
  createGameScenario,
  MockTimer,
  GameLoopSimulator,
  createTimeTestEnv
} = require('./utils/index.js');

// ========================================
// Canvas Mock Tests
// ========================================

describe('Canvas Mock', () => {
  let canvas, ctx;

  beforeEach(() => {
    canvas = createMockCanvas(800, 600);
    ctx = canvas.getContext('2d');
  });

  it('should track drawing method calls', () => {
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(10, 20, 100, 50);

    assertEqual(ctx.getCallCount('fillRect'), 1);
    const call = ctx.getLastCallTo('fillRect');
    assertEqual(call.args[0], 10);
    assertEqual(call.args[1], 20);
  });

  it('should track path drawing', () => {
    ctx.beginPath();
    ctx.moveTo(100, 100);
    ctx.lineTo(200, 200);
    ctx.closePath();
    ctx.fill();

    assertEqual(ctx.getCallCount('beginPath'), 1);
    assertEqual(ctx.getCallCount('moveTo'), 1);
    assertEqual(ctx.getCallCount('lineTo'), 1);
    assertEqual(ctx.getCallCount('fill'), 1);
  });

  it('should handle save/restore state', () => {
    ctx.fillStyle = '#FF0000';
    ctx.save();
    ctx.fillStyle = '#00FF00';
    ctx.restore();

    assertEqual(ctx.fillStyle, '#FF0000');
  });
});

// ========================================
// Storage Mock Tests
// ========================================

describe('Storage Mock', () => {
  let env;

  beforeEach(() => {
    env = createStorageTestEnv();
  });

  it('should save and load high score', () => {
    env.saveHighScore(5000);
    const loaded = env.loadHighScore();
    assertEqual(loaded, 5000);
  });

  it('should handle missing high score', () => {
    const loaded = env.loadHighScore();
    assertEqual(loaded, 0);
  });

  it('should track storage size', () => {
    env.localStorage.setItem('test', 'value');
    assertTrue(env.localStorage.size > 0);
  });

  it('should clear all data', () => {
    env.localStorage.setItem('key1', 'value1');
    env.localStorage.setItem('key2', 'value2');
    env.localStorage.clear();
    assertTrue(env.localStorage.isEmpty());
  });
});

// ========================================
// Game State Factory Tests
// ========================================

describe('Game State Factory', () => {
  it('should create initial game state', () => {
    const state = createInitialGameState();
    assertEqual(state.state, 'START');
    assertEqual(state.lives, 3);
    assertEqual(state.score, 0);
  });

  it('should create mock player', () => {
    const player = createMockPlayer();
    assertEqual(player.x, 400);
    assertEqual(player.y, 550);
    assertTrue(typeof player.update === 'function');
  });

  it('should create mock bullet', () => {
    const bullet = createMockBullet(100, 200, 'up');
    assertEqual(bullet.x, 100);
    assertEqual(bullet.y, 200);
    assertEqual(bullet.direction, 'up');
    assertTrue(bullet.active);
  });

  it('should create complete game scenario', () => {
    const scenario = createGameScenario('midGame');
    assertTrue(scenario.gameState.score > 0);
    assertTrue(scenario.bullets.length > 0);
    assertTrue(scenario.aliens.getRemainingCount() < 55);
  });
});

// ========================================
// Time Helpers Tests
// ========================================

describe('Time Helpers', () => {
  let env;

  beforeEach(() => {
    env = createTimeTestEnv();
  });

  it('should advance time', () => {
    const startTime = env.timer.now();
    env.advanceTime(1000);
    assertEqual(env.timer.now(), startTime + 1000);
  });

  it('should execute timeouts', () => {
    let executed = false;
    env.timer.setTimeout(() => { executed = true; }, 500);

    env.advanceTime(300);
    assertFalse(executed);

    env.advanceTime(300);
    assertTrue(executed);
  });

  it('should simulate game loop', () => {
    let updateCount = 0;
    env.gameLoop.onUpdate(() => { updateCount++; });
    env.gameLoop.start();

    env.runFrames(10);
    assertEqual(updateCount, 10);
  });

  it('should calculate delta time', () => {
    env.gameLoop.start();
    const results = env.runFrames(3);

    assertTrue(results.length === 3);
    assertTrue(results[0].deltaTime >= 0);
  });
});

// ========================================
// Integration Tests
// ========================================

describe('Integration: Player Movement', () => {
  let env, player;

  beforeEach(() => {
    env = createTimeTestEnv();
    player = createMockPlayer();
  });

  it('should move player with delta time', () => {
    const startX = player.x;
    player.moveRight();

    env.gameLoop.onUpdate(() => {
      player.update();
    });
    env.gameLoop.start();
    env.runFrames(10);

    assertTrue(player.x > startX);
  });

  it('should respect canvas boundaries', () => {
    player.x = 0;
    player.moveLeft();
    player.update();

    assertEqual(player.x, 0);
  });
});

describe('Integration: Collision Detection', () => {
  it('should detect bullet-alien collision', () => {
    const bullet = createMockBullet(100, 100, 'up');
    const alien = createMockAlien(95, 95, 1);

    const bounds = bullet.getBounds();
    const hit = alien.checkCollision(
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height
    );

    assertTrue(hit);
  });

  it('should not detect collision when far apart', () => {
    const bullet = createMockBullet(100, 100, 'up');
    const alien = createMockAlien(500, 500, 1);

    const bounds = bullet.getBounds();
    const hit = alien.checkCollision(
      bounds.x,
      bounds.y,
      bounds.width,
      bounds.height
    );

    assertFalse(hit);
  });
});

// Run tests
if (typeof module !== 'undefined' && require.main === module) {
  run().then(success => {
    process.exit(success ? 0 : 1);
  });
}
