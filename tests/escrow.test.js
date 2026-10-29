import assert from 'assert';

console.log("🧪 Running Escrow & Milestone Verification Unit Tests...");

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

// Simulated Escrow Transaction State Machine
class MockEscrow {
  constructor(orderId, amount, clientPin = "7492") {
    this.orderId = orderId;
    this.amount = amount;
    this.clientPin = clientPin;
    this.status = "HELD_IN_ESCROW";
    this.milestones = [
      { name: "Gig Partner Dispatched", completed: true, timestamp: new Date().toISOString() },
      { name: "On-Site Check-In", completed: false, photoUrl: null },
      { name: "Setup Completed & Blueprint Verified", completed: false, photoUrl: null },
      { name: "Client 4-Digit OTP Handover", completed: false, timestamp: null }
    ];
  }

  submitSetupPhoto(photoUrl) {
    if (this.status !== "HELD_IN_ESCROW") throw new Error("Invalid escrow state");
    this.milestones[1].completed = true;
    this.milestones[2].completed = true;
    this.milestones[2].photoUrl = photoUrl;
    this.status = "VERIFICATION_PENDING";
  }

  verifyAndRelease(inputPin) {
    if (this.status !== "VERIFICATION_PENDING") throw new Error("Photos not verified yet");
    if (inputPin !== this.clientPin) throw new Error("Invalid 4-digit verification OTP");
    this.milestones[3].completed = true;
    this.milestones[3].timestamp = new Date().toISOString();
    this.status = "FUNDS_RELEASED_TO_VENDOR";
    return true;
  }
}

// Test 1: Initial Escrow State
runTest("Escrow transaction initializes with HELD_IN_ESCROW status", () => {
  const escrow = new MockEscrow("ORD-9021", 5999, "8821");
  assert.strictEqual(escrow.status, "HELD_IN_ESCROW");
  assert.strictEqual(escrow.amount, 5999);
});

// Test 2: Milestone photo submission
runTest("Decorator setup photo submission transitions to VERIFICATION_PENDING", () => {
  const escrow = new MockEscrow("ORD-9021", 5999, "8821");
  escrow.submitSetupPhoto("https://example.com/verified-arch.jpg");
  assert.strictEqual(escrow.status, "VERIFICATION_PENDING");
  assert.strictEqual(escrow.milestones[2].completed, true);
});

// Test 3: Incorrect OTP rejection
runTest("Incorrect 4-digit OTP throws error and protects client escrow funds", () => {
  const escrow = new MockEscrow("ORD-9021", 5999, "8821");
  escrow.submitSetupPhoto("https://example.com/verified-arch.jpg");
  assert.throws(() => {
    escrow.verifyAndRelease("0000"); // Wrong PIN
  }, /Invalid 4-digit verification OTP/);
  assert.strictEqual(escrow.status, "VERIFICATION_PENDING");
});

// Test 4: Correct OTP release
runTest("Correct 4-digit OTP releases funds to gig vendor", () => {
  const escrow = new MockEscrow("ORD-9021", 5999, "8821");
  escrow.submitSetupPhoto("https://example.com/verified-arch.jpg");
  const success = escrow.verifyAndRelease("8821");
  assert.strictEqual(success, true);
  assert.strictEqual(escrow.status, "FUNDS_RELEASED_TO_VENDOR");
  assert.strictEqual(escrow.milestones[3].completed, true);
});

console.log(`\n📊 Escrow Milestone Tests: ${passed}/${total} passed.\n`);
if (passed !== total) process.exit(1);
