/**
 * @file server/config/constants.js
 * @description Centralized application constants and configurations for EventSphere.ai.
 * Provides immutable configuration dictionaries for SLAs, HTTP status codes,
 * dark-store hubs, zero-damage warranties, and budget allocation ratios.
 * @module config/constants
 */

export const APP_CONFIG = Object.freeze({
  NAME: 'EventSphere.ai',
  VERSION: '2.0.0',
  DEFAULT_PIN_CODE: '560038',
  DEFAULT_PORT: 5000,
  CLIENT_TIMEOUT_MS: 15000,
  EXPRESS_SLA_MINUTES_MIN: 90,
  EXPRESS_SLA_MINUTES_MAX: 120
});

export const WARRANTY_CONFIG = Object.freeze({
  PAINT_PROTECTION_AMOUNT_INR: 2000,
  SOP_REFERENCE: '#ZERO-DAMAGE-2026',
  FRAME_TYPE: 'Freestanding silicone-padded metal arch',
  ADHESIVE_POLICY: 'Strict zero-nail, removable masking tape only'
});

export const BUDGET_RATIOS = Object.freeze({
  CATERING: 0.50,
  DECOR: 0.20,
  DESSERT: 0.15,
  LOGISTICS_AND_OPS: 0.15
});

export const ESCROW_STATUS = Object.freeze({
  HELD: 'HELD_IN_ESCROW',
  VERIFICATION_PENDING: 'VERIFICATION_PENDING',
  RELEASED: 'FUNDS_RELEASED_TO_VENDOR',
  DISPUTED: 'DISPUTE_RAISED'
});

export const DARK_STORES = Object.freeze([
  {
    hubId: 'HUB-BLR-401',
    name: 'Indiranagar Hub 401',
    zone: 'East Bangalore',
    postalCodes: ['560038', '560008', '560075', '560001'],
    coordinates: { lat: 12.9716, lng: 77.6412 },
    averageExpressEtaMinutes: 85
  },
  {
    hubId: 'HUB-BLR-502',
    name: 'Koramangala FastHub 5th Block',
    zone: 'South-East Bangalore',
    postalCodes: ['560034', '560095', '560047', '560068'],
    coordinates: { lat: 12.9352, lng: 77.6245 },
    averageExpressEtaMinutes: 90
  },
  {
    hubId: 'HUB-MUM-101',
    name: 'Bandra West Coastal FastHub',
    zone: 'Western Mumbai',
    postalCodes: ['400050', '400052', '400054', '400055'],
    coordinates: { lat: 19.0596, lng: 72.8295 },
    averageExpressEtaMinutes: 95
  },
  {
    hubId: 'HUB-DEL-201',
    name: 'Hauz Khas Heritage FastHub',
    zone: 'South Delhi',
    postalCodes: ['110016', '110017', '110029', '110049'],
    coordinates: { lat: 28.5494, lng: 77.2001 },
    averageExpressEtaMinutes: 90
  }
]);

export const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500
});
