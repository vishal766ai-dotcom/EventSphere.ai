// Curated Guest Gifting & Return Favors Catalog by Age Group + Gifting Logistics SOP

export const giftingCatalog = [
  {
    ageGroup: "Kids (Ages 3 – 12)",
    icon: "Baby",
    tagline: "Engaging, screen-free, and safe creative souvenirs",
    items: [
      {
        id: "GIFT-KID-01",
        title: "Artisanal DIY Clay & Pottery Painting Kit",
        pricePerUnit: 249,
        description: "Non-toxic terracotta miniature figurines with 6 washable tempera colors and wooden brushes.",
        ecoCertified: true,
        bestFor: "Milestone Birthdays & Kids Gatherings"
      },
      {
        id: "GIFT-KID-02",
        title: "Personalized Wooden Animal Puzzle & Storybook",
        pricePerUnit: 349,
        description: "Custom laser-cut pine wood name puzzle with a bilingual fable picture book.",
        ecoCertified: true,
        bestFor: "1st & 5th Birthdays"
      },
      {
        id: "GIFT-KID-03",
        title: "Gourmet Healthy Bento: Seed Pops & Granola Treats",
        pricePerUnit: 199,
        description: "Zero refined sugar dried fruit lollipops, roasted ragi chips, and honey berry bites in a bamboo box.",
        ecoCertified: true,
        bestFor: "Daytime Celebrations"
      }
    ]
  },
  {
    ageGroup: "Teens & Young Adults (Ages 13 – 25)",
    icon: "Sparkles",
    tagline: "Aesthetic, trendy, and functional lifestyle keepsakes",
    items: [
      {
        id: "GIFT-TEEN-01",
        title: "Custom LED Glow Keychain & Tech Organizer Pouch",
        pricePerUnit: 299,
        description: "Personalized engraved acrylic mini neon tag with a water-resistant cable and earphone pouch.",
        ecoCertified: false,
        bestFor: "College Farewells & Bachelorettes"
      },
      {
        id: "GIFT-TEEN-02",
        title: "Plantable Seed Paper Journal & Herb Pencil Set",
        pricePerUnit: 259,
        description: "Recycled cotton paper diary. Pencils contain basil, tomato, and marigold seeds at the base.",
        ecoCertified: true,
        bestFor: "Farewells, Youth Parties & Eco Events"
      },
      {
        id: "GIFT-TEEN-03",
        title: "Artisanal Boba / Cold Brew DIY Kit & Glass Tumbler",
        pricePerUnit: 399,
        description: "Includes glass sipper with bamboo straw, roasted Arabica brew bag, and caramel syrup drops.",
        ecoCertified: true,
        bestFor: "Milestone 18th & 21st Celebrations"
      }
    ]
  },
  {
    ageGroup: "Adults (Ages 26 – 55)",
    icon: "Coffee",
    tagline: "Sophisticated gourmet tastings, aromatherapy, and home accents",
    items: [
      {
        id: "GIFT-ADULT-01",
        title: "Royal Kashmiri Kahwa & Single-Origin Honey Jar Hamper",
        pricePerUnit: 499,
        description: "Whole green tea leaves infused with saffron, cardamom, and almond slivers, paired with forest honey.",
        ecoCertified: true,
        bestFor: "Housewarmings & Anniversaries"
      },
      {
        id: "GIFT-ADULT-02",
        title: "Handmade Ceramic Succulent Planter in Jute Tote",
        pricePerUnit: 379,
        description: "Live air-purifying Jade or Haworthia succulent in a handcrafted studio ceramic pot.",
        ecoCertified: true,
        bestFor: "Housewarmings & Intimate Dinners"
      },
      {
        id: "GIFT-ADULT-03",
        title: "Artisanal Cold-Pressed Scented Soy Candle in Brass Tin",
        pricePerUnit: 449,
        description: "Mogra (Jasmine) & Sandalwood slow-burn candle with 30-hour fragrance release.",
        ecoCertified: true,
        bestFor: "Milestone Birthdays & Bachelorettes"
      }
    ]
  },
  {
    ageGroup: "Seniors & Grandparents (Ages 55+)",
    icon: "HeartHandshake",
    tagline: "Traditional wellness, cultural reverence, and soothing heritage gifts",
    items: [
      {
        id: "GIFT-SENIOR-01",
        title: "Pure Brass Heritage Akhand Diya & Aromatic Sambrani Dhoop",
        pricePerUnit: 549,
        description: "Engraved brass temple lamp with chemical-free natural cow dung & frankincense dhoop cups.",
        ecoCertified: true,
        bestFor: "Griha Pravesh & 60th/75th Milestones"
      },
      {
        id: "GIFT-SENIOR-02",
        title: "Kashmiri Pashmina-Feel Warm Woolen Stole",
        pricePerUnit: 699,
        description: "Ultra-soft unisex woven jacquard shawl in ivory or fawn tones with gold border.",
        ecoCertified: true,
        bestFor: "Milestone Golden Anniversaries"
      },
      {
        id: "GIFT-SENIOR-03",
        title: "Ayurvedic Herbal Concoction & Copper Tumbler Set",
        pricePerUnit: 599,
        description: "Hand-hammered pure copper glass paired with organic Ashwagandha & Mulethi night tea tin.",
        ecoCertified: true,
        bestFor: "Family Reunions & Pujas"
      }
    ]
  }
];

export const giftingLogisticsSOP = {
  title: "4-Step Seamless Host Gifting Protocol",
  steps: [
    {
      step: 1,
      title: "Attendee Age Profiling",
      desc: "The host selects headcount or inputs age percentages (e.g., 8 Kids, 24 Adults, 8 Seniors). The system calculates exact gift counts and suggests age-appropriate hampers."
    },
    {
      step: 2,
      title: "Personalized Host Thank-You Tags",
      desc: "Each gift box is customized with host names and celebration date on handmade seed-paper tags (e.g., 'Thank you for celebrating Aarav's 1st Birthday with us!')."
    },
    {
      step: 3,
      title: "Dark-Store Pre-Bundling & Delivery",
      desc: "Gifts are packaged in coordinated cloth totes or bamboo boxes at the metro dark store and dispatched in the same vehicle as the decor kit."
    },
    {
      step: 4,
      title: "Staging on Dedicated Exit Favor Table",
      desc: "The gig manager stages the gift boxes neatly on a designated display plinth near the exit door with warm spotlighting, ensuring seamless handover as guests leave."
    }
  ]
};
