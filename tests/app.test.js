// Automated integration test for EventSphere backend endpoints
process.env.NODE_ENV = 'test';
import http from 'http';
import app from '../server/index.js';

const TEST_PORT = 5098;
const server = http.createServer(app);

server.listen(TEST_PORT, '127.0.0.1', async () => {
  console.log(`🧪 Running automated tests on http://127.0.0.1:${TEST_PORT}...`);
  let passed = 0;
  let failed = 0;

  async function testEndpoint(name, path, options = {}) {
    try {
      const res = await fetch(`http://127.0.0.1:${TEST_PORT}${path}`, options);
      if (!res.ok) {
        throw new Error(`HTTP status ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      console.log(`✅ [PASS] ${name}`);
      passed++;
      return data;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  try {
    // 1. Health check
    await testEndpoint("Health check /health", "/health");

    // 2. Packages with honest aesthetic
    const packages = await testEndpoint("Packages list /api/packages", "/api/packages");
    if (packages && packages.count >= 4) {
      console.log(`   ✨ Verified ${packages.count} Honest Blueprint packages loaded`);
    }

    // 3. Location-based dispatch check
    const dispatch = await testEndpoint("Location-based dispatch /api/vendors/dispatch-check/560038", "/api/vendors/dispatch-check/560038");
    if (dispatch && dispatch.dispatchEligible) {
      console.log(`   ✨ Verified dark store hub: ${dispatch.assignedDarkStore.name}, ETA: ${dispatch.estimatedExpressEtaMinutes} mins`);
    }

    // 4. Reverse Budget Planner
    const budgetTest = await testEndpoint("Reverse Budget calculation /api/reverse-budget/calculate", "/api/reverse-budget/calculate", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestCount: 40, eventType: "1st Birthday", totalBudget: 25000, pinCode: "560038" })
    });
    if (budgetTest && budgetTest.strictlyWithinCap) {
      console.log(`   ✨ Verified Reverse Budget strictly within ₹25,000 cap! Total: ₹${budgetTest.calculatedTotal}`);
    }

    // 5. Express Party Dispatch
    const expressTest = await testEndpoint("Express Party Dispatch /api/express/dispatch", "/api/express/dispatch", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName: "Aakash Gupta", address: "Flat 202, Indiranagar", pinCode: "560038", packageId: "PKG-NEON-GLOW" })
    });
    if (expressTest && expressTest.success) {
      console.log(`   ✨ Verified Express dispatch created: ${expressTest.order.orderId}, ETA: ${expressTest.order.etaMinutes}m`);
    }

    // 6. Escrow Vault & Zero-Damage
    const escrowTest = await testEndpoint("Escrow Vault /api/escrow", "/api/escrow");
    if (escrowTest && escrowTest.totalEscrows > 0) {
      console.log(`   ✨ Verified Escrow funds protected: ₹${escrowTest.totalFundsProtected}`);
    }

    // 7. Day-of Live Control Room
    const controlTest = await testEndpoint("Host Control Room /api/control-room", "/api/control-room");
    if (controlTest && controlTest.vendorsTracking.length > 0) {
      console.log(`   ✨ Verified Live GPS Vendor Tracking: ${controlTest.vendorsTracking.length} active logistics pins`);
    }

    // 8. Shared Contribution Pool
    const poolTest = await testEndpoint("Crowd Pool /api/crowd-pool/POOL-COLLEGE-FAREWELL", "/api/crowd-pool/POOL-COLLEGE-FAREWELL");
    if (poolTest && poolTest.targetAmount === 30000) {
      console.log(`   ✨ Verified Crowd Gifting Pool: ₹${poolTest.collectedAmount}/₹${poolTest.targetAmount} (${poolTest.progressPercent}%)`);
    }

    // 9. WhatsApp Guest Assistant Bot
    const botTest = await testEndpoint("WhatsApp Guest Bot /api/guest-bot/query", "/api/guest-bot/query", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: "Where should I park my car?" })
    });
    if (botTest && botTest.answer) {
      console.log(`   ✨ Verified Guest Bot response: "${botTest.answer.slice(0, 50)}..."`);
    }

    // 10. Decor Visualizer Wall Analysis
    const visualTest = await testEndpoint("Living Room Visualizer /api/decor-visualizer/analyze-fitting", "/api/decor-visualizer/analyze-fitting", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ wallDescription: "10x12 ft living room wall in rented apartment", selectedPackageId: "PKG-NEON-GLOW" })
    });
    if (visualTest && visualTest.wallSpecs) {
      console.log(`   ✨ Verified Decor Visualizer: ${visualTest.package.title} matched`);
    }
  } finally {
    console.log(`\n=============================`);
    console.log(`📊 Test Summary: ${passed} PASSED, ${failed} FAILED`);
    console.log(`=============================\n`);

    process.exitCode = failed > 0 ? 1 : 0;
    server.close();
  }
});
