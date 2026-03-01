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
    this.combo = 0;
    this.wave = 1;
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
   * Get current combo count
   */
  getCombo() {
    return this.combo;
  }

  /**
   * Get current multiplier based on combo
   * Every 5 consecutive hits increases multiplier by 1x
   */
  getMultiplier() {
    return 1 + Math.floor(this.combo / 5);
  }

  /**
   * Increase combo count
   */
  increaseCombo() {
    const previousCombo = this.combo;
    this.combo++;

    const previousMultiplier = 1 + Math.floor(previousCombo / 5);
    const currentMultiplier = this.getMultiplier();

    this.emit('comboChange', {
      previous: previousCombo,
      current: this.combo,
      multiplier: currentMultiplier,
      multiplierIncreased: currentMultiplier > previousMultiplier
    });

    return this.combo;
  }

  /**
   * Reset combo count
   */
  resetCombo() {
    if (this.combo === 0) return;

    const previousCombo = this.combo;
    this.combo = 0;

    this.emit('comboChange', {
      previous: previousCombo,
      current: this.combo,
      multiplier: 1,
      multiplierIncreased: false
    });
  }

  /**
   * Get current wave
   */
  getWave() {
    return this.wave;
  }

  /**
   * Increment wave number
   */
  nextWave() {
    this.wave++;
    this.emit('waveChange', {
      previous: this.wave - 1,
      current: this.wave
    });
    return this.wave;
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
    this.combo = 0;
    this.wave = 1;

    this.emit('reset', {
      previousState,
      lives: this.lives,
      score: this.score,
      combo: this.combo,
      wave: this.wave
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
      score: this.score,
      wave: this.wave
    };
  }
}

// Export for use in other modules and testing
export { GameState, GameStates };
