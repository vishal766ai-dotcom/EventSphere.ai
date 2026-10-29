/**
 * HTTP Caching Middleware
 * Sets appropriate Cache-Control and ETag headers for static datasets to improve response time and efficiency.
 */
export function cacheControl(maxAgeSeconds = 60) {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method === 'GET') {
      res.setHeader('Cache-Control', `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${maxAgeSeconds * 2}`);
      res.setHeader('Vary', 'Accept-Encoding, Origin');
    } else {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    }
    next();
  };
}
