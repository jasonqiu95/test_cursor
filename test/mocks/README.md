# Test Mocks

Comprehensive mocks for DOM, Canvas, and Storage APIs.

## Canvas Mock

```javascript
const { createMockCanvas } = require('./canvas-mock.js');

const canvas = createMockCanvas(800, 600);
const ctx = canvas.getContext('2d');

// Use like a real canvas context
ctx.fillStyle = '#FF0000';
ctx.fillRect(0, 0, 100, 100);

// Test method calls
console.log(ctx.getCallCount('fillRect')); // 1
console.log(ctx.getLastCallTo('fillRect').args); // [0, 0, 100, 100]
```

## DOM Mock

```javascript
const { createMockDOM } = require('./dom-mock.js');

const { window, document, canvas } = createMockDOM();

// Use like real DOM
const element = document.createElement('div');
element.id = 'test';
document.body.appendChild(element);
```

## Storage Mock

```javascript
const { createStorageTestEnv } = require('./storage-mock.js');

const env = createStorageTestEnv();

// Save high score
env.saveHighScore(5000);

// Load high score
const score = env.loadHighScore(); // 5000

// Test storage directly
env.localStorage.setItem('key', 'value');
console.log(env.localStorage.getItem('key')); // 'value'
```

## Available Mocks

### Canvas Mock
- `CanvasRenderingContext2DMock` - Full 2D context mock
- `createMockCanvas()` - Create mock canvas element

### DOM Mock
- `MockHTMLElement` - Generic HTML element
- `MockCanvasElement` - Canvas element with context
- `MockKeyboardEvent` - Keyboard event mock
- `MockMouseEvent` - Mouse event mock
- `MockDocument` - Document mock
- `MockWindow` - Window mock with timers
- `createMockDOM()` - Complete DOM environment

### Storage Mock
- `MockStorage` - localStorage/sessionStorage mock
- `MockStorageManager` - Storage with event support
- `createStorageTestEnv()` - Complete storage test environment
