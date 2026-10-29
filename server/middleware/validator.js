/**
 * Input Validation & Schema Verification Middleware
 */
export function validateBudgetRequest(req, res, next) {
  const { totalBudget, guestCount, pinCode } = req.body || {};

  if (totalBudget !== undefined) {
    const budget = Number(totalBudget);
    if (isNaN(budget) || budget <= 0 || budget > 10000000) {
      return res.status(400).json({ error: 'Invalid budget amount. Must be a positive number under ₹1 Crore.' });
    }
  }

  if (guestCount !== undefined) {
    const guests = Number(guestCount);
    if (isNaN(guests) || guests <= 0 || guests > 5000) {
      return res.status(400).json({ error: 'Invalid guest count. Must be between 1 and 5,000.' });
    }
  }

  if (pinCode !== undefined) {
    const pinStr = String(pinCode).trim();
    if (!/^[1-9][0-9]{5}$/.test(pinStr)) {
      return res.status(400).json({ error: 'Invalid Indian PIN Code. Must be exactly 6 digits starting with 1-9.' });
    }
  }

  next();
}

export function validatePinCodeParam(req, res, next) {
  const pin = req.params.pinCode || req.query.pin;
  if (pin) {
    const pinStr = String(pin).trim();
    if (!/^[1-9][0-9]{5}$/.test(pinStr)) {
      return res.status(400).json({ error: 'Invalid PIN Code format. Must be a valid 6-digit postal code.' });
    }
  }
  next();
}
