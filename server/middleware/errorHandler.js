/**
 * @file server/middleware/errorHandler.js
 * @description Centralized application error handling middleware.
 * Ensures internal details are masked in production while returning clean JSON.
 * @module middleware/errorHandler
 */

import { HTTP_STATUS } from '../config/constants.js';

/**
 * Global Express error handling middleware.
 * @param {Error} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} _next
 */
export function errorHandler(err, req, res, _next) {
  const isProduction = process.env.NODE_ENV === 'production';
  const statusCode = err.statusCode || err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  // Mask sensitive database or stack traces in production
  const message = isProduction && statusCode === HTTP_STATUS.INTERNAL_SERVER_ERROR
    ? 'An internal server error occurred. Our operations desk has been notified.'
    : err.message || 'Internal server error';

  if (!isProduction && process.env.NODE_ENV !== 'test') {
    console.error('💥 Unhandled Exception:', err);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
    errorCode: err.code || 'ERR_INTERNAL',
    requestId: req.id || 'N/A',
    timestamp: new Date().toISOString()
  });
}
