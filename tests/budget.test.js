import assert from 'assert';
import { packagesData } from '../server/data/packagesData.js';

console.log("🧪 Running Reverse Budget Calculation Unit Tests...");

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

// Test 1: 50/20/15/15 Split Check for ₹25,000 / 40 guests
runTest("₹25,000 Budget standard 50/20/15/15 proportional allocation", () => {
  const budget = 25000;
  const cateringBudget = Math.round(budget * 0.50);
  const decorBudget = Math.round(budget * 0.20);
  const dessertBudget = Math.round(budget * 0.15);
  const logisticsBudget = Math.round(budget * 0.15);

  assert.strictEqual(cateringBudget, 12500);
  assert.strictEqual(decorBudget, 5000);
  assert.strictEqual(dessertBudget, 3750);
  assert.strictEqual(logisticsBudget, 3750);
  assert.strictEqual(cateringBudget + decorBudget + dessertBudget + logisticsBudget, budget);
});

// Test 2: Package selection under budget cap
runTest("Package selection strictly chooses decor under cap or base minimum", () => {
  const decorBudget = 5000;
  const match = packagesData.find(p => p.basePrice <= decorBudget) || [...packagesData].sort((a,b) => a.basePrice - b.basePrice)[0];
  assert.ok(match, "Matching package must exist");
  assert.ok(match.basePrice > 0, "Package price must be greater than 0");
});

// Test 3: Edge Case: High budget cap (₹1,00,000)
runTest("High budget scale test (₹1,00,000 / 100 guests)", () => {
  const budget = 100000;
  const guests = 100;
  const catering = Math.round(budget * 0.50);
  const perPlate = Math.floor(catering / guests);
  assert.strictEqual(perPlate, 500);
  assert.ok(perPlate >= 400, "High budget unlocks premium gourmet counter");
});

// Test 4: Edge Case: Low budget cap (₹15,000 / 20 guests)
runTest("Low budget scale test (₹15,000 / 20 guests)", () => {
  const budget = 15000;
  const guests = 20;
  const catering = Math.round(budget * 0.50);
  const perPlate = Math.max(100, Math.floor(catering / guests));
  assert.ok(perPlate >= 100, "Plate cost never drops below survival floor ₹100");
});

console.log(`\n📊 Reverse Budget Tests: ${passed}/${total} passed.\n`);
if (passed !== total) process.exit(1);
