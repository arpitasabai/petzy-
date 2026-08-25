/* PETZY Add & Edit Pet Modal Component */
import { PET_IMAGE_PRESETS, saveUserPet } from '../services/storage.js';
import { getCurrentUser } from '../services/auth.js';
import { showToast } from './toast.js';

let modalContainer = null;
let currentPetToEdit = null;
let onSaveCallback = null;
let selectedSpecies = 'Dog';
let selectedPhotoUrl = PET_IMAGE_PRESETS.dog[0];

export function openPetModal(pet = null, callback = null) {
  currentPetToEdit = pet;
  onSaveCallback = callback;
  selectedSpecies = pet ? pet.species : 'Dog';
  selectedPhotoUrl = pet ? pet.photo : PET_IMAGE_PRESETS.dog[0];

  let modalEl = document.getElementById('petzy-pet-modal-root');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'petzy-pet-modal-root';
    document.body.appendChild(modalEl);
  }

  modalEl.innerHTML = renderModalHtml();
  setupModalEvents(modalEl);

  setTimeout(() => {
    modalEl.querySelector('.petzy-modal-backdrop')?.classList.add('open');
  }, 10);
}

export function closePetModal() {
  const backdrop = document.querySelector('#petzy-pet-modal-root .petzy-modal-backdrop');
  if (backdrop) {
    backdrop.classList.remove('open');
    setTimeout(() => {
      const root = document.getElementById('petzy-pet-modal-root');
      if (root) root.innerHTML = '';
    }, 280);
  }
}

function renderModalHtml() {
  const isEdit = !!currentPetToEdit;
  const p = currentPetToEdit || {};

  return `
    <div class="petzy-modal-backdrop" id="pet-modal-backdrop">
      <div class="petzy-modal-container">
        <!-- Header -->
        <div class="petzy-modal-header">
          <div>
            <div class="section-badge ${isEdit ? 'sage' : 'coral'}" style="margin-bottom: 0.35rem; font-size: 0.75rem;">
              <i class="fa-solid fa-paw"></i>
              <span>${isEdit ? 'Edit Pet Profile' : 'New Family Member'}</span>
            </div>
            <h3>${isEdit ? `Edit ${p.name}'s Profile` : 'Add a New Pet'}</h3>
          </div>
          <button class="petzy-modal-close-btn" id="modal-close-x" aria-label="Close modal">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Form Body -->
        <form id="pet-details-form">
          <div class="petzy-modal-body">
            <!-- Species Selector Cards -->
            <div class="form-group">
              <label class="form-label">Species *</label>
              <div class="species-selector-grid">
                <button type="button" class="species-chip-btn ${selectedSpecies === 'Dog' ? 'selected' : ''}" data-species="Dog">
                  <i class="fa-solid fa-dog"></i>
                  <span>Dog</span>
                </button>
                <button type="button" class="species-chip-btn ${selectedSpecies === 'Cat' ? 'selected' : ''}" data-species="Cat">
                  <i class="fa-solid fa-cat"></i>
                  <span>Cat</span>
                </button>
                <button type="button" class="species-chip-btn ${selectedSpecies === 'Bird' ? 'selected' : ''}" data-species="Bird">
                  <i class="fa-solid fa-dove"></i>
                  <span>Bird</span>
                </button>
                <button type="button" class="species-chip-btn ${selectedSpecies === 'Rabbit' ? 'selected' : ''}" data-species="Rabbit">
                  <i class="fa-solid fa-carrot"></i>
                  <span>Rabbit</span>
                </button>
                <button type="button" class="species-chip-btn ${selectedSpecies === 'Other' ? 'selected' : ''}" data-species="Other">
                  <i class="fa-solid fa-paw"></i>
                  <span>Other</span>
                </button>
              </div>
            </div>

            <!-- Pet Name & Breed -->
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label" for="pet-form-name">Pet Name *</label>
                <input type="text" id="pet-form-name" class="form-input" placeholder="e.g. Buddy, Luna" required value="${p.name || ''}">
              </div>
              <div class="form-group">
                <label class="form-label" for="pet-form-breed">Breed *</label>
                <input type="text" id="pet-form-breed" class="form-input" placeholder="e.g. Golden Retriever, Siamese" required value="${p.breed || ''}">
              </div>
            </div>

            <!-- DOB / Age & Gender -->
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label" for="pet-form-age">Age / Life Stage *</label>
                <input type="text" id="pet-form-age" class="form-input" placeholder="e.g. 3 Years, 6 Months" required value="${p.age || ''}">
              </div>
              <div class="form-group">
                <label class="form-label" for="pet-form-gender">Gender *</label>
                <select id="pet-form-gender" class="form-input" required>
                  <option value="Male" ${p.gender === 'Male' ? 'selected' : ''}>Male</option>
                  <option value="Female" ${p.gender === 'Female' ? 'selected' : ''}>Female</option>
                  <option value="Male (Neutered)" ${p.gender === 'Male (Neutered)' || !p.gender ? 'selected' : ''}>Male (Neutered)</option>
                  <option value="Female (Spayed)" ${p.gender === 'Female (Spayed)' ? 'selected' : ''}>Female (Spayed)</option>
                </select>
              </div>
            </div>

            <!-- Weight & Microchip -->
            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label" for="pet-form-weight">Weight (kg / lbs) *</label>
                <input type="text" id="pet-form-weight" class="form-input" placeholder="e.g. 28.5 kg" required value="${p.weight || ''}">
              </div>
              <div class="form-group">
                <label class="form-label" for="pet-form-microchip">Microchip ID (Optional)</label>
                <input type="text" id="pet-form-microchip" class="form-input" placeholder="e.g. PETZY-985-0012-US" value="${p.microchip || ''}">
              </div>
            </div>

            <!-- Photo Selection & Preview -->
            <div class="form-group">
              <label class="form-label">Pet Photo</label>
              <div style="display: flex; align-items: center; gap: 1.25rem; margin-bottom: 0.75rem;">
                <img id="pet-photo-preview" src="${selectedPhotoUrl}" alt="Pet Preview" style="width: 72px; height: 72px; border-radius: var(--radius-md); object-fit: cover; border: 2px solid var(--color-forest-green);">
                <div style="flex: 1;">
                  <span style="font-size: 0.85rem; color: var(--color-charcoal-muted); display: block; margin-bottom: 0.4rem;">Choose a photo preset or enter custom image URL:</span>
                  <input type="url" id="pet-form-photo-url" class="form-input" placeholder="https://..." value="${selectedPhotoUrl}">
                </div>
              </div>

              <!-- Quick Presets -->
              <div id="photo-presets-row" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${getPresetsHtml(selectedSpecies)}
              </div>
            </div>

            <!-- Medical Notes & Allergies -->
            <div class="form-group">
              <label class="form-label" for="pet-form-allergies">Known Allergies & Food Sensitivities</label>
              <input type="text" id="pet-form-allergies" class="form-input" placeholder="e.g. Chicken meal, Flea bites, None" value="${p.allergies || ''}">
            </div>

            <div class="form-group">
              <label class="form-label" for="pet-form-conditions">Existing Conditions / Past Surgeries</label>
              <input type="text" id="pet-form-conditions" class="form-input" placeholder="e.g. Mild hip dysplasia, Seasonal allergies, None" value="${p.conditions || ''}">
            </div>

            <div class="form-group">
              <label class="form-label" for="pet-form-notes">General Temperament & Clinical Notes</label>
              <textarea id="pet-form-notes" class="form-textarea" rows="2" placeholder="e.g. Friendly, playful, loves treats during vet exams...">${p.medicalNotes || ''}</textarea>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="petzy-modal-footer">
            <button type="button" class="btn btn-outline" id="modal-cancel-btn">Cancel</button>
            <button type="submit" class="btn btn-teal">
              <i class="fa-solid fa-floppy-disk"></i>
              <span>${isEdit ? 'Update Pet' : 'Save New Pet'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function getPresetsHtml(species) {
  const key = species.toLowerCase();
  const presets = PET_IMAGE_PRESETS[key] || PET_IMAGE_PRESETS.dog;

  return presets.map(url => `
    <button type="button" class="preset-photo-chip ${url === selectedPhotoUrl ? 'active' : ''}" data-url="${url}" style="width: 44px; height: 44px; border-radius: var(--radius-md); overflow: hidden; border: 2px solid ${url === selectedPhotoUrl ? 'var(--color-forest-green)' : 'transparent'}; padding: 0; cursor: pointer;">
      <img src="${url}" alt="Preset" style="width: 100%; height: 100%; object-fit: cover;">
    </button>
  `).join('');
}

function setupModalEvents(modalEl) {
  const backdrop = modalEl.querySelector('#pet-modal-backdrop');
  const closeX = modalEl.querySelector('#modal-close-x');
  const cancelBtn = modalEl.querySelector('#modal-cancel-btn');
  const form = modalEl.querySelector('#pet-details-form');
  const photoUrlInput = modalEl.querySelector('#pet-form-photo-url');
  const photoPreview = modalEl.querySelector('#pet-photo-preview');
  const speciesBtns = modalEl.querySelectorAll('.species-chip-btn');
  const presetsContainer = modalEl.querySelector('#photo-presets-row');

  // Close handlers
  closeX?.addEventListener('click', closePetModal);
  cancelBtn?.addEventListener('click', closePetModal);
  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) closePetModal();
  });

  // Species toggle
  speciesBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      speciesBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedSpecies = btn.getAttribute('data-species') || 'Dog';

      // update preset list
      if (presetsContainer) {
        presetsContainer.innerHTML = getPresetsHtml(selectedSpecies);
        setupPresetListeners(presetsContainer, photoUrlInput, photoPreview);
      }

      // set default preset for species
      const key = selectedSpecies.toLowerCase();
      const presets = PET_IMAGE_PRESETS[key] || PET_IMAGE_PRESETS.dog;
      selectedPhotoUrl = presets[0];
      if (photoUrlInput) photoUrlInput.value = selectedPhotoUrl;
      if (photoPreview) photoPreview.src = selectedPhotoUrl;
    });
  });

  // Custom photo url typing
  photoUrlInput?.addEventListener('input', (e) => {
    const val = e.target.value.trim();
    if (val && photoPreview) {
      photoPreview.src = val;
      selectedPhotoUrl = val;
    }
  });

  if (presetsContainer) {
    setupPresetListeners(presetsContainer, photoUrlInput, photoPreview);
  }

  // Form submit
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) {
      showToast('Please sign in to save pets.', 'coral', 'fa-solid fa-lock');
      return;
    }

    const name = document.getElementById('pet-form-name')?.value.trim();
    const breed = document.getElementById('pet-form-breed')?.value.trim();
    const age = document.getElementById('pet-form-age')?.value.trim();
    const gender = document.getElementById('pet-form-gender')?.value;
    const weight = document.getElementById('pet-form-weight')?.value.trim();
    const microchip = document.getElementById('pet-form-microchip')?.value.trim() || 'Unassigned';
    const allergies = document.getElementById('pet-form-allergies')?.value.trim() || 'None reported';
    const conditions = document.getElementById('pet-form-conditions')?.value.trim() || 'None';
    const medicalNotes = document.getElementById('pet-form-notes')?.value.trim() || 'Regular healthy veterinary checkup routine.';
    const photo = photoUrlInput?.value.trim() || selectedPhotoUrl;

    const petData = {
      id: currentPetToEdit ? currentPetToEdit.id : undefined,
      name,
      species: selectedSpecies,
      breed,
      age,
      gender,
      weight,
      microchip,
      allergies,
      conditions,
      medicalNotes,
      photo,
      vaccinations: currentPetToEdit ? (currentPetToEdit.vaccinations || []) : [
        {
          id: `vac_${Date.now()}`,
          name: selectedSpecies === 'Cat' ? 'FVRCP Core Feline' : 'Rabies 1-Year Core',
          dateAdministered: new Date().toISOString().split('T')[0],
          nextDueDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
          veterinarian: 'Dr. Ananya Sharma',
          status: 'Up to Date',
          clinic: 'PETZY Central Hospital'
        }
      ]
    };

    saveUserPet(user.id, petData);
    showToast(`${name} has been ${currentPetToEdit ? 'updated' : 'added to your PETZY profile'}!`, 'sage', 'fa-solid fa-paw');
    closePetModal();

    if (typeof onSaveCallback === 'function') {
      onSaveCallback(petData);
    }
  });
}

function setupPresetListeners(presetsContainer, photoUrlInput, photoPreview) {
  presetsContainer.querySelectorAll('.preset-photo-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      presetsContainer.querySelectorAll('.preset-photo-chip').forEach(c => c.style.borderColor = 'transparent');
      chip.style.borderColor = 'var(--color-forest-green)';
      const url = chip.getAttribute('data-url');
      if (url) {
        selectedPhotoUrl = url;
        if (photoUrlInput) photoUrlInput.value = url;
        if (photoPreview) photoPreview.src = url;
      }
    });
  });
}
