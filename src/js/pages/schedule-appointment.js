/* PETZY Multi-Step Appointment Booking & Payment System (Milestone 4) */
import { getCurrentUser } from '../services/auth.js';
import {
  getUserPets,
  getUserPetById,
  saveUserAppointment,
  rescheduleUserAppointment,
  getUserAppointmentById,
  getAvailableSlotsForDoctorAndDate,
  findAvailableDoctorForSlot,
  generateAppointmentId,
  generatePaymentId,
  generateTransactionId,
  createPaymentRecord,
  getStoredServices,
  getServiceById,
  getActiveServices,
  getStoredVeterinarians,
  getDoctorById,
  getActiveVeterinarians,
  getDoctorAvailability
} from '../services/storage.js';
import { siteData } from '../data.js';
import { renderBackButton } from '../components/back-button.js';
import { openPetModal } from '../components/pet-modal.js';
import { openAppointmentModal } from '../components/appointment-modal.js';
import { openPaymentReceiptModal } from '../components/payment-receipt-modal.js';
import { showToast } from '../components/toast.js';

// Helper for initial default state
function getInitialBookingState() {
  const tomorrow = new Date(Date.now() + 86400000);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const allServices = getActiveServices();
  const defaultSrv = allServices[0] || siteData.services[0];

  return {
    currentStep: 1, // 1: Service, 2: Pet, 3: Doctor, 4: Date & Time, 5: Summary, 6: Payment Checkout
    appointmentId: null,
    rescheduleId: null,
    previousAppointmentId: null,
    appointmentType: 'Standard',
    serviceId: defaultSrv ? defaultSrv.id : 'consultation',
    serviceName: defaultSrv ? defaultSrv.title : 'Veterinary Consultation',
    serviceDuration: defaultSrv ? defaultSrv.duration : '30 Mins',
    servicePrice: defaultSrv ? defaultSrv.price : '$55',
    serviceRoom: defaultSrv ? defaultSrv.room : 'Consultation Suite 2B',
    serviceIcon: defaultSrv ? defaultSrv.icon : 'fa-solid fa-stethoscope',
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
    calendarYear: tomorrow.getFullYear(),
    // Payment info (Live PayPal Integration)
    paymentMethod: 'paypal',
    paypalEmail: 'rakeshsingh8319@gmail.com',
    cardNumber: '4242 •••• •••• 4242',
    cardExpiry: '12/28',
    cardCvv: '883',
    cardholderName: ''
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

export function resetBookingState() {
  confirmedAppointment = null;
  bookingState = getInitialBookingState();
  bookingState.currentStep = 1;
  lastParsedHash = '';
}

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

  const pets = getUserPets(user.id);

  // Sync state with URL parameters (detect fresh booking, follow-up, reschedule, or paypal return)
  syncStateFromUrl(user, pets);

  // If a booking was just confirmed (and user has not navigated to start a new booking), render confirmation
  if (confirmedAppointment) {
    return `
      <div class="container pet-profile-page-wrapper animate-fade-up" style="max-width: 1060px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem;">
          ${renderBackButton('#/dashboard')}
        </div>
        ${renderStep7Confirmed()}
      </div>
    `;
  }

  // Default date setup if empty
  if (!bookingState.date) {
    const tom = new Date(Date.now() + 86400000);
    bookingState.date = tom.toISOString().split('T')[0];
    bookingState.calendarMonth = tom.getMonth();
    bookingState.calendarYear = tom.getFullYear();
  }

  // Default cardholder name
  if (!bookingState.cardholderName && user) {
    bookingState.cardholderName = user.name || 'Samantha Hayes';
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
          <span>${bookingState.previousAppointmentId ? 'Follow-Up Visit Booking' : 'Patient Appointment & Checkout'}</span>
        </div>
        <h1 style="font-size: 2.2rem; color: var(--color-forest-green); margin-bottom: 0.35rem;">
          ${bookingState.rescheduleId ? 'Reschedule Your Appointment' : (bookingState.previousAppointmentId ? 'Book Follow-Up Visit' : 'Book a Veterinary Appointment')}
        </h1>
        <p style="font-size: 1rem; color: var(--color-charcoal-muted); margin: 0;">
          ${bookingState.previousAppointmentId 
            ? `We've pre-selected <strong>${bookingState.petName || 'your pet'}</strong> and <strong>${bookingState.serviceName}</strong> from your previous visit. You can modify any choices or pick a new date & time.` 
            : 'Select your clinical service, choose your registered pet and preferred veterinarian, pick an open date & time slot, and securely confirm with online checkout.'}
        </p>
      </div>

      <!-- 6-Step Progress Bar -->
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

  // Case: User returned from PayPal after completing payment
  const paypalSuccess = params.get('paypal_success') || (typeof window !== 'undefined' && window.location.search && new URLSearchParams(window.location.search).get('paypal_success'));
  const paypalCancel = params.get('paypal_cancel') || (typeof window !== 'undefined' && window.location.search && new URLSearchParams(window.location.search).get('paypal_cancel'));

  if (paypalCancel) {
    showToast('PayPal checkout was cancelled. You can review and complete your booking anytime.', 'coral', 'fa-solid fa-circle-info');
    if (typeof history !== 'undefined' && history.replaceState) {
      history.replaceState(null, '', '#/book-appointment');
    }
    lastParsedHash = '#/book-appointment';
  }

  if (paypalSuccess) {
    handlePayPalReturnSuccess(user, params);
    lastParsedHash = hash;
    return;
  }

  // Case A: User is rescheduling an existing appointment
  if (reschedParam) {
    confirmedAppointment = null;
    if (bookingState.rescheduleId !== reschedParam) {
      const existing = getUserAppointmentById(user.id, reschedParam);
      if (existing) {
        bookingState = getInitialBookingState();
        bookingState.rescheduleId = reschedParam;
        bookingState.previousAppointmentId = null;
        bookingState.appointmentType = 'Reschedule';
        bookingState.serviceName = existing.service;
        
        const matchedSrv = getServiceById(existing.serviceId || existing.service);
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
        
        const matchedDoc = getDoctorById(existing.veterinarianId || existing.veterinarian);
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
    confirmedAppointment = null;
    if (bookingState.previousAppointmentId !== followUpParam) {
      const prev = getUserAppointmentById(user.id, followUpParam);
      if (prev) {
        bookingState = getInitialBookingState();
        bookingState.previousAppointmentId = prev.id;
        bookingState.appointmentType = 'Follow-Up';
        bookingState.rescheduleId = null;

        // Pre-select previous service
        const matchedSrv = getServiceById(prev.serviceId || prev.service);
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
        const matchedDoc = getDoctorById(prev.veterinarianId || prev.veterinarian);
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
  confirmedAppointment = null;
  if (hash !== lastParsedHash || bookingState.rescheduleId !== null || bookingState.previousAppointmentId !== null) {
    const srvParam = params.get('service') || params.get('serviceId');
    const docParam = params.get('doctor') || params.get('doctorId');
    const petParam = params.get('petId');

    // Fresh reset to step 1
    bookingState = getInitialBookingState();
    bookingState.currentStep = 1;

    if (srvParam) {
      const foundSrv = getServiceById(srvParam);
      if (foundSrv) {
        applyServiceToState(foundSrv);
      }
    }

    if (docParam) {
      const foundDoc = getDoctorById(docParam);
      if (foundDoc) {
        bookingState.veterinarianId = foundDoc.id;
        bookingState.doctorName = foundDoc.name;
        bookingState.doctorTitle = foundDoc.title;
        bookingState.doctorImage = foundDoc.image;
      }
    }

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
  bookingState.serviceRoom = srv.room || 'Consultation Suite 2B';
  bookingState.serviceIcon = srv.icon || 'fa-solid fa-stethoscope';
  bookingState.serviceImage = srv.image || '';
}

// ----------------------------------------------------
// PROGRESS BAR COMPONENT (6 Steps)
// ----------------------------------------------------
function renderProgressBar(currentStep) {
  const steps = [
    { num: 1, label: 'Service', icon: 'fa-stethoscope' },
    { num: 2, label: 'Pet', icon: 'fa-paw' },
    { num: 3, label: 'Veterinarian', icon: 'fa-user-doctor' },
    { num: 4, label: 'Date & Time', icon: 'fa-calendar-days' },
    { num: 5, label: 'Summary', icon: 'fa-clipboard-check' },
    { num: 6, label: 'Payment', icon: 'fa-credit-card' }
  ];

  const fillPercent = ((currentStep - 1) / (steps.length - 1)) * 100;

  return `
    <div class="booking-progress-bar" aria-label="Appointment Booking Progress">
      <div class="booking-progress-track"></div>
      <div class="booking-progress-fill" style="width: calc(${fillPercent}% * 0.92);"></div>

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
    case 6:
      return renderStep6Payment(user);
    default:
      return renderStep1Service();
  }
}

// ----------------------------------------------------
// STEP 1: SELECT SERVICE (Dynamic from Storage)
// ----------------------------------------------------
function renderStep1Service() {
  const services = getActiveServices();

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
        ${services.map(srv => {
          const isSelected = srv.id === bookingState.serviceId;

          return `
            <div class="booking-service-card ${isSelected ? 'selected' : ''}" data-service-id="${srv.id}" style="cursor: pointer;">
              <img src="${srv.image}" alt="${srv.title}" class="booking-service-thumb" loading="lazy">
              
              <div class="booking-service-body">
                <div>
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.4rem;">
                    <span class="section-badge" style="font-size: 0.72rem; padding: 0.2rem 0.6rem; margin: 0;">
                      <i class="${srv.icon || 'fa-solid fa-stethoscope'}"></i>
                      <span>${srv.badge || srv.category || 'Clinical Care'}</span>
                    </span>
                    <span class="booking-service-duration">
                      <i class="fa-solid fa-clock"></i> ${srv.duration || '30 Mins'}
                    </span>
                  </div>

                  <h3 style="font-size: 1.1rem; color: var(--color-forest-green); margin: 0.4rem 0 0.35rem;">${srv.title}</h3>
                  <p style="font-size: 0.85rem; color: var(--color-charcoal-muted); line-height: 1.45; margin: 0 0 0.75rem;">
                    ${srv.shortDesc || srv.description}
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
  const hasPets = pets && pets.length > 0;

  return `
    <div class="profile-card-box animate-fade-up">
      <div class="section-subhead-row" style="margin-bottom: 1.5rem;">
        <div class="section-subhead-title">
          <i class="fa-solid fa-paw" style="color: var(--color-forest-green); font-size: 1.25rem;"></i>
          <h2 style="font-size: 1.35rem; margin: 0;">2. Select Companion Pet</h2>
        </div>
        
        <button type="button" class="btn btn-outline" id="booking-add-pet-btn" style="padding: 0.4rem 0.95rem; font-size: 0.85rem;">
          <i class="fa-solid fa-plus"></i>
          <span>Add New Pet</span>
        </button>
      </div>

      <!-- Selected Service Summary Pill -->
      <div class="booking-selected-service-banner">
        <div style="display: flex; align-items: center; gap: 0.85rem;">
          <img src="${bookingState.serviceImage || 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=800&q=80'}" alt="${bookingState.serviceName}" class="banner-service-thumb">
          <div>
            <span style="font-size: 0.75rem; text-transform: uppercase; font-weight: 700; color: var(--color-charcoal-light);">Selected Service</span>
            <h4 style="font-size: 1.05rem; color: var(--color-forest-green); margin: 0;">${bookingState.serviceName}</h4>
            <span style="font-size: 0.8rem; color: var(--color-charcoal-muted);">${bookingState.serviceDuration} • <strong style="color: var(--color-forest-green);">${bookingState.servicePrice}</strong></span>
          </div>
        </div>
        <button type="button" class="btn btn-outline" id="step2-change-service-btn" style="font-size: 0.8rem; padding: 0.35rem 0.75rem;">
          <span>Change Service</span>
        </button>
      </div>

      ${hasPets ? `
        <div class="booking-pets-grid">
          ${pets.map(pet => {
            const isSelected = pet.id === bookingState.petId;
            return `
              <div class="booking-pet-card ${isSelected ? 'selected' : ''}" data-pet-id="${pet.id}" style="cursor: pointer;">
                <img src="${pet.photo || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'}" alt="${pet.name}" class="booking-pet-avatar">
                
                <div style="flex-grow: 1;">
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.25rem;">
                    <h3 style="font-size: 1.15rem; color: var(--color-forest-green); margin: 0;">${pet.name}</h3>
                    ${isSelected ? '<span class="pet-selected-check"><i class="fa-solid fa-check"></i></span>' : ''}
                  </div>
                  
                  <div style="font-size: 0.85rem; color: var(--color-charcoal-muted); margin-bottom: 0.35rem;">
                    <strong>${pet.species}</strong> • ${pet.breed}
                  </div>
                  
                  <div style="font-size: 0.8rem; color: var(--color-charcoal-light);">
                    ${pet.age || 'Adult'} • ${pet.gender || 'Companion'}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <div class="booking-empty-pets-box" style="text-align: center; padding: 3rem 1.5rem; background: var(--color-warm-cream); border-radius: var(--radius-xl); border: 2px dashed var(--color-border);">
          <i class="fa-solid fa-paw" style="font-size: 2.5rem; color: var(--color-forest-green); margin-bottom: 1rem;"></i>
          <h3 style="color: var(--color-forest-green); margin-bottom: 0.5rem;">No Pets Registered Yet</h3>
          <p style="color: var(--color-charcoal-muted); font-size: 0.92rem; margin-bottom: 1.5rem;">Please register your companion pet to proceed with scheduling.</p>
          <button type="button" class="btn btn-teal" id="empty-state-add-pet-btn">
            <i class="fa-solid fa-plus"></i>
            <span>Add Your First Pet</span>
          </button>
        </div>
      `}

      <div class="wizard-footer-nav">
        <button type="button" class="btn btn-outline" id="step2-back-btn">
          <i class="fa-solid fa-arrow-left"></i>
          <span>Back to Services</span>
        </button>
        
        <button type="button" class="btn btn-teal btn-lg" id="step2-next-btn" ${!bookingState.petId ? 'disabled' : ''}>
          <span>Continue to Veterinarian</span>
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// STEP 3: SELECT VETERINARIAN (Dynamic from Storage)
// ----------------------------------------------------
function renderStep3Doctor() {
  const veterinarians = getActiveVeterinarians();
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
        ${veterinarians.map(v => {
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
                    <i class="fa-solid fa-award" style="color: #DEB853;"></i> ${v.experience || '5+ Years'}
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
// STEP 4: SELECT DATE & TIME SLOTS (Availability Aware)
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

          <div class="calendar-weekdays-row">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          <div class="calendar-days-grid" id="calendar-days-container">
            ${renderCalendarDaysGrid(bookingState.calendarYear, bookingState.calendarMonth, bookingState.date)}
          </div>

          <div class="calendar-legend-row" style="margin-top: 1rem; display: flex; gap: 1rem; justify-content: center; font-size: 0.78rem; color: var(--color-charcoal-muted);">
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background: var(--color-forest-green);"></span>
              <span>Selected</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background: #27AE60;"></span>
              <span>Available</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.35rem;">
              <span style="width: 10px; height: 10px; border-radius: 50%; background: #ccc;"></span>
              <span>Past / Blocked</span>
            </div>
          </div>
        </div>

        <!-- Right: Time Slots & Notes -->
        <div class="petzy-slots-box">
          <div style="margin-bottom: 1.25rem;">
            <span style="font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: var(--color-charcoal-light);">Selected Date</span>
            <h4 style="font-size: 1.2rem; color: var(--color-forest-green); margin: 0.2rem 0 0;">
              <i class="fa-solid fa-calendar-check" style="color: var(--color-soft-coral); margin-right: 0.4rem;"></i>
              ${formatDateHuman(bookingState.date)}
            </h4>
          </div>

          ${!slotAvailability.isDoctorWorkingDay ? `
            <div style="background: var(--color-soft-coral-soft); border-left: 4px solid var(--color-soft-coral); padding: 0.85rem 1rem; border-radius: var(--radius-md); font-size: 0.85rem; color: var(--color-charcoal); margin-bottom: 1.25rem;">
              <i class="fa-solid fa-circle-exclamation" style="color: var(--color-soft-coral); margin-right: 0.35rem;"></i>
              <strong>Doctor Off Duty:</strong> ${bookingState.doctorName} does not have scheduled clinical hours on this day. Please select another day or choose "Any Available Veterinarian".
            </div>
          ` : slotAvailability.isDateBlocked ? `
            <div style="background: var(--color-soft-coral-soft); border-left: 4px solid var(--color-soft-coral); padding: 0.85rem 1rem; border-radius: var(--radius-md); font-size: 0.85rem; color: var(--color-charcoal); margin-bottom: 1.25rem;">
              <i class="fa-solid fa-calendar-xmark" style="color: var(--color-soft-coral); margin-right: 0.35rem;"></i>
              <strong>Doctor Unavailable:</strong> ${bookingState.doctorName} is on leave on this date (${slotAvailability.blockedReason}).
            </div>
          ` : ''}

          <!-- Morning Slots -->
          <div class="time-period-section">
            <h4 class="time-period-title">
              <i class="fa-solid fa-sun" style="color: #F5A623;"></i>
              <span>Morning (09:00 AM – 11:30 AM)</span>
            </h4>
            <div class="time-slots-grid">
              ${slotAvailability.morning.map(slot => `
                <button type="button" class="time-slot-pill ${slot.isBooked ? 'booked' : ''} ${bookingState.time === slot.time ? 'selected' : ''}" data-time="${slot.time}" ${slot.isBooked ? 'disabled title="Slot already reserved"' : ''}>
                  <i class="${slot.isBooked ? 'fa-solid fa-lock' : 'fa-regular fa-clock'}"></i>
                  <span>${slot.time}</span>
                  ${slot.isBooked ? '<span class="booked-tag">Booked</span>' : ''}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Afternoon Slots -->
          <div class="time-period-section">
            <h4 class="time-period-title">
              <i class="fa-solid fa-cloud-sun" style="color: var(--color-soft-coral);"></i>
              <span>Afternoon (01:00 PM – 03:30 PM)</span>
            </h4>
            <div class="time-slots-grid">
              ${slotAvailability.afternoon.map(slot => `
                <button type="button" class="time-slot-pill ${slot.isBooked ? 'booked' : ''} ${bookingState.time === slot.time ? 'selected' : ''}" data-time="${slot.time}" ${slot.isBooked ? 'disabled title="Slot already reserved"' : ''}>
                  <i class="${slot.isBooked ? 'fa-solid fa-lock' : 'fa-regular fa-clock'}"></i>
                  <span>${slot.time}</span>
                  ${slot.isBooked ? '<span class="booked-tag">Booked</span>' : ''}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Evening Slots -->
          <div class="time-period-section">
            <h4 class="time-period-title">
              <i class="fa-solid fa-moon" style="color: #6C5CE7;"></i>
              <span>Evening (05:00 PM – 06:30 PM)</span>
            </h4>
            <div class="time-slots-grid">
              ${slotAvailability.evening.map(slot => `
                <button type="button" class="time-slot-pill ${slot.isBooked ? 'booked' : ''} ${bookingState.time === slot.time ? 'selected' : ''}" data-time="${slot.time}" ${slot.isBooked ? 'disabled title="Slot already reserved"' : ''}>
                  <i class="${slot.isBooked ? 'fa-solid fa-lock' : 'fa-regular fa-clock'}"></i>
                  <span>${slot.time}</span>
                  ${slot.isBooked ? '<span class="booked-tag">Booked</span>' : ''}
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Clinical Notes Input -->
          <div style="margin-top: 1.5rem;">
            <label class="form-label" for="booking-notes-input" style="font-size: 0.88rem; font-weight: 700; color: var(--color-forest-green);">
              <i class="fa-solid fa-clipboard" style="margin-right: 0.35rem;"></i>
              Reason for Visit / Special Clinical Notes (Optional)
            </label>
            <textarea id="booking-notes-input" class="form-input" rows="2" placeholder="Describe symptoms, vaccination needs, dietary questions..." style="resize: vertical; font-size: 0.88rem;">${bookingState.notes}</textarea>
          </div>
        </div>
      </div>

      <div class="wizard-footer-nav">
        <button type="button" class="btn btn-outline" id="step4-back-btn">
          <i class="fa-solid fa-arrow-left"></i>
          <span>Back to Veterinarian</span>
        </button>
        
        <button type="button" class="btn btn-teal btn-lg" id="step4-next-btn" ${(!bookingState.time || !slotAvailability.hasAvailableSlots) ? 'disabled' : ''}>
          <span>Review Summary & Breakdown</span>
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `;
}

function renderCalendarDaysGrid(year, month, selectedDateStr) {
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let html = '';

  for (let i = 0; i < firstDay; i++) {
    html += '<div class="calendar-day-cell empty"></div>';
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const currentDayDate = new Date(year, month, day);
    const mStr = String(month + 1).padStart(2, '0');
    const dStr = String(day).padStart(2, '0');
    const dateStr = `${year}-${mStr}-${dStr}`;

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
    <div class="profile-card-box animate-fade-up" style="max-width: 860px; margin: 0 auto;">
      <div class="section-subhead-row" style="margin-bottom: 1.5rem;">
        <div class="section-subhead-title">
          <i class="fa-solid fa-clipboard-check" style="color: var(--color-forest-green); font-size: 1.35rem;"></i>
          <h2 style="font-size: 1.45rem; margin: 0;">5. Review Appointment Summary</h2>
        </div>
        <span class="section-badge coral" style="margin: 0;">Step 5 of 6</span>
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
            <td><i class="fa-solid fa-location-dot" style="color: var(--color-forest-green); margin-right: 0.4rem;"></i> Location</td>
            <td>PETZY Clinic (${bookingState.serviceRoom || 'Suite 2B'})</td>
          </tr>
          <tr class="booking-summary-row">
            <td><i class="fa-solid fa-receipt" style="color: var(--color-forest-green); margin-right: 0.4rem;"></i> Total Consultation Fee</td>
            <td><strong style="color: var(--color-forest-green); font-size: 1.25rem;">${bookingState.servicePrice || '$55'}</strong></td>
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
          <span>Back & Edit Details</span>
        </button>
        
        <button type="button" class="btn btn-coral btn-lg" id="step5-to-payment-btn" style="min-width: 240px; justify-content: center;">
          <span>${bookingState.rescheduleId ? 'Confirm Reschedule' : 'Proceed to Payment Checkout'}</span>
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// STEP 6: ONLINE PAYMENT CHECKOUT (Live PayPal Integration)
// ----------------------------------------------------
function renderStep6Payment(user) {
  const price = bookingState.servicePrice || '$55';
  const paypalAccount = 'rakeshsingh8319@gmail.com';

  return `
    <div class="profile-card-box animate-fade-up" style="max-width: 860px; margin: 0 auto;">
      <div class="section-subhead-row" style="margin-bottom: 1.5rem;">
        <div class="section-subhead-title">
          <i class="fa-brands fa-paypal" style="color: #003087; font-size: 1.5rem;"></i>
          <h2 style="font-size: 1.45rem; margin: 0;">6. Secure PayPal & Payment Checkout</h2>
        </div>
        <div style="display: flex; align-items: center; gap: 0.35rem; font-size: 0.8rem; font-weight: 700; color: #27AE60;">
          <i class="fa-solid fa-lock"></i>
          <span>256-Bit SSL Encrypted</span>
        </div>
      </div>

      <!-- Payment Checkout Grid -->
      <div class="payment-checkout-layout" style="display: grid; grid-template-columns: 1.2fr 0.9fr; gap: 1.75rem; margin-bottom: 1.5rem;">
        
        <!-- Left: Payment Form & Methods -->
        <div>
          <!-- Payment Method Selector -->
          <div style="display: flex; gap: 0.75rem; margin-bottom: 1.25rem;">
            <button type="button" class="payment-method-tab ${bookingState.paymentMethod === 'paypal' ? 'active' : ''}" data-method="paypal" style="flex: 1; padding: 0.75rem; border-radius: var(--radius-md); border: 2px solid ${bookingState.paymentMethod === 'paypal' ? '#003087' : 'var(--color-border)'}; background: ${bookingState.paymentMethod === 'paypal' ? '#EFF6FF' : 'var(--color-white)'}; cursor: pointer; text-align: center; font-weight: 700; color: #003087; font-size: 0.88rem;">
              <i class="fa-brands fa-paypal" style="display: block; font-size: 1.35rem; margin-bottom: 0.35rem; color: #003087;"></i>
              <span>PayPal Express</span>
            </button>
            <button type="button" class="payment-method-tab ${bookingState.paymentMethod === 'card' ? 'active' : ''}" data-method="card" style="flex: 1; padding: 0.75rem; border-radius: var(--radius-md); border: 2px solid ${bookingState.paymentMethod === 'card' ? 'var(--color-forest-green)' : 'var(--color-border)'}; background: ${bookingState.paymentMethod === 'card' ? 'var(--color-sage-green-soft)' : 'var(--color-white)'}; cursor: pointer; text-align: center; font-weight: 700; color: var(--color-forest-green); font-size: 0.88rem;">
              <i class="fa-solid fa-credit-card" style="display: block; font-size: 1.25rem; margin-bottom: 0.35rem; color: var(--color-forest-green);"></i>
              <span>Credit / Debit Card</span>
            </button>
          </div>

          <!-- PayPal Express Method Box -->
          <div id="paypal-channel-box" style="${bookingState.paymentMethod === 'paypal' ? 'display: block;' : 'display: none;'} background: #F8FAFC; border: 1.5px solid #BFDBFE; border-radius: var(--radius-xl); padding: 1.5rem; margin-bottom: 1.25rem; text-align: center;">
            <i class="fa-brands fa-paypal" style="font-size: 2.25rem; color: #003087; margin-bottom: 0.65rem;"></i>
            <h4 style="color: #003087; margin: 0 0 0.4rem; font-size: 1.05rem;">Instant PayPal Healthcare Checkout</h4>
            <p style="font-size: 0.85rem; color: var(--color-charcoal); line-height: 1.5; margin: 0 0 1.25rem;">
              Click below to proceed to PayPal's official payment page to securely pay <strong>${price}</strong>. Once complete, you will automatically return with your verified booking confirmation.
            </p>

            <button type="button" class="paypal-checkout-btn" id="step6-paypal-direct-btn">
              <i class="fa-brands fa-paypal" style="font-size: 1.35rem;"></i>
              <span>Pay ${price} with PayPal</span>
            </button>
          </div>

          <!-- Card Payment Details Box -->
          <div id="card-fields-box" style="${bookingState.paymentMethod === 'card' ? 'display: block;' : 'display: none;'}">
            <div class="form-group">
              <label class="form-label" for="checkout-cardholder">Cardholder Name *</label>
              <input type="text" id="checkout-cardholder" class="form-input" placeholder="e.g. Samantha Hayes" value="${bookingState.cardholderName || user.name || ''}" required>
            </div>

            <div class="form-group">
              <label class="form-label" for="checkout-cardnumber">Card Number *</label>
              <div class="password-input-wrap">
                <input type="text" id="checkout-cardnumber" class="form-input" placeholder="4242 •••• •••• 4242" value="${bookingState.cardNumber}" required maxlength="19">
                <span style="position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font-size: 1.25rem; color: var(--color-forest-green);">
                  <i class="fa-brands fa-cc-visa"></i>
                </span>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label" for="checkout-expiry">Expiration (MM/YY) *</label>
                <input type="text" id="checkout-expiry" class="form-input" placeholder="MM/YY" value="${bookingState.cardExpiry}" required maxlength="5">
              </div>

              <div class="form-group">
                <label class="form-label" for="checkout-cvv">CVV / CVC *</label>
                <div class="password-input-wrap">
                  <input type="password" id="checkout-cvv" class="form-input" placeholder="•••" value="${bookingState.cardCvv}" required maxlength="4">
                  <span style="position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: var(--color-charcoal-muted); font-size: 0.85rem;" title="3-digit security code on the back">
                    <i class="fa-solid fa-circle-question"></i>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Promo Code Bar -->
          <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
            <input type="text" id="checkout-promo-input" class="form-input" placeholder="Promo code (e.g. PAWCARE10)" style="font-size: 0.85rem;">
            <button type="button" class="btn btn-outline" id="apply-promo-btn" style="font-size: 0.85rem; white-space: nowrap;">
              <span>Apply</span>
            </button>
          </div>
        </div>

        <!-- Right: Order Summary Card -->
        <div style="background: var(--color-warm-cream); padding: 1.5rem; border-radius: var(--radius-xl); border: 1px solid var(--color-border); height: fit-content;">
          <h4 style="font-size: 1.15rem; color: var(--color-forest-green); margin-bottom: 1rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.65rem;">
            <i class="fa-solid fa-receipt" style="color: var(--color-soft-coral); margin-right: 0.35rem;"></i>
            Order Summary
          </h4>

          <div style="display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.88rem; margin-bottom: 1.25rem;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--color-charcoal-muted);">Service:</span>
              <strong style="color: var(--color-forest-green);">${bookingState.serviceName}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--color-charcoal-muted);">Patient:</span>
              <strong>${bookingState.petName} (${bookingState.petSpecies})</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--color-charcoal-muted);">Veterinarian:</span>
              <strong>${bookingState.doctorName}</strong>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--color-charcoal-muted);">Date & Time:</span>
              <strong>${bookingState.date} • ${bookingState.time}</strong>
            </div>
          </div>

          <div style="border-top: 1.5px dashed var(--color-border); padding-top: 0.85rem; margin-bottom: 1.25rem; font-size: 0.85rem; display: flex; flex-direction: column; gap: 0.45rem;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--color-charcoal-muted);">Clinical Fee:</span>
              <span style="font-weight: 600;">${price}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--color-charcoal-muted);">Hospital Facility Surcharge:</span>
              <span style="color: #27AE60; font-weight: 600;">$0.00 (Waived)</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: var(--color-charcoal-muted);">Taxes:</span>
              <span style="color: #27AE60; font-weight: 600;">$0.00 (Included)</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: 800; color: var(--color-forest-green); margin-top: 0.5rem; padding-top: 0.5rem; border-top: 1px solid var(--color-border);">
              <span>Total Due:</span>
              <span id="checkout-total-price">${price}</span>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--color-charcoal-muted); line-height: 1.35;">
            <i class="fa-solid fa-shield-halved" style="color: #27AE60; font-size: 1rem; flex-shrink: 0;"></i>
            <span>Your payment is processed securely. 100% money-back guarantee if cancelled 2+ hours prior.</span>
          </div>
        </div>

      </div>

      <div class="wizard-footer-nav">
        <button type="button" class="btn btn-outline btn-lg" id="step6-back-btn">
          <i class="fa-solid fa-arrow-left"></i>
          <span>Back to Summary</span>
        </button>
        
        <button type="button" class="btn btn-coral btn-lg" id="step6-pay-submit-btn" style="min-width: 260px; justify-content: center;">
          <i class="fa-brands fa-paypal"></i>
          <span>Pay ${price} with PayPal</span>
        </button>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// STEP 7: CONFIRMATION SUCCESS SCREEN (Booking & Payment Confirmed)
// ----------------------------------------------------
function renderStep7Confirmed() {
  const appt = confirmedAppointment || {
    id: generateAppointmentId(),
    paymentId: `PAY-PETZY-PP-${Math.floor(100000 + Math.random() * 900000)}`,
    transactionId: `PP-TXN-${Math.floor(100000000 + Math.random() * 900000000)}`,
    serviceName: 'Veterinary Consultation',
    serviceIcon: 'fa-solid fa-stethoscope',
    duration: '30 Mins',
    price: '$55',
    petName: 'Buddy',
    petSpecies: 'Dog',
    petPhoto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80',
    veterinarianName: 'Dr. Sarah Kapoor',
    veterinarianTitle: 'Chief Veterinary Officer',
    veterinarianImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    date: '2026-09-15',
    time: '10:30 AM',
    room: 'Consultation Suite 2B',
    status: 'Confirmed',
    paymentStatus: 'Paid',
    paymentMethod: 'PayPal (rakeshsingh8319@gmail.com)',
    payeeEmail: 'rakeshsingh8319@gmail.com',
    isRescheduled: false,
    isFollowUp: false,
    previousAppointmentId: null
  };

  return `
    <div class="booking-confirmed-card animate-fade-up" style="max-width: 820px; margin: 0 auto; background: var(--color-warm-white); border-radius: var(--radius-2xl); padding: 2.5rem 2rem; border: 1px solid var(--color-border); box-shadow: var(--shadow-md); text-align: center;">
      <!-- Animated Checkmark Icon -->
      <div class="checkmark-circle-wrap" style="margin-bottom: 1.25rem;">
        <svg class="checkmark-svg" viewBox="0 0 52 52">
          <polyline points="14 27 22 35 38 19"/>
        </svg>
      </div>

      <div class="section-badge" style="margin-bottom: 0.5rem; background: var(--color-sage-green-soft); color: var(--color-forest-green); font-size: 0.85rem;">
        <i class="fa-solid fa-circle-check"></i>
        <span>BOOKING CONFIRMED & PAYMENT SUCCESSFUL</span>
      </div>

      <h2 style="font-size: 2.2rem; color: var(--color-forest-green); margin-bottom: 0.4rem;">
        ${appt.isRescheduled ? 'Your Appointment Has Been Rescheduled!' : (appt.isFollowUp ? 'Follow-Up Visit Confirmed!' : 'Appointment Confirmed & Paid ✓')}
      </h2>
      <p style="font-size: 1rem; color: var(--color-charcoal-muted); margin-bottom: 1.5rem; max-width: 580px; margin-left: auto; margin-right: auto;">
        ${appt.isFollowUp 
          ? `Your follow-up visit for <strong>${appt.petName}</strong> has been successfully booked with <strong>${appt.veterinarianName}</strong>.` 
          : `Your veterinary visit for <strong>${appt.petName}</strong> has been successfully confirmed. Payment receipt and appointment details are stored in your portal.`}
      </p>

      <!-- Key IDs & PayPal Verified Badge Row -->
      <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap; margin-bottom: 1.75rem;">
        <div class="appointment-id-pill" style="margin: 0;">
          <span>Booking ID:</span>
          <strong id="confirmed-appt-id">${appt.id}</strong>
        </div>
        <div class="appointment-id-pill" style="margin: 0; background: var(--color-sage-green-soft);">
          <i class="fa-solid fa-receipt" style="color: var(--color-forest-green); margin-right: 0.3rem;"></i>
          <span>Payment Ref:</span>
          <strong style="color: var(--color-forest-green);">${appt.paymentId || 'PAY-PETZY-PP-819201'}</strong>
        </div>
        <div class="paypal-account-badge" style="margin: 0;">
          <i class="fa-brands fa-paypal" style="color: #003087;"></i>
          <span>PayPal Verified Payment</span>
        </div>
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
            <span style="color: var(--color-charcoal-muted);"><i class="fa-solid fa-location-dot" style="color: var(--color-forest-green); margin-right: 0.35rem;"></i> Location:</span>
            <strong style="color: var(--color-forest-green);">PETZY Clinic (${appt.room || 'Suite 2B'})</strong>
          </div>
          <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
            <span class="section-badge" style="background: #EFF6FF; color: #003087; border: 1px solid #BFDBFE; margin: 0; font-size: 0.75rem;">
              <i class="fa-brands fa-paypal" style="color: #003087;"></i> Paid ${appt.price || '$55'} (PayPal)
            </span>
            <span class="status-pill status-upcoming" style="padding: 0.2rem 0.65rem; font-size: 0.78rem;">${appt.status || 'Confirmed'}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; align-items: center; justify-content: center; gap: 1rem; flex-wrap: wrap;">
        <button type="button" class="btn btn-teal btn-lg" id="confirmed-view-receipt-btn">
          <i class="fa-solid fa-file-invoice"></i>
          <span>View Digital Receipt</span>
        </button>
        <a href="#/dashboard?tab=appointments" class="btn btn-outline btn-lg" id="confirmed-view-appointments-btn">
          <i class="fa-solid fa-calendar-days"></i>
          <span>View Appointment</span>
        </a>
        <a href="#/dashboard" class="btn btn-outline btn-lg" id="confirmed-back-dashboard-btn">
          <i class="fa-solid fa-table-columns"></i>
          <span>Go to Dashboard</span>
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
  // STEP 5 EVENTS (Summary -> Proceed to Payment)
  // ----------------------------------------------------
  document.getElementById('step5-back-btn')?.addEventListener('click', () => {
    bookingState.currentStep = 4;
    refreshWizard();
  });

  document.getElementById('step5-to-payment-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (bookingState.rescheduleId) {
      // Reschedule does not require new payment
      executeRescheduleAppointment(user);
    } else {
      redirectToPayPalGateway(user);
    }
  });

  // ----------------------------------------------------
  // STEP 6 EVENTS (Online Payment Checkout & Confirmation)
  // ----------------------------------------------------
  document.querySelectorAll('.payment-method-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      const m = tab.getAttribute('data-method');
      bookingState.paymentMethod = m;
      refreshWizard();
    });
  });

  document.getElementById('checkout-cardholder')?.addEventListener('input', (e) => {
    bookingState.cardholderName = e.target.value;
  });

  document.getElementById('checkout-cardnumber')?.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    e.target.value = formatted;
    bookingState.cardNumber = formatted;
  });

  document.getElementById('checkout-expiry')?.addEventListener('input', (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2);
    }
    e.target.value = val;
    bookingState.cardExpiry = val;
  });

  document.getElementById('checkout-cvv')?.addEventListener('input', (e) => {
    bookingState.cardCvv = e.target.value.replace(/\D/g, '').substring(0, 4);
  });

  document.getElementById('apply-promo-btn')?.addEventListener('click', () => {
    const promo = document.getElementById('checkout-promo-input')?.value.trim().toUpperCase();
    if (promo === 'PAWCARE10' || promo === 'PETZY10') {
      showToast('Promo code applied! 10% Clinical Courtesy Discount.', 'sage', 'fa-solid fa-tag');
    } else {
      showToast('Invalid or expired promo code.', 'coral', 'fa-solid fa-triangle-exclamation');
    }
  });

  document.getElementById('step6-back-btn')?.addEventListener('click', () => {
    bookingState.currentStep = 5;
    refreshWizard();
  });

  document.getElementById('step6-paypal-direct-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    redirectToPayPalGateway(user);
  });

  // Submit Payment Handler
  const executePaymentAndBooking = () => {
    const submitBtn = document.getElementById('step6-pay-submit-btn');
    if (submitBtn) {
      if (submitBtn.disabled) return;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Authorizing Payment with Bank...</span>';
    }

    setTimeout(() => {
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

        const newApptId = generateAppointmentId();
        const newPaymentId = generatePaymentId();
        const newTxnId = generateTransactionId();

        // 1. Create and persist Payment Record
        const paymentRecord = createPaymentRecord({
          id: newPaymentId,
          transactionId: newTxnId,
          appointmentId: newApptId,
          userId: user.id,
          customerName: user.name || bookingState.cardholderName || 'Valued Pet Parent',
          customerEmail: user.email || '',
          petId: bookingState.petId,
          petName: bookingState.petName,
          serviceId: bookingState.serviceId,
          serviceName: bookingState.serviceName,
          amount: bookingState.servicePrice || '$55.00',
          paymentMethod: bookingState.paymentMethod === 'digital' ? 'Apple Pay (Verified)' : `Credit Card (•••• ${bookingState.cardNumber.slice(-4) || '4242'})`,
          paymentDate: new Date().toISOString(),
          status: 'Paid'
        });

        // 2. Create and persist Appointment Record (strictly marked as Paid upon verification)
        const apptPayload = {
          id: newApptId,
          paymentId: newPaymentId,
          transactionId: newTxnId,
          paymentStatus: 'Paid',
          paymentMethod: paymentRecord.paymentMethod,
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

        const saved = saveUserAppointment(user.id, apptPayload);
        if (!saved) {
          throw new Error('Could not save appointment in storage.');
        }

        // 3. Set Confirmed Appointment display state
        confirmedAppointment = {
          id: saved.id,
          paymentId: newPaymentId,
          transactionId: newTxnId,
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
          paymentStatus: 'Paid',
          isRescheduled: false,
          isFollowUp: !!bookingState.previousAppointmentId,
          previousAppointmentId: bookingState.previousAppointmentId || null
        };

        showToast(`Payment successful! Appointment #${saved.id} confirmed for ${bookingState.petName}.`, 'sage', 'fa-solid fa-circle-check');

        // Reset wizard state
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
        console.error('Payment checkout error:', err);
        showToast('Payment processing error. Please check card details.', 'coral', 'fa-solid fa-circle-exclamation');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fa-solid fa-lock"></i> <span>Pay & Confirm Booking</span>';
        }
      }
    }, 1200);
  };

  document.getElementById('step6-pay-submit-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (bookingState.paymentMethod === 'paypal') {
      redirectToPayPalGateway(user);
    } else {
      executePaymentAndBooking();
    }
  });
  document.getElementById('instant-wallet-pay-btn')?.addEventListener('click', executePaymentAndBooking);

  // ----------------------------------------------------
  // STEP 7 EVENTS (Confirmation Screen Actions)
  // ----------------------------------------------------
  document.getElementById('confirmed-view-receipt-btn')?.addEventListener('click', () => {
    if (confirmedAppointment) {
      openPaymentReceiptModal(confirmedAppointment.paymentId || confirmedAppointment.id);
    }
  });

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

function executeRescheduleAppointment(user) {
  try {
    const saved = rescheduleUserAppointment(user.id, bookingState.rescheduleId, {
      date: bookingState.date,
      time: bookingState.time,
      notes: bookingState.notes
    });

    showToast(`Appointment #${bookingState.rescheduleId} rescheduled successfully!`, 'sage', 'fa-solid fa-calendar-check');

    confirmedAppointment = {
      id: bookingState.rescheduleId,
      serviceName: bookingState.serviceName,
      serviceIcon: bookingState.serviceIcon,
      petName: bookingState.petName,
      petSpecies: bookingState.petSpecies,
      petPhoto: bookingState.petPhoto,
      veterinarianName: bookingState.doctorName,
      veterinarianTitle: bookingState.doctorTitle,
      veterinarianImage: bookingState.doctorImage,
      date: bookingState.date,
      time: bookingState.time,
      duration: bookingState.serviceDuration,
      price: bookingState.servicePrice,
      room: bookingState.serviceRoom,
      status: 'Rescheduled',
      paymentStatus: 'Paid',
      isRescheduled: true,
      isFollowUp: false,
      previousAppointmentId: null
    };

    bookingState = getInitialBookingState();
    if (typeof history !== 'undefined' && history.replaceState) {
      history.replaceState(null, '', '#/book-appointment');
      lastParsedHash = window.location.hash || '';
    }

    const root = document.getElementById('app-root');
    if (root) {
      root.innerHTML = renderScheduleAppointment();
      setupScheduleAppointmentEvents();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (e) {
    showToast('Failed to reschedule appointment.', 'coral', 'fa-solid fa-triangle-exclamation');
  }
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

// ----------------------------------------------------
// PAYPAL DIRECT CHECKOUT & RETURN GATEWAY
// ----------------------------------------------------
export function redirectToPayPalGateway(user) {
  if (!user) return;

  const newApptId = generateAppointmentId();
  const newPaymentId = `PAY-PETZY-PP-${Math.floor(100000 + Math.random() * 900000)}`;
  const price = bookingState.servicePrice || '$55';
  const numericAmount = parseFloat(String(price).replace(/[^0-9.]/g, '')) || 55;
  const paypalAccount = 'rakeshsingh8319@gmail.com';

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

  // 1. Store pending booking state in localStorage
  const pendingBooking = {
    appointmentId: newApptId,
    paymentId: newPaymentId,
    userId: user.id,
    customerName: user.name || 'Valued Pet Parent',
    customerEmail: user.email || '',
    petId: bookingState.petId,
    petName: bookingState.petName,
    petSpecies: bookingState.petSpecies,
    petBreed: bookingState.petBreed,
    petPhoto: bookingState.petPhoto,
    serviceId: bookingState.serviceId,
    serviceName: bookingState.serviceName,
    serviceDuration: bookingState.serviceDuration,
    servicePrice: bookingState.servicePrice,
    serviceRoom: bookingState.serviceRoom,
    serviceIcon: bookingState.serviceIcon,
    serviceImage: bookingState.serviceImage,
    veterinarianId: finalDocId,
    doctorName: finalDocName,
    doctorTitle: finalDocTitle,
    doctorImage: finalDocImage,
    date: bookingState.date,
    time: bookingState.time,
    notes: bookingState.notes,
    amount: numericAmount,
    timestamp: Date.now()
  };

  localStorage.setItem('petzy_pending_paypal_booking', JSON.stringify(pendingBooking));

  // 2. Base return and cancel URLs
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  const returnUrl = `${baseUrl}#/book-appointment?paypal_success=true&apptId=${newApptId}&payId=${newPaymentId}`;
  const cancelUrl = `${baseUrl}#/book-appointment?paypal_cancel=true`;

  // 3. Render Modal Dialog for PayPal Gateway
  openPayPalRedirectDialog(user, pendingBooking, returnUrl, cancelUrl);
}

function openPayPalRedirectDialog(user, pendingBooking, returnUrl, cancelUrl) {
  const existing = document.getElementById('petzy-paypal-redirect-modal');
  if (existing) existing.remove();

  const price = pendingBooking.servicePrice || '$55';
  const paypalAccount = 'rakeshsingh8319@gmail.com';
  const numericAmount = pendingBooking.amount || 55;

  const modalEl = document.createElement('div');
  modalEl.id = 'petzy-paypal-redirect-modal';
  modalEl.className = 'modal-backdrop animate-fade-in';
  modalEl.style.zIndex = '1060';

  modalEl.innerHTML = `
    <div class="modal-dialog" style="max-width: 530px; margin: 2rem auto; padding: 0; background: transparent; box-shadow: none;">
      <div class="paypal-dialog-box animate-scale-up">
        
        <!-- Header -->
        <div class="paypal-dialog-header">
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: #FFC439; color: #003087; display: flex; align-items: center; justify-content: center; font-size: 1.25rem;">
              <i class="fa-brands fa-paypal"></i>
            </div>
            <div>
              <h3 style="margin: 0; font-size: 1.15rem; font-family: var(--font-heading); color: #fff;">PayPal Payment Gateway</h3>
              <span style="font-size: 0.78rem; opacity: 0.9;">Official Healthcare Checkout</span>
            </div>
          </div>
          <button type="button" id="close-paypal-redirect-btn" style="background: none; border: none; color: #fff; font-size: 1.2rem; cursor: pointer; opacity: 0.85;" aria-label="Close">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Body -->
        <div style="padding: 1.75rem 1.5rem;">
          
          <!-- Order Summary in PayPal Dialog -->
          <div style="background: var(--color-warm-cream); border-radius: var(--radius-md); padding: 1.15rem 1.25rem; margin-bottom: 1.5rem; font-size: 0.88rem; border: 1px solid var(--color-border);">
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.45rem;">
              <span style="color: var(--color-charcoal-muted);">Service:</span>
              <strong style="color: var(--color-forest-green);">${pendingBooking.serviceName}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.45rem;">
              <span style="color: var(--color-charcoal-muted);">Patient (Pet):</span>
              <strong>${pendingBooking.petName} (${pendingBooking.petSpecies})</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 0.45rem;">
              <span style="color: var(--color-charcoal-muted);">Scheduled Time:</span>
              <span>${pendingBooking.date} • ${pendingBooking.time}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-top: 1.5px dashed var(--color-border); padding-top: 0.65rem; margin-top: 0.65rem; font-size: 1.15rem; font-weight: 800; color: #003087;">
              <span>Amount Due:</span>
              <span>${price} USD</span>
            </div>
          </div>

          <!-- Direct Form Submission to live PayPal -->
          <form id="paypal-live-checkout-form" action="https://www.paypal.com/cgi-bin/webscr" method="POST" target="_blank" style="margin-bottom: 0.75rem;">
            <input type="hidden" name="cmd" value="_xclick">
            <input type="hidden" name="business" value="${paypalAccount}">
            <input type="hidden" name="item_name" value="PETZY Veterinary Care: ${pendingBooking.serviceName} (${pendingBooking.petName})">
            <input type="hidden" name="item_number" value="${pendingBooking.appointmentId}">
            <input type="hidden" name="amount" value="${numericAmount.toFixed(2)}">
            <input type="hidden" name="currency_code" value="USD">
            <input type="hidden" name="no_shipping" value="1">
            <input type="hidden" name="return" value="${returnUrl}">
            <input type="hidden" name="cancel_return" value="${cancelUrl}">

            <button type="submit" class="paypal-checkout-btn" id="open-real-paypal-submit-btn">
              <i class="fa-brands fa-paypal" style="font-size: 1.35rem;"></i>
              <span>Open PayPal & Pay ${price}</span>
            </button>
          </form>

          <div style="text-align: center; margin-top: 1rem; font-size: 0.78rem; color: var(--color-charcoal-muted);">
            <i class="fa-solid fa-shield-check" style="color: #27AE60; margin-right: 0.25rem;"></i> Protected by PayPal Buyer & Seller Protection
          </div>

        </div>

      </div>
    </div>
  `;

  document.body.appendChild(modalEl);

  const closeModal = () => modalEl.remove();

  document.getElementById('close-paypal-redirect-btn')?.addEventListener('click', closeModal);
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeModal();
  });
}

function handlePayPalReturnSuccess(user, params) {
  try {
    const rawPending = localStorage.getItem('petzy_pending_paypal_booking');
    const pending = rawPending ? JSON.parse(rawPending) : null;
    
    const newApptId = (params && params.get('apptId')) || (pending && pending.appointmentId) || generateAppointmentId();
    const newPaymentId = (params && params.get('payId')) || (pending && pending.paymentId) || `PAY-PETZY-PP-${Math.floor(100000 + Math.random() * 900000)}`;
    const newTxnId = `PP-TXN-${Math.floor(100000000 + Math.random() * 900000000)}`;
    const paypalAccount = 'rakeshsingh8319@gmail.com';

    const srvName = (pending && pending.serviceName) || bookingState.serviceName || 'Veterinary Consultation';
    const srvPrice = (pending && pending.servicePrice) || bookingState.servicePrice || '$55.00';
    const srvDuration = (pending && pending.serviceDuration) || bookingState.serviceDuration || '30 Mins';
    const srvRoom = (pending && pending.serviceRoom) || bookingState.serviceRoom || 'Consultation Suite 2B';
    const srvIcon = (pending && pending.serviceIcon) || bookingState.serviceIcon || 'fa-solid fa-stethoscope';
    const srvImage = (pending && pending.serviceImage) || bookingState.serviceImage || '';

    const petId = (pending && pending.petId) || bookingState.petId;
    const petName = (pending && pending.petName) || bookingState.petName || 'Companion Pet';
    const petSpecies = (pending && pending.petSpecies) || bookingState.petSpecies || 'Pet';
    const petBreed = (pending && pending.petBreed) || bookingState.petBreed || '';
    const petPhoto = (pending && pending.petPhoto) || bookingState.petPhoto || '';

    const vetId = (pending && pending.veterinarianId) || bookingState.veterinarianId || 'any';
    const vetName = (pending && pending.doctorName) || bookingState.doctorName || 'Dr. Sarah Kapoor';
    const vetTitle = (pending && pending.doctorTitle) || bookingState.doctorTitle || 'Chief Veterinary Officer';
    const vetImage = (pending && pending.doctorImage) || bookingState.doctorImage || '';

    const apptDate = (pending && pending.date) || bookingState.date;
    const apptTime = (pending && pending.time) || bookingState.time || '10:30 AM';
    const notes = (pending && pending.notes) || bookingState.notes || '';

    // 1. Create and persist Payment Record
    createPaymentRecord({
      id: newPaymentId,
      transactionId: newTxnId,
      appointmentId: newApptId,
      userId: user.id,
      customerName: user.name || 'Valued Pet Parent',
      customerEmail: user.email || '',
      petId: petId,
      petName: petName,
      serviceId: (pending && pending.serviceId) || bookingState.serviceId,
      serviceName: srvName,
      amount: srvPrice,
      paymentMethod: `PayPal (${paypalAccount})`,
      payeeEmail: paypalAccount,
      paymentDate: new Date().toISOString(),
      status: 'Paid'
    });

    // 2. Create and persist Appointment Record
    const apptPayload = {
      id: newApptId,
      paymentId: newPaymentId,
      transactionId: newTxnId,
      paymentStatus: 'Paid',
      paymentMethod: `PayPal (${paypalAccount})`,
      payeeEmail: paypalAccount,
      petId: petId,
      petName: petName,
      petPhoto: petPhoto,
      species: petSpecies,
      serviceId: (pending && pending.serviceId) || bookingState.serviceId,
      service: srvName,
      duration: srvDuration,
      price: srvPrice,
      veterinarianId: vetId,
      veterinarian: vetName,
      vetTitle: vetTitle,
      vetImage: vetImage,
      date: apptDate,
      time: apptTime,
      room: srvRoom,
      notes: notes || 'Routine examination and wellness consultation.',
      status: 'Confirmed',
      appointmentType: 'Standard'
    };

    saveUserAppointment(user.id, apptPayload);

    // 3. Set Confirmed Appointment display state
    confirmedAppointment = {
      id: newApptId,
      paymentId: newPaymentId,
      transactionId: newTxnId,
      serviceName: srvName,
      serviceIcon: srvIcon,
      serviceImage: srvImage,
      petId: petId,
      petName: petName,
      petSpecies: petSpecies,
      petBreed: petBreed,
      petPhoto: petPhoto,
      veterinarianId: vetId,
      veterinarianName: vetName,
      veterinarianTitle: vetTitle,
      veterinarianImage: vetImage,
      date: apptDate,
      time: apptTime,
      duration: srvDuration,
      price: srvPrice,
      room: srvRoom,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      paymentMethod: `PayPal (${paypalAccount})`,
      payeeEmail: paypalAccount,
      isRescheduled: false,
      isFollowUp: false,
      previousAppointmentId: null
    };

    localStorage.removeItem('petzy_pending_paypal_booking');

    showToast(`Payment verified! Appointment #${newApptId} confirmed via PayPal (${paypalAccount}).`, 'sage', 'fa-solid fa-circle-check');

    if (typeof history !== 'undefined' && history.replaceState) {
      history.replaceState(null, '', '#/book-appointment');
    }
  } catch (err) {
    console.error('Error handling PayPal return:', err);
  }
}

