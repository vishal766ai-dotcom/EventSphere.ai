// Entertainment Acts & Spatial Placement Architecture for Indian Apartments and Venues

export const entertainmentActs = [
  {
    id: "ENT-EMCEE-01",
    title: "Interactive Emcee & Party Game Host",
    category: "Games & Engagement",
    price: 3499,
    duration: "90 Minutes",
    description: "High-energy bilingual anchor conducting fun customized icebreakers, couple/family trivia, pass-the-prop, and musical games.",
    equipmentIncluded: "Wireless handheld mic + Bluetooth portable battery amp",
    spaceRequirement: "4x4 ft standing clearance in front of seating area"
  },
  {
    id: "ENT-ACOUSTIC-02",
    title: "Live Acoustic Guitarist & Vocalist",
    category: "Live Music",
    price: 4999,
    duration: "120 Minutes",
    description: "Warm, ambient Bollywood unplugged, retro classics, and English pop acoustic serenades tailored for intimate apartment gatherings.",
    equipmentIncluded: "Fender acoustic guitar, mini Bose acoustic line array, mic stand",
    spaceRequirement: "5x5 ft corner space with one 5A power socket"
  },
  {
    id: "ENT-MAGIC-03",
    title: "Close-Up Illusionist & Strolling Mentalist",
    category: "Magic & Illusion",
    price: 4499,
    duration: "75 Minutes",
    description: "Mind-boggling interactive sleight-of-hand card magic, mind reading, and prop illusions performed table-to-table right before your eyes.",
    equipmentIncluded: "All self-contained props & table pad",
    spaceRequirement: "Zero stage needed; mingles among seated guests"
  },
  {
    id: "ENT-POLAROID-04",
    title: "Instant Polaroid Retro Photobooth Station",
    category: "Photo & Souvenir",
    price: 3999,
    duration: "Full Event",
    description: "Vintage wooden tripod with instant camera, customized laser-cut magnetic photo frames with event date, and quirky handheld props.",
    equipmentIncluded: "Camera operator, 60 instant color prints, neon tabletop sign, magnet clips",
    spaceRequirement: "6x4 ft area next to main backdrop arch"
  },
  {
    id: "ENT-CARICATURE-05",
    title: "Live 3-Minute Digital Caricature Artist",
    category: "Art & Keepsake",
    price: 3799,
    duration: "120 Minutes",
    description: "Professional digital illustrator drawing funny, charming live guest portraits on iPad with instant A5 color printouts in cellophane sleeves.",
    equipmentIncluded: "iPad Pro, portable wireless photo printer, artist easel",
    spaceRequirement: "4x5 ft quiet corner with 2 guest chairs"
  }
];

export const spatialPlacementGuide = {
  venueType: "Standard Indian Apartment Living Room (10x12 ft or 12x14 ft)",
  guidelines: [
    {
      zone: "1. Main Backdrop & Stage Arch",
      location: "Opposite to Main Entrance Door",
      reasoning: "Creates an immediate 'Wow' factor the instant guests walk in. Ensures high-impact photo framing without guests walking in front of the lens.",
      clearanceNeeded: "Clear wall span of 8 to 9 ft; 3 ft floor depth in front for group photos.",
      electricalSOP: "Keep 2 sockets free for neon sign and ambient fairy waterfall."
    },
    {
      zone: "2. Cake Plinth & Milestone Smash Zone",
      location: "Centered 3.5 ft in front of Backdrop Arch",
      reasoning: "Allows host and baby/anniversary couple to stand behind the cake while the neon backdrop remains perfectly centered in photos.",
      clearanceNeeded: "360-degree walking space around plinth so photographer can shoot from multiple angles."
    },
    {
      zone: "3. Acoustic Musician / Entertainment Corner",
      location: "Diagonal 45-degree Corner opposite to Buffet",
      reasoning: "Sound waves disperse evenly into the living room without creating an uncomfortable acoustic blast next to the dining or bar area.",
      clearanceNeeded: "5x5 ft corner area away from balcony sliding doors."
    },
    {
      zone: "4. Royal Dinner Buffet & Chaat Counter",
      location: "Dining Room Alcove or Longest Kitchen-Adjacent Wall",
      reasoning: "Prevents food queue traffic jams from cutting across the main living room photo zone. Enables kitchen team to restock platters discreetly.",
      clearanceNeeded: "Linear 10 to 12 ft perimeter space with single-direction guest traffic flow."
    },
    {
      zone: "5. Welcome Beverage & Mocktail Station",
      location: "Near Foyer / Entrance Hallway",
      reasoning: "Guests are greeted with a welcome drink immediately upon entry, giving them something in hand before they transition to seating.",
      clearanceNeeded: "Small 3x2 ft console table or high-top bar plinth."
    },
    {
      zone: "6. Return Favor & Gift Plinth",
      location: "Right Beside Exit Doorway",
      reasoning: "Guests collect their age-personalized gift bags naturally as they say goodbye, preventing gifts from being misplaced during dinner.",
      clearanceNeeded: "3 ft display plinth with warm accent lamp."
    }
  ]
};
