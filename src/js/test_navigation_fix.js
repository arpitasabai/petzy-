/* PETZY Navigation & Back Button Automated Verification Suite */
import { getSmartParentRoute } from './components/back-button.js';

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
console.log('  TESTING PETZY BACK BUTTON & NAVIGATION FIXES');
console.log('======================================================\n');

// ----------------------------------------------------
// 1. Smart Parent Route Calculation (Fallback Handling)
// ----------------------------------------------------
console.log('--- 1. Smart Semantic Fallback Resolver ---');

assert(getSmartParentRoute('#/service-detail?id=consultation') === '#/services', 'Service Detail fallback resolves to #/services');
assert(getSmartParentRoute('#/services/dental-care') === '#/services', 'Service sub-path fallback resolves to #/services');
assert(getSmartParentRoute('#/veterinarian-profile?id=ananya-sharma') === '#/veterinarians', 'Veterinarian profile fallback resolves to #/veterinarians');
assert(getSmartParentRoute('#/veterinarians/sarah-kapoor') === '#/veterinarians', 'Veterinarian sub-path fallback resolves to #/veterinarians');
assert(getSmartParentRoute('#/pet-profile?id=pet_buddy_01') === '#/dashboard?tab=pets', 'Pet profile fallback resolves to #/dashboard?tab=pets');
assert(getSmartParentRoute('#/schedule-appointment') === '#/dashboard?tab=appointments', 'Schedule appointment fallback resolves to #/dashboard?tab=appointments');
assert(getSmartParentRoute('#/book-appointment') === '#/dashboard?tab=appointments', 'Book appointment fallback resolves to #/dashboard?tab=appointments');
assert(getSmartParentRoute('#/admin?tab=customers') === '#/admin?tab=overview', 'Admin sub-tab fallback resolves to #/admin?tab=overview');
assert(getSmartParentRoute('#/admin?tab=appointments') === '#/admin?tab=overview', 'Admin appointments tab fallback resolves to #/admin?tab=overview');
assert(getSmartParentRoute('#/admin') === '#/dashboard', 'Admin root fallback resolves to #/dashboard');
assert(getSmartParentRoute('#/dashboard?tab=pets') === '#/dashboard?tab=overview', 'Dashboard sub-tab fallback resolves to #/dashboard?tab=overview');
assert(getSmartParentRoute('#/dashboard') === '#/', 'Dashboard root fallback resolves to #/');
assert(getSmartParentRoute('#/about') === '#/', 'About page fallback resolves to #/');

// ----------------------------------------------------
// 2. Navigation History Stack Simulation
// ----------------------------------------------------
console.log('\n--- 2. Navigation Stack & Single-Click Back Simulation ---');

// Mock window and navigation stack
const mockWindow = {
  location: { hash: '#/' },
  petzyNavigationStack: [],
  petzyIsGoingBack: false
};

const record = (hash) => {
  mockWindow.location.hash = hash;
  if (!mockWindow.petzyIsGoingBack) {
    const stack = mockWindow.petzyNavigationStack;
    if (stack.length === 0 || stack[stack.length - 1] !== hash) {
      stack.push(hash);
    }
  }
};

const goBack = (fallback = null) => {
  const current = mockWindow.location.hash;
  const stack = mockWindow.petzyNavigationStack;
  while (stack.length > 0 && stack[stack.length - 1] === current) {
    stack.pop();
  }
  let prev = stack.length > 0 ? stack.pop() : (fallback || getSmartParentRoute(current));
  mockWindow.petzyIsGoingBack = true;
  mockWindow.location.hash = prev;
  mockWindow.petzyIsGoingBack = false;
};

// Simulation A: Home -> Services -> Service Details -> Back -> Services
record('#/');
record('#/services');
record('#/service-detail?id=consultation');

assert(mockWindow.location.hash === '#/service-detail?id=consultation', 'Current page is Service Details');
goBack('#/services');
assert(mockWindow.location.hash === '#/services', 'Single click back goes to #/services (NOT Home, NO double click)');

// Simulation B: Services -> Veterinarians -> Dr. Ananya Profile -> Back -> Veterinarians
record('#/veterinarians');
record('#/veterinarians/ananya-sharma');

assert(mockWindow.location.hash === '#/veterinarians/ananya-sharma', 'Current page is Dr. Ananya Profile');
goBack('#/veterinarians');
assert(mockWindow.location.hash === '#/veterinarians', 'Single click back goes to #/veterinarians');

// Simulation C: Admin -> Appointments -> Back -> Admin
record('#/admin?tab=overview');
record('#/admin?tab=appointments');

assert(mockWindow.location.hash === '#/admin?tab=appointments', 'Current page is Admin Appointments');
goBack();
assert(mockWindow.location.hash === '#/admin?tab=overview', 'Single click back goes to Admin Overview');

// Simulation D: Dashboard -> My Pets -> Pet Details -> Back -> My Pets
record('#/dashboard?tab=overview');
record('#/dashboard?tab=pets');
record('#/pet-profile?id=pet_buddy_01');

assert(mockWindow.location.hash === '#/pet-profile?id=pet_buddy_01', 'Current page is Buddy Profile');
goBack();
assert(mockWindow.location.hash === '#/dashboard?tab=pets', 'Single click back goes to #/dashboard?tab=pets');

console.log('\n======================================================');
console.log(`  NAVIGATION TESTS: ${passed} PASSED, ${failed} FAILED`);
console.log('======================================================\n');

if (failed > 0) process.exit(1);
