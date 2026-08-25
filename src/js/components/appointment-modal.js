/* PETZY Appointment Details Modal Component */
import { cancelUserAppointment } from '../services/storage.js';
import { getCurrentUser } from '../services/auth.js';
import { showToast } from './toast.js';

let onUpdateCallback = null;

export function openAppointmentModal(appointment, callback = null) {
  if (!appointment) return;
  onUpdateCallback = callback;

  let modalEl = document.getElementById('petzy-appointment-modal-root');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'petzy-appointment-modal-root';
    document.body.appendChild(modalEl);
  }

  const isUpcoming = appointment.status === 'Upcoming';
  const isCancelled = appointment.status === 'Cancelled';

  modalEl.innerHTML = `
    <div class="petzy-modal-backdrop" id="appt-modal-backdrop">
      <div class="petzy-modal-container">
        <!-- Header -->
        <div class="petzy-modal-header">
          <div>
            <div class="section-badge ${isUpcoming ? 'coral' : (isCancelled ? 'red' : 'sage')}" style="margin-bottom: 0.35rem; font-size: 0.75rem; ${isCancelled ? 'background: #FDEDEC; color: #C0392B;' : ''}">
              <i class="fa-solid ${isUpcoming ? 'fa-calendar-check' : (isCancelled ? 'fa-calendar-xmark' : 'fa-circle-check')}"></i>
              <span>${appointment.status} Visit Details</span>
            </div>
            <h3>${appointment.service}</h3>
          </div>
          <button class="petzy-modal-close-btn" id="appt-close-x" aria-label="Close modal">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <!-- Body -->
        <div class="petzy-modal-body">
          <!-- Pet & Doctor Spotlight Banner -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0.85rem; padding: 1.15rem; background-color: var(--color-warm-cream); border-radius: var(--radius-lg); border: 1px solid var(--color-border); margin-bottom: 1.25rem;">
            <!-- Pet Info -->
            <div style="display: flex; align-items: center; gap: 0.75rem; min-width: 0;">
              <img src="${appointment.petPhoto}" alt="${appointment.petName}" style="width: 48px; height: 48px; border-radius: var(--radius-md); object-fit: cover; border: 2px solid var(--color-forest-green); flex-shrink: 0;">
              <div style="overflow: hidden;">
                <span style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: var(--color-charcoal-light);">Patient</span>
                <h4 style="font-size: 1.05rem; color: var(--color-forest-green); margin: 0; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${appointment.petName}</h4>
                <span style="font-size: 0.8rem; color: var(--color-charcoal-muted); display: block; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${appointment.species || 'Pet'}</span>
              </div>
            </div>

            <!-- Doctor Info -->
            <div style="display: flex; align-items: center; gap: 0.75rem; min-width: 0;">
              <img src="${appointment.vetImage || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80'}" alt="${appointment.veterinarian}" style="width: 48px; height: 48px; border-radius: var(--radius-full); object-fit: cover; border: 2px solid var(--color-soft-coral); flex-shrink: 0;">
              <div style="overflow: hidden;">
                <span style="font-size: 0.72rem; text-transform: uppercase; font-weight: 700; color: var(--color-charcoal-light);">Attending Doctor</span>
                <h4 style="font-size: 1rem; color: var(--color-forest-green); margin: 0; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${appointment.veterinarian}</h4>
                <span style="font-size: 0.75rem; color: var(--color-charcoal-muted); display: block; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${appointment.vetTitle || 'Veterinary Specialist'}</span>
              </div>
            </div>
          </div>

          <!-- Appointment Meta Row -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.65rem; margin-bottom: 1.25rem;">
            <div style="background: var(--color-white); border: 1px solid var(--color-border); padding: 0.75rem; border-radius: var(--radius-md);">
              <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-charcoal-light); text-transform: uppercase; display: block; margin-bottom: 0.2rem;">Date</span>
              <span style="font-weight: 700; color: var(--color-forest-green); font-size: 0.9rem;"><i class="fa-solid fa-calendar" style="color: var(--color-soft-coral); margin-right: 0.3rem;"></i>${appointment.date}</span>
            </div>
            <div style="background: var(--color-white); border: 1px solid var(--color-border); padding: 0.75rem; border-radius: var(--radius-md);">
              <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-charcoal-light); text-transform: uppercase; display: block; margin-bottom: 0.2rem;">Time</span>
              <span style="font-weight: 700; color: var(--color-forest-green); font-size: 0.9rem;"><i class="fa-solid fa-clock" style="color: var(--color-forest-green-light); margin-right: 0.3rem;"></i>${appointment.time}</span>
            </div>
            <div style="background: var(--color-white); border: 1px solid var(--color-border); padding: 0.75rem; border-radius: var(--radius-md);">
              <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-charcoal-light); text-transform: uppercase; display: block; margin-bottom: 0.2rem;">Clinic Suite</span>
              <span style="font-weight: 700; color: var(--color-forest-green); font-size: 0.85rem;"><i class="fa-solid fa-hospital" style="color: var(--color-sage-green); margin-right: 0.3rem;"></i>${appointment.room || 'Suite 2B'}</span>
            </div>
          </div>

          <!-- Clinical Notes & Findings -->
          <div class="form-group" style="margin-bottom: 1.15rem;">
            <label class="form-label" style="font-size: 0.82rem;">Clinical Notes & Visit Purpose</label>
            <div style="background: var(--color-warm-cream); padding: 0.85rem 1rem; border-radius: var(--radius-md); font-size: 0.88rem; color: var(--color-charcoal); line-height: 1.5; border: 1px solid var(--color-border); word-break: break-word;">
              ${appointment.notes || 'Routine checkup and physical evaluation.'}
            </div>
          </div>

          ${appointment.diagnosisSummary ? `
            <div class="form-group" style="margin-bottom: 1.15rem;">
              <label class="form-label" style="font-size: 0.82rem;">Veterinary Assessment & Plan</label>
              <div style="background: ${isCancelled ? '#FDEDEC' : 'var(--color-sage-green-soft)'}; padding: 0.85rem 1rem; border-radius: var(--radius-md); font-size: 0.88rem; color: ${isCancelled ? '#C0392B' : 'var(--color-forest-green)'}; line-height: 1.5; border: 1px solid ${isCancelled ? '#F5B7B1' : 'var(--color-sage-green)'}; word-break: break-word;">
                <i class="fa-solid ${isCancelled ? 'fa-circle-xmark' : 'fa-clipboard-check'}" style="margin-right: 0.35rem;"></i>
                <strong>Status Note:</strong> ${isCancelled ? 'This appointment has been cancelled.' : appointment.diagnosisSummary}
              </div>
            </div>
          ` : ''}

          <!-- Hospital Information Footer -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 0.65rem; border-top: 1px solid var(--color-border-subtle); font-size: 0.78rem; color: var(--color-charcoal-muted); flex-wrap: wrap; gap: 0.4rem;">
            <span><i class="fa-solid fa-location-dot"></i> PETZY Hospital, SF Suite 400</span>
            <span><i class="fa-solid fa-phone"></i> +1 (800) 555-PETZY</span>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="petzy-modal-footer">
          <div>
            ${isUpcoming ? `
              <button type="button" class="btn btn-outline" id="appt-cancel-btn" style="border-color: #F5B7B1; color: #C0392B; padding: 0.55rem 0.9rem; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.35rem;">
                <i class="fa-solid fa-calendar-xmark"></i>
                <span>Cancel Appointment</span>
              </button>
            ` : ''}
          </div>

          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <button type="button" class="btn btn-outline" id="appt-close-btn" style="padding: 0.55rem 0.95rem; font-size: 0.85rem;">Close</button>
            <a href="#/schedule-appointment?petId=${appointment.petId || ''}" class="btn btn-teal" style="padding: 0.55rem 1rem; font-size: 0.85rem;" onclick="document.getElementById('appt-close-x')?.click();">
              <i class="fa-solid fa-calendar-plus"></i>
              <span>${isCancelled ? 'Re-schedule Visit' : 'Book Follow-Up Visit'}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;

  setupApptModalEvents(modalEl, appointment);
  setTimeout(() => {
    modalEl.querySelector('.petzy-modal-backdrop')?.classList.add('open');
  }, 10);
}

export function closeAppointmentModal() {
  const backdrop = document.querySelector('#petzy-appointment-modal-root .petzy-modal-backdrop');
  if (backdrop) {
    backdrop.classList.remove('open');
    setTimeout(() => {
      const root = document.getElementById('petzy-appointment-modal-root');
      if (root) root.innerHTML = '';
    }, 280);
  }
}

function setupApptModalEvents(modalEl, appointment) {
  const backdrop = modalEl.querySelector('#appt-modal-backdrop');
  const closeX = modalEl.querySelector('#appt-close-x');
  const closeBtn = modalEl.querySelector('#appt-close-btn');
  const cancelBtn = modalEl.querySelector('#appt-cancel-btn');

  closeX?.addEventListener('click', closeAppointmentModal);
  closeBtn?.addEventListener('click', closeAppointmentModal);
  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) closeAppointmentModal();
  });

  // Cancel Appointment Action
  cancelBtn?.addEventListener('click', () => {
    const user = getCurrentUser();
    if (!user) return;

    if (confirm(`Are you sure you want to cancel the ${appointment.service} visit scheduled for ${appointment.petName} on ${appointment.date}?`)) {
      cancelUserAppointment(user.id, appointment.id);
      showToast(`Appointment for ${appointment.petName} has been cancelled.`, 'coral', 'fa-solid fa-calendar-xmark');
      closeAppointmentModal();

      if (typeof onUpdateCallback === 'function') {
        onUpdateCallback();
      } else {
        // Trigger hash change/reload to refresh current page view
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }
    }
  });
}
