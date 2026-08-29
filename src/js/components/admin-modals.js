/* PETZY Admin Modals Component (Customer details, Service CRUD, Vet CRUD, Schedule & Blocked Dates, Appointment Updater) */
import {
  getUserPets,
  getUserPetById,
  saveUserPet,
  deleteUserPet,
  getStoredServices,
  getServiceById,
  saveService,
  deleteService,
  toggleServiceStatus,
  getStoredVeterinarians,
  getDoctorById,
  saveVeterinarian,
  deleteVeterinarian,
  toggleDoctorStatus,
  getDoctorAvailability,
  saveDoctorAvailability,
  blockDoctorDate,
  unblockDoctorDate,
  getAllGlobalAppointments,
  updateAppointmentStatusByAdmin,
  refundPaymentRecord,
  getPaymentByAppointmentId
} from '../services/storage.js';
import {
  getUserById,
  updateCustomerByAdmin,
  toggleCustomerStatus,
  deleteCustomerByAdmin,
  getAllRegisteredCustomers
} from '../services/auth.js';
import { showToast } from './toast.js';
import { openPaymentReceiptModal } from './payment-receipt-modal.js';

// ----------------------------------------------------
// 1. CUSTOMER & PET INSPECTION MODAL / DRAWER
// ----------------------------------------------------
export function openCustomerDetailsModal(userId, onUpdate = null) {
  const customer = getUserById(userId);
  if (!customer) {
    showToast('Customer record not found.', 'coral', 'fa-solid fa-triangle-exclamation');
    return;
  }

  const pets = getUserPets(customer.id);
  const existing = document.getElementById('petzy-admin-modal');
  if (existing) existing.remove();

  const modalEl = document.createElement('div');
  modalEl.id = 'petzy-admin-modal';
  modalEl.className = 'modal-backdrop animate-fade-in';
  modalEl.style.zIndex = '1060';

  modalEl.innerHTML = `
    <div class="modal-dialog" style="max-width: 780px; margin: 2rem auto; background: var(--color-white); border-radius: var(--radius-2xl); padding: 2rem; border: 1px solid var(--color-border); box-shadow: var(--shadow-xl); max-height: 90vh; overflow-y: auto;">
      
      <!-- Modal Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--color-border); padding-bottom: 1.25rem; margin-bottom: 1.5rem;">
        <div style="display: flex; align-items: center; gap: 0.85rem;">
          <img src="${customer.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}" alt="${customer.name}" style="width: 54px; height: 54px; border-radius: 50%; object-fit: cover; border: 2.5px solid var(--color-forest-green);">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <h3 style="font-size: 1.35rem; color: var(--color-forest-green); margin: 0;">${customer.name}</h3>
              <span class="section-badge" style="background: ${customer.status === 'Disabled' ? '#FDEDEC' : 'var(--color-sage-green-soft)'}; color: ${customer.status === 'Disabled' ? '#C0392B' : 'var(--color-forest-green)'}; font-size: 0.72rem; margin: 0;">
                ${customer.status || 'Active'}
              </span>
            </div>
            <span style="font-size: 0.85rem; color: var(--color-charcoal-muted);">${customer.email} • ID: #${customer.id}</span>
          </div>
        </div>

        <button type="button" class="modal-close-btn" id="close-admin-modal-btn" aria-label="Close" style="background: var(--color-warm-cream); border: 1px solid var(--color-border); width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--color-forest-green);">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Customer Contact & Profile Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; background: var(--color-warm-cream); padding: 1.25rem; border-radius: var(--radius-lg); margin-bottom: 1.75rem; font-size: 0.85rem; border: 1px solid var(--color-border-subtle);">
        <div>
          <span style="color: var(--color-charcoal-muted); font-size: 0.72rem; text-transform: uppercase; font-weight: 700; display: block;">Phone Number</span>
          <strong style="color: var(--color-charcoal);"><i class="fa-solid fa-phone" style="color: var(--color-forest-green); margin-right: 0.3rem;"></i>${customer.phone || '+1 (555) 234-5678'}</strong>
        </div>
        <div>
          <span style="color: var(--color-charcoal-muted); font-size: 0.72rem; text-transform: uppercase; font-weight: 700; display: block;">Home Address</span>
          <strong style="color: var(--color-charcoal);"><i class="fa-solid fa-location-dot" style="color: var(--color-forest-green); margin-right: 0.3rem;"></i>${customer.address || '742 Evergreen Terrace, San Francisco, CA'}</strong>
        </div>
        <div>
          <span style="color: var(--color-charcoal-muted); font-size: 0.72rem; text-transform: uppercase; font-weight: 700; display: block;">Emergency Contact</span>
          <strong style="color: var(--color-charcoal);">${customer.emergencyContact || 'Michael Hayes (+1 555-987-6543)'}</strong>
        </div>
        <div>
          <span style="color: var(--color-charcoal-muted); font-size: 0.72rem; text-transform: uppercase; font-weight: 700; display: block;">Member Since</span>
          <strong style="color: var(--color-forest-green);">${customer.joinedDate || '2025'} (${customer.membershipTier || 'CarePlus Member'})</strong>
        </div>
      </div>

      <!-- Registered Pets Section -->
      <div style="margin-bottom: 1.75rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
          <h4 style="font-size: 1.15rem; color: var(--color-forest-green); margin: 0;">
            <i class="fa-solid fa-paw" style="color: var(--color-soft-coral); margin-right: 0.4rem;"></i>
            Registered Companion Pets (${pets.length})
          </h4>
        </div>

        ${pets.length === 0 ? `
          <p style="color: var(--color-charcoal-muted); font-size: 0.88rem; background: var(--color-warm-cream); padding: 1rem; border-radius: var(--radius-md); text-align: center;">No companion pets registered under this account.</p>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 1rem;">
            ${pets.map(p => `
              <div style="background: var(--color-white); border: 1px solid var(--color-border); border-radius: var(--radius-lg); padding: 1.15rem; box-shadow: var(--shadow-sm);">
                <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.85rem;">
                  <div style="display: flex; align-items: center; gap: 0.85rem;">
                    <img src="${p.photo || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'}" alt="${p.name}" style="width: 50px; height: 50px; border-radius: var(--radius-md); object-fit: cover; border: 2px solid var(--color-forest-green);">
                    <div>
                      <div style="display: flex; align-items: center; gap: 0.45rem;">
                        <h5 style="font-size: 1.05rem; color: var(--color-forest-green); margin: 0;">${p.name}</h5>
                        <span style="font-size: 0.75rem; font-weight: 700; color: var(--color-forest-green); background: var(--color-sage-green-soft); padding: 0.15rem 0.5rem; border-radius: var(--radius-full);">${p.species}</span>
                      </div>
                      <span style="font-size: 0.82rem; color: var(--color-charcoal-muted);">${p.breed} • ${p.age} • ${p.weight || '12 lbs'} • Microchip: ${p.microchip || '985141002948172'}</span>
                    </div>
                  </div>
                </div>

                <!-- Pet Medical History & Vaccinations -->
                <div style="background: var(--color-warm-cream); padding: 0.85rem; border-radius: var(--radius-md); font-size: 0.82rem;">
                  <div style="font-weight: 700; color: var(--color-forest-green); margin-bottom: 0.35rem;">
                    <i class="fa-solid fa-syringe" style="color: var(--color-soft-coral); margin-right: 0.3rem;"></i> Vaccinations & Health History:
                  </div>
                  <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                    ${(p.vaccinations && p.vaccinations.length > 0) ? p.vaccinations.map(v => `
                      <span style="background: #ffffff; padding: 0.2rem 0.6rem; border-radius: var(--radius-sm); border: 1px solid var(--color-border); font-size: 0.78rem;">
                        <strong>${v.name}</strong>: ${v.status} (Valid: ${v.date || 'Up to date'})
                      </span>
                    `).join('') : '<span style="color: var(--color-charcoal-muted);">Routine wellness examination records on file.</span>'}
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- Account Management Actions -->
      <div style="border-top: 1px solid var(--color-border); padding-top: 1.25rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem;">
        <div style="display: flex; gap: 0.5rem;">
          <button type="button" class="btn btn-outline" id="toggle-customer-status-btn" style="font-size: 0.85rem;">
            <i class="fa-solid ${customer.status === 'Disabled' ? 'fa-check' : 'fa-ban'}"></i>
            <span>${customer.status === 'Disabled' ? 'Enable Account' : 'Disable Account'}</span>
          </button>
          <button type="button" class="btn btn-outline" id="delete-customer-btn" style="font-size: 0.85rem; border-color: #F5B7B1; color: #C0392B;">
            <i class="fa-solid fa-trash-can"></i>
            <span>Delete Account</span>
          </button>
        </div>

        <button type="button" class="btn btn-teal" id="close-drawer-done-btn" style="font-size: 0.85rem;">
          <span>Done</span>
        </button>
      </div>

    </div>
  `;

  document.body.appendChild(modalEl);

  const closeModal = () => {
    modalEl.remove();
    if (typeof onUpdate === 'function') onUpdate();
  };

  document.getElementById('close-admin-modal-btn')?.addEventListener('click', closeModal);
  document.getElementById('close-drawer-done-btn')?.addEventListener('click', closeModal);
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeModal();
  });

  // Toggle customer status
  document.getElementById('toggle-customer-status-btn')?.addEventListener('click', () => {
    const updated = toggleCustomerStatus(customer.id);
    showToast(`Account ${updated.status === 'Disabled' ? 'disabled' : 'enabled'} for ${customer.name}.`, 'sage', 'fa-solid fa-user-gear');
    closeModal();
  });

  // Delete customer account
  document.getElementById('delete-customer-btn')?.addEventListener('click', () => {
    if (confirm(`Are you sure you want to permanently delete ${customer.name}'s account and associated records?`)) {
      deleteCustomerByAdmin(customer.id);
      showToast(`Account for ${customer.name} deleted.`, 'coral', 'fa-solid fa-trash-can');
      closeModal();
    }
  });
}

// ----------------------------------------------------
// 2. ADD / EDIT SERVICE MODAL
// ----------------------------------------------------
export function openServiceFormModal(serviceId = null, onSave = null) {
  const service = serviceId ? getServiceById(serviceId) : null;
  const isEditing = !!service;

  const existing = document.getElementById('petzy-admin-modal');
  if (existing) existing.remove();

  const modalEl = document.createElement('div');
  modalEl.id = 'petzy-admin-modal';
  modalEl.className = 'modal-backdrop animate-fade-in';
  modalEl.style.zIndex = '1060';

  modalEl.innerHTML = `
    <div class="modal-dialog" style="max-width: 640px; margin: 2rem auto; background: var(--color-white); border-radius: var(--radius-2xl); padding: 2rem; border: 1px solid var(--color-border); box-shadow: var(--shadow-xl);">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--color-border); padding-bottom: 1rem; margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.35rem; color: var(--color-forest-green); margin: 0;">
          <i class="fa-solid fa-stethoscope" style="color: var(--color-soft-coral); margin-right: 0.4rem;"></i>
          ${isEditing ? 'Edit Service' : 'Add New Clinical Service'}
        </h3>
        <button type="button" class="modal-close-btn" id="close-admin-modal-btn" aria-label="Close">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <form id="admin-service-form">
        <div class="form-group">
          <label class="form-label" for="srv-title">Service Title *</label>
          <input type="text" id="srv-title" class="form-input" required value="${service?.title || ''}" placeholder="e.g. Dental Prophylaxis & Polishing">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label" for="srv-category">Category / Badge *</label>
            <input type="text" id="srv-category" class="form-input" required value="${service?.badge || service?.category || 'Clinical Care'}" placeholder="e.g. Diagnostic & Imaging">
          </div>
          <div class="form-group">
            <label class="form-label" for="srv-pettype">Target Species *</label>
            <input type="text" id="srv-pettype" class="form-input" required value="${service?.petTypeLabel || 'All Companion Pets'}" placeholder="e.g. Dogs, Cats, Small Pets">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label" for="srv-price">Price *</label>
            <input type="text" id="srv-price" class="form-input" required value="${service?.price || '$55'}" placeholder="e.g. $75">
          </div>
          <div class="form-group">
            <label class="form-label" for="srv-duration">Duration *</label>
            <input type="text" id="srv-duration" class="form-input" required value="${service?.duration || '30 Mins'}" placeholder="e.g. 45 Mins">
          </div>
          <div class="form-group">
            <label class="form-label" for="srv-room">Suite / Room *</label>
            <input type="text" id="srv-room" class="form-input" required value="${service?.room || 'Consultation Suite 2B'}" placeholder="e.g. Dental Suite 1A">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="srv-image">Image URL</label>
          <input type="url" id="srv-image" class="form-input" value="${service?.image || 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=800&q=80'}" placeholder="https://images.unsplash.com/...">
        </div>

        <div class="form-group">
          <label class="form-label" for="srv-desc">Short Description *</label>
          <textarea id="srv-desc" class="form-input" rows="3" required placeholder="Comprehensive description of clinical procedure...">${service?.shortDesc || service?.description || ''}</textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; border-top: 1px solid var(--color-border); padding-top: 1.25rem;">
          <button type="button" class="btn btn-outline" id="cancel-srv-btn">Cancel</button>
          <button type="submit" class="btn btn-teal">
            <i class="fa-solid fa-save"></i>
            <span>${isEditing ? 'Save Changes' : 'Create Service'}</span>
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modalEl);

  const closeModal = () => modalEl.remove();
  document.getElementById('close-admin-modal-btn')?.addEventListener('click', closeModal);
  document.getElementById('cancel-srv-btn')?.addEventListener('click', closeModal);
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeModal();
  });

  document.getElementById('admin-service-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = document.getElementById('srv-title').value.trim();
    const badge = document.getElementById('srv-category').value.trim();
    const petTypeLabel = document.getElementById('srv-pettype').value.trim();
    const price = document.getElementById('srv-price').value.trim();
    const duration = document.getElementById('srv-duration').value.trim();
    const room = document.getElementById('srv-room').value.trim();
    const image = document.getElementById('srv-image').value.trim();
    const description = document.getElementById('srv-desc').value.trim();

    const payload = {
      ...(service || {}),
      id: service?.id || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title,
      badge,
      petTypeLabel,
      price,
      duration,
      room,
      image,
      shortDesc: description,
      description,
      status: service?.status || 'Active'
    };

    saveService(payload);
    showToast(`Service "${title}" saved successfully!`, 'sage', 'fa-solid fa-circle-check');
    closeModal();
    if (typeof onSave === 'function') onSave();
  });
}

// ----------------------------------------------------
// 3. ADD / EDIT VETERINARIAN MODAL
// ----------------------------------------------------
export function openVeterinarianFormModal(doctorId = null, onSave = null) {
  const doctor = doctorId ? getDoctorById(doctorId) : null;
  const isEditing = !!doctor;

  const existing = document.getElementById('petzy-admin-modal');
  if (existing) existing.remove();

  const modalEl = document.createElement('div');
  modalEl.id = 'petzy-admin-modal';
  modalEl.className = 'modal-backdrop animate-fade-in';
  modalEl.style.zIndex = '1060';

  modalEl.innerHTML = `
    <div class="modal-dialog" style="max-width: 640px; margin: 2rem auto; background: var(--color-white); border-radius: var(--radius-2xl); padding: 2rem; border: 1px solid var(--color-border); box-shadow: var(--shadow-xl);">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--color-border); padding-bottom: 1rem; margin-bottom: 1.5rem;">
        <h3 style="font-size: 1.35rem; color: var(--color-forest-green); margin: 0;">
          <i class="fa-solid fa-user-doctor" style="color: var(--color-soft-coral); margin-right: 0.4rem;"></i>
          ${isEditing ? 'Edit Veterinarian Profile' : 'Add New Veterinarian'}
        </h3>
        <button type="button" class="modal-close-btn" id="close-admin-modal-btn" aria-label="Close">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <form id="admin-doctor-form">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label" for="doc-name">Doctor Full Name *</label>
            <input type="text" id="doc-name" class="form-input" required value="${doctor?.name || ''}" placeholder="e.g. Dr. Emily Thorne, DVM">
          </div>
          <div class="form-group">
            <label class="form-label" for="doc-title">Clinical Role / Specialty *</label>
            <input type="text" id="doc-title" class="form-input" required value="${doctor?.title || ''}" placeholder="e.g. Veterinary Surgeon & Orthopedics">
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
          <div class="form-group">
            <label class="form-label" for="doc-degrees">Credentials & Degrees *</label>
            <input type="text" id="doc-degrees" class="form-input" required value="${doctor?.degrees || 'DVM, DACVS'}" placeholder="e.g. DVM, MS, DACVIM">
          </div>
          <div class="form-group">
            <label class="form-label" for="doc-experience">Experience *</label>
            <input type="text" id="doc-experience" class="form-input" required value="${doctor?.experience || '8+ Years Experience'}" placeholder="e.g. 10+ Years Experience">
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="doc-image">Profile Photo URL</label>
          <input type="url" id="doc-image" class="form-input" value="${doctor?.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80'}" placeholder="https://images.unsplash.com/...">
        </div>

        <div class="form-group">
          <label class="form-label" for="doc-bio">Professional Bio & Philosophy *</label>
          <textarea id="doc-bio" class="form-input" rows="3" required placeholder="Doctor's background, clinical philosophy, and interests...">${doctor?.bio || ''}</textarea>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.5rem; border-top: 1px solid var(--color-border); padding-top: 1.25rem;">
          <button type="button" class="btn btn-outline" id="cancel-doc-btn">Cancel</button>
          <button type="submit" class="btn btn-teal">
            <i class="fa-solid fa-save"></i>
            <span>${isEditing ? 'Save Changes' : 'Create Specialist'}</span>
          </button>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modalEl);

  const closeModal = () => modalEl.remove();
  document.getElementById('close-admin-modal-btn')?.addEventListener('click', closeModal);
  document.getElementById('cancel-doc-btn')?.addEventListener('click', closeModal);
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeModal();
  });

  document.getElementById('admin-doctor-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('doc-name').value.trim();
    const title = document.getElementById('doc-title').value.trim();
    const degrees = document.getElementById('doc-degrees').value.trim();
    const experience = document.getElementById('doc-experience').value.trim();
    const image = document.getElementById('doc-image').value.trim();
    const bio = document.getElementById('doc-bio').value.trim();

    const payload = {
      ...(doctor || {}),
      id: doctor?.id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name,
      title,
      degrees,
      experience,
      image,
      bio,
      badge: doctor?.badge || 'Specialist',
      status: doctor?.status || 'Active'
    };

    saveVeterinarian(payload);
    showToast(`Specialist ${name} profile saved!`, 'sage', 'fa-solid fa-circle-check');
    closeModal();
    if (typeof onSave === 'function') onSave();
  });
}

// ----------------------------------------------------
// 4. DOCTOR SCHEDULE & BLOCKED DATES MODAL
// ----------------------------------------------------
export function openDoctorScheduleModal(doctorId, onSave = null) {
  const doctor = getDoctorById(doctorId);
  if (!doctor) return;

  const availability = getDoctorAvailability(doctor.id);
  const existing = document.getElementById('petzy-admin-modal');
  if (existing) existing.remove();

  const modalEl = document.createElement('div');
  modalEl.id = 'petzy-admin-modal';
  modalEl.className = 'modal-backdrop animate-fade-in';
  modalEl.style.zIndex = '1060';

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  modalEl.innerHTML = `
    <div class="modal-dialog" style="max-width: 680px; margin: 2rem auto; background: var(--color-white); border-radius: var(--radius-2xl); padding: 2rem; border: 1px solid var(--color-border); box-shadow: var(--shadow-xl); max-height: 90vh; overflow-y: auto;">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--color-border); padding-bottom: 1rem; margin-bottom: 1.5rem;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <img src="${doctor.image}" alt="${doctor.name}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid var(--color-forest-green);">
          <div>
            <h3 style="font-size: 1.25rem; color: var(--color-forest-green); margin: 0;">${doctor.name} - Schedule & Availability</h3>
            <span style="font-size: 0.8rem; color: var(--color-charcoal-muted);">${doctor.title}</span>
          </div>
        </div>
        <button type="button" class="modal-close-btn" id="close-admin-modal-btn" aria-label="Close">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Working Days Matrix -->
      <div style="margin-bottom: 1.75rem;">
        <label class="form-label" style="font-size: 0.9rem; font-weight: 700; margin-bottom: 0.5rem; display: block;">
          <i class="fa-solid fa-calendar-week" style="color: var(--color-forest-green); margin-right: 0.35rem;"></i>
          Active Working Days
        </label>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.5rem;">
          ${daysOfWeek.map(d => {
            const isChecked = availability.workingDays.includes(d);
            return `
              <label style="display: flex; align-items: center; gap: 0.5rem; background: var(--color-warm-cream); padding: 0.5rem 0.75rem; border-radius: var(--radius-md); border: 1px solid var(--color-border); cursor: pointer; font-size: 0.85rem;">
                <input type="checkbox" class="working-day-cb" value="${d}" ${isChecked ? 'checked' : ''} style="accent-color: var(--color-forest-green);">
                <span>${d}</span>
              </label>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Blocked Dates / Leave Manager -->
      <div style="margin-bottom: 1.75rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
          <label class="form-label" style="font-size: 0.9rem; font-weight: 700; margin: 0;">
            <i class="fa-solid fa-calendar-xmark" style="color: var(--color-soft-coral); margin-right: 0.35rem;"></i>
            Blocked Dates & Leave Schedule
          </label>
        </div>

        <!-- Add Blocked Date Form -->
        <div style="display: flex; gap: 0.5rem; margin-bottom: 1rem; flex-wrap: wrap;">
          <input type="date" id="new-block-date" class="form-input" style="flex: 1; min-width: 140px; font-size: 0.85rem;" min="${new Date().toISOString().split('T')[0]}">
          <input type="text" id="new-block-reason" class="form-input" style="flex: 2; min-width: 180px; font-size: 0.85rem;" placeholder="Reason (e.g. Surgical Conference)">
          <button type="button" class="btn btn-coral" id="add-block-date-btn" style="font-size: 0.85rem;">
            <i class="fa-solid fa-plus"></i> Block Date
          </button>
        </div>

        <!-- List of Blocked Dates -->
        <div id="blocked-dates-list" style="display: flex; flex-direction: column; gap: 0.4rem;">
          ${availability.blockedDates.length === 0 ? `
            <span style="font-size: 0.82rem; color: var(--color-charcoal-muted);">No blocked dates scheduled for this specialist.</span>
          ` : availability.blockedDates.map(b => `
            <div style="display: flex; align-items: center; justify-content: space-between; background: #FDEDEC; border: 1px solid #F5B7B1; padding: 0.5rem 0.85rem; border-radius: var(--radius-md); font-size: 0.82rem;">
              <div>
                <strong style="color: #C0392B;"><i class="fa-solid fa-calendar-xmark" style="margin-right: 0.3rem;"></i>${b.date}</strong>
                <span style="color: var(--color-charcoal); margin-left: 0.5rem;">(${b.reason || 'Unavailable'})</span>
              </div>
              <button type="button" class="unblock-btn" data-date="${b.date}" style="background: none; border: none; color: #C0392B; cursor: pointer; font-size: 0.85rem;" title="Unblock Date">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          `).join('')}
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 0.75rem; border-top: 1px solid var(--color-border); padding-top: 1.25rem;">
        <button type="button" class="btn btn-outline" id="close-sched-btn">Close</button>
        <button type="button" class="btn btn-teal" id="save-sched-btn">
          <i class="fa-solid fa-save"></i>
          <span>Save Working Days</span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modalEl);

  const closeModal = () => modalEl.remove();
  document.getElementById('close-admin-modal-btn')?.addEventListener('click', closeModal);
  document.getElementById('close-sched-btn')?.addEventListener('click', closeModal);
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeModal();
  });

  // Block Date button
  document.getElementById('add-block-date-btn')?.addEventListener('click', () => {
    const d = document.getElementById('new-block-date')?.value;
    const r = document.getElementById('new-block-reason')?.value.trim() || 'Clinical Leave';
    if (!d) {
      showToast('Please select a date to block.', 'coral', 'fa-solid fa-calendar');
      return;
    }
    blockDoctorDate(doctor.id, d, r);
    showToast(`Date ${d} blocked for ${doctor.name}.`, 'sage', 'fa-solid fa-circle-check');
    openDoctorScheduleModal(doctor.id, onSave);
  });

  // Unblock buttons
  modalEl.querySelectorAll('.unblock-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const d = btn.getAttribute('data-date');
      unblockDoctorDate(doctor.id, d);
      showToast(`Date ${d} unblocked.`, 'sage', 'fa-solid fa-circle-check');
      openDoctorScheduleModal(doctor.id, onSave);
    });
  });

  // Save Working Days
  document.getElementById('save-sched-btn')?.addEventListener('click', () => {
    const selectedDays = [];
    modalEl.querySelectorAll('.working-day-cb:checked').forEach(cb => selectedDays.push(cb.value));

    saveDoctorAvailability(doctor.id, {
      ...availability,
      workingDays: selectedDays
    });

    showToast(`Schedule updated for ${doctor.name}!`, 'sage', 'fa-solid fa-circle-check');
    closeModal();
    if (typeof onSave === 'function') onSave();
  });
}

// ----------------------------------------------------
// 5. APPOINTMENT STATUS & DIAGNOSIS UPDATER MODAL
// ----------------------------------------------------
export function openAppointmentStatusModal(apptId, onUpdate = null) {
  const allAppts = getAllGlobalAppointments();
  const appt = allAppts.find(a => a.id === apptId);
  if (!appt) {
    showToast('Appointment record not found.', 'coral', 'fa-solid fa-triangle-exclamation');
    return;
  }

  const existing = document.getElementById('petzy-admin-modal');
  if (existing) existing.remove();

  const modalEl = document.createElement('div');
  modalEl.id = 'petzy-admin-modal';
  modalEl.className = 'modal-backdrop animate-fade-in';
  modalEl.style.zIndex = '1060';

  modalEl.innerHTML = `
    <div class="modal-dialog" style="max-width: 620px; margin: 2rem auto; background: var(--color-white); border-radius: var(--radius-2xl); padding: 2rem; border: 1px solid var(--color-border); box-shadow: var(--shadow-xl);">
      <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--color-border); padding-bottom: 1rem; margin-bottom: 1.5rem;">
        <div>
          <h3 style="font-size: 1.35rem; color: var(--color-forest-green); margin: 0;">Update Appointment #${appt.id}</h3>
          <span style="font-size: 0.82rem; color: var(--color-charcoal-muted);">${appt.service} for ${appt.petName}</span>
        </div>
        <button type="button" class="modal-close-btn" id="close-admin-modal-btn" aria-label="Close">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <form id="admin-appt-status-form">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;">
          <div class="form-group">
            <label class="form-label" for="appt-status-select">Appointment Status *</label>
            <select id="appt-status-select" class="form-input" style="font-size: 0.9rem;">
              <option value="Confirmed" ${appt.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="Upcoming" ${appt.status === 'Upcoming' ? 'selected' : ''}>Upcoming</option>
              <option value="Completed" ${appt.status === 'Completed' ? 'selected' : ''}>Completed</option>
              <option value="Cancelled" ${appt.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
              <option value="Rescheduled" ${appt.status === 'Rescheduled' ? 'selected' : ''}>Rescheduled</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label" for="appt-payment-select">Payment Status *</label>
            <select id="appt-payment-select" class="form-input" style="font-size: 0.9rem;">
              <option value="Paid" ${appt.paymentStatus === 'Paid' ? 'selected' : ''}>Paid</option>
              <option value="Pending" ${appt.paymentStatus === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Refunded" ${appt.paymentStatus === 'Refunded' ? 'selected' : ''}>Refunded</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" for="appt-diagnosis-text">Clinical Assessment & Examination Notes</label>
          <textarea id="appt-diagnosis-text" class="form-input" rows="4" placeholder="Enter clinical diagnosis, prescribed medication, follow-up recommendations...">${appt.diagnosisSummary || ''}</textarea>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--color-border); padding-top: 1.25rem; margin-top: 1.5rem;">
          <button type="button" class="btn btn-outline" id="appt-view-receipt-action" style="font-size: 0.85rem;">
            <i class="fa-solid fa-file-invoice"></i> View Receipt
          </button>
          
          <div style="display: flex; gap: 0.75rem;">
            <button type="button" class="btn btn-outline" id="cancel-appt-modal-btn">Cancel</button>
            <button type="submit" class="btn btn-teal">
              <i class="fa-solid fa-check"></i>
              <span>Update Record</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  `;

  document.body.appendChild(modalEl);

  const closeModal = () => modalEl.remove();
  document.getElementById('close-admin-modal-btn')?.addEventListener('click', closeModal);
  document.getElementById('cancel-appt-modal-btn')?.addEventListener('click', closeModal);
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeModal();
  });

  document.getElementById('appt-view-receipt-action')?.addEventListener('click', () => {
    openPaymentReceiptModal(appt.paymentId || appt.id);
  });

  document.getElementById('admin-appt-status-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const newStatus = document.getElementById('appt-status-select').value;
    const newPayStatus = document.getElementById('appt-payment-select').value;
    const diagnosis = document.getElementById('appt-diagnosis-text').value.trim();

    updateAppointmentStatusByAdmin(appt.id, newStatus, {
      paymentStatus: newPayStatus,
      diagnosisSummary: diagnosis
    });

    showToast(`Appointment #${appt.id} status updated to ${newStatus}!`, 'sage', 'fa-solid fa-circle-check');
    closeModal();
    if (typeof onUpdate === 'function') onUpdate();
  });
}
