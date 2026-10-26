import express from 'express';
import { sopsData } from '../data/sopsData.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    totalSOPs: sopsData.length,
    sops: sopsData
  });
});

router.get('/:sopId', (req, res) => {
  const sop = sopsData.find(s => s.sopId === req.params.sopId);
  if (!sop) return res.status(404).json({ error: "SOP not found" });
  res.json(sop);
});

export default router;
