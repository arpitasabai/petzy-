/* PETZY Mock Database & Structured Data (Milestone 1) */

export const siteData = {
  brand: {
    name: "PETZY",
    tagline: "Everything Your Pet Needs, All in One Place.",
    description: "Discover thoughtfully selected pet essentials and trusted care services designed to make pet parenting easier and happier.",
    phone: "+1 (800) 555-PETZY",
    email: "care@petzy.com",
    address: "742 Evergreen Paws Way, Suite 400, San Francisco, CA 94107",
    hours: "Mon - Sat: 8:00 AM - 8:00 PM | Sun: 9:00 AM - 6:00 PM",
    rating: "4.9 ★ (50,000+ Happy Parents)"
  },

  // Realistic Pet Imagery for Interactive UI
  petImages: {
    // Hero & Highlights
    heroDog: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=80", // Golden Retriever looking forward
    heroMiniCat: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=300&q=80", // Fluffy cat
    heroMiniRabbit: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=300&q=80", // Lop rabbit
    heroMiniBird: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=300&q=80", // Colorful parrot/bird
    
    // Categories
    catDog: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80", // Beagle dog
    catCat: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=400&q=80", // Peeking cat
    catBird: "https://images.unsplash.com/photo-1452570053593-0b015316ec58?auto=format&fit=crop&w=400&q=80", // Perched bird
    catSmallPets: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=400&q=80", // Fluffy guinea pig / hamster
    catFish: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80", // Tropical clownfish aquarium
    catReptiles: "https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?auto=format&fit=crop&w=400&q=80", // Friendly turtle walking

    // Story & Lifestyle
    storyDogOwner: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1000&q=80", // Pet parent hugging dog
    storyPuppy: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80", // Cute puppy
    peekingRabbitCta: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=200&q=80", // Rabbit for CTA

    // Avatars
    avatar1: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    avatar2: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    avatar3: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80"
  },

  // Categories (Shop by Pet)
  categories: [
    {
      id: "dogs",
      title: "Dogs",
      count: "320+ Essentials",
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80",
      bgClass: "bg-sage",
      interaction: "Paws Over Card",
      badge: "Best Friend Pick"
    },
    {
      id: "cats",
      title: "Cats",
      count: "240+ Essentials",
      image: "https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=400&q=80",
      bgClass: "bg-cream",
      interaction: "Peeking Above Card",
      badge: "Curious Feline"
    },
    {
      id: "birds",
      title: "Birds",
      count: "115+ Essentials",
      image: "https://images.unsplash.com/photo-1452570053593-0b015316ec58?auto=format&fit=crop&w=400&q=80",
      bgClass: "bg-coral",
      interaction: "Sitting on Card Edge",
      badge: "Songbird Favorite"
    },
    {
      id: "small-pets",
      title: "Small Pets",
      count: "95+ Essentials",
      image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=400&q=80",
      bgClass: "bg-yellow",
      interaction: "Rabbit Overlapping Card",
      badge: "Fluffy & Tiny"
    },
    {
      id: "fish",
      title: "Fish",
      count: "80+ Essentials",
      image: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?auto=format&fit=crop&w=400&q=80",
      bgClass: "bg-sky",
      interaction: "Aquarium Visual Card",
      badge: "Aquatic Oasis"
    },
    {
      id: "reptiles",
      title: "Reptiles",
      count: "60+ Essentials",
      image: "https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?auto=format&fit=crop&w=400&q=80",
      bgClass: "bg-mint",
      interaction: "Crossing Card Boundary",
      badge: "Gentle Crawlers"
    }
  ],

  // Featured Products (PETZY Picks)
  products: [
    {
      id: "dog-treats",
      name: "Organic All-Natural Dog Treats",
      category: "Dogs",
      price: 18.99,
      oldPrice: 24.99,
      rating: 4.9,
      reviewsCount: 342,
      tag: "Best Seller",
      image: "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?auto=format&fit=crop&w=600&q=80",
      petPeek: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=150&q=80",
      description: "Handcrafted oven-baked crunch treats made with organic pumpkin, free-range chicken, and wholesome oats."
    },
    {
      id: "interactive-dog-toy",
      name: "Smart Interactive Dog Puzzle Toy",
      category: "Dogs",
      price: 29.50,
      oldPrice: 35.00,
      rating: 4.8,
      reviewsCount: 218,
      tag: "Brain Booster",
      image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=600&q=80",
      petPeek: "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=150&q=80",
      description: "Mentally stimulating IQ puzzle toy with non-slip base and treat dispenser compartments."
    },
    {
      id: "cat-grooming-brush",
      name: "Gentle Deshedding Cat Grooming Brush",
      category: "Cats",
      price: 16.75,
      oldPrice: 22.00,
      rating: 4.9,
      reviewsCount: 412,
      tag: "Vet Approved",
      image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80",
      petPeek: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=150&q=80",
      description: "Soft massage bristle design that gently reduces shedding by up to 95% without scratching sensitive skin."
    },
    {
      id: "cozy-pet-bed",
      name: "Orthopedic Cloud Plush Pet Bed",
      category: "All Pets",
      price: 49.99,
      oldPrice: 65.00,
      rating: 5.0,
      reviewsCount: 520,
      tag: "Cloud Comfort",
      image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&w=600&q=80",
      petPeek: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=150&q=80",
      description: "Ultra-plush calming donut bed with orthopedic memory foam relief and removable machine-washable cover."
    }
  ],

  // Services
  services: [
    {
      id: "grooming",
      title: "Signature Spa Grooming",
      icon: "fa-solid fa-scissors",
      badge: "Pampered & Fresh",
      shortDesc: "Full-suite hydrotherapy bathing, organic aroma treatment, deshedding, and precision breed styling.",
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80",
      petVisual: "Dog with gentle grooming tools",
      benefits: [
        "100% tearless, hypoallergenic organic botanical shampoos",
        "Gentle stress-free handling by master certified groomers",
        "Deep conditioning paw balm and ear cleaning included",
        "Breed-specific custom styling and coat fluff-drying"
      ]
    },
    {
      id: "veterinary",
      title: "Preventive Veterinary Care",
      icon: "fa-solid fa-stethoscope",
      badge: "Certified Health",
      shortDesc: "Comprehensive wellness checkups, vaccinations, routine diagnostics, and compassionate nutritional consultations.",
      image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=800&q=80",
      petVisual: "Doctor gently examining a happy pet",
      benefits: [
        "Fear-free accredited clinical examination rooms",
        "Detailed full-body physical evaluation and weight tracking",
        "Custom life-stage vaccination and parasite prevention plans",
        "Nutritional counseling tailored to your pet's breed and lifestyle"
      ]
    },
    {
      id: "wellness",
      title: "Holistic Pet Wellness & Therapy",
      icon: "fa-solid fa-heart-pulse",
      badge: "Longevity & Joy",
      shortDesc: "Rejuvenating massage therapy, joint mobility physical support, calming aromatherapy, and custom diet planning.",
      image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80",
      petVisual: "Calm rabbit and cat relaxing peacefully",
      benefits: [
        "Specialized soothing acupressure and gentle joint relief",
        "Nutritional herbal balance and gut-health optimization",
        "Senior pet mobility and vitality wellness programs",
        "Emotional calming therapies for rescue and anxious pets"
      ]
    }
  ],

  // Brand Values (About Us)
  values: [
    {
      title: "Pet First",
      desc: "Every single formulation, toy design, and care service is built around your pet's natural happiness, safety, and comfort.",
      icon: "fa-solid fa-paw"
    },
    {
      title: "Pure Quality",
      desc: "We rigorously vet all ingredients, clean fabrics, and certified non-toxic materials before anything reaches your doorstep.",
      icon: "fa-solid fa-shield-halved"
    },
    {
      title: "Deep Care",
      desc: "Compassion guides every decision we make. We treat your furry, feathered, and scaled companions like our own family.",
      icon: "fa-solid fa-heart"
    },
    {
      title: "Earned Trust",
      desc: "Transparent ingredients, certified veterinary advisors, and 50,000+ verified 5-star reviews back our promise.",
      icon: "fa-solid fa-certificate"
    }
  ],

  // Pet Care Content / Blog
  careContent: [
    {
      id: "dog-care-tips",
      tag: "Canine Health",
      title: "Everyday Dog Care Tips for a Vibrant Life",
      readTime: "4 min read",
      date: "August 2026",
      image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80",
      summary: "Simple daily routines, hydration habits, and mental stimulation games that keep your pup thriving at every age."
    },
    {
      id: "cat-happy-guide",
      tag: "Feline Wellness",
      title: "How to Keep Your Indoor Cat Happy & Enriched",
      readTime: "5 min read",
      date: "August 2026",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80",
      summary: "Vertical spaces, interactive hunt toys, and calming routines that eliminate stress and spark feline joy."
    },
    {
      id: "small-pet-care",
      tag: "Pocket Pets",
      title: "Essential Small Pet Care: Rabbits, Guinea Pigs & More",
      readTime: "3 min read",
      date: "August 2026",
      image: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80",
      summary: "Dietary timothy hay essentials, safe habitats, and gentle handling techniques for gentle companion pets."
    }
  ],

  // Testimonials
  testimonials: [
    {
      id: 1,
      name: "Sarah Jenkins",
      petName: "Milo (Golden Retriever)",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      review: "PETZY has completely transformed Milo’s nutrition and coat! Their organic treats and spa grooming team treat him like absolute royalty. I won't shop anywhere else."
    },
    {
      id: 2,
      name: "Marcus Vance",
      petName: "Luna & Oliver (Cats)",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      review: "The deshedding brush and plush calming bed were game changers. Luna usually runs from brushes, but with PETZY she purrs the entire time. Incredible quality!"
    },
    {
      id: 3,
      name: "Elena Rostova",
      petName: "Barnaby (Holland Lop)",
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      rating: 5,
      review: "Finding trustworthy small pet essentials used to be frustrating. PETZY’s curation is world-class. Fast delivery, beautiful eco-friendly packaging, and Barnaby approved!"
    }
  ],

  // FAQ Categories and Items
  faqs: {
    general: [
      {
        q: "What makes PETZY different from other pet stores?",
        a: "PETZY combines veterinarian-vetted organic products with holistic care services. We only stock items that pass strict non-toxic, pet-safe ingredient and safety tests."
      },
      {
        q: "Where do you source your pet foods and ingredients?",
        a: "100% of our pet foods and treats are sourced from certified organic North American and European sustainable farms with zero artificial preservatives, fillers, or synthetic dyes."
      },
      {
        q: "How fast is standard shipping?",
        a: "We offer complimentary 2-day express shipping on all orders over $49 across the continental US, packed in 100% recyclable, pet-safe insulated packaging."
      }
    ],
    products: [
      {
        q: "How do I choose the right size bed or harness for my pet?",
        a: "Each product page includes our interactive size guide with weight and girth charts. If your pet falls between sizes, we recommend sizing up for comfortable relaxation."
      },
      {
        q: "Are PETZY toys suitable for heavy chewers?",
        a: "Yes! Look for our 'Tough Chew' badge on canine toys, which are engineered from non-toxic natural rubber and reinforced ballistic fibers."
      },
      {
        q: "What is your return policy for pet treats and toys?",
        a: "We offer a 30-day '100% Tail Wag Guarantee'. If your pet doesn't love their new item, we'll issue a full refund or free replacement."
      }
    ],
    services: [
      {
        q: "What certifications do your groomers and veterinary staff hold?",
        a: "All PETZY groomers are certified by the National Dog Groomers Association of America (NDGAA) and trained in Fear-Free low-stress handling protocols."
      },
      {
        q: "What precautions are taken for anxious or senior pets?",
        a: "We allocate extra time slots, use calming pheromone diffusers, low-noise drying tools, and non-slip orthopedic tables to ensure a tranquil experience."
      },
      {
        q: "Do you offer package discounts for routine wellness?",
        a: "Yes! Our PETZY Wellness Club offers monthly grooming and veterinary maintenance packages with exclusive savings and complimentary home deliveries."
      }
    ],
    account: [
      {
        q: "How do I create and manage a PETZY account?",
        a: "You can create a free account in under 30 seconds via our Register page or with one click using Google authentication."
      },
      {
        q: "Can I save multiple pets in my wishlist?",
        a: "Yes! You can favorite items by tapping the heart icon on any product card, instantly syncing across your devices."
      },
      {
        q: "Is my personal payment and pet data secure?",
        a: "We employ 256-bit SSL encryption and strict privacy protocols. We never sell or share your personal information with third parties."
      }
    ]
  }
};
