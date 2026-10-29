/**
 * In-Memory Sliding-Window Rate Limiter
 * Protects against denial-of-service and API key abuse without external dependencies.
 */
export function createRateLimiter(options = {}) {
  const windowMs = options.windowMs || 60 * 1000; // 1 minute default
  const max = options.max || 100; // 100 requests per window
  const message = options.message || { error: 'Too many requests, please try again later.' };

  const hits = new Map();

  // Periodic cleanup every 2 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [ip, timestamps] of hits.entries()) {
      const valid = timestamps.filter(t => now - t < windowMs);
      if (valid.length === 0) {
        hits.delete(ip);
      } else {
        hits.set(ip, valid);
      }
    }
  }, 120000).unref();

  return (req, res, next) => {
    // In test environment, bypass rate limiter
    if (process.env.NODE_ENV === 'test') {
      return next();
    }

    const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown-client';
    const now = Date.now();

    const clientHits = hits.get(ip) || [];
    const recentHits = clientHits.filter(timestamp => now - timestamp < windowMs);

    if (recentHits.length >= max) {
      res.setHeader('Retry-After', Math.ceil(windowMs / 1000));
      return res.status(429).json(message);
    }

    recentHits.push(now);
    hits.set(ip, recentHits);

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - recentHits.length));

    next();
  };
}
