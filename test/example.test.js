/**
 * Example tests demonstrating the test runner capabilities
 * Run with: node test/example.test.js
 */

// Load the test runner
const TestRunner = typeof module !== 'undefined' && require
  ? require('../test-runner.js')
  : window.TestRunner;

const {
  describe,
  it,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
  assertEqual,
  assertTrue,
  assertFalse,
  assertThrows,
  assertDeepEqual,
  assertNull,
  assertNotNull,
  run
} = TestRunner;

// ========================================
// Example Test Suites
// ========================================

describe('Assertion Methods', () => {
  it('should pass when values are equal', () => {
    assertEqual(1, 1);
    assertEqual('hello', 'hello');
    assertEqual(true, true);
  });

  it('should pass when value is truthy', () => {
    assertTrue(true);
    assertTrue(1);
    assertTrue('hello');
    assertTrue([1, 2, 3]);
  });

  it('should pass when value is falsy', () => {
    assertFalse(false);
    assertFalse(0);
    assertFalse('');
    assertFalse(null);
  });

  it('should detect when function throws', () => {
    assertThrows(() => {
      throw new Error('Expected error');
    });
  });

  it('should pass for deeply equal objects', () => {
    assertDeepEqual({ a: 1, b: 2 }, { a: 1, b: 2 });
    assertDeepEqual([1, 2, 3], [1, 2, 3]);
  });

  it('should detect null values', () => {
    assertNull(null);
    assertNotNull('not null');
  });
});

describe('Setup and Teardown Hooks', () => {
  let counter;

  beforeAll(() => {
    console.log('  🔧 beforeAll: Suite setup');
  });

  afterAll(() => {
    console.log('  🔧 afterAll: Suite teardown');
  });

  beforeEach(() => {
    counter = 0;
  });

  afterEach(() => {
    counter = null;
  });

  it('should have counter initialized to 0', () => {
    assertEqual(counter, 0);
  });

  it('should allow counter modification', () => {
    counter = 5;
    assertEqual(counter, 5);
  });

  it('should reset counter between tests', () => {
    assertEqual(counter, 0);
  });
});

describe('Error Handling and Reporting', () => {
  it('should catch assertion errors with assertThrows', () => {
    assertThrows(() => {
      assertEqual(1, 2, 'Custom error message');
    });
  });

  it('should handle async tests', async () => {
    const promise = new Promise(resolve => setTimeout(() => resolve(42), 10));
    const result = await promise;
    assertEqual(result, 42);
  });
});

describe('Mathematical Operations', () => {
  it('should add numbers correctly', () => {
    assertEqual(2 + 2, 4);
    assertEqual(10 + 5, 15);
  });

  it('should subtract numbers correctly', () => {
    assertEqual(10 - 5, 5);
    assertEqual(0 - 5, -5);
  });

  it('should multiply numbers correctly', () => {
    assertEqual(3 * 4, 12);
    assertEqual(7 * 0, 0);
  });

  it('should divide numbers correctly', () => {
    assertEqual(10 / 2, 5);
    assertEqual(15 / 3, 5);
  });
});

describe('String Operations', () => {
  it('should concatenate strings', () => {
    assertEqual('hello' + ' ' + 'world', 'hello world');
  });

  it('should get string length', () => {
    assertEqual('hello'.length, 5);
  });

  it('should convert to uppercase', () => {
    assertEqual('hello'.toUpperCase(), 'HELLO');
  });

  it('should convert to lowercase', () => {
    assertEqual('HELLO'.toLowerCase(), 'hello');
  });
});

describe('Array Operations', () => {
  let arr;

  beforeEach(() => {
    arr = [1, 2, 3, 4, 5];
  });

  it('should have correct length', () => {
    assertEqual(arr.length, 5);
  });

  it('should access elements by index', () => {
    assertEqual(arr[0], 1);
    assertEqual(arr[4], 5);
  });

  it('should push elements', () => {
    arr.push(6);
    assertEqual(arr.length, 6);
    assertEqual(arr[5], 6);
  });

  it('should pop elements', () => {
    const last = arr.pop();
    assertEqual(last, 5);
    assertEqual(arr.length, 4);
  });

  it('should filter elements', () => {
    const filtered = arr.filter(x => x > 3);
    assertDeepEqual(filtered, [4, 5]);
  });

  it('should map elements', () => {
    const mapped = arr.map(x => x * 2);
    assertDeepEqual(mapped, [2, 4, 6, 8, 10]);
  });
});

// Run all tests if this file is executed directly
if (typeof module !== 'undefined' && require.main === module) {
  run().then(success => {
    process.exit(success ? 0 : 1);
  });
}
