/* PETZY Admin Appointment Management View (Milestone 4) */
import {
  getAllGlobalAppointments,
  getStoredVeterinarians
} from '../../services/storage.js';
import {
  openAppointmentStatusModal
} from '../../components/admin-modals.js';
import { openPaymentReceiptModal } from '../../components/payment-receipt-modal.js';
import { showToast } from '../../components/toast.js';

let apptSearchQuery = '';
let apptStatusFilter = 'all';
let apptDoctorFilter = 'all';
let apptPaymentFilter = 'all';

export function renderAdminAppointments() {
  const allAppointments = getAllGlobalAppointments();
  const vets = getStoredVeterinarians();

  const filtered = allAppointments.filter(a => {
    const q = apptSearchQuery.toLowerCase();
    const matchesSearch = !q ||
      (a.id || '').toLowerCase().includes(q) ||
      (a.petName || '').toLowerCase().includes(q) ||
      (a.service || '').toLowerCase().includes(q) ||
      (a.veterinarian || '').toLowerCase().includes(q);

    const sLower = (a.status || '').toLowerCase();
    const matchesStatus = apptStatusFilter === 'all' ||
      (apptStatusFilter === 'upcoming' && ['upcoming', 'confirmed', 'rescheduled'].includes(sLower)) ||
      (apptStatusFilter === 'completed' && sLower === 'completed') ||
      (apptStatusFilter === 'cancelled' && sLower === 'cancelled') ||
      (apptStatusFilter === 'rescheduled' && sLower === 'rescheduled');

    const matchesDoc = apptDoctorFilter === 'all' || (a.veterinarianId === apptDoctorFilter || a.veterinarian.includes(apptDoctorFilter));

    const pLower = (a.paymentStatus || 'paid').toLowerCase();
    const matchesPayment = apptPaymentFilter === 'all' || pLower === apptPaymentFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesDoc && matchesPayment;
  });

  return `
    <div class="admin-tab-content animate-fade-up">
      
      <!-- Top Subhead -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 style="font-size: 1.5rem; color: var(--color-forest-green); margin: 0 0 0.25rem; font-family: var(--font-heading);">
            <i class="fa-solid fa-calendar-check" style="color: var(--color-soft-coral); margin-right: 0.4rem;"></i>
            Global Hospital Appointments
          </h2>
          <span style="font-size: 0.85rem; color: var(--color-charcoal-muted);">Real-time cross-patient schedule management, clinical diagnosis records, and status orchestration.</span>
        </div>

        <div class="section-badge" style="background: var(--color-sage-green-soft); color: var(--color-forest-green); margin: 0;">
          <i class="fa-solid fa-calendar-days"></i>
          <span>Total Records: ${allAppointments.length}</span>
        </div>
      </div>

      <!-- Multi-Filter & Search Bar -->
      <div style="background: var(--color-white); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border); margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
        
        <div style="display: flex; gap: 1rem; flex-wrap: wrap; align-items: center;">
          <div style="position: relative; flex: 1; min-width: 260px;">
            <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--color-charcoal-muted); font-size: 0.85rem;"></i>
            <input type="text" id="admin-appt-search-input" class="form-input" placeholder="Search by booking ID, pet name, doctor, service..." value="${apptSearchQuery}" style="padding-left: 2.25rem; font-size: 0.85rem;">
          </div>

          <!-- Doctor Filter Dropdown -->
          <div style="min-width: 200px;">
            <select id="admin-appt-doc-select" class="form-input" style="font-size: 0.85rem;">
              <option value="all" ${apptDoctorFilter === 'all' ? 'selected' : ''}>All Veterinarians</option>
              ${vets.map(v => `<option value="${v.id}" ${apptDoctorFilter === v.id ? 'selected' : ''}>${v.name}</option>`).join('')}
            </select>
          </div>

          <!-- Payment Filter Dropdown -->
          <div style="min-width: 160px;">
            <select id="admin-appt-pay-select" class="form-input" style="font-size: 0.85rem;">
              <option value="all" ${apptPaymentFilter === 'all' ? 'selected' : ''}>All Payments</option>
              <option value="Paid" ${apptPaymentFilter === 'Paid' ? 'selected' : ''}>Paid</option>
              <option value="Pending" ${apptPaymentFilter === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="Refunded" ${apptPaymentFilter === 'Refunded' ? 'selected' : ''}>Refunded</option>
            </select>
          </div>
        </div>

        <!-- Status Filter Pills -->
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button type="button" class="quick-action-pill ${apptStatusFilter === 'all' ? 'primary' : ''}" onclick="window.petzyAdminApptFilter('all')">
            All Visits (${allAppointments.length})
          </button>
          <button type="button" class="quick-action-pill ${apptStatusFilter === 'upcoming' ? 'primary' : ''}" onclick="window.petzyAdminApptFilter('upcoming')">
            Upcoming / Active (${allAppointments.filter(a => ['upcoming', 'confirmed', 'rescheduled'].includes(a.status.toLowerCase())).length})
          </button>
          <button type="button" class="quick-action-pill ${apptStatusFilter === 'completed' ? 'primary' : ''}" onclick="window.petzyAdminApptFilter('completed')">
            Completed (${allAppointments.filter(a => a.status.toLowerCase() === 'completed').length})
          </button>
          <button type="button" class="quick-action-pill ${apptStatusFilter === 'cancelled' ? 'primary' : ''}" onclick="window.petzyAdminApptFilter('cancelled')">
            Cancelled (${allAppointments.filter(a => a.status.toLowerCase() === 'cancelled').length})
          </button>
        </div>

      </div>

      <!-- Appointments Table Card -->
      <div style="background: var(--color-white); border-radius: var(--radius-xl); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm); overflow: hidden;">
        ${filtered.length === 0 ? `
          <div style="text-align: center; padding: 3.5rem 1.5rem;">
            <i class="fa-solid fa-calendar-xmark" style="font-size: 2.5rem; color: var(--color-sage-green); margin-bottom: 0.75rem;"></i>
            <h4 style="color: var(--color-forest-green); margin-bottom: 0.25rem;">No Appointments Match Criteria</h4>
            <p style="color: var(--color-charcoal-muted); font-size: 0.88rem; margin: 0;">Try adjusting your search terms or filter selections.</p>
          </div>
        ` : `
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
              <thead>
                <tr style="background: var(--color-warm-cream); border-bottom: 1.5px solid var(--color-forest-green); color: var(--color-forest-green); text-align: left; font-family: var(--font-heading); font-size: 0.78rem; text-transform: uppercase;">
                  <th style="padding: 0.85rem 1rem;">ID & Type</th>
                  <th style="padding: 0.85rem 1rem;">Patient / Pet</th>
                  <th style="padding: 0.85rem 1rem;">Clinical Service</th>
                  <th style="padding: 0.85rem 1rem;">Doctor</th>
                  <th style="padding: 0.85rem 1rem;">Schedule</th>
                  <th style="padding: 0.85rem 1rem;">Status</th>
                  <th style="padding: 0.85rem 1rem;">Payment</th>
                  <th style="padding: 0.85rem 1rem; text-align: right;">Manage</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(a => {
                  const sLower = (a.status || '').toLowerCase();

                  return `
                    <tr style="border-bottom: 1px solid var(--color-border); transition: background 0.15s ease;">
                      <!-- ID & Type -->
                      <td style="padding: 0.85rem 1rem;">
                        <strong style="color: var(--color-forest-green); font-family: monospace; font-size: 0.9rem; display: block;">#${a.id}</strong>
                        ${a.appointmentType === 'Follow-Up' ? `
                          <span style="font-size: 0.72rem; color: var(--color-forest-green); font-weight: 700;">Follow-Up (${a.previousAppointmentId ? '#' + a.previousAppointmentId : ''})</span>
                        ` : a.appointmentType === 'Reschedule' ? `
                          <span style="font-size: 0.72rem; color: var(--color-soft-coral-hover); font-weight: 700;">Rescheduled</span>
                        ` : `
                          <span style="font-size: 0.72rem; color: var(--color-charcoal-muted);">Standard Visit</span>
                        `}
                      </td>

                      <!-- Patient -->
                      <td style="padding: 0.85rem 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.65rem;">
                          <img src="${a.petPhoto || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'}" alt="${a.petName}" style="width: 36px; height: 36px; border-radius: var(--radius-sm); object-fit: cover; border: 1.5px solid var(--color-forest-green); flex-shrink: 0;">
                          <div>
                            <strong style="color: var(--color-charcoal); display: block;">${a.petName}</strong>
                            <span style="font-size: 0.75rem; color: var(--color-charcoal-muted);">${a.species || 'Pet'}</span>
                          </div>
                        </div>
                      </td>

                      <!-- Service -->
                      <td style="padding: 0.85rem 1rem;">
                        <span style="color: var(--color-forest-green); font-weight: 700; display: block;">${a.service}</span>
                        <span style="font-size: 0.75rem; color: var(--color-charcoal-muted);">${a.room || 'Suite 2B'} • ${a.duration || '30 Mins'}</span>
                      </td>

                      <!-- Doctor -->
                      <td style="padding: 0.85rem 1rem; color: var(--color-charcoal); font-weight: 600;">
                        ${a.veterinarian}
                      </td>

                      <!-- Date & Time -->
                      <td style="padding: 0.85rem 1rem;">
                        <div style="font-weight: 600; color: var(--color-charcoal);">${a.date}</div>
                        <span style="font-size: 0.78rem; font-weight: 700; color: var(--color-forest-green);">${a.time}</span>
                      </td>

                      <!-- Status -->
                      <td style="padding: 0.85rem 1rem;">
                        <span class="appointment-status-badge ${sLower}" style="font-size: 0.72rem; padding: 0.2rem 0.6rem;">
                          ${a.status}
                        </span>
                      </td>

                      <!-- Payment -->
                      <td style="padding: 0.85rem 1rem;">
                        <div style="display: flex; flex-direction: column; gap: 0.15rem;">
                          <span class="section-badge" style="background: ${a.paymentStatus === 'Paid' ? '#DCFCE7' : a.paymentStatus === 'Refunded' ? '#FEE2E2' : '#FEF3C7'}; color: ${a.paymentStatus === 'Paid' ? '#16A34A' : a.paymentStatus === 'Refunded' ? '#DC2626' : '#D97706'}; font-size: 0.7rem; padding: 0.15rem 0.5rem; margin: 0;">
                            ${a.paymentStatus || 'Paid'}
                          </span>
                          <span style="font-size: 0.78rem; font-weight: 700; color: var(--color-forest-green);">${a.price || '$55.00'}</span>
                        </div>
                      </td>

                      <!-- Actions -->
                      <td style="padding: 0.85rem 1rem; text-align: right;">
                        <div style="display: inline-flex; gap: 0.35rem;">
                          <button type="button" class="btn btn-teal" onclick="window.petzyAdminUpdateAppt('${a.id}')" style="padding: 0.3rem 0.65rem; font-size: 0.78rem;" title="Update Status & Diagnosis Notes">
                            <i class="fa-solid fa-pen-to-square"></i>
                            <span>Update</span>
                          </button>

                          <button type="button" class="btn btn-outline" onclick="window.petzyAdminReceipt('${a.paymentId || a.id}')" style="padding: 0.3rem 0.55rem; font-size: 0.78rem;" title="View Digital Receipt">
                            <i class="fa-solid fa-file-invoice"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>
        `}
      </div>

    </div>
  `;
}

export function setupAdminAppointmentsEvents(refreshAdmin) {
  document.getElementById('admin-appt-search-input')?.addEventListener('input', (e) => {
    apptSearchQuery = e.target.value;
    refreshAdmin();
  });

  document.getElementById('admin-appt-doc-select')?.addEventListener('change', (e) => {
    apptDoctorFilter = e.target.value;
    refreshAdmin();
  });

  document.getElementById('admin-appt-pay-select')?.addEventListener('change', (e) => {
    apptPaymentFilter = e.target.value;
    refreshAdmin();
  });

  window.petzyAdminApptFilter = (status) => {
    apptStatusFilter = status;
    refreshAdmin();
  };

  window.petzyAdminUpdateAppt = (apptId) => {
    openAppointmentStatusModal(apptId, refreshAdmin);
  };

  window.petzyAdminReceipt = (paymentOrApptId) => {
    openPaymentReceiptModal(paymentOrApptId);
  };
}
