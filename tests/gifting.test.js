import assert from 'assert';
import { giftingCatalog, giftingLogisticsSOP } from '../server/data/giftingData.js';

console.log("🧪 Running Return Gifting & All-Ages Suite Unit Tests...");

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

// Test 1: All 4 age brackets present
runTest("Return gifts cover all required demographics: Kids, Teens, Adults, Seniors", () => {
  const ageGroups = giftingCatalog.map(g => g.ageGroup);
  assert.ok(ageGroups.some(g => g.includes("Kids")), "Must include Kids return gifts");
  assert.ok(ageGroups.some(g => g.includes("Teens")), "Must include Teens return gifts");
  assert.ok(ageGroups.some(g => g.includes("Adults")), "Must include Adults return gifts");
  assert.ok(ageGroups.some(g => g.includes("Seniors")), "Must include Seniors return gifts");
});

// Test 2: Gifting Process SOP
runTest("4-Step Gifting SOP is completely structured", () => {
  assert.strictEqual(giftingLogisticsSOP.steps.length, 4, "Must have exact 4-step procurement SOP");
  assert.strictEqual(giftingLogisticsSOP.steps[0].step, 1);
  assert.strictEqual(giftingLogisticsSOP.steps[3].step, 4);
});

// Test 3: Eco-friendly certifications
runTest("Every age category includes eco-friendly / zero-waste options", () => {
  giftingCatalog.forEach(group => {
    const hasEcoOption = group.items.some(item => item.ecoCertified === true);
    assert.ok(hasEcoOption, `${group.ageGroup} must feature at least 1 eco-certified gift`);
  });
});

// Test 4: Pricing integrity
runTest("Return gift unit prices adhere to realistic Indian event budgets (₹150 to ₹900)", () => {
  giftingCatalog.forEach(group => {
    group.items.forEach(item => {
      assert.ok(item.pricePerUnit >= 150, "Item price must be >= ₹150");
      assert.ok(item.pricePerUnit <= 900, "Item price must be <= ₹900");
    });
  });
});

console.log(`\n📊 Return Gifting Tests: ${passed}/${total} passed.\n`);
if (passed !== total) process.exit(1);
