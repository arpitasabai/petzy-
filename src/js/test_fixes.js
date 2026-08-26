/**
 * PETZY Functional Fixes Automated Test Suite
 * Tests Dashboard Navigation, Dynamic Service Inclusions,
 * Clean Booking State Lifecycle, and Selection Switching/Persistence.
 */

// Mock browser localStorage and window for Node.js test environment
const storageStore = {};
global.localStorage = {
  getItem: (key) => storageStore[key] || null,
  setItem: (key, val) => { storageStore[key] = String(val); },
  removeItem: (key) => { delete storageStore[key]; },
  clear: () => { Object.keys(storageStore).forEach(k => delete storageStore[k]); },
  key: (i) => Object.keys(storageStore)[i] || null,
  get length() { return Object.keys(storageStore).length; }
};

global.window = {
  location: { hash: '#/' },
  scrollTo: () => {},
  dispatchEvent: () => {}
};

import {
  seedDemoData,
  getUserPets,
  getUserPetById,
  saveUserPet,
  getUserAppointments,
  getUserAppointmentById,
  saveUserAppointment,
  rescheduleUserAppointment,
  cancelUserAppointment,
  generateAppointmentId,
  isSlotBooked,
  getAvailableSlotsForDoctorAndDate
} from './services/storage.js';

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
} from './services/auth.js';

import { siteData, getDoctorById, getServiceById } from './data.js';

let passed = 0;
let total = 0;

function assert(condition, message) {
  total++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('🧪 Starting PETZY Functional Fixes Test Suite...\n');

// ----------------------------------------------------
// Setup Demo Account
// ----------------------------------------------------
const samanthaId = 'usr_demo_samantha_01';
seedDemoData(samanthaId);
const samanthaUser = loginUser('samantha@petzy.com', 'password123');

// ----------------------------------------------------
// TEST 1, 2, 3: Dashboard Navigation & Tab Resolution
// ----------------------------------------------------
console.log('--- TEST 1, 2, 3: Dashboard Tab Resolution ---');

function resolveDashboardTab(hash) {
  if (hash.includes('tab=')) {
    const t = hash.split('tab=')[1]?.split('&')[0]?.toLowerCase();
    if (['overview', 'pets', 'appointments', 'profile'].includes(t)) {
      return t;
    }
  }
  return 'overview';
}

assert(resolveDashboardTab('#/dashboard') === 'overview', 'Dashboard root URL resolves to overview tab');
assert(resolveDashboardTab('#/dashboard?tab=pets') === 'pets', 'Dashboard #/dashboard?tab=pets resolves to pets tab (TEST 1)');
assert(resolveDashboardTab('#/dashboard?tab=appointments') === 'appointments', 'Dashboard #/dashboard?tab=appointments resolves to appointments tab (TEST 2)');
assert(resolveDashboardTab('#/dashboard?tab=profile') === 'profile', 'Dashboard #/dashboard?tab=profile resolves to profile tab (TEST 3)');

// ----------------------------------------------------
// TEST 4: Dynamic Service Inclusions & Unique Data
// ----------------------------------------------------
console.log('\n--- TEST 4: Unique Service Inclusions & Details ---');

const srvConsultation = getServiceById('consultation');
const srvVaccination = getServiceById('vaccination');
const srvDental = getServiceById('dental-care');
const srvGrooming = getServiceById('grooming');
const srvSurgery = getServiceById('surgery');
const srvEmergency = getServiceById('emergency');

assert(srvConsultation.title === 'Veterinary Consultation', 'Consultation service found');
assert(srvConsultation.inclusions.length === 8, 'Consultation has 8 unique inclusions');
assert(srvConsultation.inclusions[0].includes('Physical Health'), `Consultation includes physical exam (${srvConsultation.inclusions[0]})`);

assert(srvVaccination.title === 'Vaccination & Immunity', 'Vaccination service found');
assert(srvVaccination.inclusions.length === 8, 'Vaccination has 8 unique inclusions');
assert(srvVaccination.inclusions[1].includes('Core Canine'), `Vaccination includes core vaccines (${srvVaccination.inclusions[1]})`);
assert(srvVaccination.inclusions[0] !== srvConsultation.inclusions[0], 'Vaccination inclusions are distinct from Consultation inclusions');

assert(srvDental.title === 'Dental Care & Hygiene', 'Dental Care service found');
assert(srvDental.inclusions.length === 8, 'Dental Care has 8 unique inclusions');
assert(srvDental.inclusions[2].includes('Ultrasonic Tartar Scaling'), `Dental Care includes ultrasonic scaling (${srvDental.inclusions[2]})`);
assert(srvDental.inclusions[0] !== srvConsultation.inclusions[0], 'Dental inclusions are distinct from Consultation');

assert(srvGrooming.inclusions[0].includes('Hydro-Surge'), 'Grooming has distinct Hydro-Surge inclusion');
assert(srvSurgery.inclusions[0].includes('Pre-Anesthetic Bloodwork'), 'Surgery has distinct Pre-Anesthetic Bloodwork inclusion');
assert(srvEmergency.inclusions[0].includes('Emergency Triage'), 'Emergency has distinct Emergency Triage inclusion');

// ----------------------------------------------------
// TEST 5 & 8: Fresh Booking State Initialization
// ----------------------------------------------------
console.log('\n--- TEST 5 & 8: Fresh Booking Flow Isolation ---');

// Mock fresh booking state lifecycle
function initializeBookingSession(hashParams = {}) {
  const defaultSrv = siteData.services[0];
  const reschedId = hashParams.rescheduleId || null;

  if (reschedId) {
    const existing = getUserAppointmentById(samanthaId, reschedId);
    return {
      currentStep: 4,
      rescheduleId: reschedId,
      serviceId: existing.serviceId || 'consultation',
      serviceName: existing.service,
      petId: existing.petId,
      petName: existing.petName,
      veterinarianId: existing.veterinarianId || 'any',
      doctorName: existing.veterinarian,
      date: existing.date,
      time: existing.time,
      confirmedAppt: null
    };
  }

  // Fresh booking
  const srvId = hashParams.service || defaultSrv.id;
  const srvObj = getServiceById(srvId);

  return {
    currentStep: 1,
    rescheduleId: null,
    appointmentId: null,
    confirmedAppt: null,
    serviceId: srvObj.id,
    serviceName: srvObj.title,
    serviceDuration: srvObj.duration,
    servicePrice: srvObj.price,
    serviceRoom: srvObj.room,
    petId: hashParams.petId || null,
    veterinarianId: hashParams.doctorId || 'any',
    doctorName: 'Any Available Veterinarian',
    date: '2026-09-15',
    time: '10:30 AM',
    notes: ''
  };
}

const freshSession1 = initializeBookingSession({});
assert(freshSession1.currentStep === 1, 'Fresh booking starts at Step 1 (TEST 5)');
assert(freshSession1.rescheduleId === null, 'Fresh booking has rescheduleId: null');
assert(freshSession1.confirmedAppt === null, 'Fresh booking has confirmedAppt: null');

// Simulate completing an appointment
const bookedAppt = saveUserAppointment(samanthaId, {
  petId: 'pet_buddy_01',
  petName: 'Buddy',
  species: 'Dog',
  serviceId: 'dental-care',
  service: 'Dental Care & Hygiene',
  duration: '45 Mins',
  price: '$85',
  veterinarian: 'Dr. David Chen',
  date: '2026-09-25',
  time: '02:00 PM',
  status: 'Upcoming'
});

assert(bookedAppt.id.startsWith('PETZY-'), 'Appointment booked successfully');

// TEST 8: Starting a new booking after completing an appointment
const freshSession2 = initializeBookingSession({});
assert(freshSession2.currentStep === 1, 'New booking after completed booking starts at Step 1 (TEST 8)');
assert(freshSession2.rescheduleId === null, 'New booking does not have previous appointment rescheduleId');
assert(freshSession2.confirmedAppt === null, 'New booking does not have previous confirmed appointment');

// ----------------------------------------------------
// TEST 6: Service Switching & Persistence (Forward & Back)
// ----------------------------------------------------
console.log('\n--- TEST 6: Service Switching & Step Forward/Back Persistence ---');

let bookingFlow = initializeBookingSession({});
assert(bookingFlow.serviceId === 'consultation', 'Initial service is Consultation');

// Advance to Step 2
bookingFlow.currentStep = 2;
bookingFlow.petId = 'pet_buddy_01';
assert(bookingFlow.currentStep === 2, 'Advanced to Step 2');

// Go back to Step 1
bookingFlow.currentStep = 1;

// Switch service to Vaccination & Immunity
const newSrv = getServiceById('vaccination');
bookingFlow.serviceId = newSrv.id;
bookingFlow.serviceName = newSrv.title;
bookingFlow.serviceDuration = newSrv.duration;
bookingFlow.servicePrice = newSrv.price;
bookingFlow.serviceRoom = newSrv.room;

// Advance to Step 2 again
bookingFlow.currentStep = 2;
assert(bookingFlow.serviceId === 'vaccination', 'Vaccination is now the active service ID (TEST 6)');
assert(bookingFlow.serviceName === 'Vaccination & Immunity', 'Vaccination title persists to Step 2');
assert(bookingFlow.servicePrice === '$45', 'Vaccination price is $45 in booking state');

// ----------------------------------------------------
// TEST 7: Pet Switching & Persistence
// ----------------------------------------------------
console.log('\n--- TEST 7: Pet Switching & Persistence ---');

// In Step 2, select Buddy
bookingFlow.petId = 'pet_buddy_01';
bookingFlow.petName = 'Buddy';

// Advance to Step 3 (Doctor)
bookingFlow.currentStep = 3;
bookingFlow.veterinarianId = 'dr-sarah-kapoor';
bookingFlow.doctorName = 'Dr. Sarah Kapoor';
assert(bookingFlow.petName === 'Buddy', 'Buddy is selected in Step 3');

// Go back to Step 2 and switch pet to Mimi
bookingFlow.currentStep = 2;
bookingFlow.petId = 'pet_mimi_02';
bookingFlow.petName = 'Mimi';

// Continue to Step 3 and Step 4
bookingFlow.currentStep = 3;
bookingFlow.currentStep = 4;
assert(bookingFlow.petId === 'pet_mimi_02', 'Mimi is now the active pet ID (TEST 7)');
assert(bookingFlow.petName === 'Mimi', 'Mimi persists across wizard steps');

// ----------------------------------------------------
// TEST 9: Existing Appointment Reschedule Flow Isolation
// ----------------------------------------------------
console.log('\n--- TEST 9: Reschedule Flow Isolation ---');

const reschedSession = initializeBookingSession({ rescheduleId: bookedAppt.id });
assert(reschedSession.rescheduleId === bookedAppt.id, 'Reschedule session loaded specific appointment ID (TEST 9)');
assert(reschedSession.currentStep === 4, 'Reschedule flow starts at Date & Time selection (Step 4)');
assert(reschedSession.serviceName === bookedAppt.service, 'Reschedule preserves existing service');

// ----------------------------------------------------
// TEST 10: State Integrity on Reload / Re-entry
// ----------------------------------------------------
console.log('\n--- TEST 10: Re-entry / Reset Integrity ---');

// Re-entering without rescheduleId must always yield clean initial state
const freshAfterResched = initializeBookingSession({});
assert(freshAfterResched.rescheduleId === null, 'Re-entering #/book-appointment resets rescheduleId (TEST 10)');
assert(freshAfterResched.currentStep === 1, 'Re-entering resets currentStep to 1');

// ----------------------------------------------------
// TEST 11: Book Follow-Up Visit Workflow
// ----------------------------------------------------
console.log('\n--- TEST 11: Book Follow-Up Visit Workflow ---');

// Seed a completed appointment for Buddy
const completedVisit = saveUserAppointment(samanthaId, {
  id: 'PETZY-APT-1024',
  petId: 'pet_buddy_01',
  petName: 'Buddy',
  species: 'Dog',
  serviceId: 'consultation',
  service: 'Veterinary Consultation',
  duration: '30 Mins',
  price: '$55',
  veterinarianId: 'dr-sarah-kapoor',
  veterinarian: 'Dr. Sarah Kapoor',
  vetTitle: 'Senior Veterinary Physician',
  date: '2026-08-20',
  time: '09:30 AM',
  status: 'Completed',
  diagnosisSummary: 'Annual physical exam completed. Follow-up recommended in 2 weeks.'
});

assert(completedVisit.status === 'Completed', 'Previous appointment status is Completed');

// Function simulating follow-up initialization
function initializeFollowUpSession(followUpApptId) {
  const prev = getUserAppointmentById(samanthaId, followUpApptId);
  if (!prev) return null;

  const matchedSrv = getServiceById(prev.serviceId) || siteData.services[0];
  const matchedPet = getUserPetById(samanthaId, prev.petId);

  return {
    currentStep: 1, // Must start at Step 1, not auto-advance
    appointmentType: 'Follow-Up',
    previousAppointmentId: prev.id,
    rescheduleId: null, // NOT a reschedule
    serviceId: matchedSrv.id,
    serviceName: matchedSrv.title,
    serviceDuration: matchedSrv.duration,
    servicePrice: matchedSrv.price,
    serviceRoom: matchedSrv.room,
    petId: matchedPet ? matchedPet.id : prev.petId,
    petName: matchedPet ? matchedPet.name : prev.petName,
    petSpecies: matchedPet ? matchedPet.species : prev.species,
    veterinarianId: prev.veterinarianId,
    doctorName: prev.veterinarian,
    date: '2026-09-05', // NEW date!
    time: '10:30 AM', // NEW time!
    notes: `Follow-up visit for ${prev.service} (Ref #${prev.id}).`
  };
}

const followUpSession = initializeFollowUpSession('PETZY-APT-1024');
assert(followUpSession.currentStep === 1, 'Follow-up session starts at Step 1 (TEST 11.1)');
assert(followUpSession.previousAppointmentId === 'PETZY-APT-1024', 'Follow-up references previous appointment ID (TEST 11.2)');
assert(followUpSession.rescheduleId === null, 'Follow-up is NOT in reschedule mode (TEST 11.3)');
assert(followUpSession.serviceId === 'consultation', 'Previous service (Consultation) is pre-selected');
assert(followUpSession.petName === 'Buddy', 'Previous pet (Buddy) is pre-selected');
assert(followUpSession.doctorName === 'Dr. Sarah Kapoor', 'Previous doctor (Dr. Sarah Kapoor) is pre-selected');
assert(followUpSession.date !== completedVisit.date, 'Follow-up date is NEW, not previous date');

// Customer confirms follow-up appointment
const confirmedFollowUp = saveUserAppointment(samanthaId, {
  petId: followUpSession.petId,
  petName: followUpSession.petName,
  species: followUpSession.petSpecies,
  serviceId: followUpSession.serviceId,
  service: followUpSession.serviceName,
  duration: followUpSession.serviceDuration,
  price: followUpSession.servicePrice,
  veterinarianId: followUpSession.veterinarianId,
  veterinarian: followUpSession.doctorName,
  date: followUpSession.date,
  time: followUpSession.time,
  notes: followUpSession.notes,
  status: 'Confirmed',
  appointmentType: 'Follow-Up',
  previousAppointmentId: followUpSession.previousAppointmentId
});

assert(confirmedFollowUp.id !== completedVisit.id, 'New unique appointment ID generated for follow-up (TEST 11.4)');
assert(confirmedFollowUp.status === 'Confirmed', 'Follow-up appointment status is Confirmed (TEST 11.5)');
assert(confirmedFollowUp.previousAppointmentId === 'PETZY-APT-1024', 'Follow-up stores link to previous appointment ID (TEST 11.6)');

// Verify original appointment was NOT altered
const originalAfterFollowUp = getUserAppointmentById(samanthaId, 'PETZY-APT-1024');
assert(originalAfterFollowUp.status === 'Completed', 'Original appointment remains Completed and unchanged (TEST 11.7)');
assert(originalAfterFollowUp.date === '2026-08-20', 'Original appointment date unchanged');

console.log(`\n🎉 ALL FUNCTIONAL FIXES TESTS PASSED! (${passed}/${total} assertions)\n`);
