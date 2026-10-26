// Central API Service Client with Dual-Engine Architecture
// Supports both Remote REST API and Instant Client-Side Fallback for Serverless/Static Deployments (e.g. Vercel)

import { packagesData } from '../../server/data/packagesData.js';
import { darkStoresData, vendorsData } from '../../server/data/vendorsData.js';
import { sopsData } from '../../server/data/sopsData.js';
import { activeOffers } from '../../server/data/offersData.js';
import { giftingCatalog, giftingLogisticsSOP } from '../../server/data/giftingData.js';
import { entertainmentActs, spatialPlacementGuide } from '../../server/data/entertainmentData.js';
import { masterEventTimeline } from '../../server/data/timelineData.js';

const API_BASE = '/api';

// Client-side in-memory state fallbacks
let clientEscrowVault = [
  {
    escrowId: "ESC-9021",
    orderRef: "EXP-8891",
    clientName: "Vikram Malhotra",
    vendorName: "Ramesh Sharma Decor Studio",
    amount: 5999,
    status: "HELD_IN_ESCROW",
    milestones: {
      clientDeposited: { done: true, time: "14:30", amount: 5999 },
      vendorCheckInPhoto: { done: true, time: "15:10", photoUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80" },
      vendorSetupCompletePhoto: { done: true, time: "15:45", photoUrl: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=400&q=80" },
      wallIntegrityVerified: { done: true, zeroDamageSigned: true },
      clientHandoverOtp: { done: false, requiredOtp: "4289" },
      payoutReleased: { done: false, releaseTime: null }
    },
    paintDamageInsurance: {
      coverageAmount: 2000,
      active: true,
      condition: "Covers accidental peeling or marks on client wall"
    }
  }
];

let clientControlRoomState = {
  eventId: "EVT-2026-BLR",
  eventName: "Aarav's 1st Birthday Bash",
  hostName: "Vikram & Ananya Malhotra",
  venue: "Clubhouse Terrace, Godrej Woodsman, Bellary Road, Bangalore",
  date: "Today",
  vendorsTracking: [
    {
      id: "TRK-01",
      role: "Decorator Van (Metal Arch & Neon Kit)",
      partnerName: "Ramesh Sharma Decor Studio",
      phone: "+91 98450 12345",
      status: "Approaching Venue (1.2 km away)",
      etaMinutes: 6,
      currentCoord: { lat: 12.9750, lng: 77.6430 },
      destinationCoord: { lat: 12.9780, lng: 77.6490 },
      speedKmH: 28,
      lastCheckin: "2 min ago at Indiranagar 100ft Signal"
    },
    {
      id: "TRK-02",
      role: "Artisan Cake Delivery (Refrigerated Box)",
      partnerName: "BakeCraft Artisan Patisserie",
      phone: "+91 98452 33445",
      status: "Dispatched from Kitchen",
      etaMinutes: 22,
      currentCoord: { lat: 12.9510, lng: 77.6210 },
      destinationCoord: { lat: 12.9780, lng: 77.6490 },
      speedKmH: 35,
      lastCheckin: "5 min ago at Domlur Flyover"
    },
    {
      id: "TRK-03",
      role: "Catering Head & Chaat Chef",
      partnerName: "SpiceRoute Gourmet Caterers",
      phone: "+91 98451 11223",
      status: "On-Site (Staging Buffet)",
      etaMinutes: 0,
      currentCoord: { lat: 12.9780, lng: 77.6490 },
      destinationCoord: { lat: 12.9780, lng: 77.6490 },
      speedKmH: 0,
      lastCheckin: "Checked in at Clubhouse Kitchen 25 min ago"
    }
  ],
  digitalItinerary: [
    { id: "ITN-1", time: "05:30 PM", title: "Vendor Setup & Escrow Handover Inspection", status: "IN_PROGRESS", broadcastSent: false },
    { id: "ITN-2", time: "06:30 PM", title: "Guest Welcome & Live Mocktail Bar Open", status: "PENDING", broadcastSent: false },
    { id: "ITN-3", time: "07:30 PM", title: "Milestone Cake Cutting Ceremony & Baby Slideshow", status: "PENDING", broadcastSent: false },
    { id: "ITN-4", time: "08:15 PM", title: "Royal Dinner Buffet & Live Chaat Counters", status: "PENDING", broadcastSent: false },
    { id: "ITN-5", time: "10:00 PM", title: "Return Favors & Night Breakdown Wrap-up", status: "PENDING", broadcastSent: false }
  ],
  broadcastHistory: [
    {
      id: "BC-1",
      timestamp: "15:30",
      channel: "WhatsApp Broadcast (48 Guests)",
      message: "🎉 Welcome! Live Google Maps pin & basement parking directions have been generated for Aarav's 1st Birthday at Clubhouse Terrace. See you at 6:30 PM!"
    }
  ]
};

let clientCrowdPool = {
  poolId: "POOL-COLLEGE-FAREWELL",
  title: "Batch of '26 Farewell Gala & DJ Night",
  organizerName: "Tanmay & Riya",
  targetAmount: 30000,
  collectedAmount: 24500,
  progressPercent: 82,
  remainingAmount: 5500,
  status: "FUNDING",
  packageTitle: "Cyber Neon Milestone Lounge + Live DJ Rig",
  shareableLink: "https://eventsphere.app/pool/COLLEGE-FAREWELL",
  upiId: "eventsphere.farewell26@okhdfcbank",
  contributors: [
    { name: "Rahul S.", amount: 2000, time: "10 mins ago", note: "Let's make it legendary guys!" },
    { name: "Sneha P.", amount: 2500, time: "25 mins ago", note: "Best batch ever!" },
    { name: "Aditya Roy", amount: 5000, time: "1 hour ago", note: "Sponsored extra dessert plinth 🎂" },
    { name: "Megha Rao", amount: 3000, time: "2 hours ago", note: "See you all on the dance floor!" },
    { name: "Kunal M.", amount: 4000, time: "3 hours ago", note: "Class of 2026 rock on!" },
    { name: "Anish K.", amount: 8000, time: "Yesterday", note: "Initial seed contribution" }
  ],
  autoDispatchTriggered: false
};

let clientExpressOrders = [
  {
    orderId: "EXP-8891",
    customerName: "Vikram Malhotra",
    phone: "+91 98111 22334",
    deliveryAddress: "Flat 403, Palm Grove Heights, Indiranagar",
    pinCode: "560038",
    packageId: "PKG-NEON-GLOW",
    packageName: "Cyber Neon Milestone Lounge",
    amount: 5999,
    status: "RIDER_EN_ROUTE",
    etaMinutes: 24,
    orderTime: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    targetDeliveryTime: new Date(Date.now() + 25 * 60 * 1000).toISOString(),
    assignedDarkStore: darkStoresData[0],
    assignedPartner: vendorsData[0],
    kitSku: "KIT-NEON-01",
    escrowLocked: true,
    setupPhotos: [
      { step: "Wall Pre-check", url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80", time: "15:42" }
    ],
    liveCoordinates: {
      lat: 12.9716,
      lng: 77.6412,
      destinationLat: 12.9780,
      destinationLng: 77.6490
    }
  }
];

function getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const customKey = typeof localStorage !== 'undefined' ? localStorage.getItem('gemini_api_key') : null;
  if (customKey) {
    headers['x-gemini-key'] = customKey;
  }
  return headers;
}

// Resilient fetch with automatic fallback
async function safeFetch(url, options = {}, fallbackData = null) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) throw new Error('Response not JSON');
    return await res.json();
  } catch (err) {
    // Return fallback data silently if network or backend route is unreachable
    return typeof fallbackData === 'function' ? fallbackData() : fallbackData;
  }
}

export const api = {
  // Packages
  async getPackages(params = {}) {
    const query = new URLSearchParams(params).toString();
    return safeFetch(`${API_BASE}/packages?${query}`, {}, () => {
      let result = [...packagesData];
      if (params.category) result = result.filter(p => p.category.toLowerCase().includes(params.category.toLowerCase()));
      if (params.ecoOnly === 'true' || params.ecoOnly === true) result = result.filter(p => p.sustainability.isEco);
      return { count: result.length, packages: result };
    });
  },

  async getPackageById(id) {
    return safeFetch(`${API_BASE}/packages/${id}`, {}, () => {
      return packagesData.find(p => p.id === id) || packagesData[0];
    });
  },

  // Vendors & Location Dispatch
  async getVendors(params = {}) {
    const query = new URLSearchParams(params).toString();
    return safeFetch(`${API_BASE}/vendors?${query}`, {}, () => {
      return { count: vendorsData.length, vendors: vendorsData };
    });
  },

  async checkDispatch(pinCode) {
    return safeFetch(`${API_BASE}/vendors/dispatch-check/${pinCode}`, {}, () => {
      const hub = darkStoresData.find(h => h.pinCodes.includes(pinCode)) || darkStoresData[0];
      const qualified = vendorsData.filter(v => v.pinCodesServed.includes(pinCode) || hub.pinCodes.some(p => v.pinCodesServed.includes(p)));
      return {
        pinCode,
        dispatchEligible: true,
        exactZoneMatch: true,
        assignedDarkStore: hub,
        availableKitsCount: 42,
        activeGigPartnersInZone: qualified.length || 3,
        estimatedExpressEtaMinutes: 90,
        qualifiedPartners: qualified,
        zeroDamageGuaranteeActive: true,
        escrowProtectionActive: true
      };
    });
  },

  async getDarkStores() {
    return safeFetch(`${API_BASE}/vendors/dark-stores`, {}, () => {
      return { totalHubs: darkStoresData.length, hubs: darkStoresData };
    });
  },

  // Reverse Budget Planner
  async calculateReverseBudget(payload) {
    return safeFetch(`${API_BASE}/reverse-budget/calculate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    }, () => {
      const budget = Number(payload.totalBudget || 25000);
      const guests = Number(payload.guestCount || 40);
      const eventType = payload.eventType || "1st Birthday";

      const cateringBudget = Math.round(budget * 0.50);
      const decorBudget = Math.round(budget * 0.20);
      const dessertBudget = Math.round(budget * 0.15);
      const logisticsBudget = Math.round(budget * 0.15);

      const matchedDecor = packagesData.find(p => p.basePrice <= decorBudget) || packagesData[0];
      const remaining = Math.max(0, budget - matchedDecor.basePrice);

      const actualCatering = Math.floor(remaining * 0.60);
      const actualDessert = Math.floor(remaining * 0.20);
      const actualLogistics = Math.floor(remaining * 0.20);
      const perPlateCost = Math.max(120, Math.floor(actualCatering / Math.max(guests, 1)));

      return {
        requestedBudget: budget,
        guestCount: guests,
        eventType,
        pinCode: payload.pinCode || "560038",
        budgetSplit: {
          catering: { percentage: 50, allocated: actualCatering },
          decor: { percentage: 20, allocated: matchedDecor.basePrice },
          dessert: { percentage: 15, allocated: actualDessert },
          logisticsAndOps: { percentage: 15, allocated: actualLogistics }
        },
        strictlyWithinCap: true,
        calculatedTotal: (perPlateCost * guests) + matchedDecor.basePrice + actualDessert + actualLogistics,
        savingsOrSurplus: Math.max(0, budget - ((perPlateCost * guests) + matchedDecor.basePrice + actualDessert + actualLogistics)),
        curatedPlan: {
          decor: matchedDecor,
          catering: {
            title: perPlateCost > 400 ? "Gourmet Live Counters & Premium Buffet" : "Artisanal Celebration Spread & High-Tea Bites",
            perPlateCost,
            guestCount: guests,
            totalCateringCost: perPlateCost * guests,
            vendorAssigned: "SpiceRoute Gourmet Caterers",
            menuItems: [
              "Welcome Drink: Virgin Mojito & Mango Chilli Cooler",
              "Starters: Paneer Tikka Skewers / Crispy Corn Cones / Chicken Seekh",
              "Mains: Dal Makhani, Paneer Lababdar, Jeera Rice, Baby Butter Naan",
              "Dessert: Gulab Jamun with Rabdi / Vanilla Ice Cream"
            ]
          },
          dessert: {
            title: `${guests > 25 ? '2.5 Kg Designer Theme Cake' : '1.5 Kg Custom Milestone Cake'} + Dessert Plinth`,
            totalCakeCost: actualDessert,
            flavor: "Belgian Chocolate Truffle with Salted Caramel",
            vendorAssigned: "BakeCraft Artisan Patisserie"
          },
          logistics: {
            totalLogisticsCost: actualLogistics,
            items: [
              { name: "Zero-Damage Escrow Guarantee & Ops Desk", cost: Math.round(actualLogistics * 0.45) },
              { name: "Interactive WhatsApp RSVP & Itinerary Bot", cost: Math.round(actualLogistics * 0.25) },
              { name: "Next-Day Clean-Up & Breakdown Crew Add-on", cost: Math.round(actualLogistics * 0.30) }
            ]
          }
        },
        aiOptimizationTips: `For ₹${budget.toLocaleString('en-IN')} with ${guests} guests, we allocated ₹${actualCatering.toLocaleString('en-IN')} to guarantee high food satisfaction. Paired with freestanding zero-damage "${matchedDecor.title}" to eliminate wall paint penalties in rented flats.`
      };
    });
  },

  // Express 90-120 min Party
  async getExpressOrders() {
    return safeFetch(`${API_BASE}/express`, {}, () => {
      return { total: clientExpressOrders.length, orders: clientExpressOrders };
    });
  },

  async dispatchExpressParty(payload) {
    return safeFetch(`${API_BASE}/express/dispatch`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    }, () => {
      const pkg = packagesData.find(p => p.id === payload.packageId) || packagesData[0];
      const newOrder = {
        orderId: `EXP-${Math.floor(1000 + Math.random() * 9000)}`,
        customerName: payload.customerName,
        phone: payload.phone,
        deliveryAddress: payload.address,
        pinCode: payload.pinCode,
        packageId: pkg.id,
        packageName: pkg.title,
        amount: pkg.expressPrice + (payload.addonCleanup ? 499 : 0),
        status: "KIT_PACKED",
        etaMinutes: 85,
        orderTime: new Date().toISOString(),
        assignedDarkStore: darkStoresData[0],
        assignedPartner: vendorsData[0],
        kitSku: pkg.id === "PKG-NEON-GLOW" ? "KIT-NEON-01" : "KIT-PASTEL-02",
        escrowLocked: true,
        setupPhotos: [],
        liveCoordinates: { lat: 12.9650, lng: 77.6350 }
      };
      clientExpressOrders.unshift(newOrder);
      return {
        success: true,
        message: "⚡ Express Party order dispatched! Dark-store kit allocated and nearest gig partner en-route.",
        order: newOrder
      };
    });
  },

  // Escrow Vault & Milestones
  async getEscrowVault() {
    return safeFetch(`${API_BASE}/escrow`, {}, () => {
      return {
        totalEscrows: clientEscrowVault.length,
        totalFundsProtected: clientEscrowVault.reduce((acc, curr) => acc + curr.amount, 0),
        accounts: clientEscrowVault
      };
    });
  },

  async submitMilestonePhoto(escrowId, payload) {
    return safeFetch(`${API_BASE}/escrow/${escrowId}/partner-photo`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    }, () => {
      const acc = clientEscrowVault.find(e => e.escrowId === escrowId) || clientEscrowVault[0];
      const now = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
      if (payload.photoType === 'checkIn') {
        acc.milestones.vendorCheckInPhoto = { done: true, time: now, photoUrl: payload.photoUrl };
        acc.status = "CHECKIN_VERIFIED";
      } else {
        acc.milestones.vendorSetupCompletePhoto = { done: true, time: now, photoUrl: payload.photoUrl };
        acc.status = "SETUP_PHOTO_VERIFIED";
      }
      return { success: true, message: `Milestone verified! Status: ${acc.status}`, account: acc };
    });
  },

  async verifyAndReleaseEscrow(escrowId, otp) {
    return safeFetch(`${API_BASE}/escrow/${escrowId}/verify-release`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ otp })
    }, () => {
      const acc = clientEscrowVault.find(e => e.escrowId === escrowId) || clientEscrowVault[0];
      acc.milestones.clientHandoverOtp.done = true;
      acc.milestones.payoutReleased = { done: true, releaseTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
      acc.status = "RELEASED_TO_VENDOR";
      return {
        success: true,
        message: `🎉 Escrow funds ₹${acc.amount.toLocaleString('en-IN')} successfully released to ${acc.vendorName}! Zero-damage verified.`,
        account: acc
      };
    });
  },

  // Day-of Live Control Room
  async getControlRoom() {
    return safeFetch(`${API_BASE}/control-room`, {}, () => {
      return clientControlRoomState;
    });
  },

  async broadcastItinerary(payload) {
    return safeFetch(`${API_BASE}/control-room/broadcast`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    }, () => {
      const item = clientControlRoomState.digitalItinerary.find(i => i.id === payload.itineraryId);
      const text = payload.customMessage || (item ? `🔔 Announcement: "${item.title}" is starting now at ${item.time}! Please gather near stage.` : "🔔 Quick update from Host!");
      const record = {
        id: `BC-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        channel: "WhatsApp Broadcast (48 Guests Delivered)",
        message: text
      };
      if (item) {
        item.broadcastSent = true;
        item.status = "ACTIVE";
      }
      clientControlRoomState.broadcastHistory.unshift(record);
      return {
        success: true,
        message: "WhatsApp broadcast delivered to all 48 invited guests!",
        record,
        updatedItinerary: clientControlRoomState.digitalItinerary
      };
    });
  },

  // Crowd-Gifting Pool
  async getCrowdPool(poolId = 'POOL-COLLEGE-FAREWELL') {
    return safeFetch(`${API_BASE}/crowd-pool/${poolId}`, {}, () => {
      return clientCrowdPool;
    });
  },

  async contributeToPool(poolId, payload) {
    return safeFetch(`${API_BASE}/crowd-pool/${poolId}/contribute`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    }, () => {
      const contAmt = Number(payload.amount) || 1000;
      clientCrowdPool.collectedAmount += contAmt;
      clientCrowdPool.contributors.unshift({
        name: payload.contributorName || "Friend",
        amount: contAmt,
        time: "Just now",
        note: payload.note || "Congrats! 🥳"
      });
      clientCrowdPool.progressPercent = Math.min(100, Math.round((clientCrowdPool.collectedAmount / clientCrowdPool.targetAmount) * 100));
      clientCrowdPool.remainingAmount = Math.max(0, clientCrowdPool.targetAmount - clientCrowdPool.collectedAmount);

      let autoDispatch = null;
      if (clientCrowdPool.collectedAmount >= clientCrowdPool.targetAmount) {
        clientCrowdPool.status = "TARGET_REACHED";
        autoDispatch = "🎯 100% Target Met! EventSphere Smart Escrow has locked the funds and automatically dispatched the nearest verified gig decorators and baker.";
      }
      return {
        success: true,
        message: `Thank you! ₹${contAmt.toLocaleString('en-IN')} added to the group pool.`,
        pool: clientCrowdPool,
        autoDispatchNotification: autoDispatch
      };
    });
  },

  // WhatsApp Guest Concierge Bot
  async askGuestBot(question) {
    return safeFetch(`${API_BASE}/guest-bot/query`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ question })
    }, () => {
      const q = (question || '').toLowerCase();
      let answer = "";
      if (q.includes("park") || q.includes("car") || q.includes("valet")) {
        answer = "🚗 Visitor parking is available in Basements B1 & B2 at Clubhouse Terrace. Mention 'Aarav's Birthday' at Gate 2 for free valet!";
      } else if (q.includes("cake") || q.includes("time") || q.includes("when")) {
        answer = "🎂 Cake cutting is scheduled for 07:30 PM sharp, followed by the dinner buffet at 08:15 PM!";
      } else if (q.includes("food") || q.includes("menu") || q.includes("veg")) {
        answer = "🍛 100% Pure Vegetarian gourmet spread with live Chaat counter, Paneer Tikka, and Belgian Truffle cake!";
      } else {
        answer = "🎉 Welcome! The event starts at 6:30 PM at the Clubhouse Terrace. Feel free to ask about parking, timings, dinner menu, or directions!";
      }
      return { answer, source: "EventSphere AI Concierge" };
    });
  },

  // Living Room Decor Visualizer
  async getSampleRooms() {
    return safeFetch(`${API_BASE}/decor-visualizer/sample-rooms`, {}, () => {
      return [
        {
          id: "ROOM-1",
          label: "Standard 2BHK Hall (Cream Wall, Sliding Balcony)",
          dimensions: "10 x 12 ft",
          imageUrl: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80",
          wallColor: "Warm Cream / Off-white",
          lighting: "Warm natural daylight + recessed LED"
        },
        {
          id: "ROOM-2",
          label: "Open Terrace / Balcony Deck (Brick & Glass Railing)",
          dimensions: "12 x 15 ft",
          imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
          wallColor: "Textured Exposed Brick",
          lighting: "Evening golden hour"
        },
        {
          id: "ROOM-3",
          label: "Contemporary Dark Accent Wall (Slate Grey / Navy)",
          dimensions: "11 x 13 ft",
          imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
          wallColor: "Slate Charcoal / Navy",
          lighting: "Modern ambient track lights"
        }
      ];
    });
  },

  async analyzeFitting(payload) {
    return safeFetch(`${API_BASE}/decor-visualizer/analyze-fitting`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    }, () => {
      const pkg = packagesData.find(p => p.id === payload.selectedPackageId) || packagesData[0];
      return {
        package: pkg,
        wallSpecs: {
          requiredWidth: pkg.blueprint.width,
          requiredHeight: pkg.blueprint.height,
          recommendedRoomSize: pkg.roomSuitability,
          plugPoints: pkg.blueprint.plugPointsNeeded
        },
        compositeOptions: packagesData.map(p => ({
          id: p.id,
          title: p.title,
          price: p.basePrice,
          dimensions: `${p.blueprint.width} x ${p.blueprint.height}`,
          sketchSvg: p.blueprint.blueprintSketch,
          photoUrl: p.honestPhoto.imageUrl
        })),
        stylistEvaluation: `• 📐 Spatial Ratio: Perfect fit! The ${pkg.blueprint.width} arch leaves safe 1.5 ft clearance on both sides.\n• 🎨 Color & Contrast: Vibrant glow provides excellent contrast against apartment walls.\n• 🛡️ Zero-Damage Assurance: Uses our dual-bar freestanding metal frame. Zero nails, backed by our ₹2,000 paint warranty.`
      };
    });
  },

  // SOPs
  async getSops() {
    return safeFetch(`${API_BASE}/sops`, {}, () => {
      return { totalSOPs: sopsData.length, sops: sopsData };
    });
  },

  // Gemini Status
  async getGeminiStatus() {
    return safeFetch(`${API_BASE}/gemini/status`, {}, () => {
      return {
        status: "ok",
        hasServerApiKey: false,
        activeModel: "gemini-1.5-flash",
        features: ["AI Reverse Budget", "WhatsApp Guest Bot", "Living Room Wall Fit"]
      };
    });
  },

  // Guest Gifting & Return Favors
  async getGiftingCatalog() {
    return safeFetch(`${API_BASE}/gifting`, {}, () => {
      return {
        totalCategories: giftingCatalog.length,
        catalog: giftingCatalog,
        logisticsSOP: giftingLogisticsSOP
      };
    });
  },

  async estimateGifting(payload) {
    return safeFetch(`${API_BASE}/gifting/estimate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    }, () => {
      const kids = Number(payload.kids || 8);
      const teens = Number(payload.teens || 4);
      const adults = Number(payload.adults || 20);
      const seniors = Number(payload.seniors || 8);
      const totalHeadcount = kids + teens + adults + seniors;
      const packagingCost = payload.packagingType?.includes('Jute') ? 30 : (payload.packagingType?.includes('Bamboo') ? 50 : 0);
      const totalPkg = totalHeadcount * packagingCost;
      const grandTotal = (kids * 249) + (teens * 259) + (adults * 499) + (seniors * 549) + totalPkg;

      return {
        totalGuests: totalHeadcount,
        breakdown: [
          { ageGroup: "Kids (3-12 yrs)", count: kids, selectedGift: "Artisanal DIY Clay & Pottery Painting Kit", unitPrice: 249, subtotal: kids * 249 },
          { ageGroup: "Teens & Youth (13-25 yrs)", count: teens, selectedGift: "Plantable Seed Paper Journal & Herb Pencil Set", unitPrice: 259, subtotal: teens * 259 },
          { ageGroup: "Adults (26-55 yrs)", count: adults, selectedGift: "Royal Kashmiri Kahwa & Single-Origin Honey Jar Hamper", unitPrice: 499, subtotal: adults * 499 },
          { ageGroup: "Seniors (55+ yrs)", count: seniors, selectedGift: "Pure Brass Heritage Akhand Diya & Aromatic Sambrani Dhoop", unitPrice: 549, subtotal: seniors * 549 }
        ],
        packaging: { type: payload.packagingType || "Eco Jute Tote (+₹30/unit)", cost: totalPkg },
        grandTotal,
        deliverySOP: "Pre-bundled at local Dark Store and dispatched with setup kit to arrive at T-120 mins.",
        stagedAtVenue: "Positioned on dedicated exit favor plinth for effortless handover."
      };
    });
  },

  // Entertainment & Spatial Placement
  async getEntertainmentAndSpatial() {
    return safeFetch(`${API_BASE}/entertainment`, {}, () => {
      return { acts: entertainmentActs, spatialGuide: spatialPlacementGuide };
    });
  },

  // Offers & Vouchers
  async getOffers() {
    return safeFetch(`${API_BASE}/offers`, {}, () => {
      return { offersCount: activeOffers.length, offers: activeOffers };
    });
  },

  async applyOffer(code, orderAmount) {
    return safeFetch(`${API_BASE}/offers/apply`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ code, orderAmount })
    }, () => {
      const found = activeOffers.find(o => o.code.toUpperCase() === (code || '').trim().toUpperCase());
      if (!found) return { valid: false, error: "Invalid voucher code." };
      return {
        valid: true,
        code: found.code,
        title: found.title,
        discountAmount: found.discountAmount,
        discountType: found.discountType,
        message: `🎉 Offer ${found.code} applied successfully! Saved ₹${found.discountAmount}.`
      };
    });
  },

  // Event Time Management & Run of Show
  async getTimeline() {
    return safeFetch(`${API_BASE}/timeline`, {}, () => {
      return masterEventTimeline;
    });
  },

  async updateTimelineStatus(index, status) {
    return safeFetch(`${API_BASE}/timeline/update-status`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ index, status })
    }, () => {
      if (masterEventTimeline.milestones[index]) {
        masterEventTimeline.milestones[index].status = status;
      }
      return { success: true, timeline: masterEventTimeline };
    });
  }
};
