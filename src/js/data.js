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
      duration: "30 Mins",
      price: "$55",
      room: "Consultation Suite 2B",
      image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=800&q=80",
      description: "Our comprehensive veterinary consultations focus on whole-pet health, early symptom detection, preventive lifestyle planning, and open communication with pet parents.",
      procedureDetail: "Physical exam with stethoscope auscultation, palpation, and temperature check.",
      features: [
        "Nose-to-tail clinical physical examination with stethoscope",
        "Vital signs, cardiac auscultation, and abdominal palpation",
        "Nutritional counseling & weight management roadmaps",
        "Behavioral evaluations and personalized wellness guidance"
      ],
      inclusions: [
        "Nose-to-Tail Physical Health Examination",
        "Heart & Lung Auscultation with Stethoscope",
        "Oral Cavity, Gum & Dental Assessment",
        "Ophthalmic (Eye) & Otoscopic (Ear) Evaluation",
        "Abdominal Palpation & Organ Health Check",
        "Orthopedic Gait & Musculoskeletal Exam",
        "Dermatological Skin & Coat Health Analysis",
        "Custom Diet, Nutrition & Lifestyle Roadmap"
      ],
      benefits: [
        {
          icon: "fa-solid fa-shield-virus",
          title: "Early Disease Detection",
          desc: "Catches subtle cardiac, renal, or endocrine changes before symptoms worsen."
        },
        {
          icon: "fa-solid fa-heart-pulse",
          title: "Optimal Weight & Nutrition",
          desc: "Preserves joint health and adds years of active vitality to your pet's life."
        }
      ],
      faqs: [
        {
          question: "How long does a comprehensive consultation take?",
          answer: "Our standard examination visits last between 30 to 45 minutes to ensure plenty of time for thorough evaluations and answering all your questions."
        },
        {
          question: "What should I bring to my pet's consultation?",
          answer: "Please bring past vaccination history, records of current medications, and any specific questions or dietary notes you have."
        },
        {
          question: "Are diagnostic blood tests done during the same visit?",
          answer: "Yes! With our in-house laboratory suite, routine blood chemistry, hematology, and urinalysis results are available within 15–20 minutes."
        }
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
      duration: "30 Mins",
      price: "$45",
      room: "Immunization Suite 1",
      image: "https://images.pexels.com/photos/6816869/pexels-photo-6816869.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Customized immunization schedules developed in strict accordance with AAHA and AAFP guidelines, with gentle stress-free administration for puppies, kittens, and companion animals.",
      procedureDetail: "Sterile micro-needle immunization with pre-vaccine temperature and lymph node screening.",
      features: [
        "Core canine (DHPP, Rabies) & feline (FVRCP, FeLV) vaccines",
        "Lifestyle-based risk assessments (Bordetella, Lyme, Lepto)",
        "Pre-vaccine antibody titer testing available",
        "Complimentary post-vaccine health monitoring log"
      ],
      inclusions: [
        "Pre-Vaccine Physical & Temperature Screening",
        "Core Canine (DHPP, Rabies) or Feline (FVRCP, Rabies) Vaccine",
        "Lifestyle Risk Assessment (Bordetella, Lyme, Lepto)",
        "Sterile Single-Use Ultra-Fine Micro-Needle Injection",
        "Pre-Vaccine Antibody Titer Testing Available",
        "Official Certified Vaccination Certificate",
        "Digital Vaccine Record Synchronized to Parent Portal",
        "Post-Vaccine 15-Minute Monitoring & Care Protocol"
      ],
      benefits: [
        {
          icon: "fa-solid fa-shield-halved",
          title: "Lifetime Disease Immunity",
          desc: "Protects against life-threatening viral infections like Parvovirus, Distemper, and Rabies."
        },
        {
          icon: "fa-solid fa-passport",
          title: "Boarding & Travel Compliance",
          desc: "Meets all legal requirements for boarding kennels, daycares, and interstate/international travel."
        }
      ],
      faqs: [
        {
          question: "How often does my pet need booster vaccinations?",
          answer: "Core vaccines like Rabies and DHPP/FVRCP follow a 1-year or 3-year schedule based on age, lifestyle, and previous medical history."
        },
        {
          question: "Are there any side effects after vaccination?",
          answer: "Mild sleepiness or slight tenderness at the injection site for 24 hours is normal. Severe reactions are extremely rare and monitored carefully."
        },
        {
          question: "Do strictly indoor cats need vaccinations?",
          answer: "Yes. Rabies is required by law, and airborne viruses like FVRCP can be tracked indoors on footwear, clothing, or through open window screens."
        }
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
      duration: "60 Mins",
      price: "$65",
      room: "Spa & Grooming Wing",
      image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=800&q=80",
      description: "Fear-Free certified grooming sessions utilizing hypoallergenic organic botanicals, non-slip hydraulic tables, and calming aromatics for dogs and cats.",
      procedureDetail: "Warm hydro-surge massage bathing with botanical wash, fluff dry, and paw conditioning.",
      features: [
        "Warm hydro-surge massage bath with botanical wash",
        "Complete undercoat deshedding and fluff blow-dry",
        "Gentle nail trimming, smoothing, and paw balm massage",
        "Sanitary ear cleansing and breath freshening"
      ],
      inclusions: [
        "Warm Hydro-Surge Therapeutic Bathing",
        "Hypoallergenic Organic Botanical Shampoo & Conditioning",
        "Complete Undercoat Deshedding & De-matting",
        "Gentle High-Velocity Warm Air Fluff Blow-Dry",
        "Precision Breed-Specific Styling & Sanitary Trim",
        "Ultrasonic Ear Cleansing & Ear Canal Hygiene",
        "Gentle Nail Trimming & Smoothing Dremel",
        "Soothing Organic Paw Balm Massage & Breath Refresh"
      ],
      benefits: [
        {
          icon: "fa-solid fa-spa",
          title: "Healthy Skin Barrier & Dermal Relief",
          desc: "Eliminates trapped allergens, soothes itchy hot spots, and reduces shedding by up to 80%."
        },
        {
          icon: "fa-solid fa-magnifying-glass",
          title: "Early Detection of Skin Conditions",
          desc: "Professional groomers inspect skin folds, ears, and paws for early signs of cysts, fleas, or infections."
        }
      ],
      faqs: [
        {
          question: "How long does a full spa grooming session take?",
          answer: "Typically 60 to 90 minutes depending on your pet's breed size, coat density, and specific styling requested."
        },
        {
          question: "How do you handle pets that get anxious during grooming?",
          answer: "We use Fear-Free certified handling protocols, non-slip hydraulic tables, warm towels, and soothing natural lavender aromatics."
        },
        {
          question: "How frequently should my pet be groomed?",
          answer: "Most dogs benefit from professional grooming every 4 to 6 weeks, while short-haired companion cats benefit every 8 to 12 weeks."
        }
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
      duration: "45 Mins",
      price: "$85",
      room: "Dental Suite A",
      image: "https://images.pexels.com/photos/6234622/pexels-photo-6234622.jpeg?auto=compress&cs=tinysrgb&w=800",
      description: "Advanced dental suites equipped with digital oral X-rays and precision ultrasonic scaling to treat plaque, tartar, and maintain healthy gums in companion pets.",
      procedureDetail: "Subgingival plaque removal with ultrasonic scaling and fluoride polishing.",
      features: [
        "Comprehensive oral evaluation, incisor alignment & charting",
        "Ultrasonic supragingival and subgingival scaling",
        "High-gloss fluoride enamel polishing",
        "Home oral hygiene coaching and safe dental chews"
      ],
      inclusions: [
        "Comprehensive 360° Oral Cavity & Periodontal Grading",
        "Full-Mouth Digital Dental Radiographs (X-rays)",
        "Supragingival & Subgingival Ultrasonic Tartar Scaling",
        "Periodontal Pocket Depth Measurement & Charting",
        "High-Gloss Fluoride Enamel Buffing & Polishing",
        "Antibacterial Chlorhexidine Oral Irrigation",
        "Gingival Barrier Protectant Application",
        "Personalized Home Dental Care Coaching & Dental Kit"
      ],
      benefits: [
        {
          icon: "fa-solid fa-tooth",
          title: "Prevents Systemic Organ Disease",
          desc: "Untreated oral bacteria can travel through the bloodstream to damage heart valves, kidneys, and liver."
        },
        {
          icon: "fa-solid fa-face-smile",
          title: "Eliminates Pain & Bad Breath",
          desc: "Resolves painful gingivitis, inflamed gums, loose teeth, and restores fresh breath."
        }
      ],
      faqs: [
        {
          question: "Why is anesthesia required for a thorough dental cleaning?",
          answer: "Anesthesia allows complete scaling below the gumline and taking full X-rays safely without causing fear, stress, or sudden movement."
        },
        {
          question: "How do I know if my pet has dental disease?",
          answer: "Common signs include bad breath, yellow-brown tartar, red bleeding gums, dropping kibble, or pawing at the mouth."
        },
        {
          question: "What can I do at home between professional cleanings?",
          answer: "Daily enzymatic tooth brushing, veterinary dental water additives, and VOHC-approved dental chews help maintain clean teeth."
        }
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
      duration: "90 Mins",
      price: "$250",
      room: "Sterile Surgical Suite 1",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
      description: "Equipped with multiparameter continuous anesthesia monitoring, warming blankets, and dedicated veterinary surgical nursing teams for all surgical operations.",
      procedureDetail: "Sterile surgical theater with continuous vital signs, ECG, and SpO2 monitoring.",
      features: [
        "Routine elective procedures (Spay, Neuter, Microchipping)",
        "Soft tissue surgery (mass removals, gastrointestinal procedures)",
        "Dedicated post-op recovery warming suites",
        "Multimodal pain management and recovery check-ins"
      ],
      inclusions: [
        "Comprehensive Pre-Anesthetic Bloodwork & ECG Screening",
        "Dedicated Veterinary Anesthetist & Surgical Nurse",
        "Multiparameter Continuous Vital Signs Monitoring (ECG, SpO2, Blood Pressure)",
        "Sterile Positive-Pressure Laminar Flow Operating Theater",
        "Temperature-Controlled Warm Water Blankets (Bair Hugger)",
        "Intravenous Fluid Support with Precision Infusion Pump",
        "Multimodal Pre- & Post-Operative Pain Management",
        "Dedicated Post-Op ICU Recovery Warming Suite"
      ],
      benefits: [
        {
          icon: "fa-solid fa-shield-heart",
          title: "Maximum Surgical Safety Protocols",
          desc: "Strict hospital safety standards and advanced continuous monitoring minimize anesthetic risk for all life stages."
        },
        {
          icon: "fa-solid fa-person-walking",
          title: "Rapid Low-Pain Recovery",
          desc: "Advanced pain blocking protocols and therapeutic laser accelerate tissue healing and comfort."
        }
      ],
      faqs: [
        {
          question: "How should I prepare my pet the night before surgery?",
          answer: "Fast your pet from food after 10 PM the evening before; water is permitted until the morning of surgery."
        },
        {
          question: "When can my pet return home after surgery?",
          answer: "Most routine soft-tissue patients go home the same afternoon once fully awake and ambulatory; complex orthopedic cases may stay overnight in ICU."
        },
        {
          question: "How is post-operative pain managed?",
          answer: "We utilize multimodal analgesia combining nerve blocks, continuous infusions, and tailored take-home pain medications."
        }
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
      duration: "Immediate / 45 Mins",
      price: "$120",
      room: "Emergency Triage ICU",
      image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=800&q=80",
      description: "Our hospital is staffed 24 hours a day, 365 days a year with intensive care veterinarians ready for urgent medical triage, oxygen support, and trauma stabilization.",
      procedureDetail: "Immediate emergency triage, blood diagnostics in 10 minutes, and intensive overnight hospitalization.",
      features: [
        "Immediate emergency triage with zero wait for critical cases",
        "Oxygen therapy and intensive care incubators",
        "Complete in-house critical bloodwork results in 10 minutes",
        "Emergency fluid resuscitation and overnight hospitalization"
      ],
      inclusions: [
        "Immediate Zero-Wait Emergency Triage Assessment",
        "High-Flow Oxygen Therapy & Climate-Controlled Oxygen Cages",
        "Rapid In-House Critical Blood Chemistry & Blood Gas (10-Min Results)",
        "Emergency Trauma Ultrasound (FAST Scan) & Digital X-rays",
        "Intravenous Catheter Placement & Emergency Resuscitation Fluids",
        "Continuous Cardiopulmonary & Blood Pressure Monitoring",
        "Emergency Blood Transfusion & Antivenom Availability",
        "Overnight Critical Care Nursing in Intensive Care Unit (ICU)"
      ],
      benefits: [
        {
          icon: "fa-solid fa-truck-medical",
          title: "Immediate Life-Saving Interventions",
          desc: "Full emergency veterinary and surgical team on-site 24 hours every day with zero appointment necessary."
        },
        {
          icon: "fa-solid fa-hospital-user",
          title: "Advanced Critical Care ICU",
          desc: "Equipped with intensive oxygen therapy, trauma ultrasound, blood banks, and continuous supervision."
        }
      ],
      faqs: [
        {
          question: "Do I need an appointment for emergency care?",
          answer: "No appointment is needed. Emergency cases are triaged and evaluated immediately upon arrival."
        },
        {
          question: "What symptoms require immediate emergency evaluation?",
          answer: "Difficulty breathing, collapse, sudden swollen abdomen, repeated vomiting, seizures, severe trauma, toxin ingestion, or inability to urinate."
        },
        {
          question: "Can my primary veterinarian receive the emergency records?",
          answer: "Yes, full diagnostic and treatment summaries are sent directly to your family veterinarian within 24 hours."
        }
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

  // 6 Featured Veterinarians (Dynamic Profiles & Compact Card Data)
  veterinarians: [
    {
      id: "ananya-sharma",
      slug: "ananya-sharma",
      name: "Dr. Ananya Sharma",
      title: "Chief Veterinary Surgeon",
      experience: "8+ Years Experience",
      availability: "Mon – Sat (Available Today)",
      degrees: "BVSc & AH, MVSc (Surgery), DACVS",
      badge: "Surgical Director",
      image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
      shortDesc: "Specializes in minimally invasive soft tissue surgery, reconstructive procedures, and post-operative pain protocols.",
      headline: "Compassionate Surgical Leadership",
      bio: "Dr. Ananya Sharma serves as the Surgical Director at PETZY Veterinary Hospital. With over 8 years of advanced surgical practice, she is renowned for her calm bedside manner, precision laparoscopic procedures, and multimodal post-operative pain protocols.",
      bioExtended: "She completed her advanced surgical residency at the Veterinary Medical Center and has published clinical research on soft tissue recovery and orthopedic rehabilitation in companion canines.",
      specialties: ["Orthopedic & Soft Tissue Surgery", "Minimally Invasive Laparoscopy", "Pain Management Protocols", "Emergency Trauma Repair", "Geriatric Patient Safety"],
      education: [
        "Master of Veterinary Science (MVSc Surgery) — Distinction Honors",
        "Diplomate, American College of Veterinary Surgeons (DACVS)",
        "Fear-Free Elite Certified Veterinary Practitioner"
      ],
      quickFacts: {
        experience: "8+ Years",
        cases: "1,800+ Surgeries",
        languages: "English, Hindi",
        certification: "DACVS Board Certified"
      },
      testimonial: {
        quote: "Dr. Ananya operated on our dog Bruno’s knee with such immense care and patience. Bruno was walking comfortably in days, and Dr. Ananya called us personally every evening during his recovery.",
        author: "Priya & Rajesh Nair (Bruno's Parents)"
      }
    },
    {
      id: "rohan-mehta",
      slug: "rohan-mehta",
      name: "Dr. Rohan Mehta",
      title: "Pet Wellness & Nutrition Specialist",
      experience: "6+ Years Experience",
      availability: "Mon – Fri (Available Today)",
      degrees: "DVM, ACVN Board Certified",
      badge: "Wellness Lead",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
      shortDesc: "Leads preventive longevity programs, species-appropriate clinical nutrition, and chronic metabolic therapy.",
      headline: "Preventive Longevity & Holistic Nutrition",
      bio: "Dr. Rohan Mehta leads PETZY's preventive wellness and dietary therapy programs. With 6+ years of dedicated practice, he specializes in customized species-appropriate nutrition, metabolic balancing, and allergy therapeutics.",
      bioExtended: "He graduated with top clinical honors in Veterinary Medicine and completed his post-doctoral fellowship in Comparative Animal Clinical Nutrition (ACVN). He believes proactive nutrition adds vibrant, healthy years to our pets' lives.",
      specialties: ["Preventive Longevity Medicine", "Nutritional Therapy & Weight Loss", "Clinical Dermatology & Allergies", "Herbal & Integrative Support", "Metabolic Disease Management"],
      education: [
        "Doctor of Veterinary Medicine (DVM) — Clinical Honors",
        "Diplomate, American College of Veterinary Nutrition (ACVN)",
        "Certified Canine Rehabilitation Practitioner (CCRP)"
      ],
      quickFacts: {
        experience: "6+ Years",
        cases: "2,400+ Care Plans",
        languages: "English, Gujarati, Hindi",
        certification: "ACVN Nutrition Certified"
      },
      testimonial: {
        quote: "Dr. Rohan completely transformed our Golden Retriever Simba's chronic skin allergies through a targeted nutrition and herbal plan. Simba has so much energy now!",
        author: "Amit & Neha Verma (Simba's Parents)"
      }
    },
    {
      id: "sarah-kapoor",
      slug: "sarah-kapoor",
      name: "Dr. Sarah Kapoor",
      title: "Senior Veterinary Physician",
      experience: "10+ Years Experience",
      availability: "Tue – Sun (Available Today)",
      degrees: "DVM, DABVP (Canine/Feline Practice)",
      badge: "Senior Clinician",
      image: "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=600&q=80",
      shortDesc: "Expert in comprehensive internal medicine, gentle low-stress handling, endocrinology, and senior vitality.",
      headline: "Comprehensive Internal Medicine & Feline Care",
      bio: "With over a decade of clinical medicine experience, Dr. Sarah Kapoor oversees general internal medicine, geriatric pet wellness programs, endocrinology, and feline low-stress medicine.",
      bioExtended: "She is board-certified by the American Board of Veterinary Practitioners (DABVP) and serves as an advocate for Fear-Free feline clinic design, ensuring even the most anxious cats and senior dogs feel at home.",
      specialties: ["Canine & Feline Internal Medicine", "Endocrinology & Diabetes Management", "Senior & Geriatric Vitality", "Low-Stress Feline Handling", "Cardiorenal Diagnostics"],
      education: [
        "Doctor of Veterinary Medicine (DVM) — Summa Cum Laude",
        "Diplomate, American Board of Veterinary Practitioners (DABVP)",
        "AAFP Feline-Friendly Gold Certified Practitioner"
      ],
      quickFacts: {
        experience: "10+ Years",
        cases: "5,000+ Consultations",
        languages: "English, Punjabi, Hindi",
        certification: "DABVP Board Certified"
      },
      testimonial: {
        quote: "Finding a doctor where my anxious Persian cat Mimi feels completely safe was a blessing. Dr. Sarah's gentle bedside manner and diagnostic precision gave us total peace of mind.",
        author: "Vikram Malhotra (Mimi's Parent)"
      }
    },
    {
      id: "david-chen",
      slug: "david-chen",
      name: "Dr. David Chen",
      title: "Emergency & Critical Care Specialist",
      experience: "12+ Years Experience",
      availability: "24/7 Trauma Shift (Available Daily)",
      degrees: "DVM, DACVECC Fellow",
      badge: "Emergency Lead",
      image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80",
      shortDesc: "Directs 24/7 trauma stabilization, cardiovascular critical care resuscitation, and point-of-care ultrasound.",
      headline: "Rapid Trauma Stabilization & Critical Care",
      bio: "Dr. David Chen leads PETZY's 24/7 emergency trauma department and ICU. With over 12 years on the frontlines of animal emergency medicine, he specializes in rapid triage, cardiovascular resuscitation, and emergency imaging.",
      bioExtended: "He completed an intensive critical care fellowship at the Pacific Emergency Veterinary Center and has trained hundreds of clinicians in advanced point-of-care ultrasound (POCUS) and emergency trauma resuscitation.",
      specialties: ["Emergency Trauma Resuscitation", "Cardiovascular Critical Care", "Point-of-Care Ultrasound (POCUS)", "Toxicology & Envenomation", "Oxygen Therapy & Ventilator Care"],
      education: [
        "Doctor of Veterinary Medicine (DVM) — Emergency Medicine Honors",
        "Fellow, American College of Veterinary Emergency & Critical Care (DACVECC)",
        "Advanced Veterinary Trauma Life Support (AVTLS) Certified"
      ],
      quickFacts: {
        experience: "12+ Years",
        cases: "3,200+ Emergency Cases",
        languages: "English, Mandarin",
        certification: "DACVECC Fellow"
      },
      testimonial: {
        quote: "When our Labrador swallowed a foreign object in the middle of the night, Dr. David and the emergency team stabilized him immediately. Their swift action saved his life.",
        author: "Kavita & Sanjay Patel (Rocky's Parents)"
      }
    },
    {
      id: "maya-patel",
      slug: "maya-patel",
      name: "Dr. Maya Patel",
      title: "Veterinary Dermatology Specialist",
      experience: "7+ Years Experience",
      availability: "Mon – Fri (Available Today)",
      degrees: "BVSc, MVSc, ACVD Certified",
      badge: "Skin & Allergy Care",
      image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=600&q=80",
      shortDesc: "Specializes in chronic allergy testing, immunotherapy treatment, autoimmune skin diseases, and ear care.",
      headline: "Advanced Clinical Dermatology & Allergy Care",
      bio: "Dr. Maya Patel specializes in complex companion animal dermatology, chronic allergic dermatitis, immune-mediated skin disorders, and recurrent ear infections.",
      bioExtended: "She completed her specialized dermatology residency at the Animal Allergy & Skin Center and is dedicated to restoring skin barrier health and lasting comfort for itchy, allergic pets.",
      specialties: ["Allergy Testing & Immunotherapy", "Autoimmune Skin Diseases", "Chronic Otitis & Ear Care", "Dermatopathology & Cytology", "Barrier Repair Therapeutics"],
      education: [
        "Bachelor of Veterinary Science & Animal Husbandry (BVSc & AH) — Honors",
        "Master of Veterinary Science (MVSc Dermatology & Therapeutics)",
        "Diplomate, American College of Veterinary Dermatology (ACVD)"
      ],
      quickFacts: {
        experience: "7+ Years",
        cases: "2,800+ Dermatology Cases",
        languages: "English, Hindi, Gujarati",
        certification: "ACVD Board Certified"
      },
      testimonial: {
        quote: "Our French Bulldog suffered from severe chronic itching for 2 years until we met Dr. Maya. Her custom allergy immunotherapy gave him total relief!",
        author: "Karan & Shweta Joshi (Leo's Parents)"
      }
    },
    {
      id: "priya-rao",
      slug: "priya-rao",
      name: "Dr. Priya Rao",
      title: "Avian & Exotic Pet Specialist",
      experience: "9+ Years Experience",
      availability: "Wed – Sun (Available Today)",
      degrees: "DVM, ABVP (Avian & Exotic Practice)",
      badge: "Avian & Exotic Lead",
      image: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&w=600&q=80",
      shortDesc: "Specialized clinical medicine, beak trimming, nutrition, and gentle surgery for birds, rabbits, and small pets.",
      headline: "Comprehensive Avian & Small Mammal Medicine",
      bio: "Dr. Priya Rao brings world-class medical and surgical expertise to non-traditional companion animals including parrots, songbirds, rabbits, ferrets, and small rodents.",
      bioExtended: "She is an active member of the Association of Avian Veterinarians (AAV) and has pioneered low-stress handling protocols and specialized micro-endoscopic procedures for exotic companions.",
      specialties: ["Avian Internal Medicine & Surgery", "Small Mammal Dentistry & GI Stasis", "Exotic Nutrition & Husbandry", "Micro-Endoscopy & Diagnostics", "Reptile & Rodent Wellness"],
      education: [
        "Doctor of Veterinary Medicine (DVM) — Exotic Animal Distinction",
        "Diplomate, American Board of Veterinary Practitioners (ABVP Avian Practice)",
        "Association of Exotic Mammal Veterinarians (AEMV) Certified"
      ],
      quickFacts: {
        experience: "9+ Years",
        cases: "3,500+ Exotic Patients",
        languages: "English, Kannada, Hindi",
        certification: "ABVP Avian & Exotic Certified"
      },
      testimonial: {
        quote: "Finding a true avian expert for our African Grey was crucial. Dr. Priya's gentle touch, beak care, and dietary advice keep our parrot thriving.",
        author: "Sunil & Meera Iyer (Chirpy's Parents)"
      }
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
    heroCarousel: [
      { id: "dog", animal: "Happy Dog", src: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=900&q=80" },
      { id: "cat", animal: "Curious Cat", src: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80" },
      { id: "rabbit", animal: "Holland Lop Rabbit", src: "https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=900&q=80" },
      { id: "bird", animal: "Companion Bird", src: "https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=900&q=80" }
    ],
    aboutVet: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80", // Caring veterinarian tenderly examining and holding sweet companion pet
    ctaPet: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80" // Friendly veterinarian consulting with pet owner & companion pet in modern clinic
  }
};

export function getDoctorById(slugOrId) {
  if (!slugOrId) return siteData.veterinarians[0];
  const clean = String(slugOrId).toLowerCase().trim().replace(/^dr-/, '').replace(/\/$/, '');
  const found = siteData.veterinarians.find(v => {
    const vClean = v.id.toLowerCase().replace(/^dr-/, '');
    const vSlug = v.slug ? v.slug.toLowerCase().replace(/^dr-/, '') : '';
    return vClean === clean || v.id.toLowerCase() === slugOrId.toLowerCase() || vSlug === clean;
  });
  return found || siteData.veterinarians[0];
}

export function getServiceById(slugOrId) {
  if (!slugOrId) return siteData.services[0];
  const clean = String(slugOrId).toLowerCase().trim().replace(/\/$/, '');
  const found = siteData.services.find(s => {
    return s.id.toLowerCase() === clean || s.title.toLowerCase() === clean;
  });
  return found || siteData.services[0];
}


