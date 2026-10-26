import express from 'express';
import { packagesData } from '../data/packagesData.js';

const router = express.Router();

// Get all honest aesthetic packages
router.get('/', (req, res) => {
  const { category, expressOnly, ecoOnly } = req.query;
  let result = [...packagesData];

  if (category) {
    result = result.filter(p => p.category.toLowerCase().includes(category.toLowerCase()));
  }
  if (expressOnly === 'true') {
    result = result.filter(p => p.expressAvailable);
  }
  if (ecoOnly === 'true') {
    result = result.filter(p => p.sustainability.isEco);
  }

  res.json({
    count: result.length,
    packages: result
  });
});

// Get package by ID
router.get('/:id', (req, res) => {
  const item = packagesData.find(p => p.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: "Package not found" });
  }
  res.json(item);
});

export default router;
