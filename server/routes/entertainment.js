import express from 'express';
import { entertainmentActs, spatialPlacementGuide } from '../data/entertainmentData.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    acts: entertainmentActs,
    spatialGuide: spatialPlacementGuide
  });
});

export default router;
