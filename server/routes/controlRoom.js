import express from 'express';

const router = express.Router();

let liveControlRoomState = {
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

// Get current control room status
router.get('/', (req, res) => {
  // Simulate slight GPS position shift for liveliness
  liveControlRoomState.vendorsTracking.forEach(v => {
    if (v.etaMinutes > 0) {
      v.etaMinutes = Math.max(1, v.etaMinutes - 1);
      v.currentCoord.lat += (v.destinationCoord.lat - v.currentCoord.lat) * 0.1;
      v.currentCoord.lng += (v.destinationCoord.lng - v.currentCoord.lng) * 0.1;
      if (v.etaMinutes <= 2) {
        v.status = "Arrived at Gate Entrance";
      }
    }
  });

  res.json(liveControlRoomState);
});

// Broadcast digital itinerary alert to guests via WhatsApp simulator
router.post('/broadcast', (req, res) => {
  const { itineraryId, customMessage } = req.body;
  const item = liveControlRoomState.digitalItinerary.find(i => i.id === itineraryId);
  
  const text = customMessage || (item ? `🔔 Announcement: "${item.title}" is starting now at ${item.time}! Please gather near the stage.` : "🔔 Quick update from the Host!");

  const broadcastRecord = {
    id: `BC-${Date.now().toString().slice(-4)}`,
    timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    channel: "WhatsApp Broadcast (48 Guests Delivered)",
    message: text
  };

  if (item) {
    item.broadcastSent = true;
    item.status = "ACTIVE";
  }

  liveControlRoomState.broadcastHistory.unshift(broadcastRecord);

  res.json({
    success: true,
    message: "WhatsApp broadcast delivered to all 48 invited guests!",
    record: broadcastRecord,
    updatedItinerary: liveControlRoomState.digitalItinerary
  });
});

export default router;
