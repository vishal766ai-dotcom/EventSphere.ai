import assert from 'assert';
import { sanitizeInputs, securityHeaders } from '../server/middleware/security.js';
import { createRateLimiter } from '../server/middleware/rateLimiter.js';

console.log("🧪 Running Security & Protection Middleware Unit Tests...");

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

// Test 1: OWASP Security Headers
runTest("securityHeaders middleware injects all OWASP-recommended headers", () => {
  const headers = {};
  const mockRes = {
    setHeader(k, v) { headers[k] = v; }
  };
  securityHeaders({}, mockRes, () => {});

  assert.strictEqual(headers['X-Content-Type-Options'], 'nosniff');
  assert.strictEqual(headers['X-Frame-Options'], 'DENY');
  assert.strictEqual(headers['X-XSS-Protection'], '1; mode=block');
  assert.ok(headers['Content-Security-Policy'].includes("default-src 'self'"));
  assert.ok(headers['Strict-Transport-Security'].includes("max-age=31536000"));
});

// Test 2: Input Sanitization against XSS
runTest("sanitizeInputs middleware removes <script> and dangerous protocols", () => {
  const mockReq = {
    body: {
      customerName: "Aakash <script>alert('pwned')</script>",
      address: "Flat 202, Indiranagar javascript:void(0)"
    }
  };
  sanitizeInputs(mockReq, {}, () => {});

  assert.strictEqual(mockReq.body.customerName, "Aakash");
  assert.strictEqual(mockReq.body.address, "Flat 202, Indiranagar void(0)");
});

// Test 3: Rate Limiter enforcement
runTest("createRateLimiter limits rapid requests exceeding threshold", () => {
  const limiter = createRateLimiter({ windowMs: 1000, max: 2 });
  const mockReq = { headers: {}, socket: { remoteAddress: '192.168.1.100' } };
  
  let lastStatus = 200;
  const mockRes = {
    setHeader() {},
    status(code) {
      lastStatus = code;
      return { json: () => {} };
    }
  };

  limiter(mockReq, mockRes, () => {}); // Hit 1 -> OK
  assert.strictEqual(lastStatus, 200);

  limiter(mockReq, mockRes, () => {}); // Hit 2 -> OK
  assert.strictEqual(lastStatus, 200);

  limiter(mockReq, mockRes, () => {}); // Hit 3 -> 429 Rate Limit
  assert.strictEqual(lastStatus, 429);
});

console.log(`\n📊 Security Tests: ${passed}/${total} passed.\n`);
if (passed !== total) process.exit(1);
