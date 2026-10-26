// Verified Gig Partner Network & Dark Store Hubs
export const darkStoresData = [
  {
    id: "DS-BLR-01",
    name: "Indiranagar Hub 401",
    city: "Bangalore",
    pinCodes: ["560038", "560008", "560075", "560001", "560025"],
    address: "100ft Road, Indiranagar, Bengaluru",
    inventory: {
      "KIT-NEON-01": 8,
      "KIT-PASTEL-02": 12,
      "KIT-BALLOON-03": 15,
      "KIT-ECO-04": 6,
      "KIT-ROSEGOLD-05": 9
    },
    activeRiders: 4
  },
  {
    id: "DS-BLR-02",
    name: "Koramangala 5th Block Hub",
    city: "Bangalore",
    pinCodes: ["560034", "560095", "560029", "560068", "560102"],
    address: "Jyoti Nivas College Rd, Koramangala, Bengaluru",
    inventory: {
      "KIT-NEON-01": 10,
      "KIT-PASTEL-02": 8,
      "KIT-BALLOON-03": 14,
      "KIT-ECO-04": 5,
      "KIT-ROSEGOLD-05": 7
    },
    activeRiders: 5
  },
  {
    id: "DS-BOM-01",
    name: "Bandra West FastHub",
    city: "Mumbai",
    pinCodes: ["400050", "400052", "400053", "400054", "400001"],
    address: "Linking Road, Bandra West, Mumbai",
    inventory: {
      "KIT-NEON-01": 6,
      "KIT-PASTEL-02": 10,
      "KIT-BALLOON-03": 12,
      "KIT-ECO-04": 4,
      "KIT-ROSEGOLD-05": 5
    },
    activeRiders: 3
  },
  {
    id: "DS-DEL-01",
    name: "South Delhi Hauz Khas Hub",
    city: "Delhi",
    pinCodes: ["110016", "110017", "110049", "110029", "110001"],
    address: "Aurobindo Marg, Hauz Khas, New Delhi",
    inventory: {
      "KIT-NEON-01": 7,
      "KIT-PASTEL-02": 11,
      "KIT-BALLOON-03": 16,
      "KIT-ECO-04": 8,
      "KIT-ROSEGOLD-05": 6
    },
    activeRiders: 6
  }
];

export const vendorsData = [
  {
    id: "VND-101",
    name: "Ramesh Sharma Decor Studio",
    type: "Decorator",
    tier: "Verified Pro Gig Partner",
    phone: "+91 98450 12345",
    city: "Bangalore",
    pinCodesServed: ["560038", "560008", "560075", "560001", "560025", "560034"],
    rating: 4.9,
    completedEvents: 342,
    hasMetalFrame: true,
    paintProtectionCertified: true,
    expressReady: true,
    avgResponseMinutes: 4,
    status: "Available"
  },
  {
    id: "VND-102",
    name: "GreenEarth Eco-Events & Floral",
    type: "Eco-Decorator",
    tier: "Zero-Waste Specialist",
    phone: "+91 98450 67890",
    city: "Bangalore",
    pinCodesServed: ["560038", "560034", "560095", "560075", "560102"],
    rating: 4.95,
    completedEvents: 184,
    hasMetalFrame: true,
    paintProtectionCertified: true,
    expressReady: false,
    avgResponseMinutes: 8,
    status: "Available"
  },
  {
    id: "VND-103",
    name: "SpiceRoute Gourmet Caterers",
    type: "Catering",
    tier: "FSSAI Gold Certified",
    phone: "+91 98451 11223",
    city: "Bangalore",
    pinCodesServed: ["560038", "560008", "560034", "560001", "560095"],
    rating: 4.85,
    completedEvents: 420,
    hasMetalFrame: false,
    paintProtectionCertified: false,
    expressReady: false,
    avgResponseMinutes: 12,
    status: "Available"
  },
  {
    id: "VND-104",
    name: "BakeCraft Artisan Patisserie",
    type: "Baker",
    tier: "Express 60-Min Bakery",
    phone: "+91 98452 33445",
    city: "Bangalore",
    pinCodesServed: ["560038", "560008", "560075", "560034", "560025"],
    rating: 4.92,
    completedEvents: 512,
    hasMetalFrame: false,
    paintProtectionCertified: false,
    expressReady: true,
    avgResponseMinutes: 3,
    status: "Available"
  },
  {
    id: "VND-105",
    name: "Aura Moments Candid Photography",
    type: "Photographer",
    tier: "Pro Verified Freelancer",
    phone: "+91 98453 55667",
    city: "Bangalore",
    pinCodesServed: ["560038", "560008", "560075", "560001", "560034", "560095"],
    rating: 4.88,
    completedEvents: 260,
    hasMetalFrame: false,
    paintProtectionCertified: false,
    expressReady: true,
    avgResponseMinutes: 6,
    status: "Available"
  },
  {
    id: "VND-106",
    name: "Mumbai Pulse Sound & Lighting",
    type: "Sound & Light",
    tier: "Gig Tech Partner",
    phone: "+91 98200 99887",
    city: "Mumbai",
    pinCodesServed: ["400050", "400052", "400053", "400054", "400001"],
    rating: 4.8,
    completedEvents: 198,
    hasMetalFrame: true,
    paintProtectionCertified: true,
    expressReady: true,
    avgResponseMinutes: 5,
    status: "Available"
  }
];
