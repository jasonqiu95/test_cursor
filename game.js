// Import ES6 modules
import { Player } from './player.js';
import { AlienGrid } from './alien.js';
import { BulletManager } from './bullet.js';
import { HUD } from './hud.js';
import { InputHandler } from './input.js';

// Game state constants
const GameStates = {
  START: 'START',
  PLAYING: 'PLAYING',
  GAME_OVER: 'GAME_OVER',
  WIN: 'WIN'
};

/**
 * Core game state management class
 */
class GameState {
  constructor() {
    this.state = GameStates.START;
    this.lives = 3;
    this.score = 0;
    this.eventListeners = {};

    // Valid state transitions
    this.validTransitions = {
      [GameStates.START]: [GameStates.PLAYING],
      [GameStates.PLAYING]: [GameStates.GAME_OVER, GameStates.WIN],
      [GameStates.GAME_OVER]: [GameStates.START],
      [GameStates.WIN]: [GameStates.START]
    };
  }

  /**
   * Get current game state
   */
  getState() {
    return this.state;
  }

  /**
   * Get current lives
   */
  getLives() {
    return this.lives;
  }

  /**
   * Get current score
   */
  getScore() {
    return this.score;
  }

  /**
   * Set game state with validation and event notification
   */
  setState(newState) {
    if (!GameStates[newState]) {
      throw new Error(`Invalid game state: ${newState}`);
    }

    const currentState = this.state;

    // Validate state transition
    if (!this.isValidTransition(currentState, newState)) {
      throw new Error(
        `Invalid state transition from ${currentState} to ${newState}`
      );
    }

    this.state = newState;
    this.emit('stateChange', {
      from: currentState,
      to: newState,
      lives: this.lives,
      score: this.score
    });

    // Emit specific state event
    this.emit(newState.toLowerCase(), {
      from: currentState,
      lives: this.lives,
      score: this.score
    });
  }

  /**
   * Check if a state transition is valid
   */
  isValidTransition(fromState, toState) {
    const validStates = this.validTransitions[fromState];
    return validStates && validStates.includes(toState);
  }

  /**
   * Start the game
   */
  startGame() {
    this.setState(GameStates.PLAYING);
  }

  /**
   * End the game (game over)
   */
  endGame() {
    this.setState(GameStates.GAME_OVER);
  }

  /**
   * Win the game
   */
  winGame() {
    this.setState(GameStates.WIN);
  }

  /**
   * Reset game to start state
   */
  reset() {
    const previousState = this.state;
    this.state = GameStates.START;
    this.lives = 3;
    this.score = 0;

    this.emit('reset', {
      previousState,
      lives: this.lives,
      score: this.score
    });
  }

  /**
   * Add score
   */
  addScore(points) {
    if (typeof points !== 'number' || points < 0) {
      throw new Error('Score must be a positive number');
    }

    const previousScore = this.score;
    this.score += points;

    this.emit('scoreChange', {
      previous: previousScore,
      current: this.score,
      delta: points
    });

    return this.score;
  }

  /**
   * Set score directly
   */
  setScore(points) {
    if (typeof points !== 'number' || points < 0) {
      throw new Error('Score must be a positive number');
    }

    const previousScore = this.score;
    this.score = points;

    this.emit('scoreChange', {
      previous: previousScore,
      current: this.score,
      delta: points - previousScore
    });

    return this.score;
  }

  /**
   * Lose a life
   */
  loseLife() {
    if (this.lives <= 0) {
      return false;
    }

    this.lives--;

    this.emit('lifeChange', {
      previous: this.lives + 1,
      current: this.lives
    });

    // Auto transition to game over if no lives left
    if (this.lives <= 0 && this.state === GameStates.PLAYING) {
      this.endGame();
    }

    return this.lives > 0;
  }

  /**
   * Add a life
   */
  addLife() {
    this.lives++;

    this.emit('lifeChange', {
      previous: this.lives - 1,
      current: this.lives
    });

    return this.lives;
  }

  /**
   * Set lives directly
   */
  setLives(count) {
    if (typeof count !== 'number' || count < 0) {
      throw new Error('Lives must be a non-negative number');
    }

    const previousLives = this.lives;
    this.lives = count;

    this.emit('lifeChange', {
      previous: previousLives,
      current: this.lives
    });

    // Auto transition to game over if no lives left
    if (this.lives <= 0 && this.state === GameStates.PLAYING) {
      this.endGame();
    }

    return this.lives;
  }

  /**
   * Register event listener
   */
  on(event, callback) {
    if (typeof callback !== 'function') {
      throw new Error('Callback must be a function');
    }

    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }

    this.eventListeners[event].push(callback);

    // Return unsubscribe function
    return () => {
      this.off(event, callback);
    };
  }

  /**
   * Remove event listener
   */
  off(event, callback) {
    if (!this.eventListeners[event]) {
      return;
    }

    this.eventListeners[event] = this.eventListeners[event].filter(
      cb => cb !== callback
    );
  }

  /**
   * Emit event to all listeners
   */
  emit(event, data) {
    if (!this.eventListeners[event]) {
      return;
    }

    this.eventListeners[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in event listener for ${event}:`, error);
      }
    });
  }

  /**
   * Remove all event listeners
   */
  removeAllListeners(event) {
    if (event) {
      delete this.eventListeners[event];
    } else {
      this.eventListeners = {};
    }
  }

  /**
   * Get game state snapshot
   */
  getSnapshot() {
    return {
      state: this.state,
      lives: this.lives,
      score: this.score
    };
  }
}

// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Create game state instance
const gameState = new GameState();

// Game objects
let player;
let alienGrid;
let bulletManager;
let hud;
let inputHandler;

// Timing variables for deltaTime calculation
let lastTime = 0;
let shootCooldown = 0;
const SHOOT_COOLDOWN_TIME = 300; // milliseconds between shots

/**
 * Initialize all game objects
 */
function init() {
    console.log('Game initialized');
    console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);

    // Initialize game objects
    player = new Player(canvas.width, canvas.height);
    alienGrid = new AlienGrid(50, 50);
    bulletManager = new BulletManager();
    hud = new HUD();
    inputHandler = new InputHandler();

    // Initialize input handler
    inputHandler.init();

    // Set up game state event listeners
    gameState.on('stateChange', (data) => {
        console.log('Game state changed:', data);
    });

    // Start the game loop
    lastTime = performance.now();
    requestAnimationFrame(gameLoop);
}

/**
 * Main game loop - runs at 60fps using requestAnimationFrame
 * @param {number} currentTime - Current timestamp from requestAnimationFrame
 */
function gameLoop(currentTime) {
    // Calculate deltaTime in milliseconds
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    // Update game state
    update(deltaTime);

    // Render game
    render();

    // Continue the game loop
    requestAnimationFrame(gameLoop);
}

/**
 * Update game logic
 * @param {number} deltaTime - Time elapsed since last frame in milliseconds
 */
function update(deltaTime) {
    const currentState = gameState.getState();

    // Handle input based on game state
    if (currentState === GameStates.START) {
        // Check for space to start the game
        if (inputHandler.isShootPressed()) {
            gameState.startGame();
        }
    } else if (currentState === GameStates.PLAYING) {
        // Update shoot cooldown
        if (shootCooldown > 0) {
            shootCooldown -= deltaTime;
        }

        // Handle player movement
        if (inputHandler.isLeftPressed()) {
            player.moveLeft();
        } else if (inputHandler.isRightPressed()) {
            player.moveRight();
        } else {
            player.stop();
        }

        // Handle shooting
        if (inputHandler.isShootPressed() && shootCooldown <= 0) {
            const playerBounds = player.getBounds();
            const bulletX = playerBounds.x + playerBounds.width / 2 - 1.5;
            const bulletY = playerBounds.y;
            bulletManager.add(bulletX, bulletY);
            shootCooldown = SHOOT_COOLDOWN_TIME;
        }

        // Update game objects
        player.update();
        alienGrid.update(deltaTime);
        bulletManager.updateAll();

        // Check for bullets that are off-screen
        for (let bullet of bulletManager.bullets) {
            if (bullet.isOffScreen(canvas.height)) {
                bullet.active = false;
            }
        }

        // Remove inactive bullets
        bulletManager.removeInactive();

        // Check collisions between bullets and aliens
        const collision = checkBulletAlienCollisions();
        if (collision.hit) {
            gameState.addScore(collision.points);
        }

        // Check if all aliens are destroyed (win condition)
        if (alienGrid.allDestroyed()) {
            gameState.winGame();
        }

        // Check if aliens reached the player (lose condition)
        const gridBounds = alienGrid.getGridBounds();
        const playerBounds = player.getBounds();
        if (gridBounds.bottom >= playerBounds.y) {
            gameState.endGame();
        }
    } else if (currentState === GameStates.GAME_OVER || currentState === GameStates.WIN) {
        // Check for space to restart
        if (inputHandler.isShootPressed()) {
            resetGame();
            gameState.startGame();
        }
    }
}

/**
 * Check collisions between bullets and aliens
 * @returns {object} Collision result with hit flag and points
 */
function checkBulletAlienCollisions() {
    let totalPoints = 0;
    let hit = false;

    for (let bullet of bulletManager.bullets) {
        if (!bullet.active) continue;

        const result = alienGrid.checkCollision(
            bullet.x,
            bullet.y,
            bullet.width,
            bullet.height
        );

        if (result.hit) {
            bullet.active = false;
            totalPoints += result.points;
            hit = true;
        }
    }

    return { hit, points: totalPoints };
}

/**
 * Reset the game to initial state
 */
function resetGame() {
    // Reset game objects
    player = new Player(canvas.width, canvas.height);
    alienGrid.reset();
    bulletManager.bullets = [];
    shootCooldown = 0;

    // Reset game state
    gameState.reset();
}

/**
 * Render the game
 */
function render() {
    // Clear canvas with black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const currentState = gameState.getState();

    if (currentState === GameStates.START) {
        // Draw start screen
        hud.drawGameState(ctx, canvas.width, canvas.height, 'START');
    } else if (currentState === GameStates.PLAYING) {
        // Draw game objects
        player.draw(ctx);
        alienGrid.draw(ctx);
        bulletManager.drawAll(ctx);

        // Draw HUD
        hud.drawScore(ctx, gameState.getScore(), 20, 30);
        hud.drawLives(ctx, gameState.getLives(), canvas.width - 120, 30);
    } else if (currentState === GameStates.GAME_OVER) {
        // Draw game over screen with final score
        hud.drawGameState(ctx, canvas.width, canvas.height, 'GAME_OVER');
        hud.drawScore(ctx, gameState.getScore(), canvas.width / 2 - 50, canvas.height / 2 - 80);
    } else if (currentState === GameStates.WIN) {
        // Draw win screen with final score
        hud.drawGameState(ctx, canvas.width, canvas.height, 'WIN');
        hud.drawScore(ctx, gameState.getScore(), canvas.width / 2 - 50, canvas.height / 2 - 80);
    }
}

// Start the game when page loads
init();
