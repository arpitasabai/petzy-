/* PETZY Admin Search & Filter Verification Test Suite */
const storageStore = {};
global.localStorage = {
  getItem: (key) => storageStore[key] || null,
  setItem: (key, val) => { storageStore[key] = String(val); },
  removeItem: (key) => { delete storageStore[key]; },
  clear: () => { Object.keys(storageStore).forEach(k => delete storageStore[k]); },
  key: (i) => Object.keys(storageStore)[i] || null,
  get length() { return Object.keys(storageStore).length; }
};

import { getAllRegisteredCustomers } from './services/auth.js';
import { getStoredServices, getStoredVeterinarians, getAllGlobalAppointments, getPaymentRecords, createPaymentRecord, getUserPets } from './services/storage.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('\n======================================================');
console.log('  TESTING PETZY ADMIN PORTAL SEARCH & FILTERING');
console.log('======================================================\n');

// ----------------------------------------------------
// 1. Customer & Pet Search Verification
// ----------------------------------------------------
console.log('--- 1. Customer & Pet Search ---');
const customers = getAllRegisteredCustomers();

const searchCustomers = (query) => {
  const q = query.toLowerCase().trim();
  const cleanQ = q.replace(/^#/, '');
  return customers.filter(c => {
    const pets = getUserPets(c.id);
    const petInfo = pets.map(p => `${p.name || ''} ${p.species || ''} ${p.breed || ''}`).join(' ').toLowerCase();
    return !q ||
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q) ||
      (c.id || '').toLowerCase().includes(cleanQ) ||
      petInfo.includes(q);
  });
};

const searchByName = searchCustomers('Samantha');
assert(searchByName.length > 0 && searchByName[0].name.includes('Samantha'), 'Search by Customer Name finds Samantha Hayes');

const searchByEmail = searchCustomers('samantha@petzy.com');
assert(searchByEmail.length > 0 && searchByEmail[0].email === 'samantha@petzy.com', 'Search by Customer Email finds matching account');

const searchByPet = searchCustomers('Buddy');
assert(searchByPet.length > 0 && searchByPet[0].name.includes('Samantha'), 'Search by Pet Name ("Buddy") finds owning customer account');

// ----------------------------------------------------
// 2. Services Catalog Search Verification
// ----------------------------------------------------
console.log('\n--- 2. Services Search ---');
const services = getStoredServices();

const searchServices = (query) => {
  const q = query.toLowerCase().trim();
  return services.filter(s => {
    return !q ||
      (s.title || '').toLowerCase().includes(q) ||
      (s.badge || '').toLowerCase().includes(q) ||
      (s.category || '').toLowerCase().includes(q) ||
      (s.room || '').toLowerCase().includes(q) ||
      (s.price || '').toLowerCase().includes(q) ||
      (s.duration || '').toLowerCase().includes(q);
  });
};

const searchDental = searchServices('Dental');
assert(searchDental.length > 0 && searchDental[0].title.includes('Dental'), 'Search by Title ("Dental") returns Dental Care service');

const searchSuite = searchServices('Suite 1');
assert(searchSuite.length > 0, 'Search by Room / Suite ("Suite 1") returns matching service');

// ----------------------------------------------------
// 3. Veterinarians Search Verification
// ----------------------------------------------------
console.log('\n--- 3. Veterinarians Search ---');
const vets = getStoredVeterinarians();

const searchVets = (query) => {
  if (!query || !query.trim()) return vets;
  const rawQ = query.toLowerCase().trim();
  const cleanQ = rawQ.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  const tokens = cleanQ.split(' ').filter(t => t.length > 0 && t !== 'dr' && t !== 'doctor');
  if (tokens.length === 0) return vets;

  return vets.filter(v => {
    const name = (v.name || '').toLowerCase();
    const cleanName = name.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ');
    const id = (v.id || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
    const title = (v.title || '').toLowerCase();
    const degrees = (v.degrees || '').toLowerCase();
    const specs = (Array.isArray(v.specialties) ? v.specialties.join(' ') : (v.specialties || '')).toLowerCase();
    const exp = (v.experience || '').toLowerCase();
    const bio = (v.bio || '').toLowerCase();
    const searchable = `${cleanName} ${name} ${id} ${title} ${degrees} ${specs} ${exp} ${bio}`;

    return tokens.every(token => searchable.includes(token));
  });
};

const searchDoctor = searchVets('Ananya');
assert(searchDoctor.length > 0 && searchDoctor[0].name.includes('Ananya'), 'Search by Doctor Name ("Ananya") finds Dr. Ananya Sharma');

const searchDoctorWithTitle = searchVets('Dr. Ananya');
assert(searchDoctorWithTitle.length > 0 && searchDoctorWithTitle[0].name.includes('Ananya'), 'Search by "Dr. Ananya" finds Dr. Ananya Sharma');

const searchDoctorNoDot = searchVets('Dr Ananya');
assert(searchDoctorNoDot.length > 0 && searchDoctorNoDot[0].name.includes('Ananya'), 'Search by "Dr Ananya" (without dot) finds Dr. Ananya Sharma');

const searchDoctorFullWord = searchVets('doctor rohan');
assert(searchDoctorFullWord.length > 0 && searchDoctorFullWord[0].name.includes('Rohan'), 'Search by "doctor rohan" finds Dr. Rohan Mehta');

const searchDoctorLastName = searchVets('Kapoor');
assert(searchDoctorLastName.length > 0 && searchDoctorLastName[0].name.includes('Sarah'), 'Search by Last Name ("Kapoor") finds Dr. Sarah Kapoor');

const searchDegree = searchVets('BVSc');
assert(searchDegree.length > 0, 'Search by Degree Credentials ("BVSc") returns qualified veterinarians');

// ----------------------------------------------------
// 4. Appointments Global Search Verification
// ----------------------------------------------------
console.log('\n--- 4. Appointments Search ---');
const appts = getAllGlobalAppointments();

const searchAppts = (query) => {
  const q = query.toLowerCase().trim();
  const cleanQ = q.replace(/^#/, '');
  return appts.filter(a => {
    return !q ||
      (a.id || '').toLowerCase().includes(cleanQ) ||
      (a.petName || '').toLowerCase().includes(q) ||
      (a.service || a.serviceName || '').toLowerCase().includes(q) ||
      (a.veterinarian || a.veterinarianName || '').toLowerCase().includes(q);
  });
};

if (appts.length > 0) {
  const sampleAppt = appts[0];
  const searchById = searchAppts(sampleAppt.id);
  assert(searchById.length > 0 && searchById[0].id === sampleAppt.id, `Search by Appointment ID ("${sampleAppt.id}") returns exact booking`);
}

// ----------------------------------------------------
// 5. Payments Financial Search Verification
// ----------------------------------------------------
console.log('\n--- 5. Payments Ledger Search ---');
let payments = getPaymentRecords();
if (payments.length === 0) {
  createPaymentRecord({
    id: 'PAY-TEST-001',
    transactionId: 'TXN-TEST-001',
    customerName: 'Samantha Hayes',
    petName: 'Buddy',
    serviceName: 'Veterinary Consultation',
    amount: '$55.00',
    status: 'Paid'
  });
  payments = getPaymentRecords();
}

const searchPayments = (query) => {
  const q = query.toLowerCase().trim();
  const cleanQ = q.replace(/^#/, '');
  return payments.filter(p => {
    return !q ||
      (p.id || '').toLowerCase().includes(cleanQ) ||
      (p.transactionId || '').toLowerCase().includes(cleanQ) ||
      (p.customerName || '').toLowerCase().includes(q) ||
      (p.petName || '').toLowerCase().includes(q) ||
      (p.serviceName || '').toLowerCase().includes(q);
  });
};

if (payments.length > 0) {
  const samplePay = payments[0];
  const searchByPayId = searchPayments(samplePay.id);
  assert(searchByPayId.length > 0 && searchByPayId[0].id === samplePay.id, `Search by Payment ID ("${samplePay.id}") returns transaction record`);
}

console.log('\n======================================================');
console.log(`  ADMIN SEARCH TESTS: ${passed} PASSED, ${failed} FAILED`);
console.log('======================================================\n');

if (failed > 0) process.exit(1);
