import express from 'express';
import { darkStoresData, vendorsData } from '../data/vendorsData.js';
import { packagesData } from '../data/packagesData.js';

const router = express.Router();

// In-memory express orders store
let expressOrders = [
  {
    orderId: "EXP-8891",
    customerName: "Vikram Malhotra",
    phone: "+91 98111 22334",
    deliveryAddress: "Flat 403, Palm Grove Heights, Indiranagar",
    pinCode: "560038",
    packageId: "PKG-NEON-GLOW",
    packageName: "Cyber Neon Milestone Lounge",
    amount: 5999,
    status: "RIDER_EN_ROUTE", // CREATED -> KIT_PACKED -> RIDER_DISPATCHED -> RIDER_EN_ROUTE -> CHECKED_IN -> SETUP_COMPLETE -> HANDOVER_VERIFIED
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

// Get all express orders
router.get('/', (req, res) => {
  res.json({
    total: expressOrders.length,
    orders: expressOrders
  });
});

// Create new 90-120 min express party order
router.post('/dispatch', (req, res) => {
  const { customerName, phone, address, pinCode, packageId = "PKG-NEON-GLOW", addonCleanup = true } = req.body;

  if (!customerName || !address || !pinCode) {
    return res.status(400).json({ error: "Name, address, and pinCode are required for express dispatch" });
  }

  // Find nearest dark store
  let darkStore = darkStoresData.find(hub => hub.pinCodes.includes(pinCode)) || darkStoresData[0];
  let pkg = packagesData.find(p => p.id === packageId) || packagesData[0];
  let partner = vendorsData.find(v => v.expressReady && (v.pinCodesServed.includes(pinCode) || darkStore.pinCodes.some(p => v.pinCodesServed.includes(p)))) || vendorsData[0];

  const orderId = `EXP-${Math.floor(1000 + Math.random() * 9000)}`;
  const orderTime = new Date();
  const targetEta = new Date(orderTime.getTime() + 90 * 60 * 1000);

  const newOrder = {
    orderId,
    customerName,
    phone: phone || "+91 99000 11223",
    deliveryAddress: address,
    pinCode,
    packageId: pkg.id,
    packageName: pkg.title,
    amount: pkg.expressPrice + (addonCleanup ? 499 : 0),
    status: "KIT_PACKED",
    etaMinutes: 85,
    orderTime: orderTime.toISOString(),
    targetDeliveryTime: targetEta.toISOString(),
    assignedDarkStore: darkStore,
    assignedPartner: partner,
    kitSku: pkg.id === "PKG-NEON-GLOW" ? "KIT-NEON-01" : "KIT-PASTEL-02",
    escrowLocked: true,
    setupPhotos: [],
    liveCoordinates: {
      lat: 12.9650,
      lng: 77.6350,
      destinationLat: 12.9750,
      destinationLng: 77.6450
    }
  };

  expressOrders.unshift(newOrder);

  res.status(201).json({
    success: true,
    message: "⚡ Express Party order dispatched! Dark-store kit allocated and nearest gig partner en-route.",
    order: newOrder
  });
});

// Update order status (for partner app simulation)
router.patch('/:orderId/status', (req, res) => {
  const { orderId } = req.params;
  const { status, photoUrl, stepLabel } = req.body;

  const order = expressOrders.find(o => o.orderId === orderId);
  if (!order) {
    return res.status(404).json({ error: "Order not found" });
  }

  if (status) order.status = status;
  if (photoUrl) {
    order.setupPhotos.push({
      step: stepLabel || "Milestone Check",
      url: photoUrl,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    });
  }

  res.json({
    success: true,
    order
  });
});

export default router;
