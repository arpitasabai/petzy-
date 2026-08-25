/* PETZY Add Vaccination Record Modal Component */
import { addVaccinationRecord } from '../services/storage.js';
import { getCurrentUser } from '../services/auth.js';
import { showToast } from './toast.js';

let currentPetId = null;
let onVaccineAddedCallback = null;

export function openVaccinationModal(petId, petName, callback = null) {
  currentPetId = petId;
  onVaccineAddedCallback = callback;

  let modalEl = document.getElementById('petzy-vaccination-modal-root');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'petzy-vaccination-modal-root';
    document.body.appendChild(modalEl);
  }

  const today = new Date().toISOString().split('T')[0];
  const nextYear = new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0];

  modalEl.innerHTML = `
    <div class="petzy-modal-backdrop" id="vac-modal-backdrop">
      <div class="petzy-modal-container">
        <!-- Header -->
        <div class="petzy-modal-header">
          <div>
            <div class="section-badge sage" style="margin-bottom: 0.35rem; font-size: 0.75rem;">
              <i class="fa-solid fa-syringe"></i>
              <span>Immunization Record</span>
            </div>
            <h3>Add Vaccination for ${petName}</h3>
          </div>
          <button class="petzy-modal-close-btn" id="vac-close-x" aria-label="Close modal">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Form Body -->
        <form id="vaccination-form">
          <div class="petzy-modal-body">
            <div class="form-group">
              <label class="form-label" for="vac-name">Vaccine Name *</label>
              <input type="text" id="vac-name" class="form-input" placeholder="e.g. Rabies (3-Year Booster), DHPP Core, Bordetella, FVRCP" required>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label" for="vac-date">Date Administered *</label>
                <input type="date" id="vac-date" class="form-input" required value="${today}">
              </div>
              <div class="form-group">
                <label class="form-label" for="vac-due">Next Due Date *</label>
                <input type="date" id="vac-due" class="form-input" required value="${nextYear}">
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label" for="vac-vet">Administering Doctor *</label>
                <select id="vac-vet" class="form-input" required>
                  <option value="Dr. Ananya Sharma">Dr. Ananya Sharma (Surgical Director)</option>
                  <option value="Dr. Rohan Mehta">Dr. Rohan Mehta (Wellness Lead)</option>
                  <option value="Dr. Sarah Kapoor">Dr. Sarah Kapoor (Senior Physician)</option>
                  <option value="Dr. David Chen">Dr. David Chen (Emergency Lead)</option>
                  <option value="Other Certified Veterinarian">Other Certified Veterinarian</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="vac-status">Status *</label>
                <select id="vac-status" class="form-input" required>
                  <option value="Up to Date" selected>Up to Date</option>
                  <option value="Due Soon">Due Soon</option>
                  <option value="Overdue">Overdue</option>
                </select>
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label" for="vac-batch">Batch / Lot Number (Optional)</label>
                <input type="text" id="vac-batch" class="form-input" placeholder="e.g. RB-2026-8819">
              </div>
              <div class="form-group">
                <label class="form-label" for="vac-clinic">Clinic / Hospital</label>
                <input type="text" id="vac-clinic" class="form-input" value="PETZY Central Hospital">
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="petzy-modal-footer">
            <button type="button" class="btn btn-outline" id="vac-cancel-btn">Cancel</button>
            <button type="submit" class="btn btn-teal">
              <i class="fa-solid fa-plus"></i>
              <span>Save Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  setupVacModalEvents(modalEl);
  setTimeout(() => {
    modalEl.querySelector('.petzy-modal-backdrop')?.classList.add('open');
  }, 10);
}

export function closeVaccinationModal() {
  const backdrop = document.querySelector('#petzy-vaccination-modal-root .petzy-modal-backdrop');
  if (backdrop) {
    backdrop.classList.remove('open');
    setTimeout(() => {
      const root = document.getElementById('petzy-vaccination-modal-root');
      if (root) root.innerHTML = '';
    }, 280);
  }
}

function setupVacModalEvents(modalEl) {
  const backdrop = modalEl.querySelector('#vac-modal-backdrop');
  const closeX = modalEl.querySelector('#vac-close-x');
  const cancelBtn = modalEl.querySelector('#vac-cancel-btn');
  const form = modalEl.querySelector('#vaccination-form');

  closeX?.addEventListener('click', closeVaccinationModal);
  cancelBtn?.addEventListener('click', closeVaccinationModal);
  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) closeVaccinationModal();
  });

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user || !currentPetId) return;

    const name = document.getElementById('vac-name')?.value.trim();
    const dateAdministered = document.getElementById('vac-date')?.value;
    const nextDueDate = document.getElementById('vac-due')?.value;
    const veterinarian = document.getElementById('vac-vet')?.value;
    const status = document.getElementById('vac-status')?.value;
    const batchNumber = document.getElementById('vac-batch')?.value.trim() || 'LOT-2026-X';
    const clinic = document.getElementById('vac-clinic')?.value.trim() || 'PETZY Central Hospital';

    const record = {
      name,
      dateAdministered,
      nextDueDate,
      veterinarian,
      status,
      batchNumber,
      clinic
    };

    addVaccinationRecord(user.id, currentPetId, record);
    showToast(`Vaccination record for ${name} added successfully!`, 'sage', 'fa-solid fa-syringe');
    closeVaccinationModal();

    if (typeof onVaccineAddedCallback === 'function') {
      onVaccineAddedCallback(record);
    }
  });
}
