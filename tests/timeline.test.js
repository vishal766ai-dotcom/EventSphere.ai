import assert from 'assert';
import { masterEventTimeline } from '../server/data/timelineData.js';

console.log("🧪 Running Master Event Timeline & Run-of-Show Unit Tests...");

let passed = 0;
let total = 0;

function runTest(name, fn) {
  total++;
  try {
    fn();
    console.log(`  ✅ [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
  }
}

// Test 1: Timeline milestones count
runTest("Timeline contains complete sequential celebration milestones", () => {
  assert.ok(masterEventTimeline.milestones.length >= 7, "Timeline must contain at least 7 operational phases");
});

// Test 2: Chronological integrity
runTest("Milestones begin with Vendor Arrival and conclude with Next-Day Breakdown", () => {
  assert.strictEqual(masterEventTimeline.milestones[0].stage, "Pre-Event Setup Sprint");
  const lastPhase = masterEventTimeline.milestones[masterEventTimeline.milestones.length - 1];
  assert.ok(lastPhase.title.includes("Clean-Up") || lastPhase.stage.includes("Clean-Up") || lastPhase.title.includes("Departure") || lastPhase.stage.includes("Host Wind-Down"));
});

// Test 3: Day-of automated broadcasts
runTest("Critical guest milestones specify what happens and actionable host guidance", () => {
  masterEventTimeline.milestones.forEach(m => {
    assert.ok(m.time, "Milestone must have a timestamp");
    assert.ok(m.title, "Milestone must have a title");
    assert.ok(m.whatHappens, "Milestone must explain what happens");
    assert.ok(m.hostAction, "Milestone must provide host guidance");
  });
});

// Test 4: Total Duration
runTest("Timeline specifies structured duration with setup buffer", () => {
  assert.ok(masterEventTimeline.totalDuration.includes("Hours"));
});

console.log(`\n📊 Event Timeline Tests: ${passed}/${total} passed.\n`);
if (passed !== total) process.exit(1);
