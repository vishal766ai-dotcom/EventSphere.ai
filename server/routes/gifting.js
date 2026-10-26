import express from 'express';
import { giftingCatalog, giftingLogisticsSOP } from '../data/giftingData.js';

const router = express.Router();

// Get full gifting catalog & logistics SOP
router.get('/', (req, res) => {
  res.json({
    totalCategories: giftingCatalog.length,
    catalog: giftingCatalog,
    logisticsSOP: giftingLogisticsSOP
  });
});

// Calculate return gifts bundle estimate based on age distribution
router.post('/estimate', (req, res) => {
  const { kids = 8, teens = 4, adults = 20, seniors = 8, packagingType = "Eco Jute Tote (+₹30/unit)" } = req.body;

  // Selected default items per age group
  const kidItem = giftingCatalog[0].items[0]; // DIY Clay Kit (₹249)
  const teenItem = giftingCatalog[1].items[1]; // Plantable Seed Journal (₹259)
  const adultItem = giftingCatalog[2].items[0]; // Kashmiri Kahwa Jar (₹499)
  const seniorItem = giftingCatalog[3].items[0]; // Pure Brass Diya (₹549)

  const kidsTotal = kids * kidItem.pricePerUnit;
  const teensTotal = teens * teenItem.pricePerUnit;
  const adultsTotal = adults * adultItem.pricePerUnit;
  const seniorsTotal = seniors * seniorItem.pricePerUnit;

  const totalHeadcount = Number(kids) + Number(teens) + Number(adults) + Number(seniors);
  const packagingCostPerUnit = packagingType.includes('Jute') ? 30 : (packagingType.includes('Bamboo') ? 50 : 0);
  const totalPackaging = totalHeadcount * packagingCostPerUnit;
  const grandTotal = kidsTotal + teensTotal + adultsTotal + seniorsTotal + totalPackaging;

  res.json({
    totalGuests: totalHeadcount,
    breakdown: [
      { ageGroup: "Kids (3-12 yrs)", count: kids, selectedGift: kidItem.title, unitPrice: kidItem.pricePerUnit, subtotal: kidsTotal },
      { ageGroup: "Teens & Youth (13-25 yrs)", count: teens, selectedGift: teenItem.title, unitPrice: teenItem.pricePerUnit, subtotal: teensTotal },
      { ageGroup: "Adults (26-55 yrs)", count: adults, selectedGift: adultItem.title, unitPrice: adultItem.pricePerUnit, subtotal: adultsTotal },
      { ageGroup: "Seniors (55+ yrs)", count: seniors, selectedGift: seniorItem.title, unitPrice: seniorItem.pricePerUnit, subtotal: seniorsTotal }
    ],
    packaging: {
      type: packagingType,
      cost: totalPackaging
    },
    grandTotal,
    deliverySOP: "Pre-bundled at local Dark Store and dispatched with setup kit to arrive at T-120 mins.",
    stagedAtVenue: "Positioned on dedicated exit favor plinth for effortless handover."
  });
});

export default router;
