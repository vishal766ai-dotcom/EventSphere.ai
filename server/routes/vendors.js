import express from 'express';
import { darkStoresData, vendorsData } from '../data/vendorsData.js';

const router = express.Router();

// Get all verified gig partners
router.get('/', (req, res) => {
  const { city, type, pinCode } = req.query;
  let filtered = [...vendorsData];

  if (city) {
    filtered = filtered.filter(v => v.city.toLowerCase() === city.toLowerCase());
  }
  if (type) {
    filtered = filtered.filter(v => v.type.toLowerCase().includes(type.toLowerCase()));
  }
  if (pinCode) {
    filtered = filtered.filter(v => v.pinCodesServed.includes(pinCode) || v.pinCodesServed.some(p => p.slice(0, 3) === pinCode.slice(0, 3)));
  }

  res.json({
    count: filtered.length,
    vendors: filtered
  });
});

// Location-based automated dispatch check by pin code
router.get('/dispatch-check/:pinCode', (req, res) => {
  const { pinCode } = req.params;
  
  // Find matching dark store
  let matchingHub = darkStoresData.find(hub => hub.pinCodes.includes(pinCode));
  let isExactMatch = true;

  if (!matchingHub) {
    isExactMatch = false;
    matchingHub = darkStoresData[0]; // fallback default hub
  }

  // Find qualified vendors
  const qualifiedVendors = vendorsData.filter(v => 
    v.pinCodesServed.includes(pinCode) || 
    (matchingHub && matchingHub.pinCodes.some(p => v.pinCodesServed.includes(p)))
  );

  const etaMinutes = isExactMatch ? 90 : 120;
  const dispatchEligible = qualifiedVendors.length > 0;

  res.json({
    pinCode,
    dispatchEligible,
    exactZoneMatch: isExactMatch,
    assignedDarkStore: matchingHub,
    availableKitsCount: Object.values(matchingHub.inventory).reduce((a, b) => a + b, 0),
    activeGigPartnersInZone: qualifiedVendors.length,
    estimatedExpressEtaMinutes: etaMinutes,
    qualifiedPartners: qualifiedVendors,
    zeroDamageGuaranteeActive: true,
    escrowProtectionActive: true
  });
});

// Dark store hubs
router.get('/dark-stores', (req, res) => {
  res.json({
    totalHubs: darkStoresData.length,
    hubs: darkStoresData
  });
});

export default router;
