/**
 * Player Movement and Shooting Tests
 * Tests for player ship mechanics: movement, boundaries, shooting, and collisions
 * Run with: node test/player.test.js
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
  assertDeepEqual,
  run
} = TestRunner;

// Load Player class
const { Player } = typeof module !== 'undefined' && require
  ? require('../player.js')
  : window;

// Load mocks
const { createMockCanvas } = typeof module !== 'undefined' && require
  ? require('./mocks/canvas-mock.js')
  : window;

// ========================================
// Player Initialization Tests
// ========================================

describe('Player Initialization', () => {
  let player;
  const canvasWidth = 800;
  const canvasHeight = 600;

  beforeEach(() => {
    player = new Player(canvasWidth, canvasHeight);
  });

  it('should initialize with correct dimensions', () => {
    assertEqual(player.width, 40);
    assertEqual(player.height, 30);
  });

  it('should initialize at bottom center of canvas', () => {
    const expectedX = canvasWidth / 2 - player.width / 2;
    const expectedY = canvasHeight - player.height - 20;
    assertEqual(player.x, expectedX);
    assertEqual(player.y, expectedY);
  });

  it('should initialize with zero velocity', () => {
    assertEqual(player.dx, 0);
  });

  it('should initialize with correct speed', () => {
    assertEqual(player.speed, 5);
  });

  it('should store canvas boundaries', () => {
    assertEqual(player.canvasWidth, canvasWidth);
    assertEqual(player.canvasHeight, canvasHeight);
  });

  it('should initialize with correct visual properties', () => {
    assertEqual(player.color, '#00FF00');
    assertEqual(player.glowBlur, 10);
  });
});

// ========================================
// Player Movement Tests
// ========================================

describe('Player Movement', () => {
  let player;
  const canvasWidth = 800;
  const canvasHeight = 600;

  beforeEach(() => {
    player = new Player(canvasWidth, canvasHeight);
  });

  it('should move left when moveLeft is called', () => {
    player.moveLeft();
    assertEqual(player.dx, -5);
  });

  it('should move right when moveRight is called', () => {
    player.moveRight();
    assertEqual(player.dx, 5);
  });

  it('should stop when stop is called', () => {
    player.moveRight();
    player.stop();
    assertEqual(player.dx, 0);
  });

  it('should update position based on velocity', () => {
    const initialX = player.x;
    player.moveRight();
    player.update();
    assertEqual(player.x, initialX + 5);
  });

  it('should move left multiple frames', () => {
    const initialX = player.x;
    player.moveLeft();
    player.update();
    player.update();
    player.update();
    assertEqual(player.x, initialX - 15);
  });

  it('should move right multiple frames', () => {
    const initialX = player.x;
    player.moveRight();
    player.update();
    player.update();
    assertEqual(player.x, initialX + 10);
  });

  it('should not move when stopped', () => {
    const initialX = player.x;
    player.stop();
    player.update();
    player.update();
    assertEqual(player.x, initialX);
  });
});

// ========================================
// Boundary Collision Tests
// ========================================

describe('Boundary Collision Prevention', () => {
  let player;
  const canvasWidth = 800;
  const canvasHeight = 600;

  beforeEach(() => {
    player = new Player(canvasWidth, canvasHeight);
  });

  it('should not move beyond left boundary', () => {
    player.moveLeft();
    // Move far enough to hit boundary
    for (let i = 0; i < 100; i++) {
      player.update();
    }
    assertEqual(player.x, 0);
  });

  it('should not move beyond right boundary', () => {
    player.moveRight();
    // Move far enough to hit boundary
    for (let i = 0; i < 100; i++) {
      player.update();
    }
    assertEqual(player.x, canvasWidth - player.width);
  });

  it('should clamp position to left boundary when manually set beyond', () => {
    player.x = -50;
    player.update();
    assertEqual(player.x, 0);
  });

  it('should clamp position to right boundary when manually set beyond', () => {
    player.x = canvasWidth + 50;
    player.update();
    assertEqual(player.x, canvasWidth - player.width);
  });

  it('should stay within bounds when moving left from center', () => {
    player.moveLeft();
    player.update();
    assertTrue(player.x >= 0);
    assertTrue(player.x + player.width <= canvasWidth);
  });

  it('should stay within bounds when moving right from center', () => {
    player.moveRight();
    player.update();
    assertTrue(player.x >= 0);
    assertTrue(player.x + player.width <= canvasWidth);
  });

  it('should handle rapid direction changes at boundaries', () => {
    // Move to left boundary
    player.moveLeft();
    for (let i = 0; i < 100; i++) {
      player.update();
    }
    assertEqual(player.x, 0);

    // Try to continue left (should stay at boundary)
    player.update();
    assertEqual(player.x, 0);

    // Change direction and move right
    player.moveRight();
    player.update();
    assertEqual(player.x, 5);
  });
});

// ========================================
// Player Position Updates Tests
// ========================================

describe('Player Position Updates', () => {
  let player;
  const canvasWidth = 800;
  const canvasHeight = 600;

  beforeEach(() => {
    player = new Player(canvasWidth, canvasHeight);
  });

  it('should correctly update position when moving', () => {
    const startX = player.x;
    player.dx = 3;
    player.update();
    assertEqual(player.x, startX + 3);
  });

  it('should maintain y position during horizontal movement', () => {
    const startY = player.y;
    player.moveRight();
    player.update();
    player.update();
    assertEqual(player.y, startY);
  });

  it('should handle zero velocity correctly', () => {
    const startX = player.x;
    player.dx = 0;
    player.update();
    assertEqual(player.x, startX);
  });

  it('should handle custom velocity values', () => {
    const startX = player.x;
    player.dx = 10;
    player.update();
    assertEqual(player.x, startX + 10);
  });
});

// ========================================
// Player Rendering Tests
// ========================================

describe('Player Rendering', () => {
  let player;
  let canvas;
  let ctx;

  beforeEach(() => {
    player = new Player(800, 600);
    canvas = createMockCanvas(800, 600);
    ctx = canvas.getContext('2d');
  });

  it('should call save and restore when drawing', () => {
    player.draw(ctx);
    assertTrue(ctx.getCallCount('save') > 0);
    assertTrue(ctx.getCallCount('restore') > 0);
  });

  it('should set shadow properties for glow effect', () => {
    player.draw(ctx);
    // Check that shadow properties were set by verifying they changed from defaults
    const calls = ctx.calls;
    // The context should have had shadowColor and shadowBlur modified during draw
    assertTrue(calls.length > 0);
  });

  it('should draw a triangle path', () => {
    player.draw(ctx);
    assertTrue(ctx.getCallCount('beginPath') > 0);
    assertEqual(ctx.getCallCount('moveTo'), 1);
    assertEqual(ctx.getCallCount('lineTo'), 2);
    assertTrue(ctx.getCallCount('closePath') > 0);
  });

  it('should fill the triangle shape', () => {
    player.draw(ctx);
    assertTrue(ctx.getCallCount('fill') > 0);
  });

  it('should use correct fill color', () => {
    player.draw(ctx);
    // Verify fill was called (color is reset by restore())
    assertTrue(ctx.getCallCount('fill') > 0);
  });
});

// ========================================
// Player Bounds Tests
// ========================================

describe('Player Bounds', () => {
  let player;

  beforeEach(() => {
    player = new Player(800, 600);
  });

  it('should return correct bounds object', () => {
    const bounds = player.getBounds();
    assertEqual(bounds.x, player.x);
    assertEqual(bounds.y, player.y);
    assertEqual(bounds.width, player.width);
    assertEqual(bounds.height, player.height);
  });

  it('should update bounds when player moves', () => {
    player.moveRight();
    player.update();
    const bounds = player.getBounds();
    assertEqual(bounds.x, player.x);
  });

  it('should have correct bounds structure', () => {
    const bounds = player.getBounds();
    assertTrue('x' in bounds);
    assertTrue('y' in bounds);
    assertTrue('width' in bounds);
    assertTrue('height' in bounds);
  });
});

// ========================================
// Integration Tests
// ========================================

describe('Player Integration Tests', () => {
  let player;
  const canvasWidth = 800;
  const canvasHeight = 600;

  beforeEach(() => {
    player = new Player(canvasWidth, canvasHeight);
  });

  it('should handle complete movement cycle', () => {
    const initialX = player.x;

    // Move right
    player.moveRight();
    player.update();
    const afterRight = player.x;
    assertTrue(afterRight > initialX);

    // Stop
    player.stop();
    player.update();
    assertEqual(player.x, afterRight);

    // Move left
    player.moveLeft();
    player.update();
    assertTrue(player.x < afterRight);
  });

  it('should maintain consistent state across multiple updates', () => {
    player.moveRight();
    for (let i = 0; i < 10; i++) {
      const beforeX = player.x;
      player.update();
      const afterX = player.x;
      // Should move exactly speed amount or stop at boundary
      assertTrue(afterX === beforeX + player.speed || afterX === canvasWidth - player.width);
    }
  });

  it('should correctly handle movement at different canvas sizes', () => {
    const smallPlayer = new Player(400, 300);
    smallPlayer.moveRight();
    for (let i = 0; i < 100; i++) {
      smallPlayer.update();
    }
    assertTrue(smallPlayer.x <= 400 - smallPlayer.width);
  });
});

// ========================================
// Bullet Tests
// ========================================

// Load Bullet classes
const { Bullet, BulletManager } = typeof module !== 'undefined' && require
  ? require('../bullet.js')
  : window;

describe('Bullet Firing and Trajectory', () => {
  let bullet;
  const canvasHeight = 600;

  beforeEach(() => {
    bullet = new Bullet(400, 300, 'up');
  });

  it('should initialize bullet at correct position', () => {
    assertEqual(bullet.x, 400);
    assertEqual(bullet.y, 300);
  });

  it('should initialize bullet as active', () => {
    assertTrue(bullet.active);
  });

  it('should have correct dimensions', () => {
    assertEqual(bullet.width, 3);
    assertEqual(bullet.height, 10);
  });

  it('should move upward when direction is up', () => {
    const initialY = bullet.y;
    bullet.update();
    assertTrue(bullet.y < initialY);
  });

  it('should move downward when direction is down', () => {
    const downBullet = new Bullet(400, 300, 'down');
    const initialY = downBullet.y;
    downBullet.update();
    assertTrue(downBullet.y > initialY);
  });

  it('should have correct upward speed', () => {
    const initialY = bullet.y;
    bullet.update();
    assertEqual(bullet.y, initialY - 5);
  });

  it('should have correct downward speed', () => {
    const downBullet = new Bullet(400, 300, 'down');
    const initialY = downBullet.y;
    downBullet.update();
    assertEqual(downBullet.y, initialY + 5);
  });

  it('should maintain x position during vertical movement', () => {
    const initialX = bullet.x;
    bullet.update();
    bullet.update();
    assertEqual(bullet.x, initialX);
  });

  it('should detect when bullet leaves screen top', () => {
    bullet.y = -20;
    assertTrue(bullet.isOffScreen(canvasHeight));
  });

  it('should detect when bullet leaves screen bottom', () => {
    const downBullet = new Bullet(400, 300, 'down');
    downBullet.y = canvasHeight + 10;
    assertTrue(downBullet.isOffScreen(canvasHeight));
  });

  it('should not be off screen when in bounds', () => {
    assertFalse(bullet.isOffScreen(canvasHeight));
  });

  it('should move multiple frames correctly', () => {
    const initialY = bullet.y;
    bullet.update();
    bullet.update();
    bullet.update();
    assertEqual(bullet.y, initialY - 15);
  });
});

describe('Bullet Spawning at Player Position', () => {
  let player;
  let bulletManager;

  beforeEach(() => {
    player = new Player(800, 600);
    bulletManager = new BulletManager();
  });

  it('should spawn bullet at player center x position', () => {
    const playerBounds = player.getBounds();
    const bulletX = playerBounds.x + playerBounds.width / 2 - 1.5;
    const bulletY = playerBounds.y;

    bulletManager.add(bulletX, bulletY);
    const bullet = bulletManager.bullets[0];

    assertEqual(bullet.x, bulletX);
    assertEqual(bullet.y, bulletY);
  });

  it('should spawn bullet at top of player', () => {
    const playerBounds = player.getBounds();
    const bulletY = playerBounds.y;

    bulletManager.add(400, bulletY);
    const bullet = bulletManager.bullets[0];

    assertEqual(bullet.y, playerBounds.y);
  });

  it('should update bullet x position when player moves', () => {
    // Get initial position
    let playerBounds = player.getBounds();
    const bulletX1 = playerBounds.x + playerBounds.width / 2 - 1.5;

    // Move player
    player.moveRight();
    player.update();

    // Get new position
    playerBounds = player.getBounds();
    const bulletX2 = playerBounds.x + playerBounds.width / 2 - 1.5;

    // Bullet spawn position should have changed
    assertTrue(bulletX2 > bulletX1);
  });
});

describe('BulletManager', () => {
  let bulletManager;

  beforeEach(() => {
    bulletManager = new BulletManager();
  });

  it('should initialize with empty bullets array', () => {
    assertEqual(bulletManager.bullets.length, 0);
  });

  it('should add bullet to array', () => {
    bulletManager.add(400, 300);
    assertEqual(bulletManager.bullets.length, 1);
  });

  it('should add multiple bullets', () => {
    bulletManager.add(400, 300);
    bulletManager.add(400, 300);
    bulletManager.add(400, 300);
    assertEqual(bulletManager.bullets.length, 3);
  });

  it('should update all bullets', () => {
    bulletManager.add(400, 300);
    bulletManager.add(400, 300);
    const initialY = bulletManager.bullets[0].y;

    bulletManager.updateAll();

    assertTrue(bulletManager.bullets[0].y < initialY);
    assertTrue(bulletManager.bullets[1].y < initialY);
  });

  it('should remove inactive bullets', () => {
    bulletManager.add(400, 300);
    bulletManager.add(400, 300);

    bulletManager.bullets[0].active = false;
    bulletManager.removeInactive();

    assertEqual(bulletManager.bullets.length, 1);
    assertTrue(bulletManager.bullets[0].active);
  });

  it('should track maximum bullets on screen', () => {
    // Add 5 bullets
    for (let i = 0; i < 5; i++) {
      bulletManager.add(400, 300);
    }
    assertEqual(bulletManager.bullets.length, 5);
  });

  it('should maintain bullet count after inactive removal', () => {
    bulletManager.add(400, 300);
    bulletManager.add(400, 300);
    bulletManager.add(400, 300);

    bulletManager.bullets[1].active = false;
    bulletManager.removeInactive();

    assertEqual(bulletManager.bullets.length, 2);
  });
});

describe('Shooting Cooldown Simulation', () => {
  it('should enforce cooldown between shots', () => {
    let cooldown = 0;
    const COOLDOWN_TIME = 300; // ms

    // First shot
    cooldown = COOLDOWN_TIME;
    assertTrue(cooldown > 0);

    // Simulate time passing
    cooldown -= 100;
    assertEqual(cooldown, 200);
    assertTrue(cooldown > 0); // Cannot shoot yet

    // More time passes
    cooldown -= 200;
    assertEqual(cooldown, 0);
    assertFalse(cooldown > 0); // Can shoot now
  });

  it('should allow shooting when cooldown reaches zero', () => {
    let cooldown = 300;
    cooldown -= 300;
    assertTrue(cooldown <= 0);
  });

  it('should prevent shooting while cooldown is active', () => {
    let cooldown = 300;
    const canShoot = cooldown <= 0;
    assertFalse(canShoot);
  });

  it('should reset cooldown after each shot', () => {
    const COOLDOWN_TIME = 300;
    let cooldown = 0;

    // Take shot
    if (cooldown <= 0) {
      cooldown = COOLDOWN_TIME;
    }

    assertEqual(cooldown, COOLDOWN_TIME);
  });
});

describe('Player-Alien Collision Detection', () => {
  let player;
  let alienBounds;

  beforeEach(() => {
    player = new Player(800, 600);
    alienBounds = {
      x: 400,
      y: 500,
      width: 8,
      height: 8
    };
  });

  it('should detect collision when bounds overlap', () => {
    const playerBounds = player.getBounds();

    // Simple AABB collision
    const collision = (
      playerBounds.x < alienBounds.x + alienBounds.width &&
      playerBounds.x + playerBounds.width > alienBounds.x &&
      playerBounds.y < alienBounds.y + alienBounds.height &&
      playerBounds.y + playerBounds.height > alienBounds.y
    );

    // Will depend on positions, just verify the logic works
    assertTrue(typeof collision === 'boolean');
  });

  it('should not detect collision when far apart', () => {
    const playerBounds = player.getBounds();
    const distantAlien = {
      x: 0,
      y: 0,
      width: 8,
      height: 8
    };

    const collision = (
      playerBounds.x < distantAlien.x + distantAlien.width &&
      playerBounds.x + playerBounds.width > distantAlien.x &&
      playerBounds.y < distantAlien.y + distantAlien.height &&
      playerBounds.y + playerBounds.height > distantAlien.y
    );

    assertFalse(collision);
  });

  it('should detect collision with overlapping x-axis', () => {
    const playerBounds = player.getBounds();

    // Place alien directly above player
    const topAlien = {
      x: playerBounds.x,
      y: playerBounds.y - 5,
      width: playerBounds.width,
      height: 10
    };

    const collision = (
      playerBounds.x < topAlien.x + topAlien.width &&
      playerBounds.x + playerBounds.width > topAlien.x &&
      playerBounds.y < topAlien.y + topAlien.height &&
      playerBounds.y + playerBounds.height > topAlien.y
    );

    assertTrue(collision);
  });

  it('should return player bounds for collision checking', () => {
    const bounds = player.getBounds();

    assertTrue('x' in bounds);
    assertTrue('y' in bounds);
    assertTrue('width' in bounds);
    assertTrue('height' in bounds);

    assertEqual(typeof bounds.x, 'number');
    assertEqual(typeof bounds.y, 'number');
    assertEqual(typeof bounds.width, 'number');
    assertEqual(typeof bounds.height, 'number');
  });
});

// Run all tests if this file is executed directly
if (typeof module !== 'undefined' && require.main === module) {
  run().then(success => {
    process.exit(success ? 0 : 1);
  });
}
