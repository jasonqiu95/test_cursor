/**
 * Simple Test Runner
 * Works in both browser console and Node.js environments
 *
 * Features:
 * - Assertion methods (assertEqual, assertTrue, assertFalse, assertThrows)
 * - Test registration and execution
 * - Test suite grouping
 * - Setup/teardown hooks
 * - Detailed error reporting with stack traces
 */

(function(global) {
  'use strict';

  class TestRunner {
    constructor() {
      this.suites = [];
      this.currentSuite = null;
      this.stats = {
        passed: 0,
        failed: 0,
        total: 0,
        suites: 0
      };
    }

    /**
     * Create a test suite
     */
    describe(suiteName, suiteFunction) {
      const suite = {
        name: suiteName,
        tests: [],
        beforeEach: null,
        afterEach: null,
        beforeAll: null,
        afterAll: null
      };

      this.suites.push(suite);
      this.currentSuite = suite;

      // Execute the suite definition
      suiteFunction();

      this.currentSuite = null;
    }

    /**
     * Register a test
     */
    it(testName, testFunction) {
      if (!this.currentSuite) {
        throw new Error('Tests must be defined inside a describe() block');
      }

      this.currentSuite.tests.push({
        name: testName,
        fn: testFunction
      });
    }

    /**
     * Setup hook - runs before each test
     */
    beforeEach(fn) {
      if (!this.currentSuite) {
        throw new Error('beforeEach must be called inside a describe() block');
      }
      this.currentSuite.beforeEach = fn;
    }

    /**
     * Teardown hook - runs after each test
     */
    afterEach(fn) {
      if (!this.currentSuite) {
        throw new Error('afterEach must be called inside a describe() block');
      }
      this.currentSuite.afterEach = fn;
    }

    /**
     * Setup hook - runs once before all tests in suite
     */
    beforeAll(fn) {
      if (!this.currentSuite) {
        throw new Error('beforeAll must be called inside a describe() block');
      }
      this.currentSuite.beforeAll = fn;
    }

    /**
     * Teardown hook - runs once after all tests in suite
     */
    afterAll(fn) {
      if (!this.currentSuite) {
        throw new Error('afterAll must be called inside a describe() block');
      }
      this.currentSuite.afterAll = fn;
    }

    /**
     * Run all registered tests
     */
    async run() {
      this.stats = {
        passed: 0,
        failed: 0,
        total: 0,
        suites: 0
      };

      this.log('\n========================================');
      this.log('🧪 Test Runner Started');
      this.log('========================================\n');

      const startTime = Date.now();

      for (const suite of this.suites) {
        await this.runSuite(suite);
      }

      const duration = Date.now() - startTime;

      this.log('\n========================================');
      this.log('📊 Test Results Summary');
      this.log('========================================');
      this.log(`Suites: ${this.stats.suites}`);
      this.log(`Tests:  ${this.stats.total}`);
      this.log(`✅ Passed: ${this.stats.passed}`);
      this.log(`❌ Failed: ${this.stats.failed}`);
      this.log(`Duration: ${duration}ms`);
      this.log('========================================\n');

      return this.stats.failed === 0;
    }

    /**
     * Run a test suite
     */
    async runSuite(suite) {
      this.stats.suites++;
      this.log(`\n📦 Suite: ${suite.name}`);
      this.log('─'.repeat(40));

      // Run beforeAll hook
      if (suite.beforeAll) {
        try {
          await suite.beforeAll();
        } catch (error) {
          this.log(`❌ beforeAll hook failed: ${error.message}`);
          this.logError(error);
          return;
        }
      }

      // Run each test
      for (const test of suite.tests) {
        await this.runTest(suite, test);
      }

      // Run afterAll hook
      if (suite.afterAll) {
        try {
          await suite.afterAll();
        } catch (error) {
          this.log(`⚠️  afterAll hook failed: ${error.message}`);
          this.logError(error);
        }
      }
    }

    /**
     * Run a single test
     */
    async runTest(suite, test) {
      this.stats.total++;

      try {
        // Run beforeEach hook
        if (suite.beforeEach) {
          await suite.beforeEach();
        }

        // Run the test
        await test.fn();

        // Run afterEach hook
        if (suite.afterEach) {
          await suite.afterEach();
        }

        this.stats.passed++;
        this.log(`  ✅ ${test.name}`);
      } catch (error) {
        this.stats.failed++;
        this.log(`  ❌ ${test.name}`);
        this.log(`     Error: ${error.message}`);
        this.logError(error);
      }
    }

    /**
     * Log error with stack trace
     */
    logError(error) {
      if (error.stack) {
        const stackLines = error.stack.split('\n').slice(1, 4);
        stackLines.forEach(line => {
          this.log(`     ${line.trim()}`);
        });
      }
    }

    /**
     * Logging utility
     */
    log(message) {
      if (typeof console !== 'undefined') {
        console.log(message);
      }
    }

    /**
     * Reset the runner (useful for multiple test runs)
     */
    reset() {
      this.suites = [];
      this.currentSuite = null;
      this.stats = {
        passed: 0,
        failed: 0,
        total: 0,
        suites: 0
      };
    }
  }

  // ========================================
  // Assertion Functions
  // ========================================

  class AssertionError extends Error {
    constructor(message) {
      super(message);
      this.name = 'AssertionError';
    }
  }

  /**
   * Assert that two values are equal
   */
  function assertEqual(actual, expected, message) {
    const defaultMessage = `Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`;
    if (actual !== expected) {
      throw new AssertionError(message || defaultMessage);
    }
  }

  /**
   * Assert that a value is truthy
   */
  function assertTrue(value, message) {
    const defaultMessage = `Expected truthy value, but got ${JSON.stringify(value)}`;
    if (!value) {
      throw new AssertionError(message || defaultMessage);
    }
  }

  /**
   * Assert that a value is falsy
   */
  function assertFalse(value, message) {
    const defaultMessage = `Expected falsy value, but got ${JSON.stringify(value)}`;
    if (value) {
      throw new AssertionError(message || defaultMessage);
    }
  }

  /**
   * Assert that a function throws an error
   */
  function assertThrows(fn, expectedErrorType, message) {
    let didThrow = false;
    let thrownError = null;

    try {
      fn();
    } catch (error) {
      didThrow = true;
      thrownError = error;
    }

    if (!didThrow) {
      throw new AssertionError(message || 'Expected function to throw an error, but it did not');
    }

    if (expectedErrorType && !(thrownError instanceof expectedErrorType)) {
      throw new AssertionError(
        message || `Expected error of type ${expectedErrorType.name}, but got ${thrownError.constructor.name}`
      );
    }
  }

  /**
   * Assert that two values are deeply equal (for objects/arrays)
   */
  function assertDeepEqual(actual, expected, message) {
    const actualStr = JSON.stringify(actual);
    const expectedStr = JSON.stringify(expected);

    if (actualStr !== expectedStr) {
      throw new AssertionError(
        message || `Expected ${expectedStr}, but got ${actualStr}`
      );
    }
  }

  /**
   * Assert that a value is null
   */
  function assertNull(value, message) {
    if (value !== null) {
      throw new AssertionError(message || `Expected null, but got ${JSON.stringify(value)}`);
    }
  }

  /**
   * Assert that a value is not null
   */
  function assertNotNull(value, message) {
    if (value === null) {
      throw new AssertionError(message || 'Expected value to not be null');
    }
  }

  /**
   * Assert that a value is undefined
   */
  function assertUndefined(value, message) {
    if (value !== undefined) {
      throw new AssertionError(message || `Expected undefined, but got ${JSON.stringify(value)}`);
    }
  }

  // ========================================
  // Export for different environments
  // ========================================

  const runner = new TestRunner();

  const API = {
    // Test runner instance
    runner,

    // Core test functions
    describe: runner.describe.bind(runner),
    it: runner.it.bind(runner),
    beforeEach: runner.beforeEach.bind(runner),
    afterEach: runner.afterEach.bind(runner),
    beforeAll: runner.beforeAll.bind(runner),
    afterAll: runner.afterAll.bind(runner),
    run: runner.run.bind(runner),
    reset: runner.reset.bind(runner),

    // Assertions
    assertEqual,
    assertTrue,
    assertFalse,
    assertThrows,
    assertDeepEqual,
    assertNull,
    assertNotNull,
    assertUndefined,
    AssertionError
  };

  // Node.js environment
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
  }

  // Browser environment
  if (typeof window !== 'undefined') {
    window.TestRunner = API;
  }

  // Global export for both environments
  global.TestRunner = API;

})(typeof window !== 'undefined' ? window : global);
