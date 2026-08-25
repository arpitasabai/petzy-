/* PETZY Account-Isolated Local Storage Service */

const PETS_KEY_PREFIX = 'petzy_user_pets_';
const APPOINTMENTS_KEY_PREFIX = 'petzy_user_appts_';
const USERS_KEY = 'petzy_registered_users';

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

// Seed initial data for demo customer (Samantha Hayes)
export function seedDemoData(userId) {
  if (!userId) return;

  const petsKey = PETS_KEY_PREFIX + userId;
  const apptsKey = APPOINTMENTS_KEY_PREFIX + userId;

  if (!localStorage.getItem(petsKey)) {
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

  if (!localStorage.getItem(apptsKey)) {
    const demoAppointments = [
      {
        id: 'appt_101',
        petId: 'pet_buddy_01',
        petName: 'Buddy',
        petPhoto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
        species: 'Dog',
        service: 'Comprehensive Physical Exam & Wellness',
        veterinarian: 'Dr. Ananya Sharma',
        vetTitle: 'Chief Veterinary Surgeon',
        vetImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
        date: '2026-09-05',
        time: '10:30 AM',
        status: 'Upcoming',
        room: 'Consultation Suite 2B',
        notes: 'Annual comprehensive wellness physical, heart auscultation, weight check, and routine preventative blood panel.',
        diagnosisSummary: 'Scheduled routine annual examination.'
      },
      {
        id: 'appt_102',
        petId: 'pet_buddy_01',
        petName: 'Buddy',
        petPhoto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
        species: 'Dog',
        service: 'Vaccination Booster & Allergy Consult',
        veterinarian: 'Dr. Rohan Mehta',
        vetTitle: 'Pet Wellness & Nutrition Specialist',
        vetImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
        date: '2025-08-14',
        time: '02:15 PM',
        status: 'Completed',
        room: 'Wellness Suite 1',
        notes: 'Administered DHPP and Lepto boosters. Checked skin barrier for seasonal allergy signs. Recommended omega-3 fish oil supplement.',
        diagnosisSummary: 'Healthy coat, all vitals normal. Prescribed Derma-Care Omega Drops.'
      },
      {
        id: 'appt_103',
        petId: 'pet_mimi_02',
        petName: 'Mimi',
        petPhoto: 'https://images.unsplash.com/photo-1513360309081-38f0762daed1?auto=format&fit=crop&w=600&q=80',
        species: 'Cat',
        service: 'Dental Examination & Ultrasonic Polish',
        veterinarian: 'Dr. Sarah Kapoor',
        vetTitle: 'Senior Veterinary Physician',
        vetImage: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=600&q=80',
        date: '2025-10-18',
        time: '11:00 AM',
        status: 'Completed',
        room: 'Dental Suite A',
        notes: 'Ultrasonic cleaning of mild tartar. Gingival tissue healthy with zero pocketing. Fluoride polish applied.',
        diagnosisSummary: 'Grade 1 mild gingivitis resolved post-cleaning. Home oral gel provided.'
      },
      {
        id: 'appt_104',
        petId: 'pet_mimi_02',
        petName: 'Mimi',
        petPhoto: 'https://images.unsplash.com/photo-1513360309081-38f0762daed1?auto=format&fit=crop&w=600&q=80',
        species: 'Cat',
        service: 'Annual Feline Immunization & Microchip Verification',
        veterinarian: 'Dr. Sarah Kapoor',
        vetTitle: 'Senior Veterinary Physician',
        vetImage: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=600&q=80',
        date: '2025-06-20',
        time: '03:45 PM',
        status: 'Completed',
        room: 'Quiet Feline Room 3',
        notes: 'FVRCP and PureVax Rabies administered with zero stress. Weight steady at 4.2 kg.',
        diagnosisSummary: 'Excellent feline vitals. Heart clear, clear lungs, bright alert response.'
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
  const raw = localStorage.getItem(key);
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

  localStorage.setItem(PETS_KEY_PREFIX + userId, JSON.stringify(pets));
  return newPet;
}

export function deleteUserPet(userId, petId) {
  if (!userId) return false;
  const pets = getUserPets(userId);
  const filtered = pets.filter(p => p.id !== petId);
  localStorage.setItem(PETS_KEY_PREFIX + userId, JSON.stringify(filtered));
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
// APPOINTMENTS CRUD OPERATIONS
// ----------------------------------------------------

export function getUserAppointments(userId) {
  if (!userId) return [];
  const key = APPOINTMENTS_KEY_PREFIX + userId;
  const raw = localStorage.getItem(key);
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
    id: apptData.id || `appt_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    status: apptData.status || 'Upcoming'
  };

  const existingIdx = appts.findIndex(a => a.id === newAppt.id);
  if (existingIdx >= 0) {
    appts[existingIdx] = newAppt;
  } else {
    appts.unshift(newAppt);
  }

  localStorage.setItem(APPOINTMENTS_KEY_PREFIX + userId, JSON.stringify(appts));
  return newAppt;
}

export function cancelUserAppointment(userId, apptId) {
  if (!userId || !apptId) return false;
  const appts = getUserAppointments(userId);
  const appt = appts.find(a => a.id === apptId);
  if (!appt) return false;

  appt.status = 'Cancelled';
  localStorage.setItem(APPOINTMENTS_KEY_PREFIX + userId, JSON.stringify(appts));
  return true;
}


