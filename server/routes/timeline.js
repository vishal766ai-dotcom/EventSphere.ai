import express from 'express';
import { masterEventTimeline } from '../data/timelineData.js';

const router = express.Router();

let currentTimeline = { ...masterEventTimeline };

router.get('/', (req, res) => {
  res.json(currentTimeline);
});

router.post('/update-status', (req, res) => {
  const { index, status } = req.body;
  if (currentTimeline.milestones[index]) {
    currentTimeline.milestones[index].status = status;
  }
  res.json({
    success: true,
    timeline: currentTimeline
  });
});

export default router;
