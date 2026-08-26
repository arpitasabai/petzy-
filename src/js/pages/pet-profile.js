/* PETZY Individual Pet Profile View (Milestone 2) */
import { getCurrentUser } from '../services/auth.js';
import { getUserPetById, getUserAppointmentsByPet, deleteUserPet } from '../services/storage.js';
import { renderBackButton } from '../components/back-button.js';
import { openPetModal } from '../components/pet-modal.js';
import { openVaccinationModal } from '../components/vaccination-modal.js';
import { openAppointmentModal } from '../components/appointment-modal.js';
import { showToast } from '../components/toast.js';

export function renderPetProfile(petId) {
  const user = getCurrentUser();
  if (!user) {
    setTimeout(() => {
      window.location.hash = '#/login';
      showToast('Please sign in to view pet profiles.', 'coral', 'fa-solid fa-lock');
    }, 10);
    return `<div class="auth-page-wrapper"><p>Redirecting to login...</p></div>`;
  }

  // Get pet by ID
  const pet = getUserPetById(user.id, petId);
  if (!pet) {
    return `
      <div class="container pet-profile-page-wrapper animate-fade-up">
        <div style="margin-bottom: 1.5rem;">
          ${renderBackButton('#/dashboard?tab=pets')}
        </div>
        <div class="profile-card-box" style="text-align: center; padding: 4rem 2rem;">
          <i class="fa-solid fa-paw" style="font-size: 3.5rem; color: var(--color-sage-green); margin-bottom: 1rem;"></i>
          <h2 style="color: var(--color-forest-green); margin-bottom: 0.5rem;">Pet Profile Not Found</h2>
          <p style="color: var(--color-charcoal-muted); margin-bottom: 1.5rem;">The requested pet could not be found in your account.</p>
          <a href="#/dashboard?tab=pets" class="btn btn-teal">
            <i class="fa-solid fa-arrow-left"></i>
            <span>Return to My Pets</span>
          </a>
        </div>
      </div>
    `;
  }

  const appointments = getUserAppointmentsByPet(user.id, pet.id);
  const vaccinations = pet.vaccinations || [];

  return `
    <div class="container pet-profile-page-wrapper animate-fade-up">
      <!-- Back Navigation Row -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        ${renderBackButton('#/dashboard?tab=pets')}
        <div style="display: flex; gap: 0.75rem;">
          <button class="btn btn-outline" id="profile-edit-pet-btn">
            <i class="fa-solid fa-pen-to-square"></i>
            <span>Edit Pet Info</span>
          </button>
          <button class="btn btn-teal" id="profile-add-vac-btn">
            <i class="fa-solid fa-syringe"></i>
            <span>Add Vaccination Record</span>
          </button>
        </div>
      </div>

      <!-- 1. PET HERO HEADER -->
      <div class="pet-profile-hero">
        <div class="pet-profile-hero-grid">
          <!-- Avatar Frame -->
          <div class="pet-profile-avatar-frame">
            <img src="${pet.photo}" alt="${pet.name}" id="pet-hero-avatar">
          </div>

          <!-- Pet Info Main Column -->
          <div class="pet-profile-info-col">
            <div class="section-badge coral" style="margin-bottom: 0.5rem;">
              <i class="fa-solid ${getSpeciesIcon(pet.species)}"></i>
              <span>${pet.species} • Patient Profile</span>
            </div>
            <h1>${pet.name}</h1>
            <div class="pet-profile-subtitle">${pet.breed} • ${pet.gender}</div>

            <!-- Quick Vitals Row -->
            <div class="pet-profile-vitals-row">
              <div class="pet-vital-chip">
                <i class="fa-solid fa-cake-candles"></i>
                <span>Age: ${pet.age}</span>
              </div>
              <div class="pet-vital-chip">
                <i class="fa-solid fa-weight-scale"></i>
                <span>Weight: ${pet.weight}</span>
              </div>
              <div class="pet-vital-chip">
                <i class="fa-solid fa-microchip"></i>
                <span>Microchip: ${pet.microchip || 'Registered'}</span>
              </div>
            </div>
          </div>

          <!-- Actions Column -->
          <div class="pet-profile-actions-col">
            <a href="#/schedule-appointment?petId=${pet.id}" class="btn btn-coral">
              <i class="fa-solid fa-calendar-plus"></i>
              <span>Book Vet Visit</span>
            </a>
            <button class="btn btn-outline" style="border-color: #F5B7B1; color: #C0392B;" id="profile-delete-pet-btn">
              <i class="fa-solid fa-trash-can"></i>
              <span>Delete Pet</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 2. HEALTH & MEDICAL INFORMATION GRID -->
      <div class="pet-health-grid">
        <!-- Medical Notes & General Temperament -->
        <div class="pet-health-box">
          <div class="pet-health-box-header">
            <i class="fa-solid fa-notes-medical"></i>
            <h3>Clinical & Temperament Notes</h3>
          </div>
          <p style="font-size: 0.95rem; color: var(--color-charcoal); line-height: 1.6; margin-bottom: 1rem;">
            ${pet.medicalNotes || 'No specific clinical notes entered. Regular veterinary checkup profile active.'}
          </p>
          ${pet.diet ? `
            <div style="background: var(--color-warm-cream); padding: 0.85rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--color-border); font-size: 0.88rem;">
              <strong style="color: var(--color-forest-green);"><i class="fa-solid fa-bowl-food" style="color: var(--color-soft-coral); margin-right: 0.35rem;"></i> Diet Protocol:</strong>
              <span style="color: var(--color-charcoal-muted); margin-left: 0.25rem;">${pet.diet}</span>
            </div>
          ` : ''}
        </div>

        <!-- Allergies & Existing Conditions -->
        <div class="pet-health-box">
          <div class="pet-health-box-header">
            <i class="fa-solid fa-shield-virus"></i>
            <h3>Allergies & Known Conditions</h3>
          </div>
          
          <div style="margin-bottom: 1.25rem;">
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--color-charcoal-light); text-transform: uppercase; display: block; margin-bottom: 0.4rem;">Allergies / Food Sensitivities:</span>
            ${pet.allergies && pet.allergies !== 'None reported' && pet.allergies !== 'None' ? `
              <div style="display: flex; flex-wrap: wrap;">
                ${pet.allergies.split(',').map(a => `<span class="allergy-pill"><i class="fa-solid fa-triangle-exclamation"></i> ${a.trim()}</span>`).join('')}
              </div>
            ` : `
              <span style="font-size: 0.92rem; color: #2E7D32; font-weight: 600;"><i class="fa-solid fa-circle-check"></i> No known drug or food allergies reported.</span>
            `}
          </div>

          <div>
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--color-charcoal-light); text-transform: uppercase; display: block; margin-bottom: 0.4rem;">Existing Conditions:</span>
            <p style="font-size: 0.92rem; color: var(--color-charcoal); line-height: 1.5; margin: 0;">
              ${pet.conditions || 'None. Healthy cardiac, joint, and oral baseline.'}
            </p>
          </div>
        </div>
      </div>

      <!-- 3. VACCINATION & IMMUNIZATION HISTORY TABLE -->
      <div class="vaccination-table-container">
        <div class="section-subhead-row" style="margin-bottom: 1.25rem;">
          <div class="section-subhead-title">
            <i class="fa-solid fa-syringe" style="color: var(--color-forest-green);"></i>
            <h3 style="font-size: 1.25rem;">Immunization & Vaccination Records (${vaccinations.length})</h3>
          </div>
          <button class="btn btn-teal" style="padding: 0.45rem 1rem; font-size: 0.85rem;" id="table-add-vac-btn">
            <i class="fa-solid fa-plus"></i>
            <span>Add Record</span>
          </button>
        </div>

        ${vaccinations.length === 0 ? `
          <div style="text-align: center; padding: 2.5rem; color: var(--color-charcoal-muted);">
            <i class="fa-solid fa-syringe" style="font-size: 2.5rem; color: var(--color-sage-green); margin-bottom: 0.5rem;"></i>
            <p>No vaccination records registered for ${pet.name}. Click "Add Record" to log vaccines.</p>
          </div>
        ` : `
          <table class="petzy-table" aria-label="Vaccination History Table">
            <thead>
              <tr>
                <th>Vaccine Name</th>
                <th>Administered Date</th>
                <th>Next Due Date</th>
                <th>Attending Veterinarian</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${vaccinations.map(v => {
                let badgeStyle = 'background: var(--color-sage-green-soft); color: #2E7D32; border: 1px solid #C8E6C9;';
                if (v.status === 'Due Soon') badgeStyle = 'background: var(--color-soft-coral-soft); color: var(--color-soft-coral-hover); border: 1px solid #FADBD8;';
                if (v.status === 'Overdue') badgeStyle = 'background: #FDEDEC; color: #C0392B; border: 1px solid #F5B7B1;';

                return `
                  <tr>
                    <td class="vaccine-name-cell">
                      <i class="fa-solid fa-shield-halved" style="color: var(--color-forest-green-light); margin-right: 0.4rem;"></i>
                      ${v.name}
                    </td>
                    <td><i class="fa-solid fa-calendar-check" style="color: var(--color-charcoal-light); margin-right: 0.35rem;"></i>${v.dateAdministered}</td>
                    <td><strong style="color: var(--color-forest-green);"><i class="fa-solid fa-calendar-days" style="color: var(--color-soft-coral); margin-right: 0.35rem;"></i>${v.nextDueDate}</strong></td>
                    <td><i class="fa-solid fa-user-doctor" style="color: var(--color-forest-green-light); margin-right: 0.35rem;"></i>${v.veterinarian || 'PETZY Care Staff'}</td>
                    <td>
                      <span style="display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.3rem 0.75rem; border-radius: var(--radius-full); font-size: 0.78rem; font-weight: 700; ${badgeStyle}">
                        <i class="fa-solid fa-circle" style="font-size: 0.45rem;"></i>
                        ${v.status}
                      </span>
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        `}
      </div>

      <!-- 4. APPOINTMENT HISTORY FOR THIS PET -->
      <div class="profile-card-box">
        <div class="section-subhead-row" style="margin-bottom: 1.25rem;">
          <div class="section-subhead-title">
            <i class="fa-solid fa-calendar-check" style="color: var(--color-soft-coral);"></i>
            <h3 style="font-size: 1.25rem;">Visit & Appointment History for ${pet.name} (${appointments.length})</h3>
          </div>
          <a href="#/book-appointment?petId=${pet.id}" class="btn btn-teal" style="padding: 0.45rem 1rem; font-size: 0.85rem;">
            <i class="fa-solid fa-calendar-plus"></i>
            <span>Book Visit</span>
          </a>
        </div>

        ${appointments.length === 0 ? `
          <div style="text-align: center; padding: 2.5rem; color: var(--color-charcoal-muted);">
            <i class="fa-solid fa-calendar-days" style="font-size: 2.5rem; color: var(--color-sage-green); margin-bottom: 0.5rem;"></i>
            <p>No appointment records logged for ${pet.name}.</p>
          </div>
        ` : `
          <div class="appointments-list">
            ${appointments.map(a => `
              <div class="appointment-item-card" style="align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div class="appointment-left-col">
                  <div class="stat-icon-wrap ${['upcoming', 'confirmed', 'rescheduled'].includes(a.status.toLowerCase()) ? 'coral' : 'teal'}">
                    <i class="fa-solid ${['upcoming', 'confirmed', 'rescheduled'].includes(a.status.toLowerCase()) ? 'fa-calendar-days' : 'fa-clipboard-check'}"></i>
                  </div>
                  <div class="appointment-info-main">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.2rem;">
                      <h4 class="appointment-service-title" style="margin: 0;">${a.service}</h4>
                      <span style="font-size: 0.75rem; font-weight: 700; color: var(--color-forest-green); background: var(--color-warm-cream); padding: 0.15rem 0.5rem; border-radius: var(--radius-full); border: 1px solid var(--color-border);">ID: ${a.id}</span>
                    </div>
                    <div class="appointment-meta-row">
                      <span class="appointment-meta-item"><i class="fa-solid fa-user-doctor"></i> ${a.veterinarian}</span>
                      <span class="appointment-meta-item"><i class="fa-solid fa-calendar" style="color: var(--color-soft-coral);"></i> ${a.date}</span>
                      <span class="appointment-meta-item"><i class="fa-solid fa-clock"></i> ${a.time}</span>
                    </div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap;">
                  <span class="appointment-status-badge ${a.status.toLowerCase()}">
                    <i class="fa-solid fa-circle" style="font-size: 0.45rem;"></i>
                    ${a.status}
                  </span>
                  <button class="appointment-view-detail-btn" onclick="window.petzyOpenApptModal('${a.id}')">
                    <i class="fa-solid fa-circle-info"></i>
                    <span>View Details</span>
                  </button>
                  ${a.status.toLowerCase() === 'completed' ? `
                    <a href="#/book-appointment?followUpId=${a.id}" class="btn btn-teal" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem;">
                      <i class="fa-solid fa-calendar-plus"></i>
                      <span>Book Follow-Up</span>
                    </a>
                  ` : ''}
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    </div>
  `;
}

function getSpeciesIcon(species) {
  switch ((species || '').toLowerCase()) {
    case 'dog': return 'fa-dog';
    case 'cat': return 'fa-cat';
    case 'bird': return 'fa-dove';
    case 'rabbit': return 'fa-carrot';
    default: return 'fa-paw';
  }
}

export function setupPetProfileEvents(petId) {
  const user = getCurrentUser();
  if (!user || !petId) return;

  const pet = getUserPetById(user.id, petId);
  if (!pet) return;

  // Edit pet handler
  const editBtn = document.getElementById('profile-edit-pet-btn');
  editBtn?.addEventListener('click', () => {
    openPetModal(pet, () => {
      refreshPetProfile(petId);
    });
  });

  // Add vaccine handlers
  const addVacBtn = document.getElementById('profile-add-vac-btn');
  const tableAddVacBtn = document.getElementById('table-add-vac-btn');

  const handleOpenVac = () => {
    openVaccinationModal(pet.id, pet.name, () => {
      refreshPetProfile(petId);
    });
  };

  addVacBtn?.addEventListener('click', handleOpenVac);
  tableAddVacBtn?.addEventListener('click', handleOpenVac);

  // Delete pet handler
  const deleteBtn = document.getElementById('profile-delete-pet-btn');
  deleteBtn?.addEventListener('click', () => {
    if (confirm(`Are you sure you want to delete ${pet.name}'s profile? This will remove all their health records.`)) {
      deleteUserPet(user.id, pet.id);
      showToast(`${pet.name}'s profile has been deleted.`, 'coral', 'fa-solid fa-trash-can');
      setTimeout(() => {
        window.location.hash = '#/dashboard?tab=pets';
      }, 500);
    }
  });

  // Appointment details modal helpers
  window.petzyOpenApptModal = (apptId) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    const appts = getUserAppointmentsByPet(currentUser.id, petId);
    const appt = appts.find(a => a.id === apptId);
    if (appt) openAppointmentModal(appt, () => refreshPetProfile(petId), false);
  };

  window.petzyCancelApptConfirm = (apptId) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    const appts = getUserAppointmentsByPet(currentUser.id, petId);
    const appt = appts.find(a => a.id === apptId);
    if (appt) openAppointmentModal(appt, () => refreshPetProfile(petId), true);
  };
}

function refreshPetProfile(petId) {
  const root = document.getElementById('app-root');
  if (root) {
    root.innerHTML = renderPetProfile(petId);
    setupPetProfileEvents(petId);
  }
}
