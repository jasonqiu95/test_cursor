/**
 * LocalStorage Mock
 * Mock implementation of Web Storage API for testing
 */

class MockStorage {
  constructor() {
    this._storage = new Map();
    this._maxSize = 5 * 1024 * 1024; // 5MB default limit
    this._currentSize = 0;
  }

  /**
   * Get an item from storage
   */
  getItem(key) {
    if (typeof key !== 'string') {
      key = String(key);
    }
    return this._storage.has(key) ? this._storage.get(key) : null;
  }

  /**
   * Set an item in storage
   */
  setItem(key, value) {
    if (typeof key !== 'string') {
      key = String(key);
    }
    if (typeof value !== 'string') {
      value = String(value);
    }

    const oldValue = this._storage.get(key);
    const oldSize = oldValue ? oldValue.length : 0;
    const newSize = value.length;

    // Check if quota would be exceeded
    const sizeChange = newSize - oldSize;
    if (this._currentSize + sizeChange > this._maxSize) {
      throw new Error('QuotaExceededError: Storage quota exceeded');
    }

    this._storage.set(key, value);
    this._currentSize += sizeChange;
  }

  /**
   * Remove an item from storage
   */
  removeItem(key) {
    if (typeof key !== 'string') {
      key = String(key);
    }

    const value = this._storage.get(key);
    if (value) {
      this._storage.delete(key);
      this._currentSize -= value.length;
    }
  }

  /**
   * Clear all items from storage
   */
  clear() {
    this._storage.clear();
    this._currentSize = 0;
  }

  /**
   * Get key at specified index
   */
  key(index) {
    const keys = Array.from(this._storage.keys());
    return keys[index] !== undefined ? keys[index] : null;
  }

  /**
   * Get number of items in storage
   */
  get length() {
    return this._storage.size;
  }

  /**
   * Get current storage size in bytes
   */
  get size() {
    return this._currentSize;
  }

  /**
   * Get maximum storage size in bytes
   */
  get maxSize() {
    return this._maxSize;
  }

  /**
   * Set maximum storage size (for testing quota limits)
   */
  setMaxSize(size) {
    this._maxSize = size;
  }

  /**
   * Test helper: Get all stored data as an object
   */
  getAllData() {
    return Object.fromEntries(this._storage);
  }

  /**
   * Test helper: Restore storage from an object
   */
  restoreData(data) {
    this.clear();
    Object.entries(data).forEach(([key, value]) => {
      this.setItem(key, value);
    });
  }

  /**
   * Test helper: Check if storage is empty
   */
  isEmpty() {
    return this._storage.size === 0;
  }

  /**
   * Test helper: Get keys matching a pattern
   */
  getKeysMatching(pattern) {
    const regex = new RegExp(pattern);
    return Array.from(this._storage.keys()).filter(key => regex.test(key));
  }

  /**
   * Test helper: Get items matching a key pattern
   */
  getItemsMatching(pattern) {
    const keys = this.getKeysMatching(pattern);
    return keys.reduce((acc, key) => {
      acc[key] = this.getItem(key);
      return acc;
    }, {});
  }
}

/**
 * Create a mock localStorage instance
 */
function createMockLocalStorage() {
  return new MockStorage();
}

/**
 * Create a mock sessionStorage instance
 */
function createMockSessionStorage() {
  return new MockStorage();
}

/**
 * Mock StorageEvent for testing storage event listeners
 */
class MockStorageEvent {
  constructor(type, options = {}) {
    this.type = type;
    this.key = options.key !== undefined ? options.key : null;
    this.oldValue = options.oldValue !== undefined ? options.oldValue : null;
    this.newValue = options.newValue !== undefined ? options.newValue : null;
    this.url = options.url || '';
    this.storageArea = options.storageArea || null;
  }
}

/**
 * Storage Manager - Manages localStorage/sessionStorage with event simulation
 */
class MockStorageManager {
  constructor() {
    this.localStorage = new MockStorage();
    this.sessionStorage = new MockStorage();
    this._eventListeners = [];
  }

  /**
   * Add storage event listener
   */
  addEventListener(callback) {
    this._eventListeners.push(callback);
  }

  /**
   * Remove storage event listener
   */
  removeEventListener(callback) {
    this._eventListeners = this._eventListeners.filter(cb => cb !== callback);
  }

  /**
   * Dispatch storage event to all listeners
   */
  _dispatchStorageEvent(event) {
    this._eventListeners.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in storage event listener:', error);
      }
    });
  }

  /**
   * Set item with event dispatching
   */
  setItemWithEvent(storage, key, value, url = '') {
    const oldValue = storage.getItem(key);
    storage.setItem(key, value);

    const event = new MockStorageEvent('storage', {
      key,
      oldValue,
      newValue: value,
      url,
      storageArea: storage
    });

    this._dispatchStorageEvent(event);
  }

  /**
   * Remove item with event dispatching
   */
  removeItemWithEvent(storage, key, url = '') {
    const oldValue = storage.getItem(key);
    storage.removeItem(key);

    const event = new MockStorageEvent('storage', {
      key,
      oldValue,
      newValue: null,
      url,
      storageArea: storage
    });

    this._dispatchStorageEvent(event);
  }

  /**
   * Clear storage with event dispatching
   */
  clearWithEvent(storage, url = '') {
    storage.clear();

    const event = new MockStorageEvent('storage', {
      key: null,
      oldValue: null,
      newValue: null,
      url,
      storageArea: storage
    });

    this._dispatchStorageEvent(event);
  }
}

/**
 * Helper functions for testing high score persistence
 */
const HIGH_SCORE_KEY = 'spaceInvadersHighScore';

function saveHighScoreToMock(storage, score) {
  storage.setItem(HIGH_SCORE_KEY, String(score));
}

function loadHighScoreFromMock(storage) {
  const saved = storage.getItem(HIGH_SCORE_KEY);
  if (saved === null) {
    return 0;
  }
  const score = parseInt(saved, 10);
  return isNaN(score) || score < 0 ? 0 : score;
}

function clearHighScoreFromMock(storage) {
  storage.removeItem(HIGH_SCORE_KEY);
}

/**
 * Create a complete storage testing environment
 */
function createStorageTestEnv() {
  const manager = new MockStorageManager();

  return {
    localStorage: manager.localStorage,
    sessionStorage: manager.sessionStorage,
    manager,

    // Helper methods
    saveHighScore: (score) => saveHighScoreToMock(manager.localStorage, score),
    loadHighScore: () => loadHighScoreFromMock(manager.localStorage),
    clearHighScore: () => clearHighScoreFromMock(manager.localStorage),

    // Reset everything
    reset: () => {
      manager.localStorage.clear();
      manager.sessionStorage.clear();
    }
  };
}

// Export for both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MockStorage,
    MockStorageEvent,
    MockStorageManager,
    createMockLocalStorage,
    createMockSessionStorage,
    createStorageTestEnv,
    saveHighScoreToMock,
    loadHighScoreFromMock,
    clearHighScoreFromMock,
    HIGH_SCORE_KEY
  };
}

if (typeof window !== 'undefined') {
  window.MockStorage = MockStorage;
  window.MockStorageEvent = MockStorageEvent;
  window.MockStorageManager = MockStorageManager;
  window.createMockLocalStorage = createMockLocalStorage;
  window.createMockSessionStorage = createMockSessionStorage;
  window.createStorageTestEnv = createStorageTestEnv;
}
