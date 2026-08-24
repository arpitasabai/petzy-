/* PETZY Veterinary & Healthcare Mock Data (Milestone 1) */

export const siteData = {
  brand: {
    name: "PETZY",
    tagline: "Because Every Paw Deserves the Best Care.",
    description: "Trusted veterinary care, wellness services, and compassionate support for every stage of your pet's life.",
    phone: "+1 (800) 555-PETZY",
    emergencyPhone: "+1 (800) 911-PAWS (24/7 Hotline)",
    email: "care@petzy.com",
    address: "742 Evergreen Paws Way, Suite 400, San Francisco, CA 94107",
    hours: "Mon - Sat: 8:00 AM - 8:00 PM | 24/7 Emergency Care",
    rating: "4.9 ★ (500+ Happy Pets Cared For)"
  },

  // Key Statistics
  statistics: [
    { value: 500, suffix: "+", label: "Happy Pets", icon: "fa-solid fa-paw" },
    { value: 20, suffix: "+", label: "Expert Veterinarians", icon: "fa-solid fa-user-doctor" },
    { value: 10, suffix: "+", label: "Years of Care", icon: "fa-solid fa-calendar-check" },
    { value: 98, suffix: "%", label: "Pet Parent Satisfaction", icon: "fa-solid fa-heart" }
  ],

  // 6 Medical & Wellness Services (Procedurally Accurate Clinical Imagery)
  services: [
    {
      id: "consultation",
      title: "Veterinary Consultation",
      petTypeLabel: "Stethoscope & Physical Exam",
      petTypeIcon: "fa-solid fa-stethoscope",
      icon: "fa-solid fa-stethoscope",
      shortDesc: "Comprehensive physical examinations, diagnostic evaluations, and compassionate care tailored to your pet's life stage.",
      bgClass: "bg-white",
      badge: "Clinical Checkup",
      image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=800&q=80", // Doctor in medical scrubs with stethoscope performing examination on patient
      description: "Our comprehensive veterinary consultations focus on whole-pet health, early symptom detection, preventive lifestyle planning, and open communication with pet parents.",
      procedureDetail: "Physical exam with stethoscope auscultation, palpation, and temperature check.",
      features: [
        "Nose-to-tail clinical physical examination with stethoscope",
        "Vital signs, cardiac auscultation, and abdominal palpation",
        "Nutritional counseling & weight management roadmaps",
        "Behavioral evaluations and personalized wellness guidance"
      ]
    },
    {
      id: "vaccination",
      title: "Vaccination & Immunity",
      petTypeLabel: "Pet Immunization Injection",
      petTypeIcon: "fa-solid fa-syringe",
      icon: "fa-solid fa-syringe",
      shortDesc: "Core and lifestyle vaccine protocols to protect against rabies, distemper, parvovirus, and feline leukemia.",
      bgClass: "bg-cream",
      badge: "Immunity & Shield",
      image: "https://images.pexels.com/photos/6816869/pexels-photo-6816869.jpeg?auto=compress&cs=tinysrgb&w=800", // A veterinarian holding an injection for a cat (Pexels 6816869)
      description: "Customized immunization schedules developed in strict accordance with AAHA and AAFP guidelines, with gentle stress-free administration for puppies, kittens, and companion animals.",
      procedureDetail: "Sterile micro-needle immunization with pre-vaccine temperature and lymph node screening.",
      features: [
        "Core canine (DHPP, Rabies) & feline (FVRCP, FeLV) vaccines",
        "Lifestyle-based risk assessments (Bordetella, Lyme, Lepto)",
        "Pre-vaccine antibody titer testing available",
        "Complimentary post-vaccine health monitoring log"
      ]
    },
    {
      id: "grooming",
      title: "Spa & Medical Grooming",
      petTypeLabel: "Hydrotherapy Bathing",
      petTypeIcon: "fa-solid fa-shower",
      icon: "fa-solid fa-scissors",
      shortDesc: "Therapeutic hydro-massage baths, organic botanical skin care, breed styling, and sanitary ear/nail hygiene.",
      bgClass: "bg-sage-soft",
      badge: "Pampering & Hygiene",
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80", // Pet receiving soothing shampoo bath and hydrotherapy in grooming salon
      description: "Fear-Free certified grooming sessions utilizing hypoallergenic organic botanicals, non-slip hydraulic tables, and calming aromatics for dogs and cats.",
      procedureDetail: "Warm hydro-surge massage bathing with botanical wash, fluff dry, and paw conditioning.",
      features: [
        "Warm hydro-surge massage bath with botanical wash",
        "Complete undercoat deshedding and fluff blow-dry",
        "Gentle nail trimming, smoothing, and paw balm massage",
        "Sanitary ear cleansing and breath freshening"
      ]
    },
    {
      id: "dental-care",
      title: "Dental Care & Hygiene",
      petTypeLabel: "Oral Teeth Check & Scaling",
      petTypeIcon: "fa-solid fa-tooth",
      icon: "fa-solid fa-tooth",
      shortDesc: "Ultrasonic scaling, subgingival polishing, digital oral radiographs, and periodontal disease prevention.",
      bgClass: "bg-cream",
      badge: "Oral Wellness",
      image: "https://images.pexels.com/photos/6234622/pexels-photo-6234622.jpeg?auto=compress&cs=tinysrgb&w=800", // A veterinarian checking a dog (Pexels 6234622)
      description: "Advanced dental suites equipped with digital oral X-rays and precision ultrasonic scaling to treat plaque, tartar, and maintain healthy gums in companion pets.",
      procedureDetail: "Subgingival plaque removal with ultrasonic scaling and fluoride polishing.",
      features: [
        "Comprehensive oral evaluation, incisor alignment & charting",
        "Ultrasonic supragingival and subgingival scaling",
        "High-gloss fluoride enamel polishing",
        "Home oral hygiene coaching and safe dental chews"
      ]
    },
    {
      id: "surgery",
      title: "Soft Tissue & Orthopedic Surgery",
      petTypeLabel: "Sterile Surgical Suite",
      petTypeIcon: "fa-solid fa-hospital",
      icon: "fa-solid fa-kit-medical",
      shortDesc: "State-of-the-art sterile surgical suites for spay/neuter, mass removal, and advanced orthopedic procedures.",
      bgClass: "bg-white",
      badge: "Advanced Surgery",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80", // Board-certified surgeon in surgical scrub suite with operating monitors and sterile lights
      description: "Equipped with multiparameter continuous anesthesia monitoring, warming blankets, and dedicated veterinary surgical nursing teams for all surgical operations.",
      procedureDetail: "Sterile surgical theater with continuous vital signs, ECG, and SpO2 monitoring.",
      features: [
        "Routine elective procedures (Spay, Neuter, Microchipping)",
        "Soft tissue surgery (mass removals, gastrointestinal procedures)",
        "Dedicated post-op recovery warming suites",
        "Multimodal pain management and recovery check-ins"
      ]
    },
    {
      id: "emergency",
      title: "24/7 Emergency & Urgent Care",
      petTypeLabel: "Intensive Trauma Triage",
      petTypeIcon: "fa-solid fa-truck-medical",
      icon: "fa-solid fa-truck-medical",
      shortDesc: "Rapid response critical care, trauma stabilization, oxygen therapy, and emergency surgery around the clock.",
      bgClass: "bg-sage-soft",
      badge: "24/7 Readiness",
      image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80", // Modern hospital emergency trauma intensive care unit and diagnostic equipment
      description: "Our hospital is staffed 24 hours a day, 365 days a year with intensive care veterinarians ready for urgent medical triage, oxygen support, and trauma stabilization.",
      procedureDetail: "Immediate emergency triage, blood diagnostics in 10 minutes, and intensive overnight hospitalization.",
      features: [
        "Immediate emergency triage with zero wait for critical cases",
        "Oxygen therapy and intensive care incubators",
        "Complete in-house critical bloodwork results in 10 minutes",
        "Emergency fluid resuscitation and overnight hospitalization"
      ]
    }
  ],

  // 4 Core Why Choose PETZY Benefits
  benefits: [
    {
      number: "01",
      icon: "fa-solid fa-user-doctor",
      title: "Experienced Veterinarians",
      desc: "Board-certified doctors with decades of combined clinical expertise in surgery, cardiology, wellness, and feline medicine."
    },
    {
      number: "02",
      icon: "fa-solid fa-heart-pulse",
      title: "Personalized Pet Care",
      desc: "Every pet receives a customized treatment plan respecting their unique breed temperament, age, and lifestyle habits."
    },
    {
      number: "03",
      icon: "fa-solid fa-hospital",
      title: "Modern Facilities",
      desc: "Cutting-edge digital imaging, ultra-low-dose X-rays, sterile laminar air suites, and separate stress-free cat & dog waiting zones."
    },
    {
      number: "04",
      icon: "fa-solid fa-calendar-check",
      title: "Easy & Convenient Booking",
      desc: "Seamless appointment scheduling, real-time reminders, and direct emergency hotline access 24/7."
    }
  ],

  // 4 Featured Veterinarians
  veterinarians: [
    {
      id: "dr-ananya-sharma",
      name: "Dr. Ananya Sharma",
      title: "Chief Veterinary Surgeon",
      experience: "8+ Years Experience",
      degrees: "BVSc & AH, MVSc (Surgery), DACVS",
      bio: "Dr. Ananya Sharma specializes in minimally invasive soft tissue surgery and complex reconstructive procedures. She has performed over 1,800 successful surgical operations with a compassionate, gentle touch.",
      specialties: ["Orthopedic & Soft Tissue Surgery", "Minimally Invasive Laparoscopy", "Pain Management"],
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
      badge: "Surgical Director"
    },
    {
      id: "dr-rohan-mehta",
      name: "Dr. Rohan Mehta",
      title: "Pet Wellness & Nutrition Specialist",
      experience: "6+ Years Experience",
      degrees: "DVM, ACVN Board Certified",
      bio: "Dr. Rohan is deeply passionate about preventive pet longevity, holistic herbal therapeutics, and chronic dermatology management to ensure pets thrive at every age.",
      specialties: ["Preventive Longevity", "Clinical Dermatology", "Nutritional Therapy"],
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
      badge: "Wellness Lead"
    },
    {
      id: "dr-sarah-kapoor",
      name: "Dr. Sarah Kapoor",
      title: "Senior Veterinary Physician",
      experience: "10+ Years Experience",
      degrees: "DVM, DABVP (Canine/Feline Practice)",
      bio: "With over a decade of clinical medicine experience, Dr. Sarah oversees general internal medicine, geriatric pet wellness programs, and pediatric vaccinations.",
      specialties: ["Internal Medicine", "Feline Low-Stress Medicine", "Senior Pet Vitality"],
      image: "https://images.unsplash.com/photo-1594824813598-a28a307a514d?auto=format&fit=crop&w=600&q=80",
      badge: "Senior Clinician"
    },
    {
      id: "dr-david-chen",
      name: "Dr. David Chen",
      title: "Emergency & Critical Care Specialist",
      experience: "12+ Years Experience",
      degrees: "DVM, DACVECC Fellow",
      bio: "Dr. David leads PETZY's 24/7 urgent care and trauma unit, bringing calm precision and world-class diagnostic expertise to critical pet emergencies.",
      specialties: ["Trauma Resuscitation", "Cardiovascular Critical Care", "Emergency Imaging"],
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
      badge: "Emergency Lead"
    }
  ],

  // Testimonials
  testimonials: [
    {
      id: 1,
      author: "Priya & Rajesh Nair",
      petName: "Bruno (Golden Retriever)",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      review: "PETZY made our first vet visit so easy. Dr. Ananya and the entire team were incredibly kind, patient, and professional with Bruno. You can feel how much they genuinely care about animals."
    },
    {
      id: 2,
      author: "Vikram Malhotra",
      petName: "Mimi (Persian Cat)",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
      review: "Finding a vet where my anxious cat feels relaxed was nearly impossible until we found PETZY. The separate cat waiting suite and gentle handling by Dr. Sarah are remarkable."
    },
    {
      id: 3,
      author: "Anjali Deshmukh",
      petName: "Coco (Shih Tzu)",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
      review: "From routine vaccinations to the hydrotherapy grooming spa, PETZY provides gold-standard care. The doctors take time to explain everything thoroughly with no rushed visits."
    }
  ],

  // FAQs
  faqs: [
    {
      q: "How do I book an appointment at PETZY?",
      a: "You can easily schedule a visit online by clicking the 'Book an Appointment' button on any page, or by calling our friendly care concierge desk at +1 (800) 555-PETZY."
    },
    {
      q: "What veterinary services does PETZY offer?",
      a: "We offer comprehensive care under one roof: wellness consultations, vaccinations, dental cleanings, soft tissue & orthopedic surgery, therapeutic grooming, and 24/7 emergency urgent care."
    },
    {
      q: "Can I choose my specific veterinarian for my visit?",
      a: "Yes! When scheduling your appointment, you can select your preferred doctor (such as Dr. Ananya Sharma or Dr. Rohan Mehta) based on their schedule and your pet's needs."
    },
    {
      q: "Do you provide 24/7 emergency and critical care?",
      a: "Yes, our hospital operates an emergency trauma unit 24 hours a day, 365 days a year. No prior appointment is required for urgent medical emergencies."
    },
    {
      q: "Can I bring multiple pets to a single appointment?",
      a: "Absolutely! We offer multi-pet family appointments so all your pets can receive their checkups and vaccinations during one convenient visit."
    },
    {
      q: "How can I prepare my pet for their veterinary visit?",
      a: "Bring your pet on a secure leash or carrier, keep them calm with favorite treats, and bring any past medical records or medication containers for review."
    }
  ],

  // High-Resolution Curated Visuals
  images: {
    heroPet: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=80", // Happy dog
    aboutVet: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80", // Caring veterinarian tenderly examining and holding sweet companion pet
    ctaPet: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80" // Friendly veterinarian consulting with pet owner & companion pet in modern clinic
  }
};
