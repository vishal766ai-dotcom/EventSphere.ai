/**
 * @file server/middleware/auditLog.js
 * @description Security and operational audit logging middleware.
 * Attaches unique X-Request-ID and logs timing, method, and client metadata.
 * @module middleware/auditLog
 */

import crypto from 'crypto';

/**
 * Audit log middleware tracking API invocations for security auditing.
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export function auditLogger(req, res, next) {
  const requestId = req.headers['x-request-id'] || crypto.randomUUID();
  req.id = requestId;
  res.setHeader('X-Request-Id', requestId);

  const startTime = process.hrtime();

  res.on('finish', () => {
    // Only log non-test requests or slow requests
    if (process.env.NODE_ENV !== 'test') {
      const diff = process.hrtime(startTime);
      const latencyMs = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);
      const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';

      // Log in structured JSON format for Cloud Logging / Datadog
      if (res.statusCode >= 400 || latencyMs > 500) {
        console.log(JSON.stringify({
          type: 'AUDIT_LOG',
          requestId,
          method: req.method,
          path: req.originalUrl || req.url,
          status: res.statusCode,
          latencyMs,
          clientIp: String(clientIp).split(',')[0].trim(),
          timestamp: new Date().toISOString()
        }));
      }
    }
  });

  next();
}
