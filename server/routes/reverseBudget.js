import express from 'express';
import { packagesData } from '../data/packagesData.js';
import { vendorsData } from '../data/vendorsData.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

router.post('/calculate', async (req, res) => {
  const { guestCount = 30, eventType = "1st Birthday", totalBudget = 25000, pinCode = "560038" } = req.body;
  const budget = Number(totalBudget);
  const guests = Number(guestCount);

  // Realistic split
  const cateringBudget = Math.round(budget * 0.50);
  const decorBudget = Math.round(budget * 0.20);
  const dessertBudget = Math.round(budget * 0.15);
  const logisticsBudget = Math.round(budget * 0.15);

  // Per plate budget
  const perPlateBudget = Math.round(cateringBudget / Math.max(guests, 1));

  // Find suitable decor package under decorBudget (or closest best fit)
  const matchedDecor = packagesData.find(p => p.basePrice <= decorBudget * 1.25) || packagesData[0];

  // Curated catering option
  const cateringOption = {
    title: perPlateBudget > 400 ? "Gourmet Live Counters & Premium Buffet" : "Artisanal Celebration Spread & High-Tea Bites",
    perPlateCost: perPlateBudget,
    guestCount: guests,
    totalCateringCost: perPlateBudget * guests,
    vendorAssigned: vendorsData.find(v => v.type === "Catering")?.name || "SpiceRoute Gourmet Caterers",
    menuItems: [
      "Welcome Drink: Virgin Mojito & Mango Chilli Cooler",
      "Starters: Paneer Tikka Skewers / Crispy Corn Cones / Chicken Seekh",
      "Mains: Dal Makhani, Paneer Lababdar, Jeera Rice, Baby Butter Naan",
      "Dessert: Gulab Jamun with Rabdi / Vanilla Ice Cream"
    ]
  };

  // Curated cake option
  const dessertOption = {
    title: `${guests > 25 ? '2.5 Kg Designer Theme Cake' : '1.5 Kg Custom Milestone Cake'} + Dessert Plinth`,
    totalCakeCost: dessertBudget,
    flavor: "Belgian Chocolate Truffle with Salted Caramel",
    vendorAssigned: "BakeCraft Artisan Patisserie",
    includesCakeStandPlinth: true,
    matchingDecorTheme: matchedDecor.title
  };

  // Logistics, Invites & Escrow protection
  const logisticsOption = {
    totalLogisticsCost: logisticsBudget,
    items: [
      { name: "Zero-Damage Escrow Guarantee & Ops Desk", cost: Math.round(logisticsBudget * 0.45) },
      { name: "Interactive WhatsApp RSVP & Itinerary Bot", cost: Math.round(logisticsBudget * 0.25) },
      { name: "Next-Day Clean-Up & Breakdown Crew Add-on", cost: Math.round(logisticsBudget * 0.30) }
    ]
  };

  const calculatedTotal = cateringOption.totalCateringCost + matchedDecor.basePrice + dessertOption.totalCakeCost + logisticsOption.totalLogisticsCost;
  const savingsOrSurplus = budget - calculatedTotal;

  // Optional GenAI enhancement
  let aiRecommendation = null;
  const userApiKey = req.headers['x-gemini-key'] || process.env.GEMINI_API_KEY;
  if (userApiKey) {
    try {
      const genAI = new GoogleGenerativeAI(userApiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `You are an expert Indian party planner. The host has a strict budget of ₹${budget} for ${guests} guests for a "${eventType}". Recommend 3 high-value cost optimizations and a unique theme idea tailored for a standard Indian apartment living room.`;
      const aiResult = await model.generateContent(prompt);
      aiRecommendation = aiResult.response.text();
    } catch (err) {
      console.warn("Gemini reverse budget recommendation fallback:", err.message);
    }
  }

  if (!aiRecommendation) {
    aiRecommendation = `For ₹${budget.toLocaleString('en-IN')} with ${guests} guests, we allocated ₹${cateringBudget.toLocaleString('en-IN')} (₹${perPlateBudget}/plate) to guarantee high food satisfaction. We paired it with the zero-damage "${matchedDecor.title}" which uses freestanding frames so you never risk wall paint penalties in rented apartments.`;
  }

  res.json({
    requestedBudget: budget,
    guestCount: guests,
    eventType,
    pinCode,
    budgetSplit: {
      catering: { percentage: 50, allocated: cateringBudget },
      decor: { percentage: 20, allocated: decorBudget },
      dessert: { percentage: 15, allocated: dessertBudget },
      logisticsAndOps: { percentage: 15, allocated: logisticsBudget }
    },
    strictlyWithinCap: calculatedTotal <= budget,
    calculatedTotal,
    savingsOrSurplus,
    curatedPlan: {
      decor: matchedDecor,
      catering: cateringOption,
      dessert: dessertOption,
      logistics: logisticsOption
    },
    aiOptimizationTips: aiRecommendation
  });
});

export default router;
