/**
 * Game State Factory
 * Factory functions for creating game state test scenarios
 */

/**
 * Game state constants
 */
const GameStates = {
  START: 'START',
  PLAYING: 'PLAYING',
  GAME_OVER: 'GAME_OVER',
  WIN: 'WIN'
};

/**
 * Create a fresh game state (initial state)
 */
function createInitialGameState() {
  return {
    state: GameStates.START,
    lives: 3,
    score: 0,
    combo: 0,
    wave: 1,
    highScore: 0
  };
}

/**
 * Create a game state in playing mode
 */
function createPlayingGameState(overrides = {}) {
  return {
    state: GameStates.PLAYING,
    lives: 3,
    score: 0,
    combo: 0,
    wave: 1,
    highScore: 0,
    ...overrides
  };
}

/**
 * Create a game state with low lives (critical situation)
 */
function createLowLivesGameState(overrides = {}) {
  return {
    state: GameStates.PLAYING,
    lives: 1,
    score: 5000,
    combo: 0,
    wave: 3,
    highScore: 10000,
    ...overrides
  };
}

/**
 * Create a game state with high combo
 */
function createHighComboGameState(overrides = {}) {
  return {
    state: GameStates.PLAYING,
    lives: 3,
    score: 3000,
    combo: 15,
    wave: 2,
    highScore: 8000,
    ...overrides
  };
}

/**
 * Create a game state at advanced wave
 */
function createAdvancedWaveGameState(overrides = {}) {
  return {
    state: GameStates.PLAYING,
    lives: 2,
    score: 12000,
    combo: 5,
    wave: 5,
    highScore: 15000,
    ...overrides
  };
}

/**
 * Create a game over state
 */
function createGameOverState(overrides = {}) {
  return {
    state: GameStates.GAME_OVER,
    lives: 0,
    score: 8500,
    combo: 0,
    wave: 4,
    highScore: 10000,
    ...overrides
  };
}

/**
 * Create a win state
 */
function createWinState(overrides = {}) {
  return {
    state: GameStates.WIN,
    lives: 2,
    score: 20000,
    combo: 0,
    wave: 10,
    highScore: 15000,
    ...overrides
  };
}

/**
 * Create a new high score scenario
 */
function createNewHighScoreState(overrides = {}) {
  return {
    state: GameStates.PLAYING,
    lives: 3,
    score: 12000,
    combo: 10,
    wave: 4,
    highScore: 10000,
    ...overrides
  };
}

/**
 * Create a player entity for testing
 */
function createMockPlayer(overrides = {}) {
  return {
    x: 400,
    y: 550,
    width: 40,
    height: 30,
    speed: 5,
    dx: 0,
    canvasWidth: 800,
    canvasHeight: 600,
    color: '#00FF00',
    ...overrides,

    update() {
      this.x += this.dx;
      if (this.x < 0) this.x = 0;
      if (this.x + this.width > this.canvasWidth) {
        this.x = this.canvasWidth - this.width;
      }
    },

    getBounds() {
      return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      };
    },

    moveLeft() {
      this.dx = -this.speed;
    },

    moveRight() {
      this.dx = this.speed;
    },

    stop() {
      this.dx = 0;
    }
  };
}

/**
 * Create a bullet entity for testing
 */
function createMockBullet(x, y, direction = 'up', overrides = {}) {
  return {
    x,
    y,
    width: 3,
    height: 10,
    speed: 7,
    direction,
    active: true,
    color: direction === 'up' ? '#00FF00' : '#FF0000',
    ...overrides,

    update() {
      if (this.direction === 'up') {
        this.y -= this.speed;
      } else {
        this.y += this.speed;
      }
    },

    isOffScreen(canvasHeight) {
      return this.y + this.height < 0 || this.y > canvasHeight;
    },

    getBounds() {
      return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      };
    }
  };
}

/**
 * Create an alien entity for testing
 */
function createMockAlien(x, y, type = 1, overrides = {}) {
  const alienTypes = {
    1: { points: 10, color: '#FF0000' },
    2: { points: 20, color: '#FFA500' },
    3: { points: 30, color: '#FFFF00' }
  };

  const alienData = alienTypes[type] || alienTypes[1];

  return {
    x,
    y,
    width: 30,
    height: 20,
    type,
    points: alienData.points,
    color: alienData.color,
    active: true,
    ...overrides,

    getBounds() {
      return {
        x: this.x,
        y: this.y,
        width: this.width,
        height: this.height
      };
    },

    checkCollision(bulletX, bulletY, bulletWidth, bulletHeight) {
      return (
        this.active &&
        bulletX < this.x + this.width &&
        bulletX + bulletWidth > this.x &&
        bulletY < this.y + this.height &&
        bulletY + bulletHeight > this.y
      );
    },

    destroy() {
      this.active = false;
      return this.points;
    }
  };
}

/**
 * Create an alien grid for testing
 */
function createMockAlienGrid(overrides = {}) {
  const config = {
    rows: 5,
    columns: 11,
    startX: 50,
    startY: 50,
    spacingX: 50,
    spacingY: 40,
    ...overrides
  };

  const aliens = [];
  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.columns; col++) {
      const type = row < 1 ? 3 : row < 3 ? 2 : 1;
      const x = config.startX + col * config.spacingX;
      const y = config.startY + row * config.spacingY;
      aliens.push(createMockAlien(x, y, type));
    }
  }

  return {
    aliens,
    direction: 1,
    moveDownAmount: 20,

    getRemainingCount() {
      return this.aliens.filter(a => a.active).length;
    },

    allDestroyed() {
      return this.getRemainingCount() === 0;
    },

    checkCollision(bulletX, bulletY, bulletWidth, bulletHeight) {
      for (const alien of this.aliens) {
        if (alien.checkCollision(bulletX, bulletY, bulletWidth, bulletHeight)) {
          const points = alien.destroy();
          return { hit: true, points };
        }
      }
      return { hit: false, points: 0 };
    },

    getGridBounds() {
      const activeAliens = this.aliens.filter(a => a.active);
      if (activeAliens.length === 0) {
        return { left: 0, right: 0, top: 0, bottom: 0 };
      }

      let minX = Infinity, maxX = -Infinity;
      let minY = Infinity, maxY = -Infinity;

      for (const alien of activeAliens) {
        minX = Math.min(minX, alien.x);
        maxX = Math.max(maxX, alien.x + alien.width);
        minY = Math.min(minY, alien.y);
        maxY = Math.max(maxY, alien.y + alien.height);
      }

      return {
        left: minX,
        right: maxX,
        top: minY,
        bottom: maxY
      };
    }
  };
}

/**
 * Create a partial alien grid (some aliens destroyed)
 */
function createPartialAlienGrid(destroyedCount = 20) {
  const grid = createMockAlienGrid();

  // Destroy specified number of random aliens
  let destroyed = 0;
  while (destroyed < destroyedCount && destroyed < grid.aliens.length) {
    const randomIndex = Math.floor(Math.random() * grid.aliens.length);
    if (grid.aliens[randomIndex].active) {
      grid.aliens[randomIndex].active = false;
      destroyed++;
    }
  }

  return grid;
}

/**
 * Create a mystery ship for testing
 */
function createMockMysteryShip(overrides = {}) {
  return {
    x: 0,
    y: 40,
    width: 30,
    height: 15,
    speed: 2,
    direction: 1,
    active: false,
    bonusPoints: [50, 100, 150, 200, 250, 300],
    ...overrides,

    spawn(fromLeft = true) {
      this.direction = fromLeft ? 1 : -1;
      this.x = fromLeft ? -this.width : 800;
      this.active = true;
    },

    isActive() {
      return this.active;
    },

    checkCollision(bulletX, bulletY, bulletWidth, bulletHeight) {
      return (
        this.active &&
        bulletX < this.x + this.width &&
        bulletX + bulletWidth > this.x &&
        bulletY < this.y + this.height &&
        bulletY + bulletHeight > this.y
      );
    },

    destroy() {
      this.active = false;
      return this.bonusPoints[Math.floor(Math.random() * this.bonusPoints.length)];
    }
  };
}

/**
 * Create a complete game scenario for testing
 */
function createGameScenario(scenario = 'initial') {
  const scenarios = {
    initial: {
      gameState: createInitialGameState(),
      player: createMockPlayer(),
      aliens: createMockAlienGrid(),
      bullets: [],
      mysteryShip: createMockMysteryShip()
    },

    midGame: {
      gameState: createPlayingGameState({ score: 2500, combo: 5, wave: 2 }),
      player: createMockPlayer({ x: 300 }),
      aliens: createPartialAlienGrid(15),
      bullets: [
        createMockBullet(300, 400, 'up'),
        createMockBullet(500, 300, 'down')
      ],
      mysteryShip: createMockMysteryShip()
    },

    critical: {
      gameState: createLowLivesGameState(),
      player: createMockPlayer({ x: 200 }),
      aliens: createPartialAlienGrid(5),
      bullets: [createMockBullet(250, 350, 'down')],
      mysteryShip: createMockMysteryShip()
    },

    nearVictory: {
      gameState: createAdvancedWaveGameState(),
      player: createMockPlayer({ x: 450 }),
      aliens: createPartialAlienGrid(50), // Only 5 aliens left
      bullets: [createMockBullet(450, 200, 'up')],
      mysteryShip: createMockMysteryShip({ active: true, x: 100 })
    },

    gameOver: {
      gameState: createGameOverState(),
      player: createMockPlayer(),
      aliens: createMockAlienGrid(),
      bullets: [],
      mysteryShip: createMockMysteryShip()
    }
  };

  return scenarios[scenario] || scenarios.initial;
}

// Export for both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    GameStates,
    createInitialGameState,
    createPlayingGameState,
    createLowLivesGameState,
    createHighComboGameState,
    createAdvancedWaveGameState,
    createGameOverState,
    createWinState,
    createNewHighScoreState,
    createMockPlayer,
    createMockBullet,
    createMockAlien,
    createMockAlienGrid,
    createPartialAlienGrid,
    createMockMysteryShip,
    createGameScenario
  };
}

if (typeof window !== 'undefined') {
  window.GameStateFactory = {
    GameStates,
    createInitialGameState,
    createPlayingGameState,
    createLowLivesGameState,
    createHighComboGameState,
    createAdvancedWaveGameState,
    createGameOverState,
    createWinState,
    createNewHighScoreState,
    createMockPlayer,
    createMockBullet,
    createMockAlien,
    createMockAlienGrid,
    createPartialAlienGrid,
    createMockMysteryShip,
    createGameScenario
  };
}
