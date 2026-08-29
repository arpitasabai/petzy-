/* PETZY Milestone 4 Automated Test Suite */
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
  getCurrentUser,
  loginAsDemoUser,
  loginAsAdmin,
  isAdmin,
  getAllRegisteredCustomers,
  getAllUsers,
  toggleCustomerStatus,
  deleteCustomerByAdmin
} from './services/auth.js';
import {
  getStoredServices,
  getActiveServices,
  getServiceById,
  saveService,
  deleteService,
  toggleServiceStatus,
  getStoredVeterinarians,
  getActiveVeterinarians,
  getDoctorById,
  saveVeterinarian,
  deleteVeterinarian,
  toggleDoctorStatus,
  getDoctorAvailability,
  saveDoctorAvailability,
  blockDoctorDate,
  unblockDoctorDate,
  getAvailableSlotsForDoctorAndDate,
  getPaymentRecords,
  getPaymentById,
  getPaymentByAppointmentId,
  createPaymentRecord,
  refundPaymentRecord,
  generatePaymentId,
  generateTransactionId,
  getAllGlobalAppointments,
  updateAppointmentStatusByAdmin,
  saveUserAppointment,
  getUserAppointments
} from './services/storage.js';

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
console.log('  RUNNING PETZY MILESTONE 4 TEST SUITE');
console.log('======================================================\n');

// ----------------------------------------------------
// 1. Admin Authentication & Role Separation Tests
// ----------------------------------------------------
console.log('--- 1. Admin Authentication & Role Checks ---');

// Test A: Admin login
const adminUser = loginAsAdmin();
assert(adminUser && adminUser.email === 'admin@petzy.com', 'loginAsAdmin() signs in admin user');
assert(adminUser.role === 'admin', 'adminUser has role === "admin"');
assert(isAdmin() === true, 'isAdmin() returns true when admin is logged in');

// Test B: Regular customer login
const customerUser = loginAsDemoUser();
assert(customerUser && customerUser.email === 'samantha@petzy.com', 'loginAsDemoUser() signs in Samantha');
assert(customerUser.role === 'customer', 'customerUser has role === "customer"');
assert(isAdmin() === false, 'isAdmin() returns false when regular customer is logged in');

// Test C: Customer filtering
const customersList = getAllRegisteredCustomers();
assert(customersList.length > 0, `getAllRegisteredCustomers() returns ${customersList.length} customers`);
assert(customersList.every(c => c.role !== 'admin' && c.email !== 'admin@petzy.com'), 'Customers list excludes admin accounts');

// ----------------------------------------------------
// 2. Dynamic Services CRUD Tests
// ----------------------------------------------------
console.log('\n--- 2. Dynamic Clinical Services CRUD ---');

const initialServices = getStoredServices();
assert(initialServices.length >= 6, `getStoredServices() returns ${initialServices.length} default services`);

// Test Create
const newServiceId = 'test-orthopedic-rehab';
const testService = {
  id: newServiceId,
  title: 'Orthopedic Rehabilitation & Laser Therapy',
  badge: 'Surgical Rehab',
  petTypeLabel: 'Dogs & Cats',
  price: '$120',
  duration: '45 Mins',
  room: 'Physical Therapy Suite 1',
  image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97',
  description: 'Targeted laser therapy and physical rehabilitation.',
  status: 'active'
};
saveService(testService);
const fetchedService = getServiceById(newServiceId);
assert(fetchedService && fetchedService.title === testService.title, 'saveService() successfully creates new service');

// Test Status Toggle
const toggledService = toggleServiceStatus(newServiceId);
assert(toggledService && toggledService.status === 'disabled', 'toggleServiceStatus() disables active service');

const activeServices = getActiveServices();
assert(!activeServices.some(s => s.id === newServiceId), 'getActiveServices() excludes inactive services');

// Test Delete
deleteService(newServiceId);
assert(getServiceById(newServiceId) === null, 'deleteService() removes service permanently');

// ----------------------------------------------------
// 3. Dynamic Veterinarians CRUD Tests
// ----------------------------------------------------
console.log('\n--- 3. Dynamic Veterinarians CRUD ---');

const initialVets = getStoredVeterinarians();
assert(initialVets.length >= 6, `getStoredVeterinarians() returns ${initialVets.length} default specialists`);

// Test Create
const newVetId = 'test-dr-elena-rostova';
const testVet = {
  id: newVetId,
  name: 'Dr. Elena Rostova',
  title: 'Veterinary Neurologist',
  degrees: 'DVM, PhD, DACVIM',
  experience: '12+ Years Experience',
  badge: 'Neurology Specialist',
  image: 'https://images.unsplash.com/photo-1594824813588-4c1256c7003c',
  bio: 'Specialist in companion animal neurosurgery and spinal care.',
  status: 'active'
};
saveVeterinarian(testVet);
const fetchedVet = getDoctorById(newVetId);
assert(fetchedVet && fetchedVet.name === testVet.name, 'saveVeterinarian() successfully creates new specialist profile');

// Test Status Toggle
const toggledVet = toggleDoctorStatus(newVetId);
assert(toggledVet && toggledVet.status === 'disabled', 'toggleDoctorStatus() disables active doctor');

const activeVets = getActiveVeterinarians();
assert(!activeVets.some(v => v.id === newVetId), 'getActiveVeterinarians() excludes disabled doctors');

// Test Delete
deleteVeterinarian(newVetId);
assert(getDoctorById(newVetId) === null, 'deleteVeterinarian() removes veterinarian profile');

// ----------------------------------------------------
// 4. Doctor Schedules & Availability Tests
// ----------------------------------------------------
console.log('\n--- 4. Doctor Schedules & Availability Enforcement ---');

const drSarah = initialVets[0]; // Dr. Sarah Kapoor
const sarahAvail = getDoctorAvailability(drSarah.id);
assert(sarahAvail.workingDays.length > 0, `Dr. Sarah Kapoor has ${sarahAvail.workingDays.length} working days configured`);

// Block a test date
const testBlockDate = '2026-11-20';
blockDoctorDate(drSarah.id, testBlockDate, 'Annual Veterinary Summit');
const updatedAvail = getDoctorAvailability(drSarah.id);
assert(updatedAvail.blockedDates.some(b => b.date === testBlockDate), 'blockDoctorDate() records blocked date and reason');

// Verify booking engine detects blocked date
const blockedSlotResult = getAvailableSlotsForDoctorAndDate(drSarah.name, testBlockDate);
assert(blockedSlotResult.isDateBlocked === true, 'getAvailableSlotsForDoctorAndDate() detects blocked date');
assert(blockedSlotResult.hasAvailableSlots === false, 'Blocked date reports 0 available slots');

// Unblock date
unblockDoctorDate(drSarah.id, testBlockDate);
const unblockedAvail = getDoctorAvailability(drSarah.id);
assert(!unblockedAvail.blockedDates.some(b => b.date === testBlockDate), 'unblockDoctorDate() releases blocked date');

// ----------------------------------------------------
// 5. Payment Records & Ledger Tests
// ----------------------------------------------------
console.log('\n--- 5. Payment Records & Online Checkout Integration ---');

const testPaymentId = generatePaymentId();
const testTxnId = generateTransactionId();
const testApptId = 'APPT-TEST-PAY-001';

const createdPayment = createPaymentRecord({
  id: testPaymentId,
  transactionId: testTxnId,
  appointmentId: testApptId,
  userId: customerUser.id,
  customerName: customerUser.name,
  customerEmail: customerUser.email,
  petId: 'pet-test-01',
  petName: 'Luna',
  serviceId: 'consultation',
  serviceName: 'Veterinary Consultation',
  amount: '$55.00',
  paymentMethod: 'Credit Card •••• 4242',
  paymentDate: new Date().toISOString(),
  status: 'Paid'
});

assert(createdPayment && createdPayment.id === testPaymentId, 'createPaymentRecord() persists payment record');

const fetchedPayment = getPaymentById(testPaymentId);
assert(fetchedPayment && fetchedPayment.amount === '$55.00', 'getPaymentById() returns exact payment details');

const fetchedByAppt = getPaymentByAppointmentId(testApptId);
assert(fetchedByAppt && fetchedByAppt.id === testPaymentId, 'getPaymentByAppointmentId() links payment to appointment');

// Test Refund
const refunded = refundPaymentRecord(testPaymentId);
assert(refunded && refunded.status === 'Refunded', 'refundPaymentRecord() updates status to Refunded');
assert(refunded.refundedAt !== undefined, 'Refund record contains timestamp');

// ----------------------------------------------------
// 6. Admin Appointment Management & Status Updates
// ----------------------------------------------------
console.log('\n--- 6. Global Appointments & Admin Status Updater ---');

// Create test appointment
const newAppt = saveUserAppointment(customerUser.id, {
  petId: 'pet-01',
  petName: 'Buddy',
  species: 'Dog',
  serviceId: 'consultation',
  service: 'Veterinary Consultation',
  veterinarianId: drSarah.id,
  veterinarian: drSarah.name,
  date: '2026-10-15',
  time: '11:00 AM',
  status: 'Confirmed',
  paymentStatus: 'Paid',
  price: '$55.00',
  room: 'Suite 2B'
});

assert(newAppt && newAppt.id, `saveUserAppointment() created appointment #${newAppt.id}`);

// Admin updates status to Completed with Diagnosis Notes
const updatedAppt = updateAppointmentStatusByAdmin(newAppt.id, 'Completed', {
  diagnosisSummary: 'Patient examined. Excellent cardiovascular health. Prescribed daily joint vitamins.',
  paymentStatus: 'Paid'
});

assert(updatedAppt && updatedAppt.status === 'Completed', 'updateAppointmentStatusByAdmin() updates status to Completed');
assert(updatedAppt.diagnosisSummary.includes('Excellent cardiovascular health'), 'Clinical diagnosis summary successfully persisted');

const allGlobal = getAllGlobalAppointments();
assert(allGlobal.some(a => a.id === newAppt.id), 'getAllGlobalAppointments() includes all system appointments');

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n======================================================');
console.log(`  MILESTONE 4 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('======================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
