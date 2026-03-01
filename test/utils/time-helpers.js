/**
 * Time Helpers
 * Utilities for simulating game loops, time progression, and timing-related testing
 */

/**
 * Mock Timer - Controls time for deterministic testing
 */
class MockTimer {
  constructor(startTime = 0) {
    this.currentTime = startTime;
    this.timeouts = new Map();
    this.intervals = new Map();
    this.animationFrames = new Map();
    this.nextTimeoutId = 1;
    this.nextIntervalId = 1;
    this.nextAnimationFrameId = 1;
  }

  /**
   * Get current time
   */
  now() {
    return this.currentTime;
  }

  /**
   * Advance time by specified milliseconds
   */
  advance(ms) {
    const targetTime = this.currentTime + ms;

    // Execute all timeouts that should fire
    const timeoutsToExecute = [];
    for (const [id, timeout] of this.timeouts.entries()) {
      if (timeout.fireTime <= targetTime) {
        timeoutsToExecute.push({ id, timeout });
      }
    }

    // Sort by fire time
    timeoutsToExecute.sort((a, b) => a.timeout.fireTime - b.timeout.fireTime);

    // Execute timeouts
    for (const { id, timeout } of timeoutsToExecute) {
      this.currentTime = timeout.fireTime;
      this.timeouts.delete(id);
      timeout.callback(...timeout.args);
    }

    // Execute intervals
    for (const [id, interval] of this.intervals.entries()) {
      let executionCount = Math.floor((targetTime - interval.lastFire) / interval.delay);
      for (let i = 0; i < executionCount; i++) {
        interval.lastFire += interval.delay;
        this.currentTime = interval.lastFire;
        interval.callback(...interval.args);
      }
    }

    this.currentTime = targetTime;
  }

  /**
   * Mock setTimeout
   */
  setTimeout(callback, delay, ...args) {
    const id = this.nextTimeoutId++;
    this.timeouts.set(id, {
      callback,
      delay,
      args,
      fireTime: this.currentTime + delay
    });
    return id;
  }

  /**
   * Mock clearTimeout
   */
  clearTimeout(id) {
    this.timeouts.delete(id);
  }

  /**
   * Mock setInterval
   */
  setInterval(callback, delay, ...args) {
    const id = this.nextIntervalId++;
    this.intervals.set(id, {
      callback,
      delay,
      args,
      lastFire: this.currentTime
    });
    return id;
  }

  /**
   * Mock clearInterval
   */
  clearInterval(id) {
    this.intervals.delete(id);
  }

  /**
   * Mock requestAnimationFrame
   */
  requestAnimationFrame(callback) {
    const id = this.nextAnimationFrameId++;
    this.animationFrames.set(id, callback);
    return id;
  }

  /**
   * Mock cancelAnimationFrame
   */
  cancelAnimationFrame(id) {
    this.animationFrames.delete(id);
  }

  /**
   * Execute all pending animation frames
   */
  flushAnimationFrames() {
    const callbacks = Array.from(this.animationFrames.values());
    this.animationFrames.clear();
    callbacks.forEach(callback => callback(this.currentTime));
  }

  /**
   * Execute one animation frame
   */
  tickAnimationFrame() {
    if (this.animationFrames.size > 0) {
      const [id, callback] = this.animationFrames.entries().next().value;
      this.animationFrames.delete(id);
      callback(this.currentTime);
    }
  }

  /**
   * Reset the timer
   */
  reset(startTime = 0) {
    this.currentTime = startTime;
    this.timeouts.clear();
    this.intervals.clear();
    this.animationFrames.clear();
  }

  /**
   * Get pending timeouts count
   */
  getPendingTimeouts() {
    return this.timeouts.size;
  }

  /**
   * Get active intervals count
   */
  getActiveIntervals() {
    return this.intervals.size;
  }

  /**
   * Get pending animation frames count
   */
  getPendingAnimationFrames() {
    return this.animationFrames.size;
  }
}

/**
 * Game Loop Simulator - Simulates game loop execution
 */
class GameLoopSimulator {
  constructor(timer = new MockTimer()) {
    this.timer = timer;
    this.isRunning = false;
    this.frameCount = 0;
    this.targetFPS = 60;
    this.frameDuration = 1000 / this.targetFPS;
    this.updateCallback = null;
    this.renderCallback = null;
    this.lastFrameTime = 0;
  }

  /**
   * Set update callback
   */
  onUpdate(callback) {
    this.updateCallback = callback;
  }

  /**
   * Set render callback
   */
  onRender(callback) {
    this.renderCallback = callback;
  }

  /**
   * Start the game loop
   */
  start() {
    this.isRunning = true;
    this.lastFrameTime = this.timer.now();
    this.frameCount = 0;
  }

  /**
   * Stop the game loop
   */
  stop() {
    this.isRunning = false;
  }

  /**
   * Execute one frame of the game loop
   */
  tick() {
    if (!this.isRunning) return;

    const currentTime = this.timer.now();
    const deltaTime = currentTime - this.lastFrameTime;

    if (this.updateCallback) {
      this.updateCallback(deltaTime);
    }

    if (this.renderCallback) {
      this.renderCallback();
    }

    this.lastFrameTime = currentTime;
    this.frameCount++;

    return {
      frameCount: this.frameCount,
      deltaTime,
      currentTime
    };
  }

  /**
   * Run multiple frames
   */
  runFrames(count) {
    const results = [];
    for (let i = 0; i < count; i++) {
      this.timer.advance(this.frameDuration);
      results.push(this.tick());
    }
    return results;
  }

  /**
   * Run for specified duration in milliseconds
   */
  runForDuration(ms) {
    const frames = Math.floor(ms / this.frameDuration);
    return this.runFrames(frames);
  }

  /**
   * Run for specified duration in seconds
   */
  runForSeconds(seconds) {
    return this.runForDuration(seconds * 1000);
  }

  /**
   * Get current frame count
   */
  getFrameCount() {
    return this.frameCount;
  }

  /**
   * Get average FPS over last run
   */
  getAverageFPS(results) {
    if (results.length === 0) return 0;
    const totalTime = results[results.length - 1].currentTime - results[0].currentTime;
    return (results.length / totalTime) * 1000;
  }

  /**
   * Reset the simulator
   */
  reset() {
    this.isRunning = false;
    this.frameCount = 0;
    this.lastFrameTime = this.timer.now();
  }
}

/**
 * Delta Time Calculator - Helps test delta-time-based game logic
 */
class DeltaTimeCalculator {
  constructor() {
    this.lastTime = 0;
    this.deltaHistory = [];
    this.maxHistorySize = 100;
  }

  /**
   * Calculate delta time
   */
  calculate(currentTime) {
    const delta = this.lastTime === 0 ? 0 : currentTime - this.lastTime;
    this.lastTime = currentTime;

    this.deltaHistory.push(delta);
    if (this.deltaHistory.length > this.maxHistorySize) {
      this.deltaHistory.shift();
    }

    return delta;
  }

  /**
   * Get average delta time
   */
  getAverage() {
    if (this.deltaHistory.length === 0) return 0;
    const sum = this.deltaHistory.reduce((acc, val) => acc + val, 0);
    return sum / this.deltaHistory.length;
  }

  /**
   * Get min delta time
   */
  getMin() {
    if (this.deltaHistory.length === 0) return 0;
    return Math.min(...this.deltaHistory);
  }

  /**
   * Get max delta time
   */
  getMax() {
    if (this.deltaHistory.length === 0) return 0;
    return Math.max(...this.deltaHistory);
  }

  /**
   * Reset calculator
   */
  reset() {
    this.lastTime = 0;
    this.deltaHistory = [];
  }
}

/**
 * Cooldown Timer - Test cooldown mechanics
 */
class CooldownTimer {
  constructor(duration) {
    this.duration = duration;
    this.remaining = 0;
  }

  /**
   * Start the cooldown
   */
  start() {
    this.remaining = this.duration;
  }

  /**
   * Update cooldown with delta time
   */
  update(deltaTime) {
    if (this.remaining > 0) {
      this.remaining -= deltaTime;
      if (this.remaining < 0) {
        this.remaining = 0;
      }
    }
  }

  /**
   * Check if cooldown is ready
   */
  isReady() {
    return this.remaining <= 0;
  }

  /**
   * Get remaining time
   */
  getRemaining() {
    return this.remaining;
  }

  /**
   * Get progress (0 to 1)
   */
  getProgress() {
    return 1 - (this.remaining / this.duration);
  }

  /**
   * Reset cooldown
   */
  reset() {
    this.remaining = 0;
  }
}

/**
 * Create a test environment with timing utilities
 */
function createTimeTestEnv() {
  const timer = new MockTimer();
  const gameLoop = new GameLoopSimulator(timer);
  const deltaCalc = new DeltaTimeCalculator();

  return {
    timer,
    gameLoop,
    deltaCalc,

    // Convenience methods
    advanceTime: (ms) => timer.advance(ms),
    advanceSeconds: (seconds) => timer.advance(seconds * 1000),
    runFrames: (count) => gameLoop.runFrames(count),
    runForSeconds: (seconds) => gameLoop.runForSeconds(seconds),

    // Reset everything
    reset: () => {
      timer.reset();
      gameLoop.reset();
      deltaCalc.reset();
    }
  };
}

/**
 * Helper function to measure execution time of a function
 */
function measureExecutionTime(fn, timer = new MockTimer()) {
  const startTime = timer.now();
  fn();
  const endTime = timer.now();
  return endTime - startTime;
}

/**
 * Helper to simulate frame drops
 */
function simulateFrameDrops(gameLoop, normalFrames, dropFrames, dropCount) {
  const results = [];

  for (let i = 0; i < dropCount; i++) {
    // Run normal frames
    results.push(...gameLoop.runFrames(normalFrames));

    // Simulate frame drop (advance time without ticking)
    gameLoop.timer.advance(gameLoop.frameDuration * dropFrames);
  }

  return results;
}

/**
 * Helper to create a timing statistics object
 */
function createTimingStats() {
  const samples = [];

  return {
    record: (value) => samples.push(value),

    getAverage: () => {
      if (samples.length === 0) return 0;
      return samples.reduce((a, b) => a + b, 0) / samples.length;
    },

    getMin: () => samples.length > 0 ? Math.min(...samples) : 0,
    getMax: () => samples.length > 0 ? Math.max(...samples) : 0,

    getMedian: () => {
      if (samples.length === 0) return 0;
      const sorted = [...samples].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
    },

    getPercentile: (p) => {
      if (samples.length === 0) return 0;
      const sorted = [...samples].sort((a, b) => a - b);
      const index = Math.ceil((p / 100) * sorted.length) - 1;
      return sorted[Math.max(0, index)];
    },

    getSamples: () => [...samples],
    getCount: () => samples.length,
    clear: () => samples.length = 0
  };
}

// Export for both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MockTimer,
    GameLoopSimulator,
    DeltaTimeCalculator,
    CooldownTimer,
    createTimeTestEnv,
    measureExecutionTime,
    simulateFrameDrops,
    createTimingStats
  };
}

if (typeof window !== 'undefined') {
  window.TimeHelpers = {
    MockTimer,
    GameLoopSimulator,
    DeltaTimeCalculator,
    CooldownTimer,
    createTimeTestEnv,
    measureExecutionTime,
    simulateFrameDrops,
    createTimingStats
  };
}
