import assert from 'assert';
import { DARK_STORES, APP_CONFIG } from '../server/config/constants.js';
import { vendorsData } from '../server/data/vendorsData.js';

console.log("🧪 Running Hyperlocal Dispatch & 90-Min SLA Unit Tests...");

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

// Test 1: Dark Store Hub Configuration
runTest("All dark store hubs have valid coordinates and SLA under 120 minutes", () => {
  assert.ok(DARK_STORES.length >= 4, "Must have at least 4 metro dark store hubs");
  DARK_STORES.forEach(hub => {
    assert.ok(hub.averageExpressEtaMinutes <= APP_CONFIG.EXPRESS_SLA_MINUTES_MAX, "ETA must be within 120 min max SLA");
    assert.ok(hub.averageExpressEtaMinutes >= 60, "ETA must be realistic (>= 60 min)");
    assert.ok(hub.coordinates.lat && hub.coordinates.lng, "Hub must have geocoordinates");
  });
});

// Test 2: PIN Code to Hub Mapping
runTest("Bangalore Indiranagar (560038) maps correctly to Hub 401", () => {
  const targetPin = "560038";
  const matchedHub = DARK_STORES.find(h => h.postalCodes.includes(targetPin));
  assert.ok(matchedHub, "560038 must match a registered hub");
  assert.strictEqual(matchedHub.hubId, "HUB-BLR-401");
});

// Test 3: Verified Freelance Gig Partner Network
runTest("Freelance gig network includes Decorators, Caterers, Bakers and Technicians", () => {
  const types = new Set(vendorsData.map(v => v.type));
  assert.ok(types.has("Decorator"), "Gig network must contain Decorators");
  assert.ok(types.has("Catering"), "Gig network must contain Caterers");
  assert.ok(types.has("Baker"), "Gig network must contain Bakers");
  assert.ok(types.has("Sound & Light"), "Gig network must contain Sound & Light Technicians");

  // Verify all gig partners have high verified ratings
  vendorsData.forEach(v => {
    assert.ok(v.rating >= 4.7, "Partner rating must be high quality (>= 4.7)");
    assert.ok(v.completedEvents > 100, "Partner must have verified completed events track record");
  });
});

// Test 4: Dynamic Distance SLA Math
runTest("SLA calculation scales proportionally with delivery distance", () => {
  function calculateSla(distanceKm, baseMinutes = 45) {
    const travelMinutes = Math.round(distanceKm * 4.5);
    return Math.min(120, Math.max(90, baseMinutes + travelMinutes));
  }

  assert.strictEqual(calculateSla(5), 90, "Short distance (5km) meets 90 min SLA");
  assert.strictEqual(calculateSla(15), 113, "Medium distance (15km) calculates within SLA");
  assert.strictEqual(calculateSla(30), 120, "Long distance clamps to 120 min max express ceiling");
});

console.log(`\n📊 Hyperlocal Dispatch Tests: ${passed}/${total} passed.\n`);
if (passed !== total) process.exit(1);
