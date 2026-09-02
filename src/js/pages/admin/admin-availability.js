/* PETZY Admin Doctor Availability & Schedules Manager (Milestone 4) */
import {
  getStoredVeterinarians,
  getDoctorById,
  getDoctorAvailability,
  saveDoctorAvailability,
  blockDoctorDate,
  unblockDoctorDate,
  getAvailableSlotsForDoctorAndDate
} from '../../services/storage.js';
import { showToast } from '../../components/toast.js';

let selectedDoctorId = '';

export function renderAdminAvailability() {
  const vets = getStoredVeterinarians();
  if (!selectedDoctorId && vets.length > 0) {
    selectedDoctorId = vets[0].id;
  }

  const selectedVet = getDoctorById(selectedDoctorId) || vets[0];
  const availability = selectedVet ? getDoctorAvailability(selectedVet.id) : { workingDays: [], shifts: {}, blockedDates: [] };
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const previewSlots = selectedVet ? getAvailableSlotsForDoctorAndDate(selectedVet.name, tomorrowStr) : { morning: [], afternoon: [], evening: [] };

  return `
    <div class="admin-tab-content animate-fade-up">
      
      <!-- Top Subhead -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 style="font-size: 1.5rem; color: var(--color-forest-green); margin: 0 0 0.25rem; font-family: var(--font-heading);">
            <i class="fa-solid fa-calendar-week" style="color: var(--color-soft-coral); margin-right: 0.4rem;"></i>
            Doctor Schedules & Clinical Availability
          </h2>
          <span style="font-size: 0.85rem; color: var(--color-charcoal-muted);">Configure weekly shifts, clinical working days, and emergency/conference blocked dates.</span>
        </div>
      </div>

      <!-- Doctor Selector Pill Tabs -->
      <div style="display: flex; flex-wrap: wrap; gap: 0.65rem; align-items: center; margin-bottom: 1.5rem; width: 100%;">
        ${vets.map(v => {
          const isSelected = v.id === selectedDoctorId;
          return `
            <button type="button" class="quick-action-pill ${isSelected ? 'primary' : ''}" onclick="window.petzySelectAvailDoctor('${v.id}')" style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.95rem; border-radius: var(--radius-full); font-size: 0.85rem; font-weight: 600; cursor: pointer;">
              <img src="${v.image}" alt="${v.name}" style="width: 24px; height: 24px; border-radius: 50%; object-fit: cover; flex-shrink: 0;">
              <span style="white-space: nowrap;">${v.name}</span>
            </button>
          `;
        }).join('')}
      </div>

      ${selectedVet ? `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 1.5rem; align-items: start;">
          
          <!-- Left: Working Days & Shifts Form -->
          <div style="background: var(--color-white); padding: 1.75rem; border-radius: var(--radius-xl); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
            
            <div style="display: flex; align-items: center; gap: 0.85rem; margin-bottom: 1.5rem; border-bottom: 1px solid var(--color-border); padding-bottom: 1rem;">
              <img src="${selectedVet.image}" alt="${selectedVet.name}" style="width: 52px; height: 52px; border-radius: 50%; object-fit: cover; border: 2px solid var(--color-forest-green);">
              <div>
                <h3 style="font-size: 1.25rem; color: var(--color-forest-green); margin: 0;">${selectedVet.name}</h3>
                <span style="font-size: 0.82rem; color: var(--color-charcoal-muted);">${selectedVet.title} • ${selectedVet.degrees}</span>
              </div>
            </div>

            <!-- Working Days Checkboxes -->
            <div style="margin-bottom: 1.75rem;">
              <label class="form-label" style="font-weight: 700; font-size: 0.92rem; margin-bottom: 0.75rem; display: block;">
                <i class="fa-solid fa-check-double" style="color: var(--color-forest-green); margin-right: 0.35rem;"></i>
                Weekly Working Days
              </label>

              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 0.65rem;">
                ${daysOfWeek.map(day => {
                  const isChecked = availability.workingDays.includes(day);
                  return `
                    <label style="display: flex; align-items: center; gap: 0.5rem; background: var(--color-warm-cream); padding: 0.65rem 0.85rem; border-radius: var(--radius-md); border: 1px solid var(--color-border); cursor: pointer; font-size: 0.88rem; font-weight: 600; color: var(--color-charcoal);">
                      <input type="checkbox" class="avail-working-day-cb" value="${day}" ${isChecked ? 'checked' : ''} style="accent-color: var(--color-forest-green);">
                      <span>${day}</span>
                    </label>
                  `;
                }).join('')}
              </div>
            </div>

            <!-- Shifts Config -->
            <div style="margin-bottom: 1.75rem;">
              <label class="form-label" style="font-weight: 700; font-size: 0.92rem; margin-bottom: 0.75rem; display: block;">
                <i class="fa-solid fa-clock" style="color: var(--color-soft-coral); margin-right: 0.35rem;"></i>
                Active Daily Shifts
              </label>

              <div style="display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.85rem;">
                <div style="display: flex; align-items: center; justify-content: space-between; background: var(--color-warm-cream); padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fa-solid fa-sun" style="color: #F5A623;"></i>
                    <strong>Morning Shift (09:00 AM – 11:30 AM)</strong>
                  </div>
                  <span class="section-badge" style="background: var(--color-sage-green-soft); color: var(--color-forest-green); font-size: 0.72rem; margin: 0;">Enabled</span>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; background: var(--color-warm-cream); padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fa-solid fa-cloud-sun" style="color: var(--color-soft-coral);"></i>
                    <strong>Afternoon Shift (01:00 PM – 03:30 PM)</strong>
                  </div>
                  <span class="section-badge" style="background: var(--color-sage-green-soft); color: var(--color-forest-green); font-size: 0.72rem; margin: 0;">Enabled</span>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; background: var(--color-warm-cream); padding: 0.75rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
                  <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fa-solid fa-moon" style="color: #6C5CE7;"></i>
                    <strong>Evening Shift (05:00 PM – 06:30 PM)</strong>
                  </div>
                  <span class="section-badge" style="background: var(--color-sage-green-soft); color: var(--color-forest-green); font-size: 0.72rem; margin: 0;">Enabled</span>
                </div>
              </div>
            </div>

            <button type="button" class="btn btn-teal" id="save-doctor-schedule-btn" style="width: 100%; justify-content: center;">
              <i class="fa-solid fa-save"></i>
              <span>Save Schedule Settings</span>
            </button>
          </div>

          <!-- Right: Blocked Dates & Live Preview -->
          <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            
            <!-- Blocked Dates Card -->
            <div style="background: var(--color-white); padding: 1.5rem; border-radius: var(--radius-xl); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
              <h4 style="font-size: 1.1rem; color: var(--color-forest-green); margin-bottom: 0.4rem;">
                <i class="fa-solid fa-calendar-xmark" style="color: var(--color-soft-coral); margin-right: 0.35rem;"></i>
                Blocked Dates & Off-Duty Leave
              </h4>
              <p style="font-size: 0.82rem; color: var(--color-charcoal-muted); margin-bottom: 1rem;">
                Any blocked date will automatically disable booking slots for this specialist.
              </p>

              <!-- Add Form -->
              <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
                <input type="date" id="avail-new-date" class="form-input" style="font-size: 0.85rem;" min="${new Date().toISOString().split('T')[0]}">
                <input type="text" id="avail-new-reason" class="form-input" style="font-size: 0.85rem;" placeholder="Reason (e.g. Annual Medical Leave)">
                <button type="button" class="btn btn-coral" id="avail-add-block-btn" style="font-size: 0.85rem; justify-content: center;">
                  <i class="fa-solid fa-plus"></i> Block This Date
                </button>
              </div>

              <!-- Blocked list -->
              <div style="display: flex; flex-direction: column; gap: 0.4rem;">
                ${availability.blockedDates.length === 0 ? `
                  <div style="background: var(--color-warm-cream); padding: 0.75rem; border-radius: var(--radius-md); text-align: center; font-size: 0.82rem; color: var(--color-charcoal-muted);">
                    No blocked dates on file.
                  </div>
                ` : availability.blockedDates.map(b => `
                  <div style="display: flex; align-items: center; justify-content: space-between; background: #FDEDEC; border: 1px solid #F5B7B1; padding: 0.5rem 0.85rem; border-radius: var(--radius-md); font-size: 0.82rem;">
                    <div>
                      <strong style="color: #C0392B;"><i class="fa-solid fa-ban" style="margin-right: 0.3rem;"></i>${b.date}</strong>
                      <span style="color: var(--color-charcoal); display: block; font-size: 0.75rem;">${b.reason || 'Unavailable'}</span>
                    </div>
                    <button type="button" class="btn btn-outline" onclick="window.petzyAvailUnblock('${selectedVet.id}', '${b.date}')" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; border-color: #F5B7B1; color: #C0392B;" title="Unblock Date">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Live Booking Engine Slot Preview -->
            <div style="background: var(--color-warm-cream); padding: 1.25rem; border-radius: var(--radius-xl); border: 1px solid var(--color-border);">
              <h5 style="font-size: 0.95rem; color: var(--color-forest-green); margin-bottom: 0.35rem;">
                <i class="fa-solid fa-eye" style="margin-right: 0.3rem;"></i>
                Live Patient Booking Engine Preview
              </h5>
              <p style="font-size: 0.78rem; color: var(--color-charcoal-muted); margin-bottom: 0.75rem;">
                Tomorrow (${tomorrowStr}) Slots:
              </p>

              <div style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
                ${previewSlots.morning.map(s => `
                  <span style="font-size: 0.72rem; padding: 0.2rem 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--color-border); background: ${s.isBooked ? '#FEE2E2' : '#ffffff'}; color: ${s.isBooked ? '#DC2626' : 'var(--color-forest-green)'}; font-weight: 700;">
                    ${s.time} ${s.isBooked ? '(Booked)' : '(Open)'}
                  </span>
                `).join('')}
              </div>
            </div>

          </div>

        </div>
      ` : ''}

    </div>
  `;
}

export function setupAdminAvailabilityEvents(refreshAdmin) {
  window.petzySelectAvailDoctor = (vetId) => {
    selectedDoctorId = vetId;
    refreshAdmin();
  };

  window.petzyAvailUnblock = (vetId, dateStr) => {
    unblockDoctorDate(vetId, dateStr);
    showToast(`Date ${dateStr} unblocked successfully.`, 'sage', 'fa-solid fa-circle-check');
    refreshAdmin();
  };

  document.getElementById('avail-add-block-btn')?.addEventListener('click', () => {
    const d = document.getElementById('avail-new-date')?.value;
    const r = document.getElementById('avail-new-reason')?.value.trim() || 'Clinical Leave';
    if (!d) {
      showToast('Please select a date to block.', 'coral', 'fa-solid fa-calendar');
      return;
    }
    blockDoctorDate(selectedDoctorId, d, r);
    showToast(`Date ${d} blocked for specialist.`, 'sage', 'fa-solid fa-circle-check');
    refreshAdmin();
  });

  document.getElementById('save-doctor-schedule-btn')?.addEventListener('click', () => {
    const selectedDays = [];
    document.querySelectorAll('.avail-working-day-cb:checked').forEach(cb => selectedDays.push(cb.value));

    const currentAvail = getDoctorAvailability(selectedDoctorId);
    saveDoctorAvailability(selectedDoctorId, {
      ...currentAvail,
      workingDays: selectedDays
    });

    showToast('Weekly doctor working schedule saved successfully!', 'sage', 'fa-solid fa-circle-check');
    refreshAdmin();
  });
}
