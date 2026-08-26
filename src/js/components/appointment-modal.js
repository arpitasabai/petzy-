/* PETZY Appointment Details Modal Component (Milestone 3) */
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

  const isUpcoming = ['Upcoming', 'Confirmed', 'Rescheduled'].includes(appointment.status);
  const isCancelled = appointment.status === 'Cancelled';
  const isRescheduled = appointment.status === 'Rescheduled';

  let badgeColor = 'sage';
  let badgeIcon = 'fa-circle-check';
  if (isCancelled) {
    badgeColor = 'red';
    badgeIcon = 'fa-calendar-xmark';
  } else if (isRescheduled) {
    badgeColor = 'coral';
    badgeIcon = 'fa-clock-rotate-left';
  } else if (isUpcoming) {
    badgeColor = 'coral';
    badgeIcon = 'fa-calendar-check';
  }

  modalEl.innerHTML = `
    <div class="petzy-modal-backdrop" id="appt-modal-backdrop">
      <div class="petzy-modal-container">
        <!-- Header -->
        <div class="petzy-modal-header">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.35rem;">
              <span class="appointment-status-badge ${appointment.status.toLowerCase()}">
                <i class="fa-solid ${badgeIcon}" style="font-size: 0.55rem;"></i>
                <span>${appointment.status}</span>
              </span>
              <span style="font-family: var(--font-heading); font-size: 0.82rem; font-weight: 700; color: var(--color-forest-green); background: var(--color-warm-cream); padding: 0.2rem 0.65rem; border-radius: var(--radius-full); border: 1px solid var(--color-border);">
                ID: ${appointment.id}
              </span>
            </div>
            <h3 style="font-size: 1.35rem; color: var(--color-forest-green); margin: 0;">${appointment.service}</h3>
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
              <img src="${appointment.petPhoto || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'}" alt="${appointment.petName}" style="width: 48px; height: 48px; border-radius: var(--radius-md); object-fit: cover; border: 2px solid var(--color-forest-green); flex-shrink: 0;">
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
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 0.65rem; margin-bottom: 1.25rem;">
            <div style="background: var(--color-white); border: 1px solid var(--color-border); padding: 0.75rem; border-radius: var(--radius-md);">
              <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-charcoal-light); text-transform: uppercase; display: block; margin-bottom: 0.2rem;">Date</span>
              <span style="font-weight: 700; color: var(--color-forest-green); font-size: 0.88rem;"><i class="fa-solid fa-calendar" style="color: var(--color-soft-coral); margin-right: 0.3rem;"></i>${appointment.date}</span>
            </div>
            <div style="background: var(--color-white); border: 1px solid var(--color-border); padding: 0.75rem; border-radius: var(--radius-md);">
              <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-charcoal-light); text-transform: uppercase; display: block; margin-bottom: 0.2rem;">Time Slot</span>
              <span style="font-weight: 700; color: var(--color-forest-green); font-size: 0.88rem;"><i class="fa-solid fa-clock" style="color: var(--color-forest-green-light); margin-right: 0.3rem;"></i>${appointment.time}</span>
            </div>
            <div style="background: var(--color-white); border: 1px solid var(--color-border); padding: 0.75rem; border-radius: var(--radius-md);">
              <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-charcoal-light); text-transform: uppercase; display: block; margin-bottom: 0.2rem;">Duration</span>
              <span style="font-weight: 700; color: var(--color-forest-green); font-size: 0.88rem;"><i class="fa-solid fa-hourglass-half" style="color: var(--color-sage-green); margin-right: 0.3rem;"></i>${appointment.duration || '30 Mins'}</span>
            </div>
            <div style="background: var(--color-white); border: 1px solid var(--color-border); padding: 0.75rem; border-radius: var(--radius-md);">
              <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-charcoal-light); text-transform: uppercase; display: block; margin-bottom: 0.2rem;">Fee / Location</span>
              <span style="font-weight: 700; color: var(--color-forest-green); font-size: 0.85rem;"><i class="fa-solid fa-hospital" style="color: var(--color-forest-green); margin-right: 0.3rem;"></i>${appointment.room || 'Suite 2B'}</span>
            </div>
          </div>

          <!-- Clinical Notes & Reason -->
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
                <strong>Status Note:</strong> ${isCancelled ? 'This appointment has been cancelled. The time slot has been released.' : appointment.diagnosisSummary}
              </div>
            </div>
          ` : ''}

          <!-- Hospital Information Footer -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 0.65rem; border-top: 1px solid var(--color-border-subtle); font-size: 0.78rem; color: var(--color-charcoal-muted); flex-wrap: wrap; gap: 0.4rem;">
            <span><i class="fa-solid fa-location-dot"></i> PETZY Central Hospital, SF Suite 400</span>
            <span><i class="fa-solid fa-phone"></i> +1 (800) 555-PETZY</span>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="petzy-modal-footer">
          <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
            ${isUpcoming ? `
              <button type="button" class="btn btn-outline" id="appt-cancel-trigger-btn" style="border-color: #F5B7B1; color: #C0392B; padding: 0.55rem 0.9rem; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.35rem;">
                <i class="fa-solid fa-calendar-xmark"></i>
                <span>Cancel</span>
              </button>
              
              <button type="button" class="btn btn-outline" id="appt-reschedule-btn" style="border-color: var(--color-forest-green); color: var(--color-forest-green); padding: 0.55rem 0.9rem; font-size: 0.85rem; display: inline-flex; align-items: center; gap: 0.35rem;">
                <i class="fa-solid fa-clock-rotate-left"></i>
                <span>Reschedule</span>
              </button>
            ` : ''}
          </div>

          <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap;">
            <button type="button" class="btn btn-outline" id="appt-close-btn" style="padding: 0.55rem 0.95rem; font-size: 0.85rem;">Close</button>
            ${isCompleted ? `
              <a href="#/book-appointment?followUpId=${appointment.id}" class="btn btn-teal" style="padding: 0.55rem 1rem; font-size: 0.85rem;" onclick="document.getElementById('appt-close-x')?.click();">
                <i class="fa-solid fa-calendar-plus"></i>
                <span>Book Follow-Up Visit</span>
              </a>
            ` : isCancelled ? `
              <a href="#/book-appointment?petId=${appointment.petId || ''}&service=${appointment.serviceId || ''}" class="btn btn-teal" style="padding: 0.55rem 1rem; font-size: 0.85rem;" onclick="document.getElementById('appt-close-x')?.click();">
                <i class="fa-solid fa-calendar-plus"></i>
                <span>Re-book Visit</span>
              </a>
            ` : ''}
          </div>
        </div>

        <!-- Inline Cancel Confirmation Card (Hidden by default) -->
        <div id="inline-cancel-confirm-box" style="display: none; position: absolute; inset: 0; background: rgba(255,255,255,0.98); border-radius: var(--radius-2xl); z-index: 20; padding: 2.5rem 1.5rem; text-align: center; flex-direction: column; justify-content: center; align-items: center;">
          <i class="fa-solid fa-triangle-exclamation" style="font-size: 3rem; color: #E74C3C; margin-bottom: 1rem;"></i>
          <h3 style="font-size: 1.4rem; color: var(--color-forest-green); margin: 0 0 0.5rem;">Are you sure you want to cancel this appointment?</h3>
          <p style="color: var(--color-charcoal-muted); max-width: 440px; margin: 0 0 1.75rem; font-size: 0.92rem;">
            Cancelling will immediately release your time slot for <strong>${appointment.service}</strong> with <strong>${appointment.veterinarian}</strong> on <strong>${appointment.date} at ${appointment.time}</strong>.
          </p>
          <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
            <button type="button" class="btn btn-outline btn-lg" id="keep-appointment-btn">
              <span>Keep Appointment</span>
            </button>
            <button type="button" class="btn btn-coral btn-lg" id="confirm-cancel-appointment-btn" style="background: #C0392B; border-color: #C0392B; color: white;">
              <i class="fa-solid fa-calendar-xmark"></i>
              <span>Cancel Appointment</span>
            </button>
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
  const cancelTriggerBtn = modalEl.querySelector('#appt-cancel-trigger-btn');
  const rescheduleBtn = modalEl.querySelector('#appt-reschedule-btn');
  const cancelBox = modalEl.querySelector('#inline-cancel-confirm-box');
  const keepBtn = modalEl.querySelector('#keep-appointment-btn');
  const confirmCancelBtn = modalEl.querySelector('#confirm-cancel-appointment-btn');

  closeX?.addEventListener('click', closeAppointmentModal);
  closeBtn?.addEventListener('click', closeAppointmentModal);
  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) closeAppointmentModal();
  });

  // Reschedule button handler
  rescheduleBtn?.addEventListener('click', () => {
    closeAppointmentModal();
    window.location.hash = `#/book-appointment?rescheduleId=${appointment.id}`;
  });

  // Cancel Confirmation Toggle
  cancelTriggerBtn?.addEventListener('click', () => {
    if (cancelBox) cancelBox.style.display = 'flex';
  });

  keepBtn?.addEventListener('click', () => {
    if (cancelBox) cancelBox.style.display = 'none';
  });

  // Confirm Cancellation
  confirmCancelBtn?.addEventListener('click', () => {
    const user = getCurrentUser();
    if (!user) return;

    cancelUserAppointment(user.id, appointment.id);
    showToast(`Appointment #${appointment.id} for ${appointment.petName} has been cancelled. Time slot released.`, 'coral', 'fa-solid fa-calendar-xmark');
    closeAppointmentModal();

    if (typeof onUpdateCallback === 'function') {
      onUpdateCallback();
    } else {
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
  });
}

