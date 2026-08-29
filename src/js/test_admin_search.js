/* PETZY Admin Search & Filter Verification Test Suite */
import { getAllRegisteredCustomers } from './services/auth.js';
import { getStoredServices, getStoredVeterinarians, getAllGlobalAppointments, getPaymentRecords, getUserPets } from './services/storage.js';

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

const searchSuite = searchServices('Suite 1A');
assert(searchSuite.length > 0, 'Search by Room / Suite ("Suite 1A") returns matching service');

// ----------------------------------------------------
// 3. Veterinarians Search Verification
// ----------------------------------------------------
console.log('\n--- 3. Veterinarians Search ---');
const vets = getStoredVeterinarians();

const searchVets = (query) => {
  const q = query.toLowerCase().trim();
  return vets.filter(v => {
    const specs = Array.isArray(v.specialties) ? v.specialties.join(' ') : (v.specialties || '');
    return !q ||
      (v.name || '').toLowerCase().includes(q) ||
      (v.title || '').toLowerCase().includes(q) ||
      (v.degrees || '').toLowerCase().includes(q) ||
      specs.toLowerCase().includes(q);
  });
};

const searchDoctor = searchVets('Ananya');
assert(searchDoctor.length > 0 && searchDoctor[0].name.includes('Ananya'), 'Search by Doctor Name ("Ananya") finds Dr. Ananya Sharma');

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
const payments = getPaymentRecords();

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
