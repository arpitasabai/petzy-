/* PETZY Appointment Details & Cancellation Modal Component (Milestone 3 & 4) */
import { cancelUserAppointment } from '../services/storage.js';
import { getCurrentUser } from '../services/auth.js';
import { showToast } from './toast.js';
import { openPaymentReceiptModal } from './payment-receipt-modal.js';

let onUpdateCallback = null;
let cameFromDetailsView = false;

export function openAppointmentModal(appointment, callback = null, openCancelDialog = false) {
  if (!appointment) return;
  onUpdateCallback = callback;

  if (!openCancelDialog) {
    cameFromDetailsView = true;
  }

  let modalEl = document.getElementById('petzy-appointment-modal-root');
  if (!modalEl) {
    modalEl = document.createElement('div');
    modalEl.id = 'petzy-appointment-modal-root';
    document.body.appendChild(modalEl);
  }

  // ----------------------------------------------------
  // 1. COMPACT CANCEL CONFIRMATION DIALOG (No Scrolling, Smaller Size)
  // ----------------------------------------------------
  if (openCancelDialog) {
    modalEl.innerHTML = `
      <div class="petzy-modal-backdrop" id="appt-modal-backdrop">
        <div class="petzy-modal-container" style="position: relative; max-width: 460px; padding: 2rem 1.75rem; text-align: center; overflow: hidden; border-radius: var(--radius-2xl); box-shadow: var(--shadow-xl); background: var(--color-white); border: 1px solid var(--color-border);">
          <!-- Top Close Button -->
          <button class="petzy-modal-close-btn" id="cancel-dialog-close-x" aria-label="Close dialog" style="position: absolute; top: 1rem; right: 1rem; width: 32px; height: 32px; font-size: 0.9rem;">
            <i class="fa-solid fa-xmark"></i>
          </button>

          <!-- Warning Alert Icon -->
          <div style="width: 60px; height: 60px; border-radius: var(--radius-full); background: #FDEDEC; color: #E74C3C; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin: 0.25rem auto 1rem;">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>

          <h3 style="font-size: 1.3rem; color: var(--color-forest-green); margin: 0 0 0.4rem; font-family: var(--font-heading);">
            Cancel Appointment?
          </h3>
          
          <p style="color: var(--color-charcoal-muted); font-size: 0.88rem; line-height: 1.45; margin: 0 0 1.15rem;">
            Are you sure you want to cancel the <strong>${appointment.service}</strong> visit for <strong>${appointment.petName}</strong> on <strong>${appointment.date} at ${appointment.time}</strong>?
          </p>

          <!-- Info Pill -->
          <div style="background: var(--color-warm-cream); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 0.65rem 0.9rem; margin-bottom: 1.35rem; text-align: left; display: flex; align-items: center; justify-content: space-between; font-size: 0.8rem;">
            <div>
              <span style="color: var(--color-charcoal-light); font-weight: 700; text-transform: uppercase; font-size: 0.68rem; display: block;">Doctor</span>
              <strong style="color: var(--color-forest-green);">${appointment.veterinarian}</strong>
            </div>
            <div style="text-align: right;">
              <span style="color: var(--color-charcoal-light); font-weight: 700; text-transform: uppercase; font-size: 0.68rem; display: block;">Appointment Ref</span>
              <strong style="color: var(--color-forest-green); font-size: 0.78rem;">#${appointment.id}</strong>
            </div>
          </div>

          <!-- Actions -->
          <div style="display: flex; gap: 0.65rem; justify-content: center; flex-wrap: wrap;">
            <button type="button" class="btn btn-outline" id="keep-appointment-btn" style="flex: 1; min-width: 130px; padding: 0.6rem 0.9rem; font-size: 0.88rem; justify-content: center;">
              <span>Keep Visit</span>
            </button>
            <button type="button" class="btn btn-coral" id="confirm-cancel-appointment-btn" style="flex: 1; min-width: 155px; padding: 0.6rem 0.9rem; font-size: 0.88rem; background: #C0392B; border-color: #C0392B; color: white; justify-content: center;">
              <i class="fa-solid fa-calendar-xmark"></i>
              <span>Cancel Appointment</span>
            </button>
          </div>
        </div>
      </div>
    `;

    setupCancelDialogEvents(modalEl, appointment);
    setTimeout(() => {
      modalEl.querySelector('.petzy-modal-backdrop')?.classList.add('open');
    }, 10);
    return;
  }

  // ----------------------------------------------------
  // 2. FULL APPOINTMENT DETAILS MODAL VIEW
  // ----------------------------------------------------
  const statusLower = (appointment.status || '').toLowerCase();
  const isUpcoming = ['upcoming', 'confirmed', 'rescheduled'].includes(statusLower);
  const isCancelled = statusLower === 'cancelled';
  const isCompleted = statusLower === 'completed';
  const isRescheduled = statusLower === 'rescheduled';

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
      <div class="petzy-modal-container" style="position: relative; max-width: 620px;">
        <!-- Header -->
        <div class="petzy-modal-header">
          <div>
            <div style="display: flex; align-items: center; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.35rem;">
              <span class="appointment-status-badge ${statusLower}">
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
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 0.65rem; margin-bottom: 1.25rem;">
            <div style="background: var(--color-white); border: 1px solid var(--color-border); padding: 0.75rem; border-radius: var(--radius-md);">
              <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-charcoal-light); text-transform: uppercase; display: block; margin-bottom: 0.2rem;">Date</span>
              <span style="font-weight: 700; color: var(--color-forest-green); font-size: 0.88rem;"><i class="fa-solid fa-calendar" style="color: var(--color-soft-coral); margin-right: 0.3rem;"></i>${appointment.date}</span>
            </div>
            <div style="background: var(--color-white); border: 1px solid var(--color-border); padding: 0.75rem; border-radius: var(--radius-md);">
              <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-charcoal-light); text-transform: uppercase; display: block; margin-bottom: 0.2rem;">Time Slot</span>
              <span style="font-weight: 700; color: var(--color-forest-green); font-size: 0.88rem;"><i class="fa-solid fa-clock" style="color: var(--color-forest-green-light); margin-right: 0.3rem;"></i>${appointment.time}</span>
            </div>
            <div style="background: var(--color-white); border: 1px solid var(--color-border); padding: 0.75rem; border-radius: var(--radius-md);">
              <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-charcoal-light); text-transform: uppercase; display: block; margin-bottom: 0.2rem;">Payment</span>
              <span style="font-weight: 700; color: #27AE60; font-size: 0.88rem;"><i class="fa-solid fa-circle-check" style="margin-right: 0.3rem;"></i>${appointment.paymentStatus || 'Paid'} (${appointment.price || '$55'})</span>
            </div>
            <div style="background: var(--color-white); border: 1px solid var(--color-border); padding: 0.75rem; border-radius: var(--radius-md);">
              <span style="font-size: 0.72rem; font-weight: 700; color: var(--color-charcoal-light); text-transform: uppercase; display: block; margin-bottom: 0.2rem;">Location</span>
              <span style="font-weight: 700; color: var(--color-forest-green); font-size: 0.85rem;"><i class="fa-solid fa-location-dot" style="color: var(--color-forest-green); margin-right: 0.3rem;"></i>${appointment.room || 'Suite 2B'}</span>
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

          <!-- Location & Payment Receipt Info Footer -->
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 0.65rem; border-top: 1px solid var(--color-border-subtle); font-size: 0.78rem; color: var(--color-charcoal-muted); flex-wrap: wrap; gap: 0.4rem;">
            <span><i class="fa-solid fa-location-dot"></i> PETZY Central Clinic (Suite 400)</span>
            <button type="button" class="btn btn-outline" id="appt-modal-receipt-btn" style="padding: 0.25rem 0.65rem; font-size: 0.75rem; border-radius: var(--radius-full);">
              <i class="fa-solid fa-file-invoice"></i> View Payment Receipt
            </button>
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

// Event bindings for compact Cancel Confirmation dialog
function setupCancelDialogEvents(modalEl, appointment) {
  const backdrop = modalEl.querySelector('#appt-modal-backdrop');
  const closeX = modalEl.querySelector('#cancel-dialog-close-x');
  const keepBtn = modalEl.querySelector('#keep-appointment-btn');
  const confirmCancelBtn = modalEl.querySelector('#confirm-cancel-appointment-btn');

  const handleDismiss = (e) => {
    e?.preventDefault();
    if (cameFromDetailsView) {
      openAppointmentModal(appointment, onUpdateCallback, false);
    } else {
      closeAppointmentModal();
    }
  };

  closeX?.addEventListener('click', handleDismiss);
  keepBtn?.addEventListener('click', handleDismiss);
  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) handleDismiss(e);
  });

  // Confirm Cancellation
  confirmCancelBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const user = getCurrentUser();
    if (!user) return;

    cancelUserAppointment(user.id, appointment.id);
    showToast(`Appointment #${appointment.id} for ${appointment.petName} has been cancelled. Time slot released.`, 'coral', 'fa-solid fa-calendar-xmark');
    closeAppointmentModal();

    if (typeof onUpdateCallback === 'function') {
      onUpdateCallback();
    }
  });
}

// Event bindings for full Appointment Details modal
function setupApptModalEvents(modalEl, appointment) {
  const backdrop = modalEl.querySelector('#appt-modal-backdrop');
  const closeX = modalEl.querySelector('#appt-close-x');
  const closeBtn = modalEl.querySelector('#appt-close-btn');
  const cancelTriggerBtn = modalEl.querySelector('#appt-cancel-trigger-btn');
  const rescheduleBtn = modalEl.querySelector('#appt-reschedule-btn');

  closeX?.addEventListener('click', (e) => {
    e.preventDefault();
    closeAppointmentModal();
  });

  closeBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    closeAppointmentModal();
  });

  backdrop?.addEventListener('click', (e) => {
    if (e.target === backdrop) closeAppointmentModal();
  });

  // Reschedule button handler
  rescheduleBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    closeAppointmentModal();
    window.location.hash = `#/book-appointment?rescheduleId=${appointment.id}`;
  });

  // Receipt button handler
  const receiptBtn = modalEl.querySelector('#appt-modal-receipt-btn');
  receiptBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openPaymentReceiptModal(appointment.paymentId || appointment.id);
  });

  // Switch to compact Cancel Confirmation Dialog
  cancelTriggerBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    openAppointmentModal(appointment, onUpdateCallback, true);
  });
}
