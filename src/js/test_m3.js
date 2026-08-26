/**
 * PETZY Milestone 3 Automated Test Suite
 * Tests Appointment & Booking System, Double-Booking Prevention,
 * Interactive Slots & Calendar logic, Rescheduling, Cancellation, and Multi-Account Isolation.
 */

// Mock browser localStorage for Node.js test environment
const storageStore = {};
global.localStorage = {
  getItem: (key) => storageStore[key] || null,
  setItem: (key, val) => { storageStore[key] = String(val); },
  removeItem: (key) => { delete storageStore[key]; },
  clear: () => { Object.keys(storageStore).forEach(k => delete storageStore[k]); },
  key: (i) => Object.keys(storageStore)[i] || null,
  get length() { return Object.keys(storageStore).length; }
};

import {
  seedDemoData,
  getUserPets,
  getUserPetById,
  saveUserPet,
  getUserAppointments,
  getUserAppointmentById,
  getUserAppointmentsByPet,
  saveUserAppointment,
  rescheduleUserAppointment,
  cancelUserAppointment,
  generateAppointmentId,
  isSlotBooked,
  getAvailableSlotsForDoctorAndDate,
  findAvailableDoctorForSlot,
  TIME_PERIODS,
  ALL_TIME_SLOTS
} from './services/storage.js';

import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser
} from './services/auth.js';

import { siteData, getDoctorById } from './data.js';

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

console.log('🧪 Starting PETZY Milestone 3 Test Suite...\n');

// ----------------------------------------------------
// SUITE 1: Standardized Appointment ID Format & Seeder
// ----------------------------------------------------
console.log('--- Test Suite 1: Appointment ID Generation & Demo Seed ---');
const demoId1 = generateAppointmentId();
assert(demoId1.startsWith('PETZY-'), `Generated ID starts with PETZY- prefix (${demoId1})`);
assert(demoId1.length === 12, `Generated ID has exactly 12 characters (PETZY-XXXXXX) (${demoId1})`);

// Seed demo account
const samanthaId = 'usr_demo_samantha_01';
seedDemoData(samanthaId);
const samAppts = getUserAppointments(samanthaId);
assert(samAppts.length === 4, `Samantha has 4 demo appointments seeded (found ${samAppts.length})`);
assert(samAppts[0].id.startsWith('PETZY-'), `Demo appointment ID uses PETZY- format (${samAppts[0].id})`);
assert(samAppts[0].duration === '30 Mins', `Demo appointment includes duration (${samAppts[0].duration})`);
assert(samAppts[0].price === '$55', `Demo appointment includes price (${samAppts[0].price})`);

// ----------------------------------------------------
// SUITE 2: Time Slots & Availability Categorization
// ----------------------------------------------------
console.log('\n--- Test Suite 2: Time Periods & Slot Grouping ---');
assert(TIME_PERIODS.morning.length === 6, `Morning has 6 time slots (09:00 AM to 11:30 AM)`);
assert(TIME_PERIODS.afternoon.length === 6, `Afternoon has 6 time slots (01:00 PM to 03:30 PM)`);
assert(TIME_PERIODS.evening.length === 4, `Evening has 4 time slots (05:00 PM to 06:30 PM)`);
assert(ALL_TIME_SLOTS.length === 16, `Total time slots available per day is 16`);

// Query slots for a date with no bookings
const openDate = '2026-10-15';
const openSlots = getAvailableSlotsForDoctorAndDate('Dr. Ananya Sharma', openDate);
assert(openSlots.hasAvailableSlots === true, `Doctor Ananya has available slots on open date`);
assert(openSlots.morning.every(s => s.isBooked === false), `All morning slots open on fresh date`);
assert(openSlots.afternoon.every(s => s.isBooked === false), `All afternoon slots open on fresh date`);
assert(openSlots.evening.every(s => s.isBooked === false), `All evening slots open on fresh date`);

// ----------------------------------------------------
// SUITE 3: Double-Booking Prevention Engine
// ----------------------------------------------------
console.log('\n--- Test Suite 3: Cross-Account Double-Booking Prevention ---');

// Note: In demo data, Samantha has Dr. Ananya Sharma on '2026-09-05' at '10:30 AM' (status: 'Upcoming')
const bookedDoc = 'Dr. Ananya Sharma';
const bookedDate = '2026-09-05';
const bookedTime = '10:30 AM';

const isBookedDirect = isSlotBooked(bookedDoc, bookedDate, bookedTime);
assert(isBookedDirect === true, `Dr. Ananya is correctly flagged as booked on 2026-09-05 at 10:30 AM`);

const isUnbookedTime = isSlotBooked(bookedDoc, bookedDate, '09:00 AM');
assert(isUnbookedTime === false, `Dr. Ananya is free on 2026-09-05 at 09:00 AM`);

const isDifferentDoc = isSlotBooked('Dr. David Chen', bookedDate, bookedTime);
assert(isDifferentDoc === false, `Dr. David Chen is free on 2026-09-05 at 10:30 AM`);

// Check categorized slot query for that day
const sept5Slots = getAvailableSlotsForDoctorAndDate(bookedDoc, bookedDate);
const slot1030 = sept5Slots.morning.find(s => s.time === '10:30 AM');
const slot0900 = sept5Slots.morning.find(s => s.time === '09:00 AM');

assert(slot1030.isBooked === true, `10:30 AM morning slot is marked as isBooked: true`);
assert(slot0900.isBooked === false, `09:00 AM morning slot is marked as isBooked: false`);

// ----------------------------------------------------
// SUITE 4: Cross-Account Multi-User Booking Collision Test
// ----------------------------------------------------
console.log('\n--- Test Suite 4: Multi-User Booking Isolation & Slot Locking ---');

// Create User 2 (Oliver)
const oliverUser = registerUser({
  name: 'Oliver Queen',
  email: 'oliver.m3@example.com',
  phone: '(555) 777-8899',
  password: 'password123'
});

const oliverPet = saveUserPet(oliverUser.id, {
  name: 'Shadow',
  species: 'Dog',
  breed: 'Husky'
});

// Oliver attempts to book Dr. Rohan Mehta on 2026-09-12 at 02:00 PM
const testDate = '2026-09-12';
const testTime = '02:00 PM';
const testDoctor = 'Dr. Rohan Mehta';

assert(isSlotBooked(testDoctor, testDate, testTime) === false, `Slot is initially free for Dr. Rohan on ${testDate} at ${testTime}`);

// Oliver books the appointment
const oliverAppt = saveUserAppointment(oliverUser.id, {
  petId: oliverPet.id,
  petName: oliverPet.name,
  species: oliverPet.species,
  serviceId: 'vaccination',
  service: 'Vaccination Booster',
  duration: '30 Mins',
  price: '$45',
  veterinarian: testDoctor,
  date: testDate,
  time: testTime,
  status: 'Upcoming'
});

assert(oliverAppt.id.startsWith('PETZY-'), `Oliver's appointment created with ID ${oliverAppt.id}`);
assert(isSlotBooked(testDoctor, testDate, testTime) === true, `Dr. Rohan's slot is now globally locked across all accounts`);

// User 3 (Bruce) tries to book the same slot
const bruceSlots = getAvailableSlotsForDoctorAndDate(testDoctor, testDate);
const bruceSlot2PM = bruceSlots.afternoon.find(s => s.time === testTime);
assert(bruceSlot2PM.isBooked === true, `Dr. Rohan's 02:00 PM slot appears disabled/booked for Bruce`);

// ----------------------------------------------------
// SUITE 5: Cancellation Releases Slot
// ----------------------------------------------------
console.log('\n--- Test Suite 5: Cancellation Releases Slot for Other Patients ---');

const cancelResult = cancelUserAppointment(oliverUser.id, oliverAppt.id);
assert(cancelResult === true, `Oliver successfully cancelled appointment ${oliverAppt.id}`);

const updatedOliverAppt = getUserAppointmentById(oliverUser.id, oliverAppt.id);
assert(updatedOliverAppt.status === 'Cancelled', `Oliver's appointment status is now 'Cancelled'`);

// Verify slot is now unlocked globally
const isSlotBookedAfterCancel = isSlotBooked(testDoctor, testDate, testTime);
assert(isSlotBookedAfterCancel === false, `Slot is immediately released for other customers after cancellation`);

const bruceSlotsAfterCancel = getAvailableSlotsForDoctorAndDate(testDoctor, testDate);
const bruceSlot2PMAfterCancel = bruceSlotsAfterCancel.afternoon.find(s => s.time === testTime);
assert(bruceSlot2PMAfterCancel.isBooked === false, `Bruce now sees 02:00 PM slot as available`);

// ----------------------------------------------------
// SUITE 6: Reschedule Flow (Release Old Slot + Lock New Slot)
// ----------------------------------------------------
console.log('\n--- Test Suite 6: Reschedule Flow Slot Transitions ---');

// Oliver books a new appointment
const apptToResched = saveUserAppointment(oliverUser.id, {
  petId: oliverPet.id,
  petName: oliverPet.name,
  species: oliverPet.species,
  serviceId: 'dental-care',
  service: 'Dental Examination',
  duration: '45 Mins',
  price: '$85',
  veterinarian: 'Dr. Sarah Kapoor',
  date: '2026-09-20',
  time: '11:00 AM',
  status: 'Upcoming'
});

assert(isSlotBooked('Dr. Sarah Kapoor', '2026-09-20', '11:00 AM') === true, `Dr. Sarah booked on 2026-09-20 at 11:00 AM`);

// When querying available slots during reschedule, excluding current appointment allows customer to keep/see current slot
const selfSlots = getAvailableSlotsForDoctorAndDate('Dr. Sarah Kapoor', '2026-09-20', apptToResched.id);
const selfSlot11AM = selfSlots.morning.find(s => s.time === '11:00 AM');
assert(selfSlot11AM.isBooked === false, `Excluding current appointment ID allows customer to evaluate own slot`);

// Reschedule to 2026-09-22 at 03:00 PM
const reschedResult = rescheduleUserAppointment(oliverUser.id, apptToResched.id, {
  date: '2026-09-22',
  time: '03:00 PM',
  notes: 'Rescheduled due to travel schedule change.'
});

assert(reschedResult.status === 'Rescheduled', `Appointment status updated to 'Rescheduled'`);
assert(reschedResult.date === '2026-09-22', `New appointment date is 2026-09-22`);
assert(reschedResult.time === '03:00 PM', `New appointment time is 03:00 PM`);

// Old slot released?
assert(isSlotBooked('Dr. Sarah Kapoor', '2026-09-20', '11:00 AM') === false, `Old slot (2026-09-20 11:00 AM) is released`);

// New slot locked?
assert(isSlotBooked('Dr. Sarah Kapoor', '2026-09-22', '03:00 PM') === true, `New slot (2026-09-22 03:00 PM) is locked`);

// ----------------------------------------------------
// SUITE 7: "Any Available Veterinarian" Auto-Allocation
// ----------------------------------------------------
console.log('\n--- Test Suite 7: Auto-Allocation for "Any Available Doctor" ---');

const autoDoc = findAvailableDoctorForSlot('2026-10-01', '09:30 AM');
assert(autoDoc !== null && autoDoc.name, `Auto-allocation returns an available doctor (${autoDoc.name})`);

// ----------------------------------------------------
// SUITE 8: Pet Profile History Integration
// ----------------------------------------------------
console.log('\n--- Test Suite 8: Pet Profile History Integration ---');

const samBuddyAppts = getUserAppointmentsByPet(samanthaId, 'pet_buddy_01');
const samMimiAppts = getUserAppointmentsByPet(samanthaId, 'pet_mimi_02');

assert(samBuddyAppts.length === 2, `Buddy has 2 appointments in history`);
assert(samMimiAppts.length === 2, `Mimi has 2 appointments in history`);
assert(samBuddyAppts.every(a => a.petId === 'pet_buddy_01'), `All Buddy appointments match pet ID`);

console.log(`\n🎉 ALL MILESTONE 3 TESTS PASSED! (${passed}/${total} assertions)\n`);
