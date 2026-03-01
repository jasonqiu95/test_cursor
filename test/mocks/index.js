/**
 * Test Mocks Index
 * Central export point for all test mocks
 */

// Import mocks
const canvasMock = typeof require !== 'undefined'
  ? require('./canvas-mock.js')
  : {
      CanvasRenderingContext2DMock: window.CanvasRenderingContext2DMock,
      createMockCanvas: window.createMockCanvas
    };

const domMock = typeof require !== 'undefined'
  ? require('./dom-mock.js')
  : {
      MockHTMLElement: window.MockHTMLElement,
      MockCanvasElement: window.MockCanvasElement,
      MockEvent: window.MockEvent,
      MockKeyboardEvent: window.MockKeyboardEvent,
      MockMouseEvent: window.MockMouseEvent,
      MockDocument: window.MockDocument,
      MockWindow: window.MockWindow,
      createMockDOM: window.createMockDOM
    };

const storageMock = typeof require !== 'undefined'
  ? require('./storage-mock.js')
  : {
      MockStorage: window.MockStorage,
      MockStorageEvent: window.MockStorageEvent,
      MockStorageManager: window.MockStorageManager,
      createMockLocalStorage: window.createMockLocalStorage,
      createMockSessionStorage: window.createMockSessionStorage,
      createStorageTestEnv: window.createStorageTestEnv
    };

// Re-export everything
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ...canvasMock,
    ...domMock,
    ...storageMock
  };
}

// For browser environments
if (typeof window !== 'undefined') {
  window.TestMocks = {
    ...canvasMock,
    ...domMock,
    ...storageMock
  };
}
