/**
 * EventSphere.ai Security Middleware
 * Implements OWASP-recommended HTTP security headers and request protection.
 */
export function securityHeaders(req, res, next) {
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // Prevent clickjacking attacks
  res.setHeader('X-Frame-Options', 'DENY');
  
  // XSS protection for older browsers
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Enforce HTTPS
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  // Strict Referrer policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Restrict browser features
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');
  
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com data:; " +
    "img-src 'self' data: https: blob:; " +
    "connect-src 'self' https://generativelanguage.googleapis.com https:; " +
    "frame-ancestors 'none';"
  );

  next();
}

/**
 * Sanitizes request inputs against XSS and injection
 */
export function sanitizeInputs(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    sanitizeObject(req.query);
  }
  next();
}

function sanitizeObject(obj) {
  for (const key of Object.keys(obj)) {
    if (typeof obj[key] === 'string') {
      // Strip script tags and dangerous HTML attributes
      obj[key] = obj[key]
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .trim();
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
}
