# 🔒 Security Policy & Architectural Safeguards — EventSphere.ai

## 1. Security Overview
**EventSphere.ai** adheres to the principle of **Defense-in-Depth**, implementing security controls across network transport, application runtime, input sanitization, API rate limiting, and cryptographic escrow state machines.

---

## 2. OWASP Top 10 Mitigation Matrix

| Vulnerability Category | Risk Description | EventSphere.ai Mitigation | Implementation Location |
| :--- | :--- | :--- | :--- |
| **A01: Broken Access Control** | Unauthorized escrow release or parameter tampering. | Cryptographic 4-digit OTP handover protocol required to release funds from escrow. | `server/routes/escrow.js` |
| **A02: Cryptographic Failures** | Eavesdropping or credential exposure. | Enforced HTTPS with HSTS (`max-age=31536000`), secure base64 secret obfuscation. | `server/middleware/security.js` |
| **A03: Injection (XSS & NoSQL)** | Malicious scripts injected via guest names or addresses. | Automated input sanitization stripping `<script>` tags, protocols, and control characters. | `server/middleware/security.js` |
| **A04: Insecure Design** | Vendor fraud, host non-payment, or paint damage disputes. | Milestone photo proof verification + ₹2,000 paint-damage protection warranty. | `server/routes/escrow.js`, `sopsData.js` |
| **A05: Security Misconfiguration** | Clickjacking, MIME sniffing, missing CSP. | Explicit headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, strict CSP. | `server/middleware/security.js` |
| **A06: Vulnerable Dependencies** | Outdated or unvetted NPM packages. | Zero non-standard dependencies; minimal surface area with automated lockfile validation. | `package.json` |
| **A07: Identification & Auth** | API key abuse or token exhaustion. | Sliding-window rate limiting (120 req/min general, 40 req/min for GenAI endpoints). | `server/middleware/rateLimiter.js` |
| **A08: Software & Data Integrity** | Data payload tampering in transit. | Schema validation enforcing 6-digit Indian PIN regex and positive budget bounds. | `server/middleware/validator.js` |
| **A09: Logging & Monitoring** | Silent failures or unmonitored attacks. | Structured JSON audit logging with unique `X-Request-Id` tracking and latency metrics. | `server/middleware/auditLog.js` |
| **A10: Server-Side Request Forgery** | Malicious external SSRF endpoints. | Fixed egress routing targeting authorized Google APIs only with domain circuit breakers. | `server/routes/gemini.js` |

---

## 3. Rate Limiting Architecture
To safeguard platform availability against denial-of-service (DoS) and generative AI quota exhaustion:
- **General Endpoints**: 120 requests per minute per IP address.
- **Generative AI Endpoints (`/api/gemini`, `/api/guest-bot`)**: 40 requests per minute per IP address with standard `Retry-After` headers.
- **Automatic In-Memory Cleanup**: Stale IP entries are garbage-collected every 2 minutes without memory leaks.

---

## 4. Reporting a Security Vulnerability
If you discover a security vulnerability in EventSphere.ai, please report it via email to `security@eventsphere.ai` or submit a private security advisory through GitHub. Reports are acknowledged within 24 hours with coordinated vulnerability disclosure protocols.
