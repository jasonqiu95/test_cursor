// Import ES6 modules
import { Player } from './player.js';
import { AlienGrid } from './alien.js';
import { BulletManager } from './bullet.js';
import { HUD } from './hud.js';
import { InputHandler } from './input.js';

/**
 * Sound Manager class for retro arcade sound effects using Web Audio API
 */
class SoundManager {
  constructor() {
    this.audioContext = null;
    this.enabled = true;
    this.alienMoveInterval = null;
    this.alienMoveSpeed = 1000; // milliseconds between beeps
    this.minAlienMoveSpeed = 200; // fastest speed

    // Initialize audio context on user interaction
    this.initAudioContext();
  }

  /**
   * Initialize Web Audio API context
   */
  initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
      this.enabled = false;
    }
  }

  /**
   * Resume audio context if it's suspended (browser autoplay policy)
   */
  resumeContext() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  /**
   * Create a simple oscillator-based tone
   * @param {number} frequency - Frequency in Hz
   * @param {number} duration - Duration in seconds
   * @param {string} type - Oscillator type (sine, square, sawtooth, triangle)
   * @param {number} volume - Volume (0-1)
   */
  playTone(frequency, duration, type = 'square', volume = 0.3) {
    if (!this.enabled || !this.audioContext) return;

    this.resumeContext();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gainNode.gain.value = volume;
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  /**
   * Play shoot sound - classic pew pew
   */
  playShoot() {
    if (!this.enabled || !this.audioContext) return;

    this.resumeContext();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'square';
    oscillator.frequency.value = 200;

    // Frequency sweep down
    oscillator.frequency.exponentialRampToValueAtTime(
      50,
      this.audioContext.currentTime + 0.1
    );

    gainNode.gain.value = 0.3;
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.1
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  /**
   * Play alien destroyed sound - explosion-like
   */
  playAlienDestroyed() {
    if (!this.enabled || !this.audioContext) return;

    this.resumeContext();

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = 'sawtooth';
    oscillator.frequency.value = 100;

    // Frequency sweep down for explosion effect
    oscillator.frequency.exponentialRampToValueAtTime(
      30,
      this.audioContext.currentTime + 0.2
    );

    gainNode.gain.value = 0.4;
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + 0.2
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  /**
   * Play single alien move beep
   */
  playAlienMove() {
    this.playTone(150, 0.1, 'square', 0.2);
  }

  /**
   * Start periodic alien movement sound
   * @param {number} speed - Speed factor (0-1, higher is faster)
   */
  startAlienMovement(speed = 0) {
    this.stopAlienMovement();

    // Calculate interval based on speed (faster as aliens get closer)
    const speedRange = this.alienMoveSpeed - this.minAlienMoveSpeed;
    this.currentAlienSpeed = this.alienMoveSpeed - (speedRange * speed);

    this.alienMoveInterval = setInterval(() => {
      this.playAlienMove();
    }, this.currentAlienSpeed);
  }

  /**
   * Stop alien movement sound
   */
  stopAlienMovement() {
    if (this.alienMoveInterval) {
      clearInterval(this.alienMoveInterval);
      this.alienMoveInterval = null;
    }
  }

  /**
   * Update alien movement speed based on game state
   * @param {number} speed - Speed factor (0-1)
   */
  updateAlienMovementSpeed(speed = 0) {
    if (this.alienMoveInterval) {
      this.startAlienMovement(speed);
    }
  }

  /**
   * Play player hit sound
   */
  playPlayerHit() {
    if (!this.enabled || !this.audioContext) return;

    this.resumeContext();

    // Create multiple oscillators for a harsher sound
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        oscillator.type = 'sawtooth';
        oscillator.frequency.value = 80 + (i * 20);

        gainNode.gain.value = 0.3;
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          this.audioContext.currentTime + 0.3
        );

        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + 0.3);
      }, i * 50);
    }
  }

  /**
   * Play game over sound - descending tones
   */
  playGameOver() {
    if (!this.enabled || !this.audioContext) return;

    this.resumeContext();
    this.stopAlienMovement();

    const frequencies = [300, 250, 200, 150];
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, 0.3, 'square', 0.3);
      }, index * 300);
    });
  }

  /**
   * Play victory sound - ascending tones
   */
  playVictory() {
    if (!this.enabled || !this.audioContext) return;

    this.resumeContext();
    this.stopAlienMovement();

    const frequencies = [200, 250, 300, 400, 500];
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, 0.2, 'sine', 0.25);
      }, index * 150);
    });
  }

  /**
   * Clean up resources
   */
  cleanup() {
    this.stopAlienMovement();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}

/**
 * Particle class for visual effects
 */
class Particle {
  constructor(x, y, color = '#ff0000') {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4;
    this.life = 1.0; // 1.0 = fully alive, 0.0 = dead
    this.decay = 0.01 + Math.random() * 0.02; // Random decay rate
    this.size = 2 + Math.random() * 3;
    this.color = color;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1; // Gravity effect
    this.life -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
    ctx.restore();
  }

  isDead() {
    return this.life <= 0;
  }
}

/**
 * ParticleManager class for managing particle effects
 */
class ParticleManager {
  constructor() {
    this.particles = [];
  }

  /**
   * Create explosion effect at a position
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {string} color - Particle color
   * @param {number} count - Number of particles
   */
  createExplosion(x, y, color = '#ff0000', count = 15) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, color));
    }
  }

  /**
   * Update all particles
   */
  update() {
    for (let particle of this.particles) {
      particle.update();
    }

    // Remove dead particles
    this.particles = this.particles.filter(p => !p.isDead());
  }

  /**
   * Draw all particles
   */
  draw(ctx) {
    for (let particle of this.particles) {
      particle.draw(ctx);
    }
  }

  /**
   * Clear all particles
   */
  clear() {
    this.particles = [];
  }
}

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
let soundManager;
let particleManager;

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
    soundManager = new SoundManager();
    particleManager = new ParticleManager();

    // Initialize input handler
    inputHandler.init();

    // Set up game state event listeners
    gameState.on('stateChange', (data) => {
        console.log('Game state changed:', data);

        // Play sounds based on state changes
        if (data.to === GameStates.GAME_OVER) {
            soundManager.playGameOver();
        } else if (data.to === GameStates.WIN) {
            soundManager.playVictory();
        } else if (data.to === GameStates.PLAYING) {
            soundManager.startAlienMovement(0);
        } else if (data.from === GameStates.PLAYING) {
            soundManager.stopAlienMovement();
        }
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
            soundManager.playShoot();
        }

        // Update game objects
        player.update();
        alienGrid.update(deltaTime);
        bulletManager.updateAll();
        particleManager.update();

        // Aliens shoot downward bullets
        const alienShootPositions = alienGrid.shoot(deltaTime);
        if (alienShootPositions) {
            for (let pos of alienShootPositions) {
                bulletManager.add(pos.x, pos.y, 'down');
            }
        }

        // Check for bullets that are off-screen
        for (let bullet of bulletManager.bullets) {
            if (bullet.isOffScreen(canvas.height)) {
                bullet.active = false;
            }
        }

        // Remove inactive bullets
        bulletManager.removeInactive();

        // Check collisions between upward bullets and aliens
        const collision = checkBulletAlienCollisions();
        if (collision.hit) {
            gameState.addScore(collision.points);
            soundManager.playAlienDestroyed();

            // Update alien movement speed based on remaining aliens
            const remainingAliens = alienGrid.getRemainingCount();
            const totalAliens = 55; // 11 columns * 5 rows
            const speedFactor = 1 - (remainingAliens / totalAliens);
            soundManager.updateAlienMovementSpeed(speedFactor);
        }

        // Check collisions between downward bullets and player
        checkPlayerBulletCollisions();

        // Check if all aliens are destroyed (win condition)
        if (alienGrid.allDestroyed()) {
            gameState.winGame();
        }

        // Check if aliens reached the player (lose condition)
        const gridBounds = alienGrid.getGridBounds();
        const playerBounds = player.getBounds();
        if (gridBounds.bottom >= playerBounds.y) {
            soundManager.playPlayerHit();
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
        if (!bullet.active || bullet.direction === 'down') continue;

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

            // Create particle explosion at alien hit position
            particleManager.createExplosion(
                bullet.x + bullet.width / 2,
                bullet.y + bullet.height / 2,
                '#00ff00', // Green particles for alien explosions
                20
            );
        }
    }

    return { hit, points: totalPoints };
}

/**
 * Check collisions between downward bullets and player
 */
function checkPlayerBulletCollisions() {
    const playerBounds = player.getBounds();

    for (let bullet of bulletManager.bullets) {
        if (!bullet.active || bullet.direction !== 'down') continue;

        // Simple AABB collision detection
        if (bullet.x < playerBounds.x + playerBounds.width &&
            bullet.x + bullet.width > playerBounds.x &&
            bullet.y < playerBounds.y + playerBounds.height &&
            bullet.y + bullet.height > playerBounds.y) {

            // Deactivate the bullet
            bullet.active = false;

            // Player loses a life
            gameState.loseLife();

            // Play hit sound
            soundManager.playPlayerHit();

            // Create particle explosion at player hit position
            particleManager.createExplosion(
                playerBounds.x + playerBounds.width / 2,
                playerBounds.y + playerBounds.height / 2,
                '#ff0000', // Red particles for player hit
                25
            );
        }
    }
}

/**
 * Reset the game to initial state
 */
function resetGame() {
    // Reset game objects
    player = new Player(canvas.width, canvas.height);
    alienGrid.reset();
    bulletManager.bullets = [];
    particleManager.clear();
    shootCooldown = 0;

    // Stop alien movement sounds
    soundManager.stopAlienMovement();

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
        particleManager.draw(ctx);

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
