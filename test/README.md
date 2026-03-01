# Test Suite

This directory contains the test infrastructure and test files for the game.

## Test Runner

The test runner (`../test-runner.js`) provides a simple, lightweight testing framework that works in both Node.js and browser environments.

### Features

- ✅ Assertion methods (assertEqual, assertTrue, assertFalse, assertThrows, etc.)
- ✅ Test suite grouping with `describe()`
- ✅ Individual test cases with `it()`
- ✅ Setup/teardown hooks (beforeEach, afterEach, beforeAll, afterAll)
- ✅ Detailed error reporting with stack traces
- ✅ Async/await support
- ✅ Clear pass/fail output with statistics

## Running Tests

### Node.js

Run individual test files:

```bash
node test/example.test.js
node test/game.test.js
```

Run all tests:

```bash
node test/run-all.js
```

### Browser

Open `test-runner.html` in your browser to run tests in the browser environment.

## Writing Tests

### Basic Test Structure

```javascript
const { describe, it, assertEqual, run } = require('../test-runner.js');

describe('My Test Suite', () => {
  it('should do something', () => {
    assertEqual(1 + 1, 2);
  });

  it('should do something else', () => {
    assertTrue(true);
  });
});

run();
```

### Using Hooks

```javascript
describe('Test with Hooks', () => {
  let data;

  beforeAll(() => {
    // Runs once before all tests
    console.log('Suite setup');
  });

  beforeEach(() => {
    // Runs before each test
    data = { value: 0 };
  });

  afterEach(() => {
    // Runs after each test
    data = null;
  });

  afterAll(() => {
    // Runs once after all tests
    console.log('Suite teardown');
  });

  it('test 1', () => {
    assertEqual(data.value, 0);
  });

  it('test 2', () => {
    data.value = 5;
    assertEqual(data.value, 5);
  });
});
```

### Available Assertions

- `assertEqual(actual, expected, message?)` - Strict equality check
- `assertTrue(value, message?)` - Check if value is truthy
- `assertFalse(value, message?)` - Check if value is falsy
- `assertThrows(fn, ErrorType?, message?)` - Check if function throws
- `assertDeepEqual(actual, expected, message?)` - Deep equality for objects/arrays
- `assertNull(value, message?)` - Check if value is null
- `assertNotNull(value, message?)` - Check if value is not null
- `assertUndefined(value, message?)` - Check if value is undefined

### Async Tests

The test runner supports async/await:

```javascript
it('should handle async operations', async () => {
  const result = await someAsyncFunction();
  assertEqual(result, expectedValue);
});
```

## Test Files

- `example.test.js` - Demonstrates all test runner features
- `game.test.js` - Game component tests with mock objects
- `run-all.js` - Runs all test files

## Best Practices

1. **Keep tests focused** - Each test should verify one specific behavior
2. **Use descriptive names** - Test names should clearly describe what they test
3. **Setup and teardown** - Use hooks to ensure clean state between tests
4. **Mock external dependencies** - Create simple mocks for complex objects
5. **Test edge cases** - Include tests for boundary conditions and error cases
6. **Keep tests fast** - Avoid unnecessary delays or slow operations

## Example Output

```
========================================
🧪 Test Runner Started
========================================

📦 Suite: Assertion Methods
────────────────────────────────────────
  ✅ should pass when values are equal
  ✅ should pass when value is truthy
  ✅ should pass when value is falsy
  ✅ should detect when function throws

========================================
📊 Test Results Summary
========================================
Suites: 1
Tests:  4
✅ Passed: 4
❌ Failed: 0
Duration: 15ms
========================================
```
