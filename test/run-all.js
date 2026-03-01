/**
 * Run all test files
 * Usage: node test/run-all.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const testDir = __dirname;
const testFiles = fs.readdirSync(testDir)
  .filter(file => file.endsWith('.test.js'))
  .sort();

console.log('\n' + '='.repeat(50));
console.log('🚀 Running All Tests');
console.log('='.repeat(50) + '\n');

let totalPassed = 0;
let totalFailed = 0;
let failedFiles = [];

testFiles.forEach((file, index) => {
  console.log(`\n[${ index + 1 }/${testFiles.length}] Running ${file}...`);
  console.log('-'.repeat(50));

  try {
    const output = execSync(`node ${path.join(testDir, file)}`, {
      encoding: 'utf8',
      stdio: 'pipe'
    });

    console.log(output);

    // Parse output for statistics (simple regex matching)
    const passedMatch = output.match(/✅ Passed: (\d+)/);
    const failedMatch = output.match(/❌ Failed: (\d+)/);

    if (passedMatch) totalPassed += parseInt(passedMatch[1]);
    if (failedMatch) {
      const failed = parseInt(failedMatch[1]);
      totalFailed += failed;
      if (failed > 0) {
        failedFiles.push(file);
      }
    }
  } catch (error) {
    console.error(`\n❌ Error running ${file}:`);
    console.error(error.stdout || error.message);
    failedFiles.push(file);
  }
});

console.log('\n' + '='.repeat(50));
console.log('📊 Overall Test Results');
console.log('='.repeat(50));
console.log(`Test files: ${testFiles.length}`);
console.log(`✅ Total Passed: ${totalPassed}`);
console.log(`❌ Total Failed: ${totalFailed}`);

if (failedFiles.length > 0) {
  console.log(`\n⚠️  Failed test files:`);
  failedFiles.forEach(file => console.log(`   - ${file}`));
}

console.log('='.repeat(50) + '\n');

// Exit with error code if any tests failed
process.exit(totalFailed > 0 || failedFiles.length > 0 ? 1 : 0);
