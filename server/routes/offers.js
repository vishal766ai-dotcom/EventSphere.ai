import express from 'express';
import { activeOffers } from '../data/offersData.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    offersCount: activeOffers.length,
    offers: activeOffers
  });
});

router.post('/apply', (req, res) => {
  const { code, orderAmount = 0 } = req.body;
  if (!code) return res.status(400).json({ error: "Voucher code is required" });

  const found = activeOffers.find(o => o.code.toUpperCase() === code.trim().toUpperCase());
  if (!found) {
    return res.status(404).json({ valid: false, error: "Invalid voucher code. Try 'FIRSTEVENT' or 'CLEANUPFREE'." });
  }

  if (orderAmount < found.minOrderValue) {
    return res.status(400).json({
      valid: false,
      error: `Order amount ₹${orderAmount} does not meet minimum order requirement of ₹${found.minOrderValue} for code ${found.code}.`
    });
  }

  res.json({
    valid: true,
    code: found.code,
    title: found.title,
    discountAmount: found.discountAmount,
    discountType: found.discountType,
    message: `🎉 Offer ${found.code} applied successfully! Saved ₹${found.discountAmount}.`
  });
});

export default router;
