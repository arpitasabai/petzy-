/* PETZY Multi-Step Appointment Booking System (Milestone 3) */
import { getCurrentUser } from '../services/auth.js';
import {
  getUserPets,
  getUserPetById,
  saveUserAppointment,
  rescheduleUserAppointment,
  getUserAppointmentById,
  getAvailableSlotsForDoctorAndDate,
  findAvailableDoctorForSlot,
  generateAppointmentId
} from '../services/storage.js';
import { siteData, getDoctorById, getServiceById } from '../data.js';
import { renderBackButton } from '../components/back-button.js';
import { openPetModal } from '../components/pet-modal.js';
import { openAppointmentModal } from '../components/appointment-modal.js';
import { showToast } from '../components/toast.js';

// Helper for initial default state
function getInitialBookingState() {
  const tomorrow = new Date(Date.now() + 86400000);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const defaultSrv = siteData.services[0]; // Veterinary Consultation

  return {
    currentStep: 1, // 1: Service, 2: Pet, 3: Doctor, 4: Date & Time, 5: Summary
    appointmentId: null,
    rescheduleId: null,
    previousAppointmentId: null,
    appointmentType: 'Standard',
    serviceId: defaultSrv ? defaultSrv.id : 'consultation',
    serviceName: defaultSrv ? defaultSrv.title : 'Veterinary Consultation',
    serviceDuration: defaultSrv ? defaultSrv.duration : '30 Mins',
    servicePrice: defaultSrv ? defaultSrv.price : '$55',
    serviceRoom: defaultSrv ? defaultSrv.room : 'Consultation Suite 2B',
    serviceIcon: defaultSrv ? defaultSrv.icon : 'fa-stethoscope',
    serviceImage: defaultSrv ? defaultSrv.image : '',
    petId: null,
    petName: '',
    petSpecies: '',
    petBreed: '',
    petPhoto: '',
    veterinarianId: 'any',
    doctorName: 'Any Available Veterinarian',
    doctorTitle: 'Assigned based on schedule',
    doctorImage: '',
    date: tomorrowStr,
    time: '10:30 AM',
    notes: '',
    calendarMonth: tomorrow.getMonth(),
    calendarYear: tomorrow.getFullYear()
  };
}

// Active wizard booking state
let bookingState = getInitialBookingState();

// Active confirmed appointment record (displayed on successful confirmation page)
let confirmedAppointment = null;

// Track processed hash to prevent query param re-reading on user selection changes
let lastParsedHash = '';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export function renderScheduleAppointment() {
  const user = getCurrentUser();
  if (!user) {
    setTimeout(() => {
      window.location.hash = '#/login?redirect=book-appointment';
      showToast('Please sign in to schedule an appointment.', 'coral', 'fa-solid fa-lock');
    }, 10);
    return `
      <div class="auth-page-wrapper">
        <div class="auth-card-box" style="text-align: center;">
          <i class="fa-solid fa-spinner fa-spin" style="font-size: 2.5rem; color: var(--color-forest-green); margin-bottom: 1rem;"></i>
          <p>Redirecting to login portal...</p>
        </div>
      </div>
    `;
  }

  // If a booking was just confirmed, render the Confirmation / Details page
  if (confirmedAppointment) {
    return `
      <div class="container pet-profile-page-wrapper animate-fade-up" style="max-width: 1060px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
          ${renderBackButton('#/dashboard')}
        </div>
        ${renderStep6Confirmed()}
      </div>
    `;
  }

  const pets = getUserPets(user.id);

  // Sync state with URL parameters (detect fresh booking, follow-up, or reschedule)
  syncStateFromUrl(user, pets);

  // Default date setup if empty
  if (!bookingState.date) {
    const tom = new Date(Date.now() + 86400000);
    bookingState.date = tom.toISOString().split('T')[0];
    bookingState.calendarMonth = tom.getMonth();
    bookingState.calendarYear = tom.getFullYear();
  }

  // Ensure selected pet is valid
  if (!bookingState.petId && pets.length > 0) {
    bookingState.petId = pets[0].id;
    bookingState.petName = pets[0].name;
    bookingState.petSpecies = pets[0].species;
    bookingState.petBreed = pets[0].breed;
    bookingState.petPhoto = pets[0].photo;
  }

  // Render Step View
  return `
    <div class="container pet-profile-page-wrapper animate-fade-up" style="max-width: 1060px;">
      <!-- Top Back Navigation -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        ${renderBackButton(bookingState.rescheduleId ? '#/dashboard?tab=appointments' : '#/dashboard')}
        
        ${bookingState.rescheduleId ? `
          <div class="section-badge coral" style="font-size: 0.82rem;">
            <i class="fa-solid fa-calendar-days"></i>
            <span>Rescheduling Appointment: <strong>#${bookingState.rescheduleId}</strong></span>
          </div>
        ` : bookingState.previousAppointmentId ? `
          <div class="section-badge" style="font-size: 0.82rem; background: var(--color-sage-green-soft); color: var(--color-forest-green);">
            <i class="fa-solid fa-clipboard-check"></i>
            <span>Follow-Up Visit for: <strong>#${bookingState.previousAppointmentId}</strong></span>
          </div>
        ` : ''}
      </div>

      <!-- Page Header -->
      <div class="auth-card-header" style="text-align: left; margin-bottom: 2rem;">
        <div class="section-badge coral" style="margin-bottom: 0.5rem;">
          <i class="fa-solid fa-calendar-plus"></i>
          <span>${bookingState.previousAppointmentId ? 'Follow-Up Visit Booking' : 'Patient Appointment Booking'}</span>
        </div>
        <h1 style="font-size: 2.2rem; color: var(--color-forest-green); margin-bottom: 0.35rem;">
          ${bookingState.rescheduleId ? 'Reschedule Your Appointment' : (bookingState.previousAppointmentId ? 'Book Follow-Up Visit' : 'Book a Veterinary Appointment')}
        </h1>
        <p style="font-size: 1rem; color: var(--color-charcoal-muted); margin: 0;">
          ${bookingState.previousAppointmentId 
            ? `We've pre-selected <strong>${bookingState.petName || 'your pet'}</strong> and <strong>${bookingState.serviceName}</strong> from your previous visit. You can modify any choices or pick a new date & time.` 
            : 'Select your medical service, choose your registered pet and preferred veterinarian, pick an open date & time slot, and confirm.'}
        </p>
      </div>

      <!-- 5-Step Progress Bar -->
      ${renderProgressBar(bookingState.currentStep)}

      <!-- Step Content Box -->
      <div id="booking-step-container">
        ${renderCurrentStep(user, pets)}
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// URL PARAMETERS & STATE SYNCHRONIZATION
// ----------------------------------------------------
function syncStateFromUrl(user, pets) {
  const hash = window.location.hash || '';
  const hasParams = hash.includes('?');
  const queryStr = hasParams ? hash.split('?')[1] || '' : '';
  const params = new URLSearchParams(queryStr);
  const reschedParam = params.get('rescheduleId');
  const followUpParam = params.get('followUpId') || params.get('followUp');

  // Case A: User is rescheduling an existing appointment
  if (reschedParam) {
    if (bookingState.rescheduleId !== reschedParam) {
      const existing = getUserAppointmentById(user.id, reschedParam);
      if (existing) {
        bookingState.rescheduleId = reschedParam;
        bookingState.previousAppointmentId = null;
        bookingState.appointmentType = 'Reschedule';
        bookingState.serviceName = existing.service;
        
        const matchedSrv = siteData.services.find(s => 
          s.id === existing.serviceId || 
          s.title.toLowerCase() === (existing.service || '').toLowerCase()
        ) || siteData.services[0];

        if (matchedSrv) {
          applyServiceToState(matchedSrv);
        }

        bookingState.petId = existing.petId;
        bookingState.petName = existing.petName;
        bookingState.petSpecies = existing.species;
        bookingState.petPhoto = existing.petPhoto;
        bookingState.doctorName = existing.veterinarian;
        bookingState.doctorTitle = existing.vetTitle;
        bookingState.doctorImage = existing.vetImage;
        
        const matchedDoc = siteData.veterinarians.find(v => 
          v.id === existing.veterinarianId || 
          v.name.toLowerCase() === (existing.veterinarian || '').toLowerCase()
        );
        bookingState.veterinarianId = matchedDoc ? matchedDoc.id : 'any';

        bookingState.date = existing.date;
        bookingState.time = existing.time;
        bookingState.notes = existing.notes || '';
        bookingState.currentStep = 4; // Start at date/time for reschedule
      }
    }
    lastParsedHash = hash;
    return;
  }

  // Case B: User is booking a Follow-Up for a completed appointment
  if (followUpParam) {
    if (bookingState.previousAppointmentId !== followUpParam) {
      const prev = getUserAppointmentById(user.id, followUpParam);
      if (prev) {
        bookingState = getInitialBookingState();
        bookingState.previousAppointmentId = prev.id;
        bookingState.appointmentType = 'Follow-Up';
        bookingState.rescheduleId = null;

        // Pre-select previous service
        const matchedSrv = siteData.services.find(s => 
          s.id === prev.serviceId || 
          s.title.toLowerCase() === (prev.service || '').toLowerCase()
        ) || siteData.services[0];
        if (matchedSrv) {
          applyServiceToState(matchedSrv);
        }

        // Pre-select previous pet
        const matchedPet = pets.find(p => p.id === prev.petId);
        if (matchedPet) {
          bookingState.petId = matchedPet.id;
          bookingState.petName = matchedPet.name;
          bookingState.petSpecies = matchedPet.species;
          bookingState.petBreed = matchedPet.breed;
          bookingState.petPhoto = matchedPet.photo;
        }

        // Pre-select previous veterinarian
        const matchedDoc = siteData.veterinarians.find(v => 
          v.id === prev.veterinarianId || 
          v.name.toLowerCase() === (prev.veterinarian || '').toLowerCase()
        );
        if (matchedDoc) {
          bookingState.veterinarianId = matchedDoc.id;
          bookingState.doctorName = matchedDoc.name;
          bookingState.doctorTitle = matchedDoc.title;
          bookingState.doctorImage = matchedDoc.image;
        } else {
          bookingState.veterinarianId = 'any';
          bookingState.doctorName = 'Any Available Veterinarian';
          bookingState.doctorTitle = 'Assigned based on schedule';
          bookingState.doctorImage = '';
        }

        // Date and Time must be NEW! (Tomorrow default)
        const tom = new Date(Date.now() + 86400000);
        bookingState.date = tom.toISOString().split('T')[0];
        bookingState.time = '10:30 AM';
        bookingState.calendarMonth = tom.getMonth();
        bookingState.calendarYear = tom.getFullYear();
        bookingState.notes = `Follow-up visit for ${prev.service || 'clinical examination'} (Ref #${prev.id}).`;
        
        // Start at Step 1 and do NOT auto-advance
        bookingState.currentStep = 1;
      }
    }
    lastParsedHash = hash;
    return;
  }

  // Case C: Fresh New Booking Flow
  // Only parse initial query params when hash changes externally
  if (hash !== lastParsedHash) {
    // If previously in reschedule mode or follow-up mode, reset to clean state
    if (bookingState.rescheduleId !== null || bookingState.previousAppointmentId !== null) {
      bookingState = getInitialBookingState();
    }

    // Check URL query parameters for fresh booking pre-selections
    const srvParam = params.get('service') || params.get('serviceId');
    if (srvParam) {
      const foundSrv = getServiceById(srvParam);
      if (foundSrv) {
        applyServiceToState(foundSrv);
      }
    }

    const docParam = params.get('doctor') || params.get('doctorId');
    if (docParam) {
      const foundDoc = getDoctorById(docParam);
      if (foundDoc) {
        bookingState.veterinarianId = foundDoc.id;
        bookingState.doctorName = foundDoc.name;
        bookingState.doctorTitle = foundDoc.title;
        bookingState.doctorImage = foundDoc.image;
      }
    }

    const petParam = params.get('petId');
    if (petParam && pets.length > 0) {
      const foundPet = pets.find(p => p.id === petParam);
      if (foundPet) {
        bookingState.petId = foundPet.id;
        bookingState.petName = foundPet.name;
        bookingState.petSpecies = foundPet.species;
        bookingState.petBreed = foundPet.breed;
        bookingState.petPhoto = foundPet.photo;
      }
    }

    lastParsedHash = hash;
  }
}

function applyServiceToState(srv) {
  bookingState.serviceId = srv.id;
  bookingState.serviceName = srv.title;
  bookingState.serviceDuration = srv.duration;
  bookingState.servicePrice = srv.price;
  bookingState.serviceRoom = srv.room;
  bookingState.serviceIcon = srv.icon;
  bookingState.serviceImage = srv.image;
}

// ----------------------------------------------------
// PROGRESS BAR COMPONENT
// ----------------------------------------------------
function renderProgressBar(currentStep) {
  const steps = [
    { num: 1, label: 'Service', icon: 'fa-stethoscope' },
    { num: 2, label: 'Pet', icon: 'fa-paw' },
    { num: 3, label: 'Veterinarian', icon: 'fa-user-doctor' },
    { num: 4, label: 'Date & Time', icon: 'fa-calendar-days' },
    { num: 5, label: 'Confirmation', icon: 'fa-clipboard-check' }
  ];

  const fillPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return `
    <div class="booking-progress-bar" aria-label="Appointment Booking Progress">
      <div class="booking-progress-track"></div>
      <div class="booking-progress-fill" style="width: calc(${fillPercent}% * 0.9);"></div>

      ${steps.map(s => {
        let statusClass = '';
        if (s.num === currentStep) statusClass = 'active';
        else if (s.num < currentStep) statusClass = 'completed';

        return `
          <button type="button" class="booking-step-item ${statusClass}" data-step-target="${s.num}" ${s.num > currentStep ? 'disabled' : ''}>
            <div class="booking-step-circle">
              ${s.num < currentStep ? '<i class="fa-solid fa-check"></i>' : s.num}
            </div>
            <span class="booking-step-label">${s.label}</span>
          </button>
        `;
      }).join('')}
    </div>
  `;
}

// ----------------------------------------------------
// CURRENT STEP DISPATCHER
// ----------------------------------------------------
function renderCurrentStep(user, pets) {
  switch (bookingState.currentStep) {
    case 1:
      return renderStep1Service();
    case 2:
      return renderStep2Pet(pets);
    case 3:
      return renderStep3Doctor();
    case 4:
      return renderStep4DateTime();
    case 5:
      return renderStep5Summary();
    default:
      return renderStep1Service();
  }
}

// ----------------------------------------------------
// STEP 1: SELECT SERVICE
// ----------------------------------------------------
function renderStep1Service() {
  return `
    <div class="profile-card-box animate-fade-up">
      <div class="section-subhead-row" style="margin-bottom: 1.5rem;">
        <div class="section-subhead-title">
          <i class="fa-solid fa-stethoscope" style="color: var(--color-forest-green); font-size: 1.25rem;"></i>
          <h2 style="font-size: 1.35rem; margin: 0;">1. Select Clinical or Wellness Service</h2>
        </div>
        <span style="font-size: 0.85rem; color: var(--color-charcoal-muted);">Choose required veterinary care</span>
      </div>

      <div class="booking-services-grid">
        ${siteData.services.map(srv => {
          const isSelected = srv.id === bookingState.serviceId;

          return `
            <div class="booking-service-card ${isSelected ? 'selected' : ''}" data-service-id="${srv.id}" style="cursor: pointer;">
              <img src="${srv.image}" alt="${srv.title}" class="booking-service-thumb" loading="lazy">
              
              <div class="booking-service-body">
                <div>
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.4rem;">
                    <span class="section-badge" style="font-size: 0.72rem; padding: 0.2rem 0.6rem; margin: 0;">
                      <i class="${srv.icon}"></i>
                      <span>${srv.badge}</span>
                    </span>
                    <span class="booking-service-duration">
                      <i class="fa-solid fa-clock"></i> ${srv.duration || '30 Mins'}
                    </span>
                  </div>

                  <h3 style="font-size: 1.1rem; color: var(--color-forest-green); margin: 0.4rem 0 0.35rem;">${srv.title}</h3>
                  <p style="font-size: 0.85rem; color: var(--color-charcoal-muted); line-height: 1.45; margin: 0 0 0.75rem;">
                    ${srv.shortDesc}
                  </p>
                </div>

                <div class="booking-service-meta">
                  <span class="booking-service-price">${srv.price || '$55'}</span>
                  <button type="button" class="btn ${isSelected ? 'btn-teal' : 'btn-outline'}" style="padding: 0.45rem 1rem; font-size: 0.82rem; pointer-events: none;">
                    <span>${isSelected ? 'Selected ✓' : 'Select Service'}</span>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="wizard-footer-nav">
        <div></div>
        <button type="button" class="btn btn-teal btn-lg" id="step1-next-btn" ${!bookingState.serviceId ? 'disabled' : ''}>
          <span>Continue to Select Pet</span>
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// STEP 2: SELECT PET
// ----------------------------------------------------
function renderStep2Pet(pets) {
  return `
    <div class="profile-card-box animate-fade-up">
      <div class="section-subhead-row" style="margin-bottom: 1.5rem;">
        <div class="section-subhead-title">
          <i class="fa-solid fa-paw" style="color: var(--color-forest-green); font-size: 1.25rem;"></i>
          <h2 style="font-size: 1.35rem; margin: 0;">2. Select Patient (Your Pet)</h2>
        </div>
        
        <button type="button" class="btn btn-outline" id="booking-add-pet-btn" style="padding: 0.4rem 0.9rem; font-size: 0.82rem;">
          <i class="fa-solid fa-plus"></i>
          <span>Add a Pet</span>
        </button>
      </div>

      <!-- Service Highlight Banner -->
      <div style="background: var(--color-warm-cream); padding: 0.75rem 1.25rem; border-radius: var(--radius-md); border-left: 4px solid var(--color-forest-green); margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between;">
        <div style="font-size: 0.92rem; color: var(--color-forest-green);">
          <span>Selected Service: <strong>${bookingState.serviceName}</strong> (${bookingState.serviceDuration} • ${bookingState.servicePrice})</span>
        </div>
        <button type="button" class="btn btn-outline" id="step2-change-service-btn" style="padding: 0.25rem 0.65rem; font-size: 0.78rem;">
          <span>Change</span>
        </button>
      </div>

      ${pets.length === 0 ? `
        <div style="background: var(--color-warm-cream); padding: 3rem 2rem; border-radius: var(--radius-xl); border: 2px dashed var(--color-sage-green); text-align: center;">
          <i class="fa-solid fa-paw" style="font-size: 3rem; color: var(--color-sage-green); margin-bottom: 1rem;"></i>
          <h3 style="color: var(--color-forest-green); margin-bottom: 0.4rem;">No pets added yet.</h3>
          <p style="color: var(--color-charcoal-muted); max-width: 420px; margin: 0 auto 1.5rem;">
            Please register your pet to link their medical charts, vaccine schedules, and appointments.
          </p>
          <button type="button" class="btn btn-teal btn-lg" id="empty-state-add-pet-btn">
            <i class="fa-solid fa-plus"></i>
            <span>Add a Pet</span>
          </button>
        </div>
      ` : `
        <div class="booking-pets-grid">
          ${pets.map(p => {
            const isSelected = p.id === bookingState.petId;

            return `
              <div class="booking-pet-card ${isSelected ? 'selected' : ''}" data-pet-id="${p.id}" style="cursor: pointer;">
                <img src="${p.photo}" alt="${p.name}" class="booking-pet-avatar">
                
                <div style="flex-grow: 1; overflow: hidden;">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.2rem;">
                    <h3 style="font-size: 1.1rem; color: var(--color-forest-green); margin: 0; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${p.name}</h3>
                    ${isSelected ? '<i class="fa-solid fa-circle-check" style="color: var(--color-forest-green); font-size: 1.1rem;"></i>' : ''}
                  </div>
                  
                  <span style="font-size: 0.85rem; color: var(--color-charcoal-muted); display: block; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">
                    ${p.species} • ${p.breed}
                  </span>
                  <span style="font-size: 0.78rem; font-weight: 700; color: var(--color-soft-coral-hover); display: block; margin-top: 0.25rem;">
                    <i class="fa-solid fa-cake-candles"></i> ${p.age}
                  </span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}

      <div class="wizard-footer-nav">
        <button type="button" class="btn btn-outline" id="step2-back-btn">
          <i class="fa-solid fa-arrow-left"></i>
          <span>Back to Service</span>
        </button>
        
        <button type="button" class="btn btn-teal btn-lg" id="step2-next-btn" ${pets.length === 0 ? 'disabled' : ''}>
          <span>Continue to Veterinarian</span>
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// STEP 3: SELECT VETERINARIAN
// ----------------------------------------------------
function renderStep3Doctor() {
  const isAnySelected = bookingState.veterinarianId === 'any' || bookingState.doctorName.toLowerCase().includes('any available');

  return `
    <div class="profile-card-box animate-fade-up">
      <div class="section-subhead-row" style="margin-bottom: 1.5rem;">
        <div class="section-subhead-title">
          <i class="fa-solid fa-user-doctor" style="color: var(--color-forest-green); font-size: 1.25rem;"></i>
          <h2 style="font-size: 1.35rem; margin: 0;">3. Select Attending Veterinarian</h2>
        </div>
        <span style="font-size: 0.85rem; color: var(--color-charcoal-muted);">Board-certified clinical specialists</span>
      </div>

      <!-- "Any Available Veterinarian" Card -->
      <div class="booking-doctor-card ${isAnySelected ? 'selected' : ''}" data-doctor-id="any" style="margin-bottom: 1.25rem; border: 2px solid ${isAnySelected ? 'var(--color-forest-green)' : 'var(--color-border)'}; background: ${isAnySelected ? 'var(--color-sage-green-soft)' : 'var(--color-warm-cream)'}; cursor: pointer;">
        <div style="width: 58px; height: 58px; border-radius: var(--radius-full); background: var(--color-forest-green); color: var(--color-warm-cream); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; flex-shrink: 0; box-shadow: var(--shadow-sm);">
          <i class="fa-solid fa-user-doctor"></i>
        </div>
        
        <div style="flex-grow: 1;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.2rem;">
            <h3 style="font-size: 1.15rem; color: var(--color-forest-green); margin: 0;">Any Available Veterinarian</h3>
            <span class="section-badge" style="font-size: 0.72rem; padding: 0.2rem 0.65rem; margin: 0; background: var(--color-forest-green); color: var(--color-warm-cream);">
              Auto-Assign
            </span>
          </div>
          <p style="font-size: 0.85rem; color: var(--color-charcoal-muted); margin: 0;">
            PETZY will automatically assign the earliest available specialist for your chosen date and time slot.
          </p>
        </div>
      </div>

      <!-- Specific Veterinarians Grid -->
      <div class="booking-doctors-grid">
        ${siteData.veterinarians.map(v => {
          const isSelected = v.id === bookingState.veterinarianId || v.name === bookingState.doctorName;

          return `
            <div class="booking-doctor-card ${isSelected ? 'selected' : ''}" data-doctor-id="${v.id}" style="cursor: pointer;">
              <img src="${v.image}" alt="${v.name}" class="booking-doctor-avatar">
              
              <div style="flex-grow: 1; overflow: hidden;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.2rem;">
                  <h3 style="font-size: 1.05rem; color: var(--color-forest-green); margin: 0; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${v.name}</h3>
                  ${isSelected ? '<i class="fa-solid fa-circle-check" style="color: var(--color-forest-green); font-size: 1.1rem;"></i>' : ''}
                </div>
                
                <span style="font-size: 0.82rem; color: var(--color-charcoal-muted); display: block; margin-bottom: 0.25rem; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">
                  ${v.title}
                </span>

                <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.78rem;">
                  <span style="background: var(--color-warm-cream); color: var(--color-forest-green); padding: 0.15rem 0.5rem; border-radius: var(--radius-sm); font-weight: 600;">
                    <i class="fa-solid fa-award" style="color: #DEB853;"></i> ${v.experience}
                  </span>
                  <span style="color: var(--color-sage-green-dark); font-weight: 600;">
                    <i class="fa-solid fa-circle" style="font-size: 0.5rem; color: #27AE60;"></i> Available
                  </span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="wizard-footer-nav">
        <button type="button" class="btn btn-outline" id="step3-back-btn">
          <i class="fa-solid fa-arrow-left"></i>
          <span>Back to Pet</span>
        </button>
        
        <button type="button" class="btn btn-teal btn-lg" id="step3-next-btn">
          <span>Continue to Date & Time</span>
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// STEP 4: SELECT DATE & TIME SLOTS
// ----------------------------------------------------
function renderStep4DateTime() {
  const slotAvailability = getAvailableSlotsForDoctorAndDate(
    bookingState.doctorName,
    bookingState.date,
    bookingState.rescheduleId
  );

  return `
    <div class="profile-card-box animate-fade-up">
      <div class="section-subhead-row" style="margin-bottom: 1.5rem;">
        <div class="section-subhead-title">
          <i class="fa-solid fa-calendar-days" style="color: var(--color-forest-green); font-size: 1.25rem;"></i>
          <h2 style="font-size: 1.35rem; margin: 0;">4. Select Date & Time Slot</h2>
        </div>
        <span style="font-size: 0.85rem; color: var(--color-charcoal-muted);">Real-time hospital availability</span>
      </div>

      <div class="booking-datetime-layout">
        <!-- Left: Interactive Calendar Widget -->
        <div class="petzy-calendar-box">
          <div class="calendar-header">
            <button type="button" class="calendar-nav-btn" id="cal-prev-month" aria-label="Previous Month">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <h3 class="calendar-title" style="margin: 0;">
              ${MONTH_NAMES[bookingState.calendarMonth]} ${bookingState.calendarYear}
            </h3>
            <button type="button" class="calendar-nav-btn" id="cal-next-month" aria-label="Next Month">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <div class="calendar-weekdays">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          <div class="calendar-days-grid" id="calendar-days-container">
            ${renderCalendarDays(bookingState.calendarYear, bookingState.calendarMonth, bookingState.date)}
          </div>

          <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--color-border-subtle); display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem; color: var(--color-charcoal-muted);">
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <span style="width: 12px; height: 12px; border-radius: 3px; background: var(--color-soft-coral); display: inline-block;"></span>
              <span>Selected Date</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <span style="width: 12px; height: 12px; border-radius: 3px; border: 1.5px solid var(--color-forest-green); display: inline-block;"></span>
              <span>Today</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              <span style="width: 12px; height: 12px; border-radius: 3px; background: #e0e0e0; display: inline-block;"></span>
              <span>Unavailable</span>
            </div>
          </div>
        </div>

        <!-- Right: Time Slots & Notes -->
        <div class="time-slots-box">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 0.65rem; border-bottom: 1px solid var(--color-border-subtle);">
            <span style="font-size: 0.9rem; font-weight: 700; color: var(--color-forest-green);">
              <i class="fa-solid fa-clock" style="color: var(--color-soft-coral); margin-right: 0.35rem;"></i>
              Available Slots for ${formatDateHuman(bookingState.date)}
            </span>
          </div>

          ${!slotAvailability.hasAvailableSlots ? `
            <div style="background: #FDEDEC; border: 1px solid #F5B7B1; color: #C0392B; padding: 1.25rem; border-radius: var(--radius-md); text-align: center; margin-bottom: 1.25rem;">
              <i class="fa-solid fa-calendar-xmark" style="font-size: 1.75rem; margin-bottom: 0.5rem;"></i>
              <p style="font-weight: 700; margin: 0 0 0.25rem;">No appointments are available for this date.</p>
              <p style="font-size: 0.85rem; margin: 0;">Please choose another date on the calendar.</p>
            </div>
          ` : `
            <!-- Morning Slots -->
            <div class="time-slots-group">
              <div class="time-group-title">
                <i class="fa-solid fa-sun" style="color: #F39C12;"></i>
                <span>Morning</span>
              </div>
              <div class="time-slots-grid">
                ${slotAvailability.morning.map(s => renderTimeSlotButton(s)).join('')}
              </div>
            </div>

            <!-- Afternoon Slots -->
            <div class="time-slots-group">
              <div class="time-group-title">
                <i class="fa-solid fa-cloud-sun" style="color: var(--color-forest-green);"></i>
                <span>Afternoon</span>
              </div>
              <div class="time-slots-grid">
                ${slotAvailability.afternoon.map(s => renderTimeSlotButton(s)).join('')}
              </div>
            </div>

            <!-- Evening Slots -->
            <div class="time-slots-group">
              <div class="time-group-title">
                <i class="fa-solid fa-moon" style="color: var(--color-soft-coral);"></i>
                <span>Evening</span>
              </div>
              <div class="time-slots-grid">
                ${slotAvailability.evening.map(s => renderTimeSlotButton(s)).join('')}
              </div>
            </div>
          `}

          <!-- Clinical Notes / Reason for Visit -->
          <div class="form-group" style="margin-top: 1.25rem; margin-bottom: 0;">
            <label class="form-label" for="booking-notes-input" style="font-size: 0.85rem;">
              Reason for Visit & Symptoms (Optional)
            </label>
            <textarea id="booking-notes-input" class="form-textarea" rows="2" placeholder="e.g. Annual health checkup, vaccine boosters, routine physical, or check mild ear scratching...">${bookingState.notes}</textarea>
          </div>
        </div>

      </div>

      <div class="wizard-footer-nav">
        <button type="button" class="btn btn-outline" id="step4-back-btn">
          <i class="fa-solid fa-arrow-left"></i>
          <span>Back to Veterinarian</span>
        </button>
        
        <button type="button" class="btn btn-teal btn-lg" id="step4-next-btn" ${!slotAvailability.hasAvailableSlots ? 'disabled' : ''}>
          <span>Review Booking Summary</span>
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `;
}

function renderTimeSlotButton(slot) {
  const isSelected = slot.time === bookingState.time;

  if (slot.isBooked) {
    return `
      <button type="button" class="time-slot-pill booked" disabled title="Slot already booked by another patient">
        <span>${slot.time}</span>
      </button>
    `;
  }

  return `
    <button type="button" class="time-slot-pill ${isSelected ? 'selected' : ''}" data-time="${slot.time}">
      <span>${slot.time}</span>
    </button>
  `;
}

function renderCalendarDays(year, month, selectedDateStr) {
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let html = '';

  // Empty leading days
  for (let i = 0; i < firstDayIndex; i++) {
    html += `<div class="calendar-day-cell empty"></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDayDate = new Date(year, month, day);
    currentDayDate.setHours(0, 0, 0, 0);

    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isPast = currentDayDate < today;
    const isToday = currentDayDate.getTime() === today.getTime();
    const isSelected = dateStr === selectedDateStr;

    let cellClass = 'calendar-day-cell';
    if (isPast) cellClass += ' disabled';
    if (isToday) cellClass += ' today';
    if (isSelected) cellClass += ' selected';

    html += `
      <div class="${cellClass}" data-date="${dateStr}">
        ${day}
      </div>
    `;
  }

  return html;
}

// ----------------------------------------------------
// STEP 5: BOOKING SUMMARY & REVIEW
// ----------------------------------------------------
function renderStep5Summary() {
  const assignedDoc = (bookingState.veterinarianId === 'any' || bookingState.doctorName.toLowerCase().includes('any available'))
    ? findAvailableDoctorForSlot(bookingState.date, bookingState.time, bookingState.rescheduleId)
    : { name: bookingState.doctorName, title: bookingState.doctorTitle, image: bookingState.doctorImage };

  return `
    <div class="profile-card-box animate-fade-up" style="max-width: 820px; margin: 0 auto;">
      <div class="section-subhead-row" style="margin-bottom: 1.5rem;">
        <div class="section-subhead-title">
          <i class="fa-solid fa-clipboard-check" style="color: var(--color-forest-green); font-size: 1.35rem;"></i>
          <h2 style="font-size: 1.45rem; margin: 0;">5. Review Appointment Summary</h2>
        </div>
        <span class="section-badge coral" style="margin: 0;">Ready to Confirm</span>
      </div>

      <!-- Spotlight Header with Pet & Doctor -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem; background: var(--color-warm-cream); padding: 1.25rem; border-radius: var(--radius-xl); border: 1px solid var(--color-border);">
        <div style="display: flex; align-items: center; gap: 0.85rem;">
          <img src="${bookingState.petPhoto || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'}" alt="${bookingState.petName}" style="width: 52px; height: 52px; border-radius: var(--radius-md); object-fit: cover; border: 2px solid var(--color-forest-green);">
          <div>
            <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--color-charcoal-light);">Patient</span>
            <h4 style="font-size: 1.1rem; color: var(--color-forest-green); margin: 0;">${bookingState.petName || 'My Pet'}</h4>
            <span style="font-size: 0.82rem; color: var(--color-charcoal-muted);">${bookingState.petSpecies} • ${bookingState.petBreed}</span>
          </div>
        </div>

        <div style="display: flex; align-items: center; gap: 0.85rem;">
          <img src="${assignedDoc.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80'}" alt="${assignedDoc.name}" style="width: 52px; height: 52px; border-radius: var(--radius-full); object-fit: cover; border: 2px solid var(--color-soft-coral);">
          <div>
            <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--color-charcoal-light);">Veterinarian</span>
            <h4 style="font-size: 1.1rem; color: var(--color-forest-green); margin: 0;">${assignedDoc.name}</h4>
            <span style="font-size: 0.82rem; color: var(--color-charcoal-muted);">${assignedDoc.title}</span>
          </div>
        </div>
      </div>

      <!-- Structured Summary Table -->
      <table class="booking-summary-table" aria-label="Appointment Confirmation Summary">
        <tbody>
          ${bookingState.previousAppointmentId ? `
            <tr class="booking-summary-row">
              <td><i class="fa-solid fa-clipboard-check" style="color: var(--color-forest-green); margin-right: 0.4rem;"></i> Appointment Type</td>
              <td><span class="section-badge" style="background: var(--color-sage-green-soft); color: var(--color-forest-green); font-size: 0.8rem; margin: 0;">Follow-Up Visit (Ref #${bookingState.previousAppointmentId})</span></td>
            </tr>
          ` : ''}
          <tr class="booking-summary-row">
            <td><i class="fa-solid fa-stethoscope" style="color: var(--color-forest-green); margin-right: 0.4rem;"></i> Clinical Service</td>
            <td><strong>${bookingState.serviceName}</strong></td>
          </tr>
          <tr class="booking-summary-row">
            <td><i class="fa-solid fa-clock" style="color: var(--color-forest-green); margin-right: 0.4rem;"></i> Estimated Duration</td>
            <td>${bookingState.serviceDuration || '30 Mins'}</td>
          </tr>
          <tr class="booking-summary-row">
            <td><i class="fa-solid fa-calendar" style="color: var(--color-soft-coral); margin-right: 0.4rem;"></i> Appointment Date</td>
            <td><strong>${formatDateHuman(bookingState.date)}</strong></td>
          </tr>
          <tr class="booking-summary-row">
            <td><i class="fa-solid fa-clock-rotate-left" style="color: var(--color-soft-coral); margin-right: 0.4rem;"></i> Scheduled Time</td>
            <td><strong style="color: var(--color-soft-coral-hover); font-size: 1.05rem;">${bookingState.time}</strong></td>
          </tr>
          <tr class="booking-summary-row">
            <td><i class="fa-solid fa-hospital" style="color: var(--color-forest-green); margin-right: 0.4rem;"></i> Hospital Location</td>
            <td>PETZY Central Hospital (${bookingState.serviceRoom || 'Suite 2B'})</td>
          </tr>
          <tr class="booking-summary-row">
            <td><i class="fa-solid fa-receipt" style="color: var(--color-forest-green); margin-right: 0.4rem;"></i> Consultation Fee</td>
            <td><strong style="color: var(--color-forest-green); font-size: 1.15rem;">${bookingState.servicePrice || '$55'}</strong></td>
          </tr>
          ${bookingState.notes ? `
            <tr class="booking-summary-row">
              <td><i class="fa-solid fa-clipboard-question" style="color: var(--color-forest-green); margin-right: 0.4rem;"></i> Clinical Notes</td>
              <td style="font-weight: 500; font-size: 0.88rem; color: var(--color-charcoal);">${bookingState.notes}</td>
            </tr>
          ` : ''}
        </tbody>
      </table>

      <!-- Policy notice -->
      <div style="background: var(--color-sage-green-soft); border-left: 4px solid var(--color-forest-green); padding: 0.85rem 1.15rem; border-radius: var(--radius-md); font-size: 0.85rem; color: var(--color-forest-green); margin-top: 1.25rem;">
        <i class="fa-solid fa-shield-heart" style="margin-right: 0.35rem;"></i>
        <strong>Peace of Mind Guarantee:</strong> Free cancellation and instant rescheduling up to 2 hours prior to scheduled visit.
      </div>

      <div class="wizard-footer-nav">
        <button type="button" class="btn btn-outline btn-lg" id="step5-back-btn">
          <i class="fa-solid fa-arrow-left"></i>
          <span>Back & Edit</span>
        </button>
        
        <button type="button" class="btn btn-coral btn-lg" id="step5-confirm-btn" style="min-width: 240px; justify-content: center;">
          <i class="fa-solid fa-calendar-check"></i>
          <span>${bookingState.rescheduleId ? 'Confirm Reschedule' : (bookingState.previousAppointmentId ? 'Confirm Follow-Up Appointment' : 'Confirm Appointment')}</span>
        </button>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// STEP 6: CONFIRMATION SUCCESS SCREEN / DETAILS PAGE
// ----------------------------------------------------
function renderStep6Confirmed() {
  const appt = confirmedAppointment || {
    id: generateAppointmentId(),
    serviceName: 'Veterinary Consultation',
    serviceIcon: 'fa-stethoscope',
    duration: '30 Mins',
    price: '$55',
    petName: 'My Pet',
    petSpecies: 'Pet',
    petPhoto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    veterinarianName: 'Dr. Sarah Kapoor',
    veterinarianTitle: 'Chief Veterinary Officer',
    veterinarianImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    date: '2026-09-15',
    time: '10:30 AM',
    room: 'Consultation Suite 2B',
    status: 'Confirmed',
    isRescheduled: false,
    isFollowUp: false,
    previousAppointmentId: null
  };

  return `
    <div class="booking-confirmed-card animate-fade-up" style="max-width: 780px; margin: 0 auto; background: var(--color-warm-white); border-radius: var(--radius-2xl); padding: 2.5rem 2rem; border: 1px solid var(--color-border); box-shadow: var(--shadow-md); text-align: center;">
      <!-- Animated Checkmark Icon -->
      <div class="checkmark-circle-wrap" style="margin-bottom: 1.25rem;">
        <svg class="checkmark-svg" viewBox="0 0 52 52">
          <polyline points="14 27 22 35 38 19"/>
        </svg>
      </div>

      <div class="section-badge" style="margin-bottom: 0.5rem; background: var(--color-sage-green-soft); color: var(--color-forest-green);">
        <i class="fa-solid fa-circle-check"></i>
        <span>${appt.isRescheduled ? 'Appointment Rescheduled' : (appt.isFollowUp ? 'Follow-Up Visit Confirmed ✓' : 'Appointment Confirmed ✓')}</span>
      </div>

      <h2 style="font-size: 2.2rem; color: var(--color-forest-green); margin-bottom: 0.4rem;">
        ${appt.isRescheduled ? 'Your Appointment Has Been Rescheduled!' : (appt.isFollowUp ? 'Follow-Up Visit Successfully Confirmed!' : 'Appointment Confirmed ✓')}
      </h2>
      <p style="font-size: 1rem; color: var(--color-charcoal-muted); margin-bottom: 1.5rem; max-width: 540px; margin-left: auto; margin-right: auto;">
        ${appt.isFollowUp 
          ? `Your follow-up visit for <strong>${appt.petName}</strong> has been successfully booked with <strong>${appt.veterinarianName}</strong>.` 
          : `Your veterinary visit for <strong>${appt.petName}</strong> has been successfully confirmed. We look forward to welcoming you at PETZY Central Hospital.`}
      </p>

      <div class="appointment-id-pill" style="margin-bottom: 1.75rem;">
        <span>Appointment ID:</span>
        <strong id="confirmed-appt-id">${appt.id}</strong>
        ${appt.isFollowUp ? `<span style="font-size: 0.8rem; color: var(--color-forest-green); margin-left: 0.5rem;">(Follow-Up for #${appt.previousAppointmentId})</span>` : ''}
      </div>

      <!-- Visit Overview Box -->
      <div style="background: var(--color-warm-cream); border-radius: var(--radius-xl); border: 1px solid var(--color-border); padding: 1.5rem; text-align: left; margin-bottom: 2rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem;">
          
          <!-- Service -->
          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--color-forest-green); color: var(--color-warm-cream); display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0;">
              <i class="${appt.serviceIcon || 'fa-solid fa-stethoscope'}"></i>
            </div>
            <div>
              <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--color-charcoal-light);">Service</span>
              <h4 style="font-size: 1rem; color: var(--color-forest-green); margin: 0.15rem 0 0;">${appt.serviceName}</h4>
              <span style="font-size: 0.8rem; color: var(--color-charcoal-muted);">${appt.duration || '30 Mins'} • ${appt.price || '$55'}</span>
            </div>
          </div>

          <!-- Patient -->
          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <img src="${appt.petPhoto || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'}" alt="${appt.petName}" style="width: 44px; height: 44px; border-radius: var(--radius-md); object-fit: cover; border: 2px solid var(--color-forest-green); flex-shrink: 0;">
            <div>
              <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--color-charcoal-light);">Patient</span>
              <h4 style="font-size: 1rem; color: var(--color-forest-green); margin: 0.15rem 0 0;">${appt.petName}</h4>
              <span style="font-size: 0.8rem; color: var(--color-charcoal-muted);">${appt.petSpecies || 'Pet'}</span>
            </div>
          </div>

          <!-- Attending Doctor -->
          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <img src="${appt.veterinarianImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80'}" alt="${appt.veterinarianName}" style="width: 44px; height: 44px; border-radius: var(--radius-full); object-fit: cover; border: 2px solid var(--color-soft-coral); flex-shrink: 0;">
            <div>
              <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--color-charcoal-light);">Veterinarian</span>
              <h4 style="font-size: 1rem; color: var(--color-forest-green); margin: 0.15rem 0 0;">${appt.veterinarianName}</h4>
              <span style="font-size: 0.8rem; color: var(--color-charcoal-muted);">${appt.veterinarianTitle || 'Attending Specialist'}</span>
            </div>
          </div>

          <!-- Date & Time -->
          <div style="display: flex; gap: 0.75rem; align-items: center;">
            <div style="width: 44px; height: 44px; border-radius: var(--radius-md); background: var(--color-soft-coral); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; flex-shrink: 0;">
              <i class="fa-solid fa-calendar-check"></i>
            </div>
            <div>
              <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--color-charcoal-light);">Schedule</span>
              <h4 style="font-size: 1rem; color: var(--color-forest-green); margin: 0.15rem 0 0;">${formatDateHuman(appt.date)}</h4>
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-soft-coral-hover);">${appt.time}</span>
            </div>
          </div>

        </div>

        <!-- Status & Location Row -->
        <div style="margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--color-border-subtle); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; font-size: 0.85rem;">
          <div>
            <span style="color: var(--color-charcoal-muted);"><i class="fa-solid fa-location-dot" style="color: var(--color-forest-green); margin-right: 0.35rem;"></i> Hospital:</span>
            <strong style="color: var(--color-forest-green);">PETZY Central Hospital (${appt.room || 'Suite 2B'})</strong>
          </div>
          <div>
            <span style="color: var(--color-charcoal-muted);"><i class="fa-solid fa-circle-check" style="color: #27AE60; margin-right: 0.35rem;"></i> Status:</span>
            <span class="status-pill status-upcoming" style="padding: 0.2rem 0.65rem; font-size: 0.78rem;">${appt.status || 'Confirmed'}</span>
          </div>
        </div>
      </div>

      <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap;">
        <a href="#/dashboard?tab=appointments" class="btn btn-teal btn-lg" id="confirmed-view-appointments-btn">
          <i class="fa-solid fa-calendar-days"></i>
          <span>View My Appointments</span>
        </a>
        <a href="#/dashboard" class="btn btn-outline btn-lg" id="confirmed-back-dashboard-btn">
          <i class="fa-solid fa-table-columns"></i>
          <span>Back to Dashboard</span>
        </a>
        <button type="button" class="btn btn-coral btn-lg" id="confirmed-book-another-btn">
          <i class="fa-solid fa-calendar-plus"></i>
          <span>Book Another Appointment</span>
        </button>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// EVENT LISTENERS & LIFECYCLE
// ----------------------------------------------------
export function setupScheduleAppointmentEvents() {
  const user = getCurrentUser();
  if (!user) return;

  const pets = getUserPets(user.id);

  // Helper to re-render wizard
  const refreshWizard = () => {
    const root = document.getElementById('app-root');
    if (root) {
      root.innerHTML = renderScheduleAppointment();
      setupScheduleAppointmentEvents();
    }
  };

  // Step Bar direct navigation (to completed or current step)
  document.querySelectorAll('.booking-step-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.getAttribute('data-step-target'), 10);
      if (target && target <= bookingState.currentStep) {
        bookingState.currentStep = target;
        refreshWizard();
      }
    });
  });

  // ----------------------------------------------------
  // STEP 1 EVENTS (Service Selection)
  // ----------------------------------------------------
  document.querySelectorAll('.booking-service-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const srvId = card.getAttribute('data-service-id');
      const found = getServiceById(srvId);
      if (found) {
        applyServiceToState(found);
        if (typeof history !== 'undefined' && history.replaceState) {
          const followUpParam = bookingState.previousAppointmentId ? `&followUpId=${bookingState.previousAppointmentId}` : '';
          history.replaceState(null, '', `#/book-appointment?service=${found.id}${followUpParam}`);
          lastParsedHash = window.location.hash || '';
        }
        // Re-render Step 1 showing active selection without advancing
        refreshWizard();
      }
    });
  });

  document.getElementById('step1-next-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (!bookingState.serviceId) {
      showToast('Please select a clinical or wellness service first.', 'coral', 'fa-solid fa-stethoscope');
      return;
    }
    bookingState.currentStep = 2;
    refreshWizard();
  });

  // ----------------------------------------------------
  // STEP 2 EVENTS (Pet Selection)
  // ----------------------------------------------------
  document.querySelectorAll('.booking-pet-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const pId = card.getAttribute('data-pet-id');
      const found = pets.find(p => p.id === pId);
      if (found) {
        bookingState.petId = found.id;
        bookingState.petName = found.name;
        bookingState.petSpecies = found.species;
        bookingState.petBreed = found.breed;
        bookingState.petPhoto = found.photo;

        if (typeof history !== 'undefined' && history.replaceState) {
          const followUpParam = bookingState.previousAppointmentId ? `&followUpId=${bookingState.previousAppointmentId}` : '';
          history.replaceState(null, '', `#/book-appointment?service=${bookingState.serviceId}&petId=${found.id}${followUpParam}`);
          lastParsedHash = window.location.hash || '';
        }

        // Show selection without auto-advancing to next page
        refreshWizard();
      }
    });
  });

  document.getElementById('step2-change-service-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    bookingState.currentStep = 1;
    refreshWizard();
  });

  document.getElementById('step2-back-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    bookingState.currentStep = 1;
    refreshWizard();
  });

  document.getElementById('step2-next-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (bookingState.petId) {
      bookingState.currentStep = 3;
      refreshWizard();
    } else {
      showToast('Please select a pet to continue.', 'coral', 'fa-solid fa-paw');
    }
  });

  const handleAddPetModal = () => {
    openPetModal(null, (newPet) => {
      if (newPet) {
        bookingState.petId = newPet.id;
        bookingState.petName = newPet.name;
        bookingState.petSpecies = newPet.species;
        bookingState.petBreed = newPet.breed;
        bookingState.petPhoto = newPet.photo;
        showToast(`${newPet.name} added to your account!`, 'sage', 'fa-solid fa-paw');
      }
      refreshWizard();
    });
  };

  document.getElementById('booking-add-pet-btn')?.addEventListener('click', handleAddPetModal);
  document.getElementById('empty-state-add-pet-btn')?.addEventListener('click', handleAddPetModal);

  // ----------------------------------------------------
  // STEP 3 EVENTS (Doctor Selection)
  // ----------------------------------------------------
  document.querySelectorAll('.booking-doctor-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const docId = card.getAttribute('data-doctor-id');
      if (docId === 'any') {
        bookingState.veterinarianId = 'any';
        bookingState.doctorName = 'Any Available Veterinarian';
        bookingState.doctorTitle = 'Assigned based on schedule';
        bookingState.doctorImage = '';
      } else {
        const found = getDoctorById(docId);
        if (found) {
          bookingState.veterinarianId = found.id;
          bookingState.doctorName = found.name;
          bookingState.doctorTitle = found.title;
          bookingState.doctorImage = found.image;
        }
      }

      // Show selection without auto-advancing to next page
      refreshWizard();
    });
  });

  document.getElementById('step3-back-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    bookingState.currentStep = 2;
    refreshWizard();
  });

  document.getElementById('step3-next-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    bookingState.currentStep = 4;
    refreshWizard();
  });

  // ----------------------------------------------------
  // STEP 4 EVENTS (Date & Time Selection + Calendar Navigation)
  // ----------------------------------------------------
  document.getElementById('cal-prev-month')?.addEventListener('click', () => {
    if (bookingState.calendarMonth === 0) {
      bookingState.calendarMonth = 11;
      bookingState.calendarYear -= 1;
    } else {
      bookingState.calendarMonth -= 1;
    }
    refreshWizard();
  });

  document.getElementById('cal-next-month')?.addEventListener('click', () => {
    if (bookingState.calendarMonth === 11) {
      bookingState.calendarMonth = 0;
      bookingState.calendarYear += 1;
    } else {
      bookingState.calendarMonth += 1;
    }
    refreshWizard();
  });

  // Calendar Day Selection
  document.querySelectorAll('.calendar-day-cell:not(.disabled):not(.empty)').forEach(cell => {
    cell.addEventListener('click', () => {
      const d = cell.getAttribute('data-date');
      if (d) {
        bookingState.date = d;
        refreshWizard();
      }
    });
  });

  // Time Slot Selection
  document.querySelectorAll('.time-slot-pill:not(.booked)').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.getAttribute('data-time');
      if (t) {
        bookingState.time = t;
        document.querySelectorAll('.time-slot-pill').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        
        // Enable next button if disabled
        const nextBtn = document.getElementById('step4-next-btn');
        if (nextBtn) nextBtn.removeAttribute('disabled');
      }
    });
  });

  // Clinical Notes input sync
  document.getElementById('booking-notes-input')?.addEventListener('input', (e) => {
    bookingState.notes = e.target.value;
  });

  document.getElementById('step4-back-btn')?.addEventListener('click', () => {
    bookingState.currentStep = 3;
    refreshWizard();
  });

  document.getElementById('step4-next-btn')?.addEventListener('click', () => {
    if (!bookingState.date) {
      showToast('Please pick a date on the calendar.', 'coral', 'fa-solid fa-calendar');
      return;
    }
    if (!bookingState.time) {
      showToast('Please select an available time slot.', 'coral', 'fa-solid fa-clock');
      return;
    }
    bookingState.currentStep = 5;
    refreshWizard();
  });

  // ----------------------------------------------------
  // STEP 5 EVENTS (Summary Confirmation)
  // ----------------------------------------------------
  document.getElementById('step5-back-btn')?.addEventListener('click', () => {
    bookingState.currentStep = 4;
    refreshWizard();
  });

  document.getElementById('step5-confirm-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const confirmBtn = document.getElementById('step5-confirm-btn');
    if (confirmBtn) {
      if (confirmBtn.disabled) return;
      confirmBtn.disabled = true;
      confirmBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Confirming Appointment...</span>';
    }

    try {
      // Resolve doctor if "Any"
      let finalDocName = bookingState.doctorName;
      let finalDocTitle = bookingState.doctorTitle;
      let finalDocImage = bookingState.doctorImage;
      let finalDocId = bookingState.veterinarianId;

      if (bookingState.veterinarianId === 'any' || finalDocName.toLowerCase().includes('any available')) {
        const autoAssigned = findAvailableDoctorForSlot(bookingState.date, bookingState.time, bookingState.rescheduleId);
        finalDocName = autoAssigned.name;
        finalDocTitle = autoAssigned.title;
        finalDocImage = autoAssigned.image;
        finalDocId = autoAssigned.id;
      }

      const apptPayload = {
        petId: bookingState.petId,
        petName: bookingState.petName,
        petPhoto: bookingState.petPhoto,
        species: bookingState.petSpecies,
        serviceId: bookingState.serviceId,
        service: bookingState.serviceName,
        duration: bookingState.serviceDuration,
        price: bookingState.servicePrice,
        veterinarianId: finalDocId,
        veterinarian: finalDocName,
        vetTitle: finalDocTitle,
        vetImage: finalDocImage,
        date: bookingState.date,
        time: bookingState.time,
        room: bookingState.serviceRoom || 'Consultation Suite 2B',
        notes: bookingState.notes || 'Routine examination and wellness consultation.',
        status: 'Confirmed',
        appointmentType: bookingState.previousAppointmentId ? 'Follow-Up' : 'Standard',
        previousAppointmentId: bookingState.previousAppointmentId || null,
        diagnosisSummary: bookingState.previousAppointmentId 
          ? `Follow-up consultation for previous visit #${bookingState.previousAppointmentId}.` 
          : 'Scheduled visit. Awaiting clinical examination.'
      };

      let saved;
      if (bookingState.rescheduleId) {
        saved = rescheduleUserAppointment(user.id, bookingState.rescheduleId, {
          date: bookingState.date,
          time: bookingState.time,
          notes: bookingState.notes
        });
        if (!saved) {
          saved = saveUserAppointment(user.id, { ...apptPayload, id: bookingState.rescheduleId, status: 'Rescheduled' });
        }
        showToast(`Appointment #${bookingState.rescheduleId} rescheduled successfully!`, 'sage', 'fa-solid fa-calendar-check');
      } else {
        saved = saveUserAppointment(user.id, apptPayload);
        const toastMsg = bookingState.previousAppointmentId
          ? `Follow-up visit confirmed for ${bookingState.petName} on ${bookingState.date}!`
          : `Appointment confirmed for ${bookingState.petName} on ${bookingState.date}!`;
        showToast(toastMsg, 'sage', 'fa-solid fa-calendar-check');
      }

      if (!saved) {
        throw new Error('Could not save appointment in storage.');
      }

      // Store confirmed appointment details for Confirmation View
      confirmedAppointment = {
        id: saved.id || generateAppointmentId(),
        serviceId: bookingState.serviceId,
        serviceName: bookingState.serviceName,
        serviceIcon: bookingState.serviceIcon,
        serviceImage: bookingState.serviceImage,
        petId: bookingState.petId,
        petName: bookingState.petName,
        petSpecies: bookingState.petSpecies,
        petBreed: bookingState.petBreed,
        petPhoto: bookingState.petPhoto,
        veterinarianId: finalDocId,
        veterinarianName: finalDocName,
        veterinarianTitle: finalDocTitle,
        veterinarianImage: finalDocImage,
        date: bookingState.date,
        time: bookingState.time,
        duration: bookingState.serviceDuration,
        price: bookingState.servicePrice,
        room: bookingState.serviceRoom,
        status: saved.status || 'Confirmed',
        isRescheduled: !!bookingState.rescheduleId,
        isFollowUp: !!bookingState.previousAppointmentId,
        previousAppointmentId: bookingState.previousAppointmentId || null
      };

      // Reset temporary booking wizard state
      bookingState = getInitialBookingState();

      // Clean URL query hash so refresh won't conflict
      if (typeof history !== 'undefined' && history.replaceState) {
        history.replaceState(null, '', '#/book-appointment');
        lastParsedHash = window.location.hash || '';
      }

      // Render Confirmation Page
      refreshWizard();
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
      console.error('Booking confirmation error:', err);
      showToast('Unable to confirm your appointment. Please try again.', 'coral', 'fa-solid fa-circle-exclamation');
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = '<i class="fa-solid fa-calendar-check"></i> <span>Confirm Appointment</span>';
      }
    }
  });

  // ----------------------------------------------------
  // STEP 6 EVENTS (Confirmation Screen Actions)
  // ----------------------------------------------------
  document.getElementById('confirmed-view-appointments-btn')?.addEventListener('click', () => {
    confirmedAppointment = null;
    bookingState = getInitialBookingState();
  });

  document.getElementById('confirmed-back-dashboard-btn')?.addEventListener('click', () => {
    confirmedAppointment = null;
    bookingState = getInitialBookingState();
  });

  document.getElementById('confirmed-book-another-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    confirmedAppointment = null;
    bookingState = getInitialBookingState();
    bookingState.currentStep = 1;
    if (typeof history !== 'undefined' && history.replaceState) {
      history.replaceState(null, '', '#/book-appointment');
      lastParsedHash = '#/book-appointment';
    }
    refreshWizard();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function formatDateHuman(dateStr) {
  if (!dateStr) return '';
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
}
