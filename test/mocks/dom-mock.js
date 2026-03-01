/**
 * DOM Element Mocks
 * Mock implementations of DOM elements and APIs for testing
 */

/**
 * Mock HTMLElement with common properties and methods
 */
class MockHTMLElement {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
    this.id = '';
    this.className = '';
    this.style = {};
    this.children = [];
    this.parentElement = null;
    this.innerHTML = '';
    this.textContent = '';
    this.attributes = {};
    this.dataset = {};
    this.classList = new MockClassList(this);
    this.clientWidth = 0;
    this.clientHeight = 0;
    this.offsetWidth = 0;
    this.offsetHeight = 0;
    this.scrollTop = 0;
    this.scrollLeft = 0;
    this._eventListeners = {};
  }

  getAttribute(name) {
    return this.attributes[name] || null;
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  removeAttribute(name) {
    delete this.attributes[name];
  }

  hasAttribute(name) {
    return name in this.attributes;
  }

  appendChild(child) {
    this.children.push(child);
    child.parentElement = this;
    return child;
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
      child.parentElement = null;
    }
    return child;
  }

  addEventListener(event, handler, options) {
    if (!this._eventListeners[event]) {
      this._eventListeners[event] = [];
    }
    this._eventListeners[event].push({ handler, options });
  }

  removeEventListener(event, handler) {
    if (this._eventListeners[event]) {
      this._eventListeners[event] = this._eventListeners[event].filter(
        listener => listener.handler !== handler
      );
    }
  }

  dispatchEvent(event) {
    if (this._eventListeners[event.type]) {
      this._eventListeners[event.type].forEach(listener => {
        listener.handler(event);
      });
    }
    return true;
  }

  querySelector(selector) {
    // Simplified selector support
    return null;
  }

  querySelectorAll(selector) {
    return [];
  }

  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      right: this.offsetWidth,
      bottom: this.offsetHeight,
      width: this.offsetWidth,
      height: this.offsetHeight,
      x: 0,
      y: 0
    };
  }

  focus() {
    // No-op for mock
  }

  blur() {
    // No-op for mock
  }

  click() {
    this.dispatchEvent(new MockEvent('click'));
  }
}

/**
 * Mock ClassList for managing CSS classes
 */
class MockClassList {
  constructor(element) {
    this.element = element;
    this._classes = new Set();
  }

  add(...classNames) {
    classNames.forEach(name => this._classes.add(name));
    this._updateClassName();
  }

  remove(...classNames) {
    classNames.forEach(name => this._classes.delete(name));
    this._updateClassName();
  }

  toggle(className, force) {
    if (force !== undefined) {
      force ? this.add(className) : this.remove(className);
      return force;
    }
    if (this._classes.has(className)) {
      this.remove(className);
      return false;
    } else {
      this.add(className);
      return true;
    }
  }

  contains(className) {
    return this._classes.has(className);
  }

  replace(oldClass, newClass) {
    if (this._classes.has(oldClass)) {
      this._classes.delete(oldClass);
      this._classes.add(newClass);
      this._updateClassName();
      return true;
    }
    return false;
  }

  _updateClassName() {
    this.element.className = Array.from(this._classes).join(' ');
  }

  get length() {
    return this._classes.size;
  }

  item(index) {
    return Array.from(this._classes)[index] || null;
  }
}

/**
 * Mock Canvas element
 */
class MockCanvasElement extends MockHTMLElement {
  constructor() {
    super('canvas');
    this.width = 800;
    this.height = 600;
    this._context2d = null;
  }

  getContext(contextType, options) {
    if (contextType === '2d') {
      if (!this._context2d) {
        // Import the canvas mock if available
        const { CanvasRenderingContext2DMock } = require('./canvas-mock.js');
        this._context2d = new CanvasRenderingContext2DMock();
      }
      return this._context2d;
    }
    return null;
  }

  toDataURL(type, quality) {
    return 'data:image/png;base64,mock';
  }

  toBlob(callback, type, quality) {
    setTimeout(() => {
      callback(new Blob(['mock'], { type: type || 'image/png' }));
    }, 0);
  }
}

/**
 * Mock Event
 */
class MockEvent {
  constructor(type, options = {}) {
    this.type = type;
    this.bubbles = options.bubbles || false;
    this.cancelable = options.cancelable || false;
    this.defaultPrevented = false;
    this.target = null;
    this.currentTarget = null;
    this.timeStamp = Date.now();
  }

  preventDefault() {
    if (this.cancelable) {
      this.defaultPrevented = true;
    }
  }

  stopPropagation() {
    // No-op for mock
  }

  stopImmediatePropagation() {
    // No-op for mock
  }
}

/**
 * Mock KeyboardEvent
 */
class MockKeyboardEvent extends MockEvent {
  constructor(type, options = {}) {
    super(type, options);
    this.key = options.key || '';
    this.code = options.code || '';
    this.keyCode = options.keyCode || 0;
    this.which = options.which || this.keyCode;
    this.ctrlKey = options.ctrlKey || false;
    this.shiftKey = options.shiftKey || false;
    this.altKey = options.altKey || false;
    this.metaKey = options.metaKey || false;
  }
}

/**
 * Mock MouseEvent
 */
class MockMouseEvent extends MockEvent {
  constructor(type, options = {}) {
    super(type, options);
    this.clientX = options.clientX || 0;
    this.clientY = options.clientY || 0;
    this.screenX = options.screenX || 0;
    this.screenY = options.screenY || 0;
    this.pageX = options.pageX || this.clientX;
    this.pageY = options.pageY || this.clientY;
    this.button = options.button || 0;
    this.buttons = options.buttons || 0;
    this.ctrlKey = options.ctrlKey || false;
    this.shiftKey = options.shiftKey || false;
    this.altKey = options.altKey || false;
    this.metaKey = options.metaKey || false;
  }
}

/**
 * Mock Document
 */
class MockDocument {
  constructor() {
    this._eventListeners = {};
    this.body = new MockHTMLElement('body');
    this.documentElement = new MockHTMLElement('html');
    this._elementsById = {};
  }

  getElementById(id) {
    return this._elementsById[id] || null;
  }

  createElement(tagName) {
    if (tagName.toLowerCase() === 'canvas') {
      return new MockCanvasElement();
    }
    return new MockHTMLElement(tagName);
  }

  querySelector(selector) {
    // Simplified selector support
    if (selector.startsWith('#')) {
      return this.getElementById(selector.slice(1));
    }
    return null;
  }

  querySelectorAll(selector) {
    return [];
  }

  addEventListener(event, handler, options) {
    if (!this._eventListeners[event]) {
      this._eventListeners[event] = [];
    }
    this._eventListeners[event].push({ handler, options });
  }

  removeEventListener(event, handler) {
    if (this._eventListeners[event]) {
      this._eventListeners[event] = this._eventListeners[event].filter(
        listener => listener.handler !== handler
      );
    }
  }

  dispatchEvent(event) {
    if (this._eventListeners[event.type]) {
      this._eventListeners[event.type].forEach(listener => {
        listener.handler(event);
      });
    }
    return true;
  }

  /**
   * Helper to register an element by ID for testing
   */
  _registerElement(id, element) {
    element.id = id;
    this._elementsById[id] = element;
  }
}

/**
 * Mock Window
 */
class MockWindow {
  constructor() {
    this.document = new MockDocument();
    this.innerWidth = 1024;
    this.innerHeight = 768;
    this.devicePixelRatio = 1;
    this._eventListeners = {};
    this._timeouts = new Map();
    this._intervals = new Map();
    this._animationFrameCallbacks = new Map();
    this._nextTimeoutId = 1;
    this._nextAnimationFrameId = 1;
    this.performance = {
      now: () => Date.now()
    };
  }

  addEventListener(event, handler, options) {
    if (!this._eventListeners[event]) {
      this._eventListeners[event] = [];
    }
    this._eventListeners[event].push({ handler, options });
  }

  removeEventListener(event, handler) {
    if (this._eventListeners[event]) {
      this._eventListeners[event] = this._eventListeners[event].filter(
        listener => listener.handler !== handler
      );
    }
  }

  dispatchEvent(event) {
    if (this._eventListeners[event.type]) {
      this._eventListeners[event.type].forEach(listener => {
        listener.handler(event);
      });
    }
    return true;
  }

  setTimeout(callback, delay, ...args) {
    const id = this._nextTimeoutId++;
    this._timeouts.set(id, { callback, delay, args });
    return id;
  }

  clearTimeout(id) {
    this._timeouts.delete(id);
  }

  setInterval(callback, delay, ...args) {
    const id = this._nextTimeoutId++;
    this._intervals.set(id, { callback, delay, args });
    return id;
  }

  clearInterval(id) {
    this._intervals.delete(id);
  }

  requestAnimationFrame(callback) {
    const id = this._nextAnimationFrameId++;
    this._animationFrameCallbacks.set(id, callback);
    return id;
  }

  cancelAnimationFrame(id) {
    this._animationFrameCallbacks.delete(id);
  }

  /**
   * Test helper: Execute all pending timeouts
   */
  _flushTimeouts() {
    const timeouts = Array.from(this._timeouts.entries());
    this._timeouts.clear();
    timeouts.forEach(([id, { callback, args }]) => {
      callback(...args);
    });
  }

  /**
   * Test helper: Execute all pending animation frames
   */
  _flushAnimationFrames(timestamp = Date.now()) {
    const callbacks = Array.from(this._animationFrameCallbacks.values());
    this._animationFrameCallbacks.clear();
    callbacks.forEach(callback => callback(timestamp));
  }

  /**
   * Test helper: Execute one interval callback
   */
  _tickInterval(id) {
    const interval = this._intervals.get(id);
    if (interval) {
      interval.callback(...interval.args);
    }
  }
}

/**
 * Create a complete mock DOM environment
 */
function createMockDOM() {
  const mockWindow = new MockWindow();
  const mockDocument = mockWindow.document;

  // Create and register a game canvas
  const gameCanvas = mockDocument.createElement('canvas');
  mockDocument._registerElement('gameCanvas', gameCanvas);

  return {
    window: mockWindow,
    document: mockDocument,
    canvas: gameCanvas
  };
}

// Export for both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    MockHTMLElement,
    MockCanvasElement,
    MockClassList,
    MockEvent,
    MockKeyboardEvent,
    MockMouseEvent,
    MockDocument,
    MockWindow,
    createMockDOM
  };
}

if (typeof window !== 'undefined') {
  window.MockHTMLElement = MockHTMLElement;
  window.MockCanvasElement = MockCanvasElement;
  window.MockEvent = MockEvent;
  window.MockKeyboardEvent = MockKeyboardEvent;
  window.MockMouseEvent = MockMouseEvent;
  window.MockDocument = MockDocument;
  window.MockWindow = MockWindow;
  window.createMockDOM = createMockDOM;
}
