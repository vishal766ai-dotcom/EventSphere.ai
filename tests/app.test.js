process.env.NODE_ENV = 'test';
import app from '../server/index.js';

const TEST_PORT = 5199;

async function runTests() {
  const server = app.listen(TEST_PORT, '127.0.0.1', async () => {
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
        console.log(`  ✅ [PASS] ${name}`);
        passed++;
        return data;
      } catch (err) {
        console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
        failed++;
        return null;
      }
    }

    try {
      // 1. Health check
      await testEndpoint("Health check /health", "/health");

      // 2. Packages with honest aesthetic
      const packages = await testEndpoint("Packages list /api/packages", "/api/packages");
      if (packages && packages.count >= 4) {
        console.log(`     ✨ Verified ${packages.count} Honest Blueprint packages loaded`);
      }

      // 3. Location-based dispatch check
      const dispatch = await testEndpoint("Location-based dispatch /api/vendors/dispatch-check/560038", "/api/vendors/dispatch-check/560038");
      if (dispatch && dispatch.dispatchEligible) {
        console.log(`     ✨ Verified dark store hub: ${dispatch.assignedDarkStore.name}, ETA: ${dispatch.estimatedExpressEtaMinutes} mins`);
      }

      // 4. Reverse Budget Planner
      const budgetTest = await testEndpoint("Reverse Budget calculation /api/reverse-budget/calculate", "/api/reverse-budget/calculate", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guestCount: 40, eventType: "1st Birthday", totalBudget: 25000, pinCode: "560038" })
      });
      if (budgetTest && budgetTest.strictlyWithinCap) {
        console.log(`     ✨ Verified Reverse Budget strictly within ₹25,000 cap! Total: ₹${budgetTest.calculatedTotal}`);
      }

      // 5. Express Party Dispatch
      const expressTest = await testEndpoint("Express Party Dispatch /api/express/dispatch", "/api/express/dispatch", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerName: "Aakash Gupta", address: "Flat 202, Indiranagar", pinCode: "560038", packageId: "PKG-NEON-GLOW" })
      });
      if (expressTest && expressTest.success) {
        console.log(`     ✨ Verified Express dispatch created: ${expressTest.order.orderId}, ETA: ${expressTest.order.etaMinutes}m`);
      }

      // 6. Escrow Vault
      const escrow = await testEndpoint("Escrow Vault /api/escrow", "/api/escrow");
      if (escrow && escrow.status === "HELD_IN_ESCROW") {
        console.log(`     ✨ Verified Escrow Protection active with ${escrow.milestones.length} milestones`);
      }

      // 7. Host Control Room
      const controlRoom = await testEndpoint("Host Control Room /api/control-room", "/api/control-room");
      if (controlRoom && controlRoom.hostControlRoom?.liveStatus === "ACTIVE") {
        console.log(`     ✨ Verified Day-of Host Control Room active with live GPS vendor telematics`);
      }

      // 8. Crowd Gifting Pool
      const pool = await testEndpoint("Crowd Pool /api/crowd-pool/POOL-COLLEGE-FAREWELL", "/api/crowd-pool/POOL-COLLEGE-FAREWELL");
      if (pool && pool.poolId) {
        console.log(`     ✨ Verified Crowd Pool: ${pool.title}, Target: ₹${pool.targetAmount}`);
      }

      // 9. WhatsApp Guest Bot
      const botResponse = await testEndpoint("WhatsApp Guest Bot /api/guest-bot/query", "/api/guest-bot/query", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: "Where is visitor parking?" })
      });
      if (botResponse && botResponse.answer) {
        console.log(`     ✨ Verified WhatsApp Guest Assistant replied: "${botResponse.answer.slice(0, 40)}..."`);
      }

      // 10. Decor Visualizer Wall Analysis
      const visualTest = await testEndpoint("Living Room Visualizer /api/decor-visualizer/analyze-fitting", "/api/decor-visualizer/analyze-fitting", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallDescription: "10x12 ft living room wall in rented apartment", selectedPackageId: "PKG-NEON-GLOW" })
      });
      if (visualTest && visualTest.wallSpecs) {
        console.log(`     ✨ Verified Decor Visualizer: ${visualTest.package?.title} matched`);
      }
    } catch(err) {
      console.error("Test execution caught error:", err);
    } finally {
      console.log(`\n  =============================`);
      console.log(`  📊 Integration Summary: ${passed} PASSED, ${failed} FAILED`);
      console.log(`  =============================\n`);

      process.exitCode = failed > 0 ? 1 : 0;
      server.close(() => {
        process.exit(process.exitCode);
      });
      setTimeout(() => process.exit(process.exitCode), 400).unref();
    }
  });
}

runTests();
