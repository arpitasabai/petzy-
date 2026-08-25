/* PETZY Schedule Appointment Dedicated Page (Milestone 2) */
import { getCurrentUser } from '../services/auth.js';
import { getUserPets, saveUserAppointment } from '../services/storage.js';
import { siteData } from '../data.js';
import { renderBackButton } from '../components/back-button.js';
import { showToast } from '../components/toast.js';

let selectedPetId = null;
let selectedServiceName = 'Veterinary Consultation';
let selectedDoctorName = 'Dr. Ananya Sharma';
let selectedDoctorTitle = 'Chief Veterinary Surgeon';
let selectedDoctorImage = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80';
let selectedTimeSlot = '10:30 AM';

const TIME_SLOTS = [
  '09:00 AM',
  '10:30 AM',
  '11:45 AM',
  '02:00 PM',
  '03:30 PM',
  '04:45 PM',
  '06:00 PM'
];

const SERVICES_LIST = [
  {
    name: 'Veterinary Consultation',
    desc: 'Comprehensive nose-to-tail physical exam, vitals, and preventive assessment.',
    icon: 'fa-stethoscope',
    room: 'Consultation Suite 2B'
  },
  {
    name: 'Vaccination & Immunity',
    desc: 'Core puppy/kitten and adult vaccine protocols (Rabies, DHPP, FVRCP).',
    icon: 'fa-syringe',
    room: 'Immunization Suite 1'
  },
  {
    name: 'Dental Care & Hygiene',
    desc: 'Ultrasonic plaque removal, tartar scaling, subgingival check, and polish.',
    icon: 'fa-tooth',
    room: 'Dental Suite A'
  },
  {
    name: 'Spa & Medical Grooming',
    desc: 'Therapeutic hydro-massage bath, sanitary ear cleaning, and nail trim.',
    icon: 'fa-scissors',
    room: 'Spa & Grooming Wing'
  },
  {
    name: 'Soft Tissue & Orthopedic Surgery',
    desc: 'Sterile surgical suite with continuous anesthesia and vitals monitoring.',
    icon: 'fa-kit-medical',
    room: 'Sterile Surgical Suite'
  },
  {
    name: '24/7 Emergency & Urgent Care',
    desc: 'Rapid triage, trauma stabilization, oxygen therapy, and urgent care.',
    icon: 'fa-truck-medical',
    room: 'Emergency Triage ICU'
  }
];

export function renderScheduleAppointment() {
  const user = getCurrentUser();
  if (!user) {
    setTimeout(() => {
      window.location.hash = '#/login';
      showToast('Please sign in to schedule an appointment.', 'coral', 'fa-solid fa-lock');
    }, 10);
    return `<div class="auth-page-wrapper"><p>Redirecting to login...</p></div>`;
  }

  const pets = getUserPets(user.id);

  // Check URL for preselected petId (e.g. #/schedule-appointment?petId=...)
  const fullHash = window.location.hash;
  if (fullHash.includes('petId=')) {
    const urlPetId = fullHash.split('petId=')[1]?.split('&')[0];
    if (pets.some(p => p.id === urlPetId)) {
      selectedPetId = urlPetId;
    }
  }

  if (!selectedPetId && pets.length > 0) {
    selectedPetId = pets[0].id;
  }

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  return `
    <div class="container pet-profile-page-wrapper animate-fade-up" style="max-width: 1040px;">
      <!-- Back Link -->
      <div style="margin-bottom: 1.5rem;">
        ${renderBackButton('#/dashboard?tab=appointments')}
      </div>

      <!-- Page Header -->
      <div class="auth-card-header" style="text-align: left; margin-bottom: 2rem;">
        <div class="section-badge coral" style="margin-bottom: 0.5rem;">
          <i class="fa-solid fa-calendar-plus"></i>
          <span>Patient Appointment Booking</span>
        </div>
        <h1 style="font-size: 2.2rem; color: var(--color-forest-green); margin-bottom: 0.35rem;">Schedule a Veterinary Visit</h1>
        <p style="font-size: 1rem; color: var(--color-charcoal-muted); margin: 0;">Select your registered pet, medical service, preferred veterinary specialist, and appointment time.</p>
      </div>

      <form id="schedule-appointment-form">
        <div style="display: grid; grid-template-columns: 1fr 340px; gap: 2rem; align-items: start;">
          
          <!-- Left Column: Step-by-Step Form Fields -->
          <div style="display: flex; flex-direction: column; gap: 1.75rem;">
            
            <!-- Step 1: Select Patient / Pet -->
            <div class="profile-card-box">
              <div class="section-subhead-row" style="margin-bottom: 1rem;">
                <div class="section-subhead-title">
                  <i class="fa-solid fa-paw" style="color: var(--color-forest-green);"></i>
                  <h3 style="font-size: 1.15rem;">1. Select Patient (Pet) *</h3>
                </div>
                <a href="#/dashboard?tab=pets" class="btn btn-outline" style="padding: 0.35rem 0.85rem; font-size: 0.8rem;">
                  <i class="fa-solid fa-plus"></i>
                  <span>Manage Pets</span>
                </a>
              </div>

              ${pets.length === 0 ? `
                <div style="background: var(--color-warm-cream); padding: 1.25rem; border-radius: var(--radius-md); border: 1px dashed var(--color-sage-green); text-align: center;">
                  <p style="font-size: 0.92rem; color: var(--color-charcoal-muted); margin-bottom: 0.75rem;">No pets found in your account.</p>
                  <div class="form-group" style="text-align: left; margin: 0;">
                    <label class="form-label" for="manual-pet-name">Enter Pet Name *</label>
                    <input type="text" id="manual-pet-name" class="form-input" placeholder="e.g. Buddy (Dog)" required>
                  </div>
                </div>
              ` : `
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.85rem;">
                  ${pets.map(p => `
                    <div class="pet-select-card ${p.id === selectedPetId ? 'selected' : ''}" data-pet-id="${p.id}" data-pet-name="${p.name}" data-pet-species="${p.species}" data-pet-photo="${p.photo}" style="padding: 0.85rem; border-radius: var(--radius-lg); border: 2px solid ${p.id === selectedPetId ? 'var(--color-forest-green)' : 'var(--color-border)'}; background: ${p.id === selectedPetId ? 'var(--color-sage-green-soft)' : 'var(--color-white)'}; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; transition: all var(--transition-fast);">
                      <img src="${p.photo}" alt="${p.name}" style="width: 48px; height: 48px; border-radius: var(--radius-md); object-fit: cover; border: 1.5px solid var(--color-forest-green);">
                      <div style="overflow: hidden;">
                        <h4 style="font-family: var(--font-heading); font-size: 1rem; color: var(--color-forest-green); margin: 0;">${p.name}</h4>
                        <span style="font-size: 0.8rem; color: var(--color-charcoal-muted); display: block; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${p.species} • ${p.breed}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              `}
            </div>

            <!-- Step 2: Select Service -->
            <div class="profile-card-box">
              <div class="section-subhead-row" style="margin-bottom: 1rem;">
                <div class="section-subhead-title">
                  <i class="fa-solid fa-stethoscope" style="color: var(--color-forest-green);"></i>
                  <h3 style="font-size: 1.15rem;">2. Select Veterinary Service *</h3>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 0.85rem;">
                ${SERVICES_LIST.map(s => `
                  <div class="service-select-card ${s.name === selectedServiceName ? 'selected' : ''}" data-service-name="${s.name}" data-service-room="${s.room}" style="padding: 1rem; border-radius: var(--radius-lg); border: 2px solid ${s.name === selectedServiceName ? 'var(--color-forest-green)' : 'var(--color-border)'}; background: ${s.name === selectedServiceName ? 'var(--color-sage-green-soft)' : 'var(--color-white)'}; cursor: pointer; display: flex; align-items: flex-start; gap: 0.75rem; transition: all var(--transition-fast);">
                    <div style="width: 38px; height: 38px; border-radius: var(--radius-md); background: ${s.name === selectedServiceName ? 'var(--color-forest-green)' : 'var(--color-warm-cream)'}; color: ${s.name === selectedServiceName ? 'var(--color-warm-cream)' : 'var(--color-forest-green)'}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 1.1rem;">
                      <i class="fa-solid ${s.icon}"></i>
                    </div>
                    <div>
                      <h4 style="font-family: var(--font-heading); font-size: 0.95rem; color: var(--color-forest-green); margin: 0 0 0.2rem;">${s.name}</h4>
                      <p style="font-size: 0.78rem; color: var(--color-charcoal-muted); margin: 0; line-height: 1.35;">${s.desc}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Step 3: Select Veterinarian -->
            <div class="profile-card-box">
              <div class="section-subhead-row" style="margin-bottom: 1rem;">
                <div class="section-subhead-title">
                  <i class="fa-solid fa-user-doctor" style="color: var(--color-forest-green);"></i>
                  <h3 style="font-size: 1.15rem;">3. Select Veterinarian Specialist *</h3>
                </div>
              </div>

              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 0.85rem;">
                ${siteData.veterinarians.map(v => `
                  <div class="doctor-select-card ${v.name === selectedDoctorName ? 'selected' : ''}" data-doctor-name="${v.name}" data-doctor-title="${v.title}" data-doctor-image="${v.image}" style="padding: 0.85rem; border-radius: var(--radius-lg); border: 2px solid ${v.name === selectedDoctorName ? 'var(--color-forest-green)' : 'var(--color-border)'}; background: ${v.name === selectedDoctorName ? 'var(--color-sage-green-soft)' : 'var(--color-white)'}; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; transition: all var(--transition-fast);">
                    <img src="${v.image}" alt="${v.name}" style="width: 46px; height: 46px; border-radius: var(--radius-full); object-fit: cover; border: 2px solid var(--color-forest-green);">
                    <div style="overflow: hidden;">
                      <h4 style="font-family: var(--font-heading); font-size: 0.95rem; color: var(--color-forest-green); margin: 0;">${v.name}</h4>
                      <span style="font-size: 0.75rem; color: var(--color-soft-coral-hover); font-weight: 700; display: block; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${v.badge || v.title}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Step 4: Date, Time & Location -->
            <div class="profile-card-box">
              <div class="section-subhead-row" style="margin-bottom: 1rem;">
                <div class="section-subhead-title">
                  <i class="fa-solid fa-calendar-days" style="color: var(--color-forest-green);"></i>
                  <h3 style="font-size: 1.15rem;">4. Date & Time Selection *</h3>
                </div>
              </div>

              <div class="form-row-2" style="margin-bottom: 1.25rem;">
                <div class="form-group">
                  <label class="form-label" for="appt-date-input">Appointment Date *</label>
                  <input type="date" id="appt-date-input" class="form-input" required min="${today}" value="${tomorrow}">
                </div>
                <div class="form-group">
                  <label class="form-label" for="appt-room-input">Hospital Suite / Room</label>
                  <input type="text" id="appt-room-input" class="form-input" value="Consultation Suite 2B" readonly>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Available Time Slots *</label>
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;" id="time-slots-container">
                  ${TIME_SLOTS.map(t => `
                    <button type="button" class="quick-action-pill time-slot-btn ${t === selectedTimeSlot ? 'primary' : ''}" data-time="${t}">
                      <i class="fa-solid fa-clock"></i>
                      <span>${t}</span>
                    </button>
                  `).join('')}
                </div>
              </div>
            </div>

            <!-- Step 5: Clinical Notes & Reason for Visit -->
            <div class="profile-card-box">
              <div class="section-subhead-row" style="margin-bottom: 1rem;">
                <div class="section-subhead-title">
                  <i class="fa-solid fa-clipboard-question" style="color: var(--color-forest-green);"></i>
                  <h3 style="font-size: 1.15rem;">5. Reason for Visit & Clinical Notes</h3>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="appt-notes-input">Describe reason for consultation or symptoms (Optional)</label>
                <textarea id="appt-notes-input" class="form-textarea" rows="3" placeholder="e.g. Annual health checkup, vaccination booster, routine physical, or check slight limp on left paw..."></textarea>
              </div>
            </div>

          </div>

          <!-- Right Column: Live Booking Summary Sticky Card -->
          <div style="position: sticky; top: 100px;">
            <div class="profile-card-box" style="border: 2px solid var(--color-forest-green); box-shadow: var(--shadow-lg);">
              <div class="section-badge" style="margin-bottom: 0.75rem;">
                <i class="fa-solid fa-clipboard-check"></i>
                <span>Booking Summary</span>
              </div>

              <h3 style="font-size: 1.25rem; color: var(--color-forest-green); margin: 0 0 1.25rem;">Visit Overview</h3>

              <div style="display: flex; flex-direction: column; gap: 0.85rem; font-size: 0.88rem; margin-bottom: 1.5rem;">
                <div style="display: flex; justify-content: space-between; padding-bottom: 0.6rem; border-bottom: 1px solid var(--color-border-subtle);">
                  <span style="color: var(--color-charcoal-light);">Patient:</span>
                  <strong style="color: var(--color-forest-green);" id="summary-pet-name">${pets.length > 0 ? pets.find(p => p.id === selectedPetId)?.name || 'Selected Pet' : 'Your Pet'}</strong>
                </div>

                <div style="display: flex; justify-content: space-between; padding-bottom: 0.6rem; border-bottom: 1px solid var(--color-border-subtle);">
                  <span style="color: var(--color-charcoal-light);">Service:</span>
                  <strong style="color: var(--color-forest-green); text-align: right;" id="summary-service-name">${selectedServiceName}</strong>
                </div>

                <div style="display: flex; justify-content: space-between; padding-bottom: 0.6rem; border-bottom: 1px solid var(--color-border-subtle);">
                  <span style="color: var(--color-charcoal-light);">Doctor:</span>
                  <strong style="color: var(--color-forest-green);" id="summary-doctor-name">${selectedDoctorName}</strong>
                </div>

                <div style="display: flex; justify-content: space-between; padding-bottom: 0.6rem; border-bottom: 1px solid var(--color-border-subtle);">
                  <span style="color: var(--color-charcoal-light);">Date:</span>
                  <strong style="color: var(--color-forest-green);" id="summary-date">${tomorrow}</strong>
                </div>

                <div style="display: flex; justify-content: space-between; padding-bottom: 0.6rem; border-bottom: 1px solid var(--color-border-subtle);">
                  <span style="color: var(--color-charcoal-light);">Time:</span>
                  <strong style="color: var(--color-soft-coral-hover);" id="summary-time">${selectedTimeSlot}</strong>
                </div>

                <div style="display: flex; justify-content: space-between;">
                  <span style="color: var(--color-charcoal-light);">Location:</span>
                  <span style="font-weight: 600; color: var(--color-forest-green); font-size: 0.82rem;">PETZY Hospital (Suite 2B)</span>
                </div>
              </div>

              <button type="submit" class="btn btn-teal btn-lg" style="width: 100%; justify-content: center;" id="confirm-booking-btn">
                <i class="fa-solid fa-calendar-check"></i>
                <span>Confirm & Schedule</span>
              </button>

              <div style="margin-top: 1rem; text-align: center; font-size: 0.78rem; color: var(--color-charcoal-light);">
                <i class="fa-solid fa-shield-heart" style="color: var(--color-forest-green);"></i>
                Free cancellation up to 2 hours prior to scheduled visit.
              </div>
            </div>
          </div>

        </div>
      </form>
    </div>
  `;
}

export function setupScheduleAppointmentEvents() {
  const user = getCurrentUser();
  if (!user) return;

  const pets = getUserPets(user.id);
  const form = document.getElementById('schedule-appointment-form');

  // 1. Pet selection cards
  const petCards = document.querySelectorAll('.pet-select-card');
  petCards.forEach(card => {
    card.addEventListener('click', () => {
      petCards.forEach(c => {
        c.style.borderColor = 'var(--color-border)';
        c.style.background = 'var(--color-white)';
      });
      card.style.borderColor = 'var(--color-forest-green)';
      card.style.background = 'var(--color-sage-green-soft)';

      selectedPetId = card.getAttribute('data-pet-id');
      const petName = card.getAttribute('data-pet-name');
      const summaryPetName = document.getElementById('summary-pet-name');
      if (summaryPetName && petName) summaryPetName.textContent = petName;
    });
  });

  // 2. Service selection cards
  const serviceCards = document.querySelectorAll('.service-select-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      serviceCards.forEach(c => {
        c.style.borderColor = 'var(--color-border)';
        c.style.background = 'var(--color-white)';
        const iconWrap = c.querySelector('div:first-child');
        if (iconWrap) {
          iconWrap.style.background = 'var(--color-warm-cream)';
          iconWrap.style.color = 'var(--color-forest-green)';
        }
      });
      card.style.borderColor = 'var(--color-forest-green)';
      card.style.background = 'var(--color-sage-green-soft)';
      const iconWrap = card.querySelector('div:first-child');
      if (iconWrap) {
        iconWrap.style.background = 'var(--color-forest-green)';
        iconWrap.style.color = 'var(--color-warm-cream)';
      }

      selectedServiceName = card.getAttribute('data-service-name') || 'Veterinary Consultation';
      const room = card.getAttribute('data-service-room') || 'Consultation Suite 2B';
      
      const roomInput = document.getElementById('appt-room-input');
      if (roomInput) roomInput.value = room;

      const summaryService = document.getElementById('summary-service-name');
      if (summaryService) summaryService.textContent = selectedServiceName;
    });
  });

  // 3. Doctor selection cards
  const doctorCards = document.querySelectorAll('.doctor-select-card');
  doctorCards.forEach(card => {
    card.addEventListener('click', () => {
      doctorCards.forEach(c => {
        c.style.borderColor = 'var(--color-border)';
        c.style.background = 'var(--color-white)';
      });
      card.style.borderColor = 'var(--color-forest-green)';
      card.style.background = 'var(--color-sage-green-soft)';

      selectedDoctorName = card.getAttribute('data-doctor-name') || 'Dr. Ananya Sharma';
      selectedDoctorTitle = card.getAttribute('data-doctor-title') || 'Veterinary Specialist';
      selectedDoctorImage = card.getAttribute('data-doctor-image') || '';

      const summaryDoctor = document.getElementById('summary-doctor-name');
      if (summaryDoctor) summaryDoctor.textContent = selectedDoctorName;
    });
  });

  // 4. Date change handler
  const dateInput = document.getElementById('appt-date-input');
  dateInput?.addEventListener('input', (e) => {
    const summaryDate = document.getElementById('summary-date');
    if (summaryDate) summaryDate.textContent = e.target.value;
  });

  // 5. Time slot button handler
  const timeBtns = document.querySelectorAll('.time-slot-btn');
  timeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      timeBtns.forEach(b => b.classList.remove('primary'));
      btn.classList.add('primary');
      selectedTimeSlot = btn.getAttribute('data-time') || '10:30 AM';

      const summaryTime = document.getElementById('summary-time');
      if (summaryTime) summaryTime.textContent = selectedTimeSlot;
    });
  });

  // 6. Form Submission
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    let targetPet = null;
    if (pets.length > 0 && selectedPetId) {
      targetPet = pets.find(p => p.id === selectedPetId);
    }

    const manualName = document.getElementById('manual-pet-name')?.value.trim();
    const petName = targetPet ? targetPet.name : (manualName || 'My Pet');
    const petPhoto = targetPet ? targetPet.photo : 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80';
    const petSpecies = targetPet ? targetPet.species : 'Pet';

    const date = document.getElementById('appt-date-input')?.value;
    const room = document.getElementById('appt-room-input')?.value || 'Consultation Suite 2B';
    const notes = document.getElementById('appt-notes-input')?.value.trim() || 'Routine checkup and physical evaluation.';

    if (!date) {
      showToast('Please choose an appointment date.', 'coral', 'fa-solid fa-calendar');
      return;
    }

    const newAppt = {
      petId: targetPet ? targetPet.id : `pet_custom_${Date.now()}`,
      petName,
      petPhoto,
      species: petSpecies,
      service: selectedServiceName,
      veterinarian: selectedDoctorName,
      vetTitle: selectedDoctorTitle,
      vetImage: selectedDoctorImage,
      date,
      time: selectedTimeSlot,
      status: 'Upcoming',
      room,
      notes,
      diagnosisSummary: 'Scheduled visit. Awaiting clinical examination.'
    };

    saveUserAppointment(user.id, newAppt);
    showToast(`Appointment confirmed for ${petName} on ${date} at ${selectedTimeSlot}!`, 'sage', 'fa-solid fa-calendar-check');

    setTimeout(() => {
      window.location.hash = '#/dashboard?tab=appointments';
    }, 600);
  });
}
