/* PETZY Account-Isolated Local Storage & Dynamic Entity Management Service (Milestone 4) */
import { siteData } from '../data.js';

const PETS_KEY_PREFIX = 'petzy_user_pets_';
const APPOINTMENTS_KEY_PREFIX = 'petzy_user_appts_';
const USERS_KEY = 'petzy_registered_users';
const SERVICES_KEY = 'petzy_services';
const VETS_KEY = 'petzy_veterinarians';
const VET_AVAILABILITY_KEY = 'petzy_vet_availability';
const PAYMENTS_KEY = 'petzy_payments';

// High-quality curated pet images for presets and demo pets
export const PET_IMAGE_PRESETS = {
  dog: [
    'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80', // Golden Retriever
    'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80', // Beagle / Hound
    'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80', // German Shepherd
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80', // Labrador
    'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=600&q=80'  // Puppy
  ],
  cat: [
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80', // Tabby Cat
    'https://images.unsplash.com/photo-1513360309081-38f0762daed1?auto=format&fit=crop&w=600&q=80', // Siamese Cat
    'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80', // British Shorthair
    'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80'  // Playful Orange Cat
  ],
  bird: [
    'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80', // Parrot
    'https://images.unsplash.com/photo-1522858547137-f1dcec554f55?auto=format&fit=crop&w=600&q=80'  // Budgie
  ],
  rabbit: [
    'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80', // White Bunny
    'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=600&q=80'  // Fluffy Rabbit
  ],
  other: [
    'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=600&q=80'  // Hamster / Small pet
  ]
};

// ----------------------------------------------------
// TIME SLOTS & AVAILABILITY CONSTANTS
// ----------------------------------------------------

export const TIME_PERIODS = {
  morning: ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM'],
  afternoon: ['01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM'],
  evening: ['05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM']
};

export const ALL_TIME_SLOTS = [
  ...TIME_PERIODS.morning,
  ...TIME_PERIODS.afternoon,
  ...TIME_PERIODS.evening
];

// Helper to generate IDs
export function generateAppointmentId() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PETZY-${result}`;
}

export function generatePaymentId() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `PAY-PETZY-${result}`;
}

export function generateTransactionId() {
  const num = Math.floor(100000000 + Math.random() * 900000000);
  return `TXN_${num}`;
}

// ----------------------------------------------------
// DYNAMIC SERVICES CRUD (ADMIN & PUBLIC SYNCHRONIZATION)
// ----------------------------------------------------

export function getStoredServices() {
  const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(SERVICES_KEY) : null;
  if (!raw) {
    const initial = JSON.parse(JSON.stringify(siteData.services)).map(s => ({
      ...s,
      status: s.status || 'active',
      category: s.category || s.badge || 'Clinical Care'
    }));
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(SERVICES_KEY, JSON.stringify(initial));
    }
    return initial;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return siteData.services;
  }
}

export function getActiveServices() {
  return getStoredServices().filter(s => s.status !== 'disabled' && s.status !== 'inactive');
}

export function getServiceById(slugOrId) {
  const allServices = getStoredServices();
  if (!slugOrId) {
    return allServices[0] || siteData.services[0];
  }
  const clean = String(slugOrId).toLowerCase().trim().replace(/\/$/, '');
  const found = allServices.find(s => s.id.toLowerCase() === clean || s.title.toLowerCase() === clean);
  return found || null;
}

export function saveService(serviceData) {
  const services = getStoredServices();
  const id = serviceData.id || `srv_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
  const cleanPrice = String(serviceData.price || '$55').startsWith('$') ? String(serviceData.price) : `$${serviceData.price}`;

  const newService = {
    ...serviceData,
    id,
    price: cleanPrice,
    status: serviceData.status || 'active',
    inclusions: Array.isArray(serviceData.inclusions) ? serviceData.inclusions : (serviceData.inclusions ? String(serviceData.inclusions).split('\n').filter(Boolean) : [
      "Comprehensive Physical Health Check",
      "Vital Signs & Heart Auscultation",
      "Diagnostic Assessment & Plan",
      "Post-Visit Home Care Guidelines"
    ]),
    features: Array.isArray(serviceData.features) ? serviceData.features : (serviceData.features ? String(serviceData.features).split('\n').filter(Boolean) : [
      "Performed by board-certified veterinarians",
      "Stress-free Fear-Free certified clinical protocol",
      "Digital care records synchronized to pet portal"
    ]),
    faqs: Array.isArray(serviceData.faqs) ? serviceData.faqs : [],
    benefits: Array.isArray(serviceData.benefits) ? serviceData.benefits : []
  };

  const idx = services.findIndex(s => s.id === id);
  if (idx >= 0) {
    services[idx] = newService;
  } else {
    services.push(newService);
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
  }
  return newService;
}

export function deleteService(serviceId) {
  const services = getStoredServices();
  const filtered = services.filter(s => s.id !== serviceId);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(SERVICES_KEY, JSON.stringify(filtered));
  }
  return true;
}

export function toggleServiceStatus(serviceId) {
  const services = getStoredServices();
  const srv = services.find(s => s.id === serviceId);
  if (!srv) return null;
  srv.status = srv.status === 'disabled' ? 'active' : 'disabled';
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(SERVICES_KEY, JSON.stringify(services));
  }
  return srv;
}

// ----------------------------------------------------
// DYNAMIC VETERINARIANS CRUD (ADMIN & PUBLIC SYNCHRONIZATION)
// ----------------------------------------------------

export function getStoredVeterinarians() {
  const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(VETS_KEY) : null;
  if (!raw) {
    const initial = JSON.parse(JSON.stringify(siteData.veterinarians)).map(v => ({
      ...v,
      status: v.status || 'active'
    }));
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(VETS_KEY, JSON.stringify(initial));
    }
    return initial;
  }
  try {
    const parsed = JSON.parse(raw);
    let modified = false;
    siteData.veterinarians.forEach(defaultVet => {
      const exists = parsed.some(v => v.id === defaultVet.id || (v.slug && v.slug === defaultVet.slug));
      if (!exists) {
        parsed.push({ ...defaultVet, status: defaultVet.status || 'active' });
        modified = true;
      }
    });
    if (modified && typeof localStorage !== 'undefined') {
      localStorage.setItem(VETS_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch (e) {
    return siteData.veterinarians;
  }
}

export function getActiveVeterinarians() {
  return getStoredVeterinarians().filter(v => v.status !== 'disabled' && v.status !== 'inactive');
}

export function getDoctorById(slugOrId) {
  const allVets = getStoredVeterinarians();
  if (!slugOrId) return allVets[0] || siteData.veterinarians[0];
  const clean = String(slugOrId).toLowerCase().trim().replace(/^dr-/, '').replace(/\/$/, '');
  const found = allVets.find(v => {
    const vClean = v.id.toLowerCase().replace(/^dr-/, '');
    const vSlug = v.slug ? v.slug.toLowerCase().replace(/^dr-/, '') : '';
    return vClean === clean || v.id.toLowerCase() === slugOrId.toLowerCase() || vSlug === clean || v.name.toLowerCase().includes(clean);
  });
  return found || null;
}

export function saveVeterinarian(vetData) {
  const vets = getStoredVeterinarians();
  const id = vetData.id || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;

  const newVet = {
    ...vetData,
    id,
    slug: vetData.slug || id,
    status: vetData.status || 'active',
    specialties: Array.isArray(vetData.specialties) ? vetData.specialties : (vetData.specialties ? String(vetData.specialties).split(',').map(s => s.trim()).filter(Boolean) : ['Veterinary Medicine', 'Companion Care']),
    education: Array.isArray(vetData.education) ? vetData.education : (vetData.education ? String(vetData.education).split('\n').map(s => s.trim()).filter(Boolean) : ['Doctor of Veterinary Medicine (DVM)']),
    quickFacts: vetData.quickFacts || {
      experience: vetData.experience || '5+ Years',
      cases: '1,500+ Patients',
      languages: 'English',
      certification: vetData.degrees || 'DVM Board Certified'
    }
  };

  const idx = vets.findIndex(v => v.id === id);
  if (idx >= 0) {
    vets[idx] = newVet;
  } else {
    vets.push(newVet);
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(VETS_KEY, JSON.stringify(vets));
  }
  return newVet;
}

export function deleteVeterinarian(vetId) {
  const vets = getStoredVeterinarians();
  const filtered = vets.filter(v => v.id !== vetId);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(VETS_KEY, JSON.stringify(filtered));
  }
  return true;
}

export function toggleDoctorStatus(vetId) {
  const vets = getStoredVeterinarians();
  const vet = vets.find(v => v.id === vetId);
  if (!vet) return null;
  vet.status = vet.status === 'disabled' ? 'active' : 'disabled';
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(VETS_KEY, JSON.stringify(vets));
  }
  return vet;
}

// ----------------------------------------------------
// VETERINARIAN AVAILABILITY & BLOCKED DATES MANAGEMENT
// ----------------------------------------------------

const DEFAULT_AVAILABILITY = {
  workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  shifts: {
    morning: true,
    afternoon: true,
    evening: true
  },
  blockedDates: [] // Array of { date: 'YYYY-MM-DD', reason: 'Conference' }
};

export function getAllDoctorAvailability() {
  const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(VET_AVAILABILITY_KEY) : null;
  if (!raw) {
    const initial = {};
    const vets = getStoredVeterinarians();
    vets.forEach(v => {
      initial[v.id] = JSON.parse(JSON.stringify(DEFAULT_AVAILABILITY));
    });
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(VET_AVAILABILITY_KEY, JSON.stringify(initial));
    }
    return initial;
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}

export function getDoctorAvailability(doctorId) {
  const all = getAllDoctorAvailability();
  if (!doctorId) return DEFAULT_AVAILABILITY;
  const cleanId = String(doctorId).toLowerCase();
  
  // Find matching doctor key
  const matchKey = Object.keys(all).find(k => k.toLowerCase() === cleanId || k.replace(/^dr-/, '') === cleanId.replace(/^dr-/, ''));
  if (matchKey && all[matchKey]) {
    return all[matchKey];
  }
  return JSON.parse(JSON.stringify(DEFAULT_AVAILABILITY));
}

export function saveDoctorAvailability(doctorId, config) {
  const all = getAllDoctorAvailability();
  all[doctorId] = {
    ...DEFAULT_AVAILABILITY,
    ...config
  };
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(VET_AVAILABILITY_KEY, JSON.stringify(all));
  }
  return all[doctorId];
}

export function blockDoctorDate(doctorId, dateStr, reason = 'Leave / Clinic Duty') {
  const all = getAllDoctorAvailability();
  if (!all[doctorId]) {
    all[doctorId] = JSON.parse(JSON.stringify(DEFAULT_AVAILABILITY));
  }
  if (!all[doctorId].blockedDates) {
    all[doctorId].blockedDates = [];
  }
  if (!all[doctorId].blockedDates.some(b => b.date === dateStr)) {
    all[doctorId].blockedDates.push({ date: dateStr, reason });
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(VET_AVAILABILITY_KEY, JSON.stringify(all));
  }
  return all[doctorId];
}

export function unblockDoctorDate(doctorId, dateStr) {
  const all = getAllDoctorAvailability();
  if (all[doctorId] && all[doctorId].blockedDates) {
    all[doctorId].blockedDates = all[doctorId].blockedDates.filter(b => b.date !== dateStr);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(VET_AVAILABILITY_KEY, JSON.stringify(all));
    }
  }
  return all[doctorId] || null;
}

// ----------------------------------------------------
// PAYMENT RECORDS & REVENUE MANAGEMENT (MILSTONE 4)
// ----------------------------------------------------

export function getPaymentRecords() {
  const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(PAYMENTS_KEY) : null;
  if (!raw) {
    return [];
  }
  try {
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    
    // Filter out legacy hardcoded fake demo transactions
    const fakeIds = ['PAY-PETZY-948201', 'PAY-PETZY-832104', 'PAY-PETZY-719302', 'PAY-PETZY-605821'];
    const fakeTxns = ['TXN_884920194', 'TXN_773910283', 'TXN_662809172', 'TXN_551798061'];
    const cleaned = list.filter(p => !fakeIds.includes(p.id) && !fakeTxns.includes(p.transactionId));
    
    if (cleaned.length !== list.length && typeof localStorage !== 'undefined') {
      localStorage.setItem(PAYMENTS_KEY, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (e) {
    return [];
  }
}

export function getPaymentById(paymentId) {
  const records = getPaymentRecords();
  return records.find(p => p.id === paymentId || p.transactionId === paymentId) || null;
}

export function getPaymentsByUserId(userId) {
  const records = getPaymentRecords();
  return records.filter(p => p.userId === userId);
}

export function getPaymentByAppointmentId(apptId) {
  const records = getPaymentRecords();
  return records.find(p => p.appointmentId === apptId) || null;
}

export function createPaymentRecord(paymentData) {
  const records = getPaymentRecords();
  const amountStr = String(paymentData.amount || '$55').startsWith('$') ? String(paymentData.amount) : `$${paymentData.amount}`;
  const amountVal = parseFloat(amountStr.replace(/[^0-9.]/g, '')) || 55;

  const newPayment = {
    id: paymentData.id || generatePaymentId(),
    transactionId: paymentData.transactionId || generateTransactionId(),
    appointmentId: paymentData.appointmentId,
    userId: paymentData.userId,
    customerName: paymentData.customerName || 'Valued Pet Parent',
    customerEmail: paymentData.customerEmail || '',
    petId: paymentData.petId || '',
    petName: paymentData.petName || 'Pet',
    serviceId: paymentData.serviceId || '',
    serviceName: paymentData.serviceName || 'Veterinary Care',
    amount: amountStr,
    amountValue: amountVal,
    paymentMethod: paymentData.paymentMethod || 'Credit Card •••• 4242',
    paymentDate: paymentData.paymentDate || new Date().toISOString(),
    status: paymentData.status || 'Paid'
  };

  records.unshift(newPayment);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(records));
  }
  return newPayment;
}

export function refundPaymentRecord(paymentId, reason = 'Customer request / Cancellation') {
  const records = getPaymentRecords();
  const payment = records.find(p => p.id === paymentId || p.transactionId === paymentId);
  if (!payment) return null;

  payment.status = 'Refunded';
  payment.refundedAt = new Date().toISOString();
  payment.refundReason = reason;

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(PAYMENTS_KEY, JSON.stringify(records));
  }

  // Also update corresponding appointment status if found
  if (payment.appointmentId && payment.userId) {
    const appts = getUserAppointments(payment.userId);
    const appt = appts.find(a => a.id === payment.appointmentId);
    if (appt) {
      appt.paymentStatus = 'Refunded';
      saveUserAppointment(payment.userId, appt);
    }
  }

  return payment;
}

// ----------------------------------------------------
// SEED INITIAL DEMO DATA
// ----------------------------------------------------

export function seedDemoData(userId) {
  if (!userId) return;

  const petsKey = PETS_KEY_PREFIX + userId;
  const apptsKey = APPOINTMENTS_KEY_PREFIX + userId;

  // Initialize Services, Veterinarians, Availability, and Payments
  getStoredServices();
  getStoredVeterinarians();
  getAllDoctorAvailability();
  getPaymentRecords();

  if (typeof localStorage !== 'undefined' && !localStorage.getItem(petsKey)) {
    const demoPets = [
      {
        id: 'pet_buddy_01',
        name: 'Buddy',
        species: 'Dog',
        breed: 'Golden Retriever',
        dob: '2023-04-15',
        age: '3 Years',
        gender: 'Male (Neutered)',
        weight: '30.5 kg',
        microchip: 'PETZY-985-0012-US',
        photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
        medicalNotes: 'Friendly, active temperament. Loves outdoor frisbee. Slight sensitivity to chicken meal; thrives on salmon recipe.',
        allergies: 'Poultry meal / Chicken proteins (mild itchiness)',
        conditions: 'None. Healthy cardiac & orthopedic status.',
        diet: 'Adult High-Protein Salmon & Sweet Potato Diet (2 cups twice daily)',
        vaccinations: [
          {
            id: 'vac_b1',
            name: 'Rabies (3-Year Booster)',
            dateAdministered: '2025-05-10',
            nextDueDate: '2028-05-10',
            veterinarian: 'Dr. Ananya Sharma',
            status: 'Up to Date',
            batchNumber: 'RB-2025-9942',
            clinic: 'PETZY Central Hospital'
          },
          {
            id: 'vac_b2',
            name: 'DHPP (Distemper, Hepatitis, Parvo, Parainfluenza)',
            dateAdministered: '2025-08-14',
            nextDueDate: '2026-08-14',
            veterinarian: 'Dr. Rohan Mehta',
            status: 'Due Soon',
            batchNumber: 'DH-8821-X',
            clinic: 'PETZY Central Hospital'
          },
          {
            id: 'vac_b3',
            name: 'Bordetella (Kennel Cough Oral)',
            dateAdministered: '2025-11-02',
            nextDueDate: '2026-11-02',
            veterinarian: 'Dr. Sarah Kapoor',
            status: 'Up to Date',
            batchNumber: 'BD-5510-O',
            clinic: 'PETZY Central Hospital'
          },
          {
            id: 'vac_b4',
            name: 'Leptospirosis 4-Way',
            dateAdministered: '2025-08-14',
            nextDueDate: '2026-08-14',
            veterinarian: 'Dr. Rohan Mehta',
            status: 'Due Soon',
            batchNumber: 'LP-3301-A',
            clinic: 'PETZY Central Hospital'
          }
        ]
      },
      {
        id: 'pet_mimi_02',
        name: 'Mimi',
        species: 'Cat',
        breed: 'Siamese',
        dob: '2024-02-10',
        age: '2 Years',
        gender: 'Female (Spayed)',
        weight: '4.2 kg',
        microchip: 'PETZY-985-0013-US',
        photo: 'https://images.unsplash.com/photo-1513360309081-38f0762daed1?auto=format&fit=crop&w=600&q=80',
        medicalNotes: 'Indoor only. Calm and affectionate. Responds well to low-stress handling and gentle chin rubs.',
        allergies: 'None reported.',
        conditions: 'Mild tartar accumulation on upper right premolar (monitoring).',
        diet: 'Grain-Free Indoor Feline Turkey Formula + Fresh Spring Water Fountain',
        vaccinations: [
          {
            id: 'vac_m1',
            name: 'FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)',
            dateAdministered: '2025-06-20',
            nextDueDate: '2026-06-20',
            veterinarian: 'Dr. Sarah Kapoor',
            status: 'Up to Date',
            batchNumber: 'FV-7740-K',
            clinic: 'PETZY Central Hospital'
          },
          {
            id: 'vac_m2',
            name: 'Rabies (PureVax Feline)',
            dateAdministered: '2025-06-20',
            nextDueDate: '2026-06-20',
            veterinarian: 'Dr. Sarah Kapoor',
            status: 'Up to Date',
            batchNumber: 'RB-4412-F',
            clinic: 'PETZY Central Hospital'
          }
        ]
      }
    ];
    localStorage.setItem(petsKey, JSON.stringify(demoPets));
  }

  if (typeof localStorage !== 'undefined' && !localStorage.getItem(apptsKey)) {
    const demoAppointments = [
      {
        id: 'PETZY-948201',
        paymentId: 'PAY-PETZY-948201',
        transactionId: 'TXN_884920194',
        paymentStatus: 'Paid',
        paymentMethod: 'Visa •••• 4242',
        petId: 'pet_buddy_01',
        petName: 'Buddy',
        petPhoto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
        species: 'Dog',
        serviceId: 'consultation',
        service: 'Veterinary Consultation',
        duration: '30 Mins',
        price: '$55',
        veterinarianId: 'ananya-sharma',
        veterinarian: 'Dr. Ananya Sharma',
        vetTitle: 'Chief Veterinary Surgeon',
        vetImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
        date: '2026-09-05',
        time: '10:30 AM',
        status: 'Upcoming',
        room: 'Consultation Suite 2B',
        notes: 'Annual comprehensive wellness physical, heart auscultation, weight check, and routine preventative blood panel.',
        diagnosisSummary: 'Scheduled routine annual examination.',
        createdAt: '2026-08-20T10:00:00.000Z'
      },
      {
        id: 'PETZY-832104',
        paymentId: 'PAY-PETZY-832104',
        transactionId: 'TXN_773910283',
        paymentStatus: 'Paid',
        paymentMethod: 'Mastercard •••• 5555',
        petId: 'pet_buddy_01',
        petName: 'Buddy',
        petPhoto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
        species: 'Dog',
        serviceId: 'vaccination',
        service: 'Vaccination & Immunity',
        duration: '30 Mins',
        price: '$45',
        veterinarianId: 'rohan-mehta',
        veterinarian: 'Dr. Rohan Mehta',
        vetTitle: 'Pet Wellness & Nutrition Specialist',
        vetImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
        date: '2025-08-14',
        time: '02:15 PM',
        status: 'Completed',
        room: 'Immunization Suite 1',
        notes: 'Administered DHPP and Lepto boosters. Checked skin barrier for seasonal allergy signs. Recommended omega-3 fish oil supplement.',
        diagnosisSummary: 'Healthy coat, all vitals normal. Prescribed Derma-Care Omega Drops.',
        createdAt: '2025-08-10T14:00:00.000Z'
      },
      {
        id: 'PETZY-719302',
        paymentId: 'PAY-PETZY-719302',
        transactionId: 'TXN_662809172',
        paymentStatus: 'Paid',
        paymentMethod: 'Apple Pay (Visa •••• 1928)',
        petId: 'pet_mimi_02',
        petName: 'Mimi',
        petPhoto: 'https://images.unsplash.com/photo-1513360309081-38f0762daed1?auto=format&fit=crop&w=600&q=80',
        species: 'Cat',
        serviceId: 'dental-care',
        service: 'Dental Care & Hygiene',
        duration: '45 Mins',
        price: '$85',
        veterinarianId: 'sarah-kapoor',
        veterinarian: 'Dr. Sarah Kapoor',
        vetTitle: 'Senior Veterinary Physician',
        vetImage: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=600&q=80',
        date: '2025-10-18',
        time: '11:00 AM',
        status: 'Completed',
        room: 'Dental Suite A',
        notes: 'Ultrasonic cleaning of mild tartar. Gingival tissue healthy with zero pocketing. Fluoride polish applied.',
        diagnosisSummary: 'Grade 1 mild gingivitis resolved post-cleaning. Home oral gel provided.',
        createdAt: '2025-10-12T11:00:00.000Z'
      },
      {
        id: 'PETZY-605821',
        paymentId: 'PAY-PETZY-605821',
        transactionId: 'TXN_551798061',
        paymentStatus: 'Paid',
        paymentMethod: 'Visa •••• 4242',
        petId: 'pet_mimi_02',
        petName: 'Mimi',
        petPhoto: 'https://images.unsplash.com/photo-1513360309081-38f0762daed1?auto=format&fit=crop&w=600&q=80',
        species: 'Cat',
        serviceId: 'vaccination',
        service: 'Vaccination & Immunity',
        duration: '30 Mins',
        price: '$45',
        veterinarianId: 'sarah-kapoor',
        veterinarian: 'Dr. Sarah Kapoor',
        vetTitle: 'Senior Veterinary Physician',
        vetImage: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=600&q=80',
        date: '2025-06-20',
        time: '03:45 PM',
        status: 'Completed',
        room: 'Immunization Suite 1',
        notes: 'FVRCP and PureVax Rabies administered with zero stress. Weight steady at 4.2 kg.',
        diagnosisSummary: 'Excellent feline vitals. Heart clear, clear lungs, bright alert response.',
        createdAt: '2025-06-15T15:00:00.000Z'
      }
    ];
    localStorage.setItem(apptsKey, JSON.stringify(demoAppointments));
  }
}

// ----------------------------------------------------
// PETS CRUD OPERATIONS
// ----------------------------------------------------

export function getUserPets(userId) {
  if (!userId) return [];
  const key = PETS_KEY_PREFIX + userId;
  const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function getUserPetById(userId, petId) {
  const pets = getUserPets(userId);
  return pets.find(p => p.id === petId) || null;
}

export function saveUserPet(userId, petData) {
  if (!userId) return null;
  const pets = getUserPets(userId);
  const newPet = {
    ...petData,
    id: petData.id || `pet_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    vaccinations: petData.vaccinations || []
  };

  const existingIdx = pets.findIndex(p => p.id === newPet.id);
  if (existingIdx >= 0) {
    pets[existingIdx] = newPet;
  } else {
    pets.push(newPet);
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(PETS_KEY_PREFIX + userId, JSON.stringify(pets));
  }
  return newPet;
}

export function deleteUserPet(userId, petId) {
  if (!userId) return false;
  const pets = getUserPets(userId);
  const filtered = pets.filter(p => p.id !== petId);
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(PETS_KEY_PREFIX + userId, JSON.stringify(filtered));
  }
  return true;
}

// ----------------------------------------------------
// VACCINATION OPERATIONS
// ----------------------------------------------------

export function addVaccinationRecord(userId, petId, record) {
  if (!userId || !petId) return null;
  const pet = getUserPetById(userId, petId);
  if (!pet) return null;

  if (!pet.vaccinations) {
    pet.vaccinations = [];
  }

  const newVac = {
    ...record,
    id: record.id || `vac_${Date.now()}`
  };

  pet.vaccinations.unshift(newVac);
  saveUserPet(userId, pet);
  return newVac;
}

// ----------------------------------------------------
// CROSS-ACCOUNT DOUBLE-BOOKING & AVAILABILITY ENFORCEMENT
// ----------------------------------------------------

export function getAllGlobalAppointments() {
  const allAppts = [];
  try {
    if (typeof localStorage !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(APPOINTMENTS_KEY_PREFIX)) {
          const userId = key.replace(APPOINTMENTS_KEY_PREFIX, '');
          const raw = localStorage.getItem(key);
          if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed)) {
              parsed.forEach(a => {
                allAppts.push({
                  ...a,
                  userId: a.userId || userId
                });
              });
            }
          }
        }
      }
    }
  } catch (e) {
    console.error('Error reading global appointments:', e);
  }
  return allAppts;
}

export function isSlotBooked(doctorNameOrId, dateStr, timeSlot, excludeApptId = null) {
  if (!dateStr || !timeSlot) return false;
  const allAppts = getAllGlobalAppointments();
  const docLower = doctorNameOrId ? doctorNameOrId.toLowerCase().trim() : '';

  return allAppts.some(appt => {
    if (excludeApptId && appt.id === excludeApptId) return false;
    if (appt.status === 'Cancelled') return false; // Cancelled appointments free the slot
    if (appt.date !== dateStr) return false;
    if (appt.time !== timeSlot) return false;

    if (!docLower || docLower === 'any' || docLower.includes('any available')) {
      return false;
    }

    const apptDoc = (appt.veterinarian || '').toLowerCase();
    const apptDocId = (appt.veterinarianId || '').toLowerCase();
    return apptDoc.includes(docLower) || docLower.includes(apptDoc) || apptDocId === docLower;
  });
}

export function isAllDoctorsBookedAtSlot(dateStr, timeSlot, excludeApptId = null) {
  const docs = getActiveVeterinarians();
  return docs.every(doc => isSlotBooked(doc.name, dateStr, timeSlot, excludeApptId));
}

export function findAvailableDoctorForSlot(dateStr, timeSlot, excludeApptId = null) {
  const docs = getActiveVeterinarians();

  for (const doc of docs) {
    const avail = getDoctorAvailability(doc.id);

    // Check if doctor works on this day
    if (avail.workingDays && !isDoctorWorkingOnDay(avail.workingDays, dateStr)) {
      continue;
    }

    // Check if date is blocked for this doctor
    if (avail.blockedDates && avail.blockedDates.some(b => b.date === dateStr)) {
      continue;
    }

    // Check if slot is booked
    if (!isSlotBooked(doc.name, dateStr, timeSlot, excludeApptId)) {
      return doc;
    }
  }
  return docs[0] || siteData.veterinarians[0];
}

function isDoctorWorkingOnDay(workingDaysList, dateStr) {
  if (!Array.isArray(workingDaysList) || workingDaysList.length === 0) return true;
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const daysFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const curShort = daysShort[dt.getDay()];
    const curFull = daysFull[dt.getDay()];
    return workingDaysList.some(day => 
      day.toLowerCase() === curShort.toLowerCase() || 
      day.toLowerCase() === curFull.toLowerCase() ||
      day.toLowerCase().startsWith(curShort.toLowerCase())
    );
  } catch (e) {
    return true;
  }
}

export function getAvailableSlotsForDoctorAndDate(doctorNameOrId, dateStr, excludeApptId = null) {
  const result = {
    morning: [],
    afternoon: [],
    evening: [],
    hasAvailableSlots: false,
    isDoctorWorkingDay: true,
    isDateBlocked: false,
    blockedReason: ''
  };

  if (!dateStr) return result;

  const isAnyDoctor = !doctorNameOrId || doctorNameOrId === 'any' || String(doctorNameOrId).toLowerCase().includes('any available');
  
  let targetDoc = null;
  if (!isAnyDoctor) {
    targetDoc = getDoctorById(doctorNameOrId);
  }

  // Doctor availability & leave checks
  if (targetDoc) {
    const avail = getDoctorAvailability(targetDoc.id);

    if (avail.workingDays && !isDoctorWorkingOnDay(avail.workingDays, dateStr)) {
      result.isDoctorWorkingDay = false;
    }

    if (avail.blockedDates && avail.blockedDates.some(b => b.date === dateStr)) {
      result.isDateBlocked = true;
      const blk = avail.blockedDates.find(b => b.date === dateStr);
      result.blockedReason = blk ? blk.reason : 'Doctor is unavailable';
    }
  }

  ['morning', 'afternoon', 'evening'].forEach(period => {
    result[period] = TIME_PERIODS[period].map(slot => {
      let isBooked = false;

      if (!result.isDoctorWorkingDay || result.isDateBlocked) {
        isBooked = true; // All slots disabled if doctor isn't working or on leave
      } else if (isAnyDoctor) {
        isBooked = isAllDoctorsBookedAtSlot(dateStr, slot, excludeApptId);
      } else {
        isBooked = isSlotBooked(targetDoc ? targetDoc.name : doctorNameOrId, dateStr, slot, excludeApptId);
      }

      if (!isBooked) {
        result.hasAvailableSlots = true;
      }

      return {
        time: slot,
        isBooked
      };
    });
  });

  return result;
}

// ----------------------------------------------------
// USER APPOINTMENTS CRUD OPERATIONS
// ----------------------------------------------------

export function getUserAppointments(userId) {
  if (!userId) return [];
  const key = APPOINTMENTS_KEY_PREFIX + userId;
  const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

export function getUserAppointmentById(userId, apptId) {
  const appts = getUserAppointments(userId);
  return appts.find(a => a.id === apptId) || null;
}

export function getUserAppointmentsByPet(userId, petId) {
  const appts = getUserAppointments(userId);
  return appts.filter(a => a.petId === petId);
}

export function saveUserAppointment(userId, apptData) {
  if (!userId) return null;
  const appts = getUserAppointments(userId);
  const newAppt = {
    ...apptData,
    userId,
    id: apptData.id || generateAppointmentId(),
    status: apptData.status || 'Upcoming',
    paymentStatus: apptData.paymentStatus || 'Paid',
    createdAt: apptData.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const existingIdx = appts.findIndex(a => a.id === newAppt.id);
  if (existingIdx >= 0) {
    appts[existingIdx] = newAppt;
  } else {
    appts.unshift(newAppt);
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(APPOINTMENTS_KEY_PREFIX + userId, JSON.stringify(appts));
  }
  return newAppt;
}

export function rescheduleUserAppointment(userId, apptId, { date, time, notes }) {
  if (!userId || !apptId) return null;
  const appts = getUserAppointments(userId);
  const appt = appts.find(a => a.id === apptId);
  if (!appt) return null;

  appt.date = date || appt.date;
  appt.time = time || appt.time;
  if (notes !== undefined) appt.notes = notes;
  appt.status = 'Rescheduled';
  appt.updatedAt = new Date().toISOString();

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(APPOINTMENTS_KEY_PREFIX + userId, JSON.stringify(appts));
  }
  return appt;
}

export function cancelUserAppointment(userId, apptId) {
  if (!userId || !apptId) return false;
  const appts = getUserAppointments(userId);
  const appt = appts.find(a => a.id === apptId);
  if (!appt) return false;

  appt.status = 'Cancelled';
  appt.updatedAt = new Date().toISOString();
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(APPOINTMENTS_KEY_PREFIX + userId, JSON.stringify(appts));
  }
  return true;
}

// ----------------------------------------------------
// ADMIN GLOBAL APPOINTMENT MANAGEMENT
// ----------------------------------------------------

export function updateAppointmentStatusByAdmin(apptId, newStatus, optionsOrDiagnosis = null, notes = null) {
  let updatedAppt = null;
  try {
    if (typeof localStorage !== 'undefined') {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(APPOINTMENTS_KEY_PREFIX)) {
          const raw = localStorage.getItem(key);
          if (raw) {
            const appts = JSON.parse(raw);
            const target = appts.find(a => a.id === apptId);
            if (target) {
              target.status = newStatus;
              if (typeof optionsOrDiagnosis === 'object' && optionsOrDiagnosis !== null) {
                if (optionsOrDiagnosis.diagnosisSummary !== undefined) target.diagnosisSummary = optionsOrDiagnosis.diagnosisSummary;
                if (optionsOrDiagnosis.paymentStatus !== undefined) target.paymentStatus = optionsOrDiagnosis.paymentStatus;
                if (optionsOrDiagnosis.notes !== undefined) target.notes = optionsOrDiagnosis.notes;
              } else {
                if (optionsOrDiagnosis !== null) target.diagnosisSummary = optionsOrDiagnosis;
                if (notes !== null) target.notes = notes;
              }
              target.updatedAt = new Date().toISOString();
              localStorage.setItem(key, JSON.stringify(appts));
              updatedAppt = target;
              break;
            }
          }
        }
      }
    }
  } catch (e) {
    console.error('Error updating appointment status by admin:', e);
  }
  return updatedAppt;
}



