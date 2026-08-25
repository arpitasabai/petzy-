/* PETZY Milestone 2 Comprehensive Logic & Data Flow Test Suite */

// Mock localStorage for Node.js environment
const store = {};
global.localStorage = {
  getItem: (key) => store[key] || null,
  setItem: (key, val) => { store[key] = String(val); },
  removeItem: (key) => { delete store[key]; },
  clear: () => { for (const k in store) delete store[k]; }
};
global.window = {
  dispatchEvent: () => {},
  CustomEvent: class {}
};

async function runTests() {
  console.log('🧪 Starting PETZY Milestone 2 Test Suite...\n');
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

  const {
    registerUser,
    loginUser,
    loginAsDemoUser,
    getCurrentUser,
    logoutUser,
    updateUserProfile,
    changeUserPassword,
    isAuthenticated
  } = await import('./services/auth.js');

  const {
    getUserPets,
    getUserPetById,
    saveUserPet,
    deleteUserPet,
    addVaccinationRecord,
    getUserAppointments,
    getUserAppointmentById,
    getUserAppointmentsByPet,
    saveUserAppointment,
    cancelUserAppointment,
    seedDemoData
  } = await import('./services/storage.js');

  // Test 1: Seed & Demo Login
  console.log('--- Test Suite 1: Authentication & Demo Account ---');
  const demoUser = loginAsDemoUser();
  assert(demoUser.email === 'samantha@petzy.com', 'Demo user logged in with email samantha@petzy.com');
  assert(isAuthenticated() === true, 'User is authenticated');
  assert(getCurrentUser().name === 'Samantha Hayes', 'Current user session matches Samantha Hayes');

  // Test 2: Demo Pets Data
  console.log('\n--- Test Suite 2: Demo Pets & Vaccinations ---');
  const samanthaPets = getUserPets(demoUser.id);
  assert(samanthaPets.length >= 2, `Samantha has ${samanthaPets.length} registered pets (Buddy & Mimi)`);
  
  const buddy = samanthaPets.find(p => p.name === 'Buddy');
  assert(buddy !== undefined, 'Buddy the Golden Retriever exists');
  assert(buddy.species === 'Dog', 'Buddy species is Dog');
  assert(buddy.vaccinations.length >= 4, `Buddy has ${buddy.vaccinations.length} vaccination records`);

  const mimi = samanthaPets.find(p => p.name === 'Mimi');
  assert(mimi !== undefined, 'Mimi the Siamese Cat exists');
  assert(mimi.species === 'Cat', 'Mimi species is Cat');

  // Test 3: Demo Appointments
  console.log('\n--- Test Suite 3: Appointments Isolation & Queries ---');
  const samanthaAppts = getUserAppointments(demoUser.id);
  assert(samanthaAppts.length === 4, `Samantha has 4 total appointments (${samanthaAppts.length})`);
  
  const buddyAppts = getUserAppointmentsByPet(demoUser.id, buddy.id);
  assert(buddyAppts.length === 2, `Buddy has 2 specific appointments (${buddyAppts.length})`);

  const upcomingAppts = samanthaAppts.filter(a => a.status === 'Upcoming');
  assert(upcomingAppts.length === 1, `Upcoming appointments count is 1 (${upcomingAppts[0].service})`);

  // Test 4: New Customer Registration
  console.log('\n--- Test Suite 4: New User Registration & Account Isolation ---');
  logoutUser();
  assert(isAuthenticated() === false, 'User successfully logged out');

  const newUser = registerUser({
    name: 'Oliver Queen',
    email: 'oliver@example.com',
    phone: '+1 (555) 345-6789',
    password: 'Password123!'
  });
  assert(newUser.email === 'oliver@example.com', 'New user registered with oliver@example.com');
  assert(getCurrentUser().id === newUser.id, 'New user session is automatically active');

  // Oliver's pets should start empty (data isolation)
  const oliverPets = getUserPets(newUser.id);
  assert(oliverPets.length === 0, 'Oliver Queen has 0 pets initially (strict account isolation)');

  // Test 5: Add New Pet for Oliver
  console.log('\n--- Test Suite 5: Add, Edit, and Delete Pet CRUD ---');
  const newPet = saveUserPet(newUser.id, {
    name: 'Shadow',
    species: 'Dog',
    breed: 'German Shepherd',
    age: '2 Years',
    gender: 'Male (Neutered)',
    weight: '34 kg',
    allergies: 'None reported',
    conditions: 'None',
    medicalNotes: 'Intelligent, energetic agility dog.'
  });
  assert(newPet.id !== undefined, `Shadow created with ID ${newPet.id}`);
  assert(getUserPets(newUser.id).length === 1, 'Oliver now has 1 pet (Shadow)');

  // Edit Shadow
  newPet.weight = '35.2 kg';
  newPet.allergies = 'Beef meal';
  saveUserPet(newUser.id, newPet);
  const updatedShadow = getUserPetById(newUser.id, newPet.id);
  assert(updatedShadow.weight === '35.2 kg', 'Pet weight updated successfully');
  assert(updatedShadow.allergies === 'Beef meal', 'Pet allergies updated successfully');

  // Test 6: Add Vaccination Record for Shadow
  console.log('\n--- Test Suite 6: Vaccination Records Tracking ---');
  const vacRecord = addVaccinationRecord(newUser.id, newPet.id, {
    name: 'Rabies (3-Year Booster)',
    dateAdministered: '2026-08-25',
    nextDueDate: '2029-08-25',
    veterinarian: 'Dr. Ananya Sharma',
    status: 'Up to Date',
    clinic: 'PETZY Central Hospital'
  });
  assert(vacRecord.id !== undefined, 'Vaccination record created');
  const shadowWithVac = getUserPetById(newUser.id, newPet.id);
  assert(shadowWithVac.vaccinations.length === 1, 'Shadow has 1 vaccination record attached');
  assert(shadowWithVac.vaccinations[0].status === 'Up to Date', 'Status is Up to Date');

  // Test 7: Profile Management & Password Security
  console.log('\n--- Test Suite 7: Profile Updates & Password Security ---');
  const updatedProfile = updateUserProfile({
    name: 'Oliver Queen, CEO',
    address: '450 Starling Blvd, San Francisco, CA',
    emergencyContact: '+1 (555) 999-8888 (Thea Queen)'
  });
  assert(updatedProfile.name === 'Oliver Queen, CEO', 'Profile name updated');
  assert(updatedProfile.address === '450 Starling Blvd, San Francisco, CA', 'Profile address updated');

  changeUserPassword('Password123!', 'NewStrongPassword2026!');
  assert(getCurrentUser().password === 'NewStrongPassword2026!', 'Password updated');

  // Verify login with new password
  logoutUser();
  const reLoggedIn = loginUser('oliver@example.com', 'NewStrongPassword2026!');
  assert(reLoggedIn.id === newUser.id, 'Successfully logged in with new password');

  // Test 8: Samantha data still untouched
  console.log('\n--- Test Suite 8: Multi-Account Isolation Verification ---');
  const samanthaRecheckPets = getUserPets(demoUser.id);
  assert(samanthaRecheckPets.length === 2, 'Samantha Hayes pets remain intact (2 pets)');
  assert(samanthaRecheckPets.find(p => p.name === 'Buddy').weight === '30.5 kg', 'Buddy data preserved');

  // Test 9: Schedule New Appointment with Custom User Details
  console.log('\n--- Test Suite 9: Dynamic User Appointment Scheduling ---');
  const oliverAppt = saveUserAppointment(newUser.id, {
    petId: newPet.id,
    petName: 'Shadow',
    petPhoto: newPet.photo || 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
    species: 'Dog',
    service: 'Dental Care & Hygiene',
    veterinarian: 'Dr. Sarah Kapoor',
    vetTitle: 'Senior Veterinary Physician',
    date: '2026-09-12',
    time: '11:45 AM',
    room: 'Dental Suite A',
    notes: 'Routine dental tartar check and teeth scaling for Shadow.'
  });
  assert(oliverAppt.id !== undefined, `Appointment scheduled with ID ${oliverAppt.id}`);
  assert(oliverAppt.status === 'Upcoming', 'Appointment status is Upcoming');
  
  const oliverApptsList = getUserAppointments(newUser.id);
  assert(oliverApptsList.length === 1, 'Oliver now has 1 appointment in history');
  assert(oliverApptsList[0].service === 'Dental Care & Hygiene', 'Service matches user-selected Dental Care');
  // Test 10: Cancel Appointment Action
  console.log('\n--- Test Suite 10: Cancel Appointment Action ---');
  const cancelResult = cancelUserAppointment(newUser.id, oliverAppt.id);
  assert(cancelResult === true, 'Appointment cancelled successfully');
  const cancelledAppt = getUserAppointmentById(newUser.id, oliverAppt.id);
  assert(cancelledAppt.status === 'Cancelled', 'Appointment status is now Cancelled');

  console.log(`\n🎉 ALL TESTS PASSED! (${passed}/${total} assertions)\n`);
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
