/**
 * Canvas Context Mock
 * Comprehensive mock for CanvasRenderingContext2D with method tracking
 */

class CanvasRenderingContext2DMock {
  constructor() {
    // Drawing state properties
    this.fillStyle = '#000000';
    this.strokeStyle = '#000000';
    this.lineWidth = 1;
    this.lineCap = 'butt';
    this.lineJoin = 'miter';
    this.miterLimit = 10;
    this.globalAlpha = 1.0;
    this.globalCompositeOperation = 'source-over';

    // Shadow properties
    this.shadowBlur = 0;
    this.shadowColor = 'rgba(0, 0, 0, 0)';
    this.shadowOffsetX = 0;
    this.shadowOffsetY = 0;

    // Text properties
    this.font = '10px sans-serif';
    this.textAlign = 'start';
    this.textBaseline = 'alphabetic';
    this.direction = 'ltr';

    // Transform properties
    this._transformMatrix = [1, 0, 0, 1, 0, 0];

    // State stack for save/restore
    this._stateStack = [];

    // Method call history for testing
    this.calls = [];

    // Path state
    this._currentPath = [];
    this._isPathStarted = false;
  }

  /**
   * Record a method call for test assertions
   */
  _recordCall(method, args = []) {
    this.calls.push({
      method,
      args: [...args],
      timestamp: Date.now()
    });
  }

  /**
   * Get all calls to a specific method
   */
  getCallsTo(methodName) {
    return this.calls.filter(call => call.method === methodName);
  }

  /**
   * Get the last call to a specific method
   */
  getLastCallTo(methodName) {
    const calls = this.getCallsTo(methodName);
    return calls.length > 0 ? calls[calls.length - 1] : null;
  }

  /**
   * Clear call history
   */
  clearCalls() {
    this.calls = [];
  }

  /**
   * Get call count for a specific method
   */
  getCallCount(methodName) {
    return this.getCallsTo(methodName).length;
  }

  // ========================================
  // State Management
  // ========================================

  save() {
    this._recordCall('save');
    this._stateStack.push({
      fillStyle: this.fillStyle,
      strokeStyle: this.strokeStyle,
      lineWidth: this.lineWidth,
      lineCap: this.lineCap,
      lineJoin: this.lineJoin,
      miterLimit: this.miterLimit,
      globalAlpha: this.globalAlpha,
      globalCompositeOperation: this.globalCompositeOperation,
      shadowBlur: this.shadowBlur,
      shadowColor: this.shadowColor,
      shadowOffsetX: this.shadowOffsetX,
      shadowOffsetY: this.shadowOffsetY,
      font: this.font,
      textAlign: this.textAlign,
      textBaseline: this.textBaseline,
      direction: this.direction,
      transformMatrix: [...this._transformMatrix]
    });
  }

  restore() {
    this._recordCall('restore');
    if (this._stateStack.length > 0) {
      const state = this._stateStack.pop();
      Object.assign(this, state);
      this._transformMatrix = state.transformMatrix;
    }
  }

  // ========================================
  // Rectangle Drawing
  // ========================================

  fillRect(x, y, width, height) {
    this._recordCall('fillRect', [x, y, width, height]);
  }

  strokeRect(x, y, width, height) {
    this._recordCall('strokeRect', [x, y, width, height]);
  }

  clearRect(x, y, width, height) {
    this._recordCall('clearRect', [x, y, width, height]);
  }

  // ========================================
  // Path Drawing
  // ========================================

  beginPath() {
    this._recordCall('beginPath');
    this._currentPath = [];
    this._isPathStarted = true;
  }

  closePath() {
    this._recordCall('closePath');
    if (this._currentPath.length > 0) {
      this._currentPath.push({ type: 'close' });
    }
  }

  moveTo(x, y) {
    this._recordCall('moveTo', [x, y]);
    this._currentPath.push({ type: 'moveTo', x, y });
  }

  lineTo(x, y) {
    this._recordCall('lineTo', [x, y]);
    this._currentPath.push({ type: 'lineTo', x, y });
  }

  arc(x, y, radius, startAngle, endAngle, counterclockwise = false) {
    this._recordCall('arc', [x, y, radius, startAngle, endAngle, counterclockwise]);
    this._currentPath.push({
      type: 'arc',
      x,
      y,
      radius,
      startAngle,
      endAngle,
      counterclockwise
    });
  }

  arcTo(x1, y1, x2, y2, radius) {
    this._recordCall('arcTo', [x1, y1, x2, y2, radius]);
    this._currentPath.push({ type: 'arcTo', x1, y1, x2, y2, radius });
  }

  ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise = false) {
    this._recordCall('ellipse', [x, y, radiusX, radiusY, rotation, startAngle, endAngle, counterclockwise]);
    this._currentPath.push({
      type: 'ellipse',
      x,
      y,
      radiusX,
      radiusY,
      rotation,
      startAngle,
      endAngle,
      counterclockwise
    });
  }

  rect(x, y, width, height) {
    this._recordCall('rect', [x, y, width, height]);
    this._currentPath.push({ type: 'rect', x, y, width, height });
  }

  quadraticCurveTo(cpx, cpy, x, y) {
    this._recordCall('quadraticCurveTo', [cpx, cpy, x, y]);
    this._currentPath.push({ type: 'quadraticCurveTo', cpx, cpy, x, y });
  }

  bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
    this._recordCall('bezierCurveTo', [cp1x, cp1y, cp2x, cp2y, x, y]);
    this._currentPath.push({ type: 'bezierCurveTo', cp1x, cp1y, cp2x, cp2y, x, y });
  }

  fill() {
    this._recordCall('fill');
  }

  stroke() {
    this._recordCall('stroke');
  }

  clip() {
    this._recordCall('clip');
  }

  isPointInPath(x, y) {
    this._recordCall('isPointInPath', [x, y]);
    return false; // Simplified mock
  }

  isPointInStroke(x, y) {
    this._recordCall('isPointInStroke', [x, y]);
    return false; // Simplified mock
  }

  // ========================================
  // Text Drawing
  // ========================================

  fillText(text, x, y, maxWidth) {
    this._recordCall('fillText', [text, x, y, maxWidth]);
  }

  strokeText(text, x, y, maxWidth) {
    this._recordCall('strokeText', [text, x, y, maxWidth]);
  }

  measureText(text) {
    this._recordCall('measureText', [text]);
    // Approximate width calculation
    const width = text.length * 8;
    return {
      width,
      actualBoundingBoxLeft: 0,
      actualBoundingBoxRight: width,
      actualBoundingBoxAscent: 10,
      actualBoundingBoxDescent: 2,
      fontBoundingBoxAscent: 12,
      fontBoundingBoxDescent: 3
    };
  }

  // ========================================
  // Transformations
  // ========================================

  translate(x, y) {
    this._recordCall('translate', [x, y]);
    this._transformMatrix[4] += x;
    this._transformMatrix[5] += y;
  }

  rotate(angle) {
    this._recordCall('rotate', [angle]);
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const [a, b, c, d, e, f] = this._transformMatrix;
    this._transformMatrix = [
      a * cos + c * sin,
      b * cos + d * sin,
      a * -sin + c * cos,
      b * -sin + d * cos,
      e,
      f
    ];
  }

  scale(x, y) {
    this._recordCall('scale', [x, y]);
    this._transformMatrix[0] *= x;
    this._transformMatrix[3] *= y;
  }

  transform(a, b, c, d, e, f) {
    this._recordCall('transform', [a, b, c, d, e, f]);
    const [m11, m12, m21, m22, m31, m32] = this._transformMatrix;
    this._transformMatrix = [
      m11 * a + m21 * b,
      m12 * a + m22 * b,
      m11 * c + m21 * d,
      m12 * c + m22 * d,
      m11 * e + m21 * f + m31,
      m12 * e + m22 * f + m32
    ];
  }

  setTransform(a, b, c, d, e, f) {
    this._recordCall('setTransform', [a, b, c, d, e, f]);
    this._transformMatrix = [a, b, c, d, e, f];
  }

  resetTransform() {
    this._recordCall('resetTransform');
    this._transformMatrix = [1, 0, 0, 1, 0, 0];
  }

  // ========================================
  // Image Drawing (simplified)
  // ========================================

  drawImage(...args) {
    this._recordCall('drawImage', args);
  }

  // ========================================
  // Pixel Manipulation (simplified)
  // ========================================

  createImageData(width, height) {
    this._recordCall('createImageData', [width, height]);
    return {
      width,
      height,
      data: new Uint8ClampedArray(width * height * 4)
    };
  }

  getImageData(x, y, width, height) {
    this._recordCall('getImageData', [x, y, width, height]);
    return {
      width,
      height,
      data: new Uint8ClampedArray(width * height * 4)
    };
  }

  putImageData(imageData, x, y) {
    this._recordCall('putImageData', [imageData, x, y]);
  }

  // ========================================
  // Gradient & Pattern (simplified)
  // ========================================

  createLinearGradient(x0, y0, x1, y1) {
    this._recordCall('createLinearGradient', [x0, y0, x1, y1]);
    return {
      addColorStop: (offset, color) => {}
    };
  }

  createRadialGradient(x0, y0, r0, x1, y1, r1) {
    this._recordCall('createRadialGradient', [x0, y0, r0, x1, y1, r1]);
    return {
      addColorStop: (offset, color) => {}
    };
  }

  createPattern(image, repetition) {
    this._recordCall('createPattern', [image, repetition]);
    return {};
  }

  // ========================================
  // Test Helper Methods
  // ========================================

  /**
   * Get current path for testing
   */
  getCurrentPath() {
    return [...this._currentPath];
  }

  /**
   * Get current transform matrix
   */
  getTransform() {
    return [...this._transformMatrix];
  }

  /**
   * Check if a specific property was set to a value
   */
  wasPropertySetTo(property, value) {
    return this[property] === value;
  }

  /**
   * Get all unique methods that were called
   */
  getCalledMethods() {
    return [...new Set(this.calls.map(call => call.method))];
  }
}

/**
 * Create a mock canvas element with a mock 2D context
 */
function createMockCanvas(width = 800, height = 600) {
  const context = new CanvasRenderingContext2DMock();

  const canvas = {
    width,
    height,
    style: {},
    parentElement: {
      clientWidth: width,
      clientHeight: height
    },

    getContext(contextType) {
      if (contextType === '2d') {
        return context;
      }
      return null;
    },

    // Add reference to context for easy access in tests
    _mockContext: context
  };

  return canvas;
}

// Export for both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CanvasRenderingContext2DMock,
    createMockCanvas
  };
}

if (typeof window !== 'undefined') {
  window.CanvasRenderingContext2DMock = CanvasRenderingContext2DMock;
  window.createMockCanvas = createMockCanvas;
}
