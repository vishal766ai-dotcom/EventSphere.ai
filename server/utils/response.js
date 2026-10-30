/**
 * @file server/utils/response.js
 * @description Standardized API response utilities for consistent client-server contracts.
 * @module utils/response
 */

import { HTTP_STATUS } from '../config/constants.js';

/**
 * Sends a successful standardized JSON response.
 * @param {import('express').Response} res - Express response object.
 * @param {any} data - Response payload.
 * @param {string} [message] - Optional success message.
 * @param {number} [statusCode=HTTP_STATUS.OK] - HTTP status code.
 * @param {Record<string, any>} [meta={}] - Additional metadata.
 */
export function sendSuccess(res, data, message = 'Success', statusCode = HTTP_STATUS.OK, meta = {}) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      ...meta
    }
  });
}

/**
 * Sends a standardized error JSON response.
 * @param {import('express').Response} res - Express response object.
 * @param {string} error - Error description.
 * @param {number} [statusCode=HTTP_STATUS.INTERNAL_SERVER_ERROR] - HTTP status code.
 * @param {string} [errorCode='ERR_UNKNOWN'] - Machine-readable error code.
 */
export function sendError(res, error = 'An unexpected error occurred', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errorCode = 'ERR_INTERNAL') {
  return res.status(statusCode).json({
    success: false,
    error,
    errorCode,
    timestamp: new Date().toISOString()
  });
}
