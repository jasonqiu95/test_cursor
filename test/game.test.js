/**
 * Game component tests
 * Demonstrates testing game logic components
 * Run with: node test/game.test.js
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

// Mock game objects for testing
class MockPlayer {
  constructor() {
    this.x = 400;
    this.y = 500;
    this.health = 100;
    this.shield = 0;
  }

  takeDamage(amount) {
    if (this.shield > 0) {
      this.shield -= amount;
      if (this.shield < 0) {
        this.health += this.shield;
        this.shield = 0;
      }
    } else {
      this.health -= amount;
    }
    return this.health > 0;
  }

  move(dx) {
    this.x += dx;
    if (this.x < 0) this.x = 0;
    if (this.x > 800) this.x = 800;
  }
}

class MockBullet {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.active = true;
  }

  update() {
    this.y -= this.speed;
    if (this.y < 0) {
      this.active = false;
    }
  }

  collidesWith(enemy) {
    const distance = Math.sqrt(
      Math.pow(this.x - enemy.x, 2) + Math.pow(this.y - enemy.y, 2)
    );
    return distance < 20;
  }
}

class MockEnemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.health = 10;
    this.active = true;
  }

  takeDamage(amount) {
    this.health -= amount;
    if (this.health <= 0) {
      this.active = false;
      return true; // enemy destroyed
    }
    return false;
  }
}

// ========================================
// Player Tests
// ========================================

describe('Player Class', () => {
  let player;

  beforeEach(() => {
    player = new MockPlayer();
  });

  it('should initialize with correct position', () => {
    assertEqual(player.x, 400);
    assertEqual(player.y, 500);
  });

  it('should initialize with full health', () => {
    assertEqual(player.health, 100);
  });

  it('should move within bounds', () => {
    player.move(50);
    assertEqual(player.x, 450);

    player.move(-50);
    assertEqual(player.x, 400);
  });

  it('should not move beyond left boundary', () => {
    player.move(-500);
    assertEqual(player.x, 0);
  });

  it('should not move beyond right boundary', () => {
    player.move(500);
    assertEqual(player.x, 800);
  });

  it('should take damage correctly', () => {
    const survived = player.takeDamage(30);
    assertEqual(player.health, 70);
    assertTrue(survived);
  });

  it('should die when health reaches zero', () => {
    const survived = player.takeDamage(100);
    assertEqual(player.health, 0);
    assertFalse(survived);
  });

  it('should absorb damage with shield first', () => {
    player.shield = 50;
    player.takeDamage(30);
    assertEqual(player.shield, 20);
    assertEqual(player.health, 100);
  });

  it('should overflow shield damage to health', () => {
    player.shield = 20;
    player.takeDamage(50);
    assertEqual(player.shield, 0);
    assertEqual(player.health, 70);
  });
});

// ========================================
// Bullet Tests
// ========================================

describe('Bullet Class', () => {
  let bullet;

  beforeEach(() => {
    bullet = new MockBullet(400, 300, 5);
  });

  it('should initialize at correct position', () => {
    assertEqual(bullet.x, 400);
    assertEqual(bullet.y, 300);
  });

  it('should be active when created', () => {
    assertTrue(bullet.active);
  });

  it('should move upward when updated', () => {
    bullet.update();
    assertEqual(bullet.y, 295);
  });

  it('should deactivate when leaving screen', () => {
    bullet.y = 3;
    bullet.update();
    assertFalse(bullet.active);
  });

  it('should detect collision with enemy', () => {
    const enemy = new MockEnemy(405, 305);
    const collision = bullet.collidesWith(enemy);
    assertTrue(collision);
  });

  it('should not collide with distant enemy', () => {
    const enemy = new MockEnemy(500, 400);
    const collision = bullet.collidesWith(enemy);
    assertFalse(collision);
  });
});

// ========================================
// Enemy Tests
// ========================================

describe('Enemy Class', () => {
  let enemy;

  beforeEach(() => {
    enemy = new MockEnemy(300, 100);
  });

  it('should initialize at correct position', () => {
    assertEqual(enemy.x, 300);
    assertEqual(enemy.y, 100);
  });

  it('should start with health', () => {
    assertEqual(enemy.health, 10);
  });

  it('should be active when created', () => {
    assertTrue(enemy.active);
  });

  it('should take damage without dying', () => {
    const destroyed = enemy.takeDamage(5);
    assertEqual(enemy.health, 5);
    assertTrue(enemy.active);
    assertFalse(destroyed);
  });

  it('should be destroyed when health reaches zero', () => {
    const destroyed = enemy.takeDamage(10);
    assertEqual(enemy.health, 0);
    assertFalse(enemy.active);
    assertTrue(destroyed);
  });

  it('should be destroyed with overkill damage', () => {
    const destroyed = enemy.takeDamage(20);
    assertEqual(enemy.health, -10);
    assertFalse(enemy.active);
    assertTrue(destroyed);
  });
});

// ========================================
// Game Logic Tests
// ========================================

describe('Collision Detection', () => {
  it('should detect bullet-enemy collision', () => {
    const bullet = new MockBullet(300, 100, 5);
    const enemy = new MockEnemy(305, 105);

    assertTrue(bullet.collidesWith(enemy));
  });

  it('should handle collision damage', () => {
    const bullet = new MockBullet(300, 100, 5);
    const enemy = new MockEnemy(305, 105);

    if (bullet.collidesWith(enemy)) {
      enemy.takeDamage(5);
      bullet.active = false;
    }

    assertEqual(enemy.health, 5);
    assertFalse(bullet.active);
  });
});

describe('Score System', () => {
  it('should calculate score correctly', () => {
    let score = 0;
    const pointsPerEnemy = 100;

    // Destroy 5 enemies
    score += pointsPerEnemy * 5;

    assertEqual(score, 500);
  });

  it('should apply combo multiplier', () => {
    let score = 0;
    let combo = 3;
    const basePoints = 100;

    score += basePoints * combo;

    assertEqual(score, 300);
  });
});

// Run all tests if this file is executed directly
if (typeof module !== 'undefined' && require.main === module) {
  run().then(success => {
    process.exit(success ? 0 : 1);
  });
}
