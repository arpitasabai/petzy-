/* PETZY Admin Overview Dashboard View (Milestone 4) */
import {
  getAllRegisteredCustomers,
  getAllUsers
} from '../../services/auth.js';
import {
  getStoredServices,
  getStoredVeterinarians,
  getAllGlobalAppointments,
  getPaymentRecords,
  getUserPets
} from '../../services/storage.js';
import {
  openCustomerDetailsModal,
  openServiceFormModal,
  openVeterinarianFormModal,
  openDoctorScheduleModal,
  openAppointmentStatusModal
} from '../../components/admin-modals.js';
import { openPaymentReceiptModal } from '../../components/payment-receipt-modal.js';

export function renderAdminOverview() {
  const customers = getAllRegisteredCustomers();
  const services = getStoredServices();
  const vets = getStoredVeterinarians();
  const appointments = getAllGlobalAppointments();
  const payments = getPaymentRecords();

  // Aggregate all registered pets across all users
  let totalPetsCount = 0;
  customers.forEach(c => {
    const p = getUserPets(c.id);
    totalPetsCount += p.length;
  });

  const upcomingAppts = appointments.filter(a => ['upcoming', 'confirmed', 'rescheduled'].includes(a.status.toLowerCase()));
  const completedAppts = appointments.filter(a => a.status.toLowerCase() === 'completed');
  const cancelledAppts = appointments.filter(a => a.status.toLowerCase() === 'cancelled');

  // Compute Gross Revenue
  let totalRevenue = 0;
  payments.forEach(p => {
    if (p.status === 'Paid') {
      const numeric = parseFloat(String(p.amount).replace(/[^0-9.]/g, '')) || 0;
      totalRevenue += numeric;
    }
  });

  const recentAppts = appointments.slice(0, 6);

  return `
    <div class="admin-tab-content animate-fade-up">
      
      <!-- Welcome Banner & Quick Summary -->
      <div class="admin-welcome-banner" style="background: linear-gradient(135deg, var(--color-forest-green) 0%, #0d2e24 100%); color: var(--color-warm-cream); padding: 1.75rem 2rem; border-radius: var(--radius-xl); margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.25rem; box-shadow: var(--shadow-md); position: relative; overflow: hidden;">
        <div style="position: relative; z-index: 2;">
          <div class="section-badge" style="background: rgba(255,255,255,0.18); color: var(--color-warm-cream); border: none; margin-bottom: 0.5rem;">
            <i class="fa-solid fa-hospital"></i>
            <span>Executive Command Center</span>
          </div>
          <h2 style="font-size: 1.75rem; color: #fff; margin: 0 0 0.35rem; font-family: var(--font-heading);">
            Hospital Operations & Performance Overview
          </h2>
          <p style="font-size: 0.92rem; color: rgba(255,255,255,0.85); margin: 0; max-width: 580px;">
            Real-time synchronization across clinical specialists, patient health records, appointment bookings, and payment transactions.
          </p>
        </div>

        <div style="display: flex; gap: 0.75rem; z-index: 2; flex-wrap: wrap;">
          <button type="button" class="btn btn-coral" id="admin-quick-add-srv-btn" style="font-size: 0.85rem;">
            <i class="fa-solid fa-plus"></i>
            <span>Add Service</span>
          </button>
          <button type="button" class="btn btn-outline" id="admin-quick-add-vet-btn" style="color: #fff; border-color: rgba(255,255,255,0.4); font-size: 0.85rem;">
            <i class="fa-solid fa-user-plus"></i>
            <span>Add Specialist</span>
          </button>
        </div>
      </div>

      <!-- 8 KPI Metrics Cards Grid -->
      <div class="admin-kpi-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 1.15rem; margin-bottom: 2rem;">
        
        <!-- 1. Total Customers -->
        <div class="admin-kpi-card" onclick="window.petzyAdminTab('customers')" style="background: var(--color-white); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm); cursor: pointer; transition: transform var(--transition-fast);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: var(--color-sage-green-soft); color: var(--color-forest-green); display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
              <i class="fa-solid fa-users"></i>
            </div>
            <span style="font-size: 0.75rem; color: var(--color-forest-green); font-weight: 700;">Manage <i class="fa-solid fa-arrow-right"></i></span>
          </div>
          <div style="font-size: 1.85rem; font-weight: 800; color: var(--color-forest-green); font-family: var(--font-heading);">${customers.length}</div>
          <div style="font-size: 0.82rem; color: var(--color-charcoal-muted); font-weight: 600;">Registered Pet Parents</div>
        </div>

        <!-- 2. Total Pets -->
        <div class="admin-kpi-card" onclick="window.petzyAdminTab('customers')" style="background: var(--color-white); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm); cursor: pointer;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: #FFF4E5; color: #D97706; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
              <i class="fa-solid fa-paw"></i>
            </div>
            <span style="font-size: 0.75rem; color: #D97706; font-weight: 700;">Patients <i class="fa-solid fa-arrow-right"></i></span>
          </div>
          <div style="font-size: 1.85rem; font-weight: 800; color: var(--color-forest-green); font-family: var(--font-heading);">${totalPetsCount}</div>
          <div style="font-size: 0.82rem; color: var(--color-charcoal-muted); font-weight: 600;">Registered Companion Pets</div>
        </div>

        <!-- 3. Total Veterinarians -->
        <div class="admin-kpi-card" onclick="window.petzyAdminTab('veterinarians')" style="background: var(--color-white); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm); cursor: pointer;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: var(--color-sage-green-soft); color: var(--color-forest-green); display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
              <i class="fa-solid fa-user-doctor"></i>
            </div>
            <span style="font-size: 0.75rem; color: var(--color-forest-green); font-weight: 700;">Specialists <i class="fa-solid fa-arrow-right"></i></span>
          </div>
          <div style="font-size: 1.85rem; font-weight: 800; color: var(--color-forest-green); font-family: var(--font-heading);">${vets.length}</div>
          <div style="font-size: 0.82rem; color: var(--color-charcoal-muted); font-weight: 600;">Clinical Veterinarians</div>
        </div>

        <!-- 4. Total Services Catalog -->
        <div class="admin-kpi-card" onclick="window.petzyAdminTab('services')" style="background: var(--color-white); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm); cursor: pointer;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: #EEF2FF; color: #4F46E5; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
              <i class="fa-solid fa-stethoscope"></i>
            </div>
            <span style="font-size: 0.75rem; color: #4F46E5; font-weight: 700;">Catalog <i class="fa-solid fa-arrow-right"></i></span>
          </div>
          <div style="font-size: 1.85rem; font-weight: 800; color: var(--color-forest-green); font-family: var(--font-heading);">${services.length}</div>
          <div style="font-size: 0.82rem; color: var(--color-charcoal-muted); font-weight: 600;">Active Clinical Services</div>
        </div>

        <!-- 5. Upcoming Appointments -->
        <div class="admin-kpi-card" onclick="window.petzyAdminTab('appointments')" style="background: var(--color-white); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm); cursor: pointer;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: #FEF3C7; color: #D97706; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
              <i class="fa-solid fa-calendar-check"></i>
            </div>
            <span style="font-size: 0.75rem; color: #D97706; font-weight: 700;">Upcoming <i class="fa-solid fa-arrow-right"></i></span>
          </div>
          <div style="font-size: 1.85rem; font-weight: 800; color: #D97706; font-family: var(--font-heading);">${upcomingAppts.length}</div>
          <div style="font-size: 0.82rem; color: var(--color-charcoal-muted); font-weight: 600;">Upcoming Scheduled Visits</div>
        </div>

        <!-- 6. Completed Appointments -->
        <div class="admin-kpi-card" onclick="window.petzyAdminTab('appointments')" style="background: var(--color-white); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm); cursor: pointer;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: #DCFCE7; color: #16A34A; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
              <i class="fa-solid fa-circle-check"></i>
            </div>
            <span style="font-size: 0.75rem; color: #16A34A; font-weight: 700;">Completed <i class="fa-solid fa-arrow-right"></i></span>
          </div>
          <div style="font-size: 1.85rem; font-weight: 800; color: #16A34A; font-family: var(--font-heading);">${completedAppts.length}</div>
          <div style="font-size: 0.82rem; color: var(--color-charcoal-muted); font-weight: 600;">Completed Consultations</div>
        </div>

        <!-- 7. Cancelled Appointments -->
        <div class="admin-kpi-card" onclick="window.petzyAdminTab('appointments')" style="background: var(--color-white); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm); cursor: pointer;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: #FEE2E2; color: #DC2626; display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
              <i class="fa-solid fa-calendar-xmark"></i>
            </div>
            <span style="font-size: 0.75rem; color: #DC2626; font-weight: 700;">Released <i class="fa-solid fa-arrow-right"></i></span>
          </div>
          <div style="font-size: 1.85rem; font-weight: 800; color: #DC2626; font-family: var(--font-heading);">${cancelledAppts.length}</div>
          <div style="font-size: 0.82rem; color: var(--color-charcoal-muted); font-weight: 600;">Cancelled Bookings</div>
        </div>

        <!-- 8. Total Gross Revenue -->
        <div class="admin-kpi-card" onclick="window.petzyAdminTab('payments')" style="background: var(--color-white); padding: 1.25rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm); cursor: pointer; border-left: 4px solid var(--color-forest-green);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
            <div style="width: 42px; height: 42px; border-radius: var(--radius-md); background: var(--color-sage-green-soft); color: var(--color-forest-green); display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
              <i class="fa-solid fa-receipt"></i>
            </div>
            <span style="font-size: 0.75rem; color: var(--color-forest-green); font-weight: 700;">Ledger <i class="fa-solid fa-arrow-right"></i></span>
          </div>
          <div style="font-size: 1.85rem; font-weight: 800; color: var(--color-forest-green); font-family: var(--font-heading);">$${totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div style="font-size: 0.82rem; color: var(--color-charcoal-muted); font-weight: 600;">Gross Revenue Paid</div>
        </div>

      </div>

      <!-- Charts & Visual Analytics Section -->
      <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 1.5rem; margin-bottom: 2rem;">
        
        <!-- Left: Appointment Trends Chart -->
        <div style="background: var(--color-white); padding: 1.5rem; border-radius: var(--radius-xl); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <i class="fa-solid fa-chart-line" style="color: var(--color-forest-green); font-size: 1.15rem;"></i>
              <h3 style="font-size: 1.1rem; color: var(--color-forest-green); margin: 0;">Weekly Patient Visit Inflow</h3>
            </div>
            <span style="font-size: 0.78rem; background: var(--color-warm-cream); padding: 0.2rem 0.65rem; border-radius: var(--radius-full); color: var(--color-forest-green); font-weight: 700;">Live Feed</span>
          </div>

          <!-- SVG Visual Line & Area Chart -->
          <div style="position: relative; width: 100%; height: 180px;">
            <svg viewBox="0 0 500 160" style="width: 100%; height: 100%; overflow: visible;">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#174A3A" stop-opacity="0.35"/>
                  <stop offset="100%" stop-color="#174A3A" stop-opacity="0.0"/>
                </linearGradient>
              </defs>
              <!-- Grid lines -->
              <line x1="0" y1="30" x2="500" y2="30" stroke="#eee" stroke-dasharray="3"/>
              <line x1="0" y1="70" x2="500" y2="70" stroke="#eee" stroke-dasharray="3"/>
              <line x1="0" y1="110" x2="500" y2="110" stroke="#eee" stroke-dasharray="3"/>
              
              <!-- Area fill -->
              <polygon points="20,130 90,95 170,110 250,55 330,75 410,35 480,45 480,145 20,145" fill="url(#chartGrad)" />
              
              <!-- Smooth Line -->
              <polyline points="20,130 90,95 170,110 250,55 330,75 410,35 480,45" fill="none" stroke="#174A3A" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
              
              <!-- Points with tooltips -->
              <circle cx="20" cy="130" r="4.5" fill="#F28C7B" stroke="#fff" stroke-width="2"/>
              <circle cx="90" cy="95" r="4.5" fill="#F28C7B" stroke="#fff" stroke-width="2"/>
              <circle cx="170" cy="110" r="4.5" fill="#F28C7B" stroke="#fff" stroke-width="2"/>
              <circle cx="250" cy="55" r="4.5" fill="#F28C7B" stroke="#fff" stroke-width="2"/>
              <circle cx="330" cy="75" r="4.5" fill="#F28C7B" stroke="#fff" stroke-width="2"/>
              <circle cx="410" cy="35" r="5.5" fill="#174A3A" stroke="#fff" stroke-width="2.5"/>
              <circle cx="480" cy="45" r="4.5" fill="#F28C7B" stroke="#fff" stroke-width="2"/>
            </svg>
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--color-charcoal-muted); margin-top: 0.5rem;">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span style="font-weight: 700; color: var(--color-forest-green);">Sat (Peak)</span>
              <span>Sun</span>
            </div>
          </div>
        </div>

        <!-- Right: Revenue by Service Distribution -->
        <div style="background: var(--color-white); padding: 1.5rem; border-radius: var(--radius-xl); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem;">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
              <i class="fa-solid fa-pie-chart" style="color: var(--color-soft-coral); font-size: 1.15rem;"></i>
              <h3 style="font-size: 1.1rem; color: var(--color-forest-green); margin: 0;">Department Revenue</h3>
            </div>
            <span style="font-size: 0.78rem; color: var(--color-charcoal-muted);">30-Day Share</span>
          </div>

          <!-- Service breakdown bars -->
          <div style="display: flex; flex-direction: column; gap: 0.85rem; font-size: 0.82rem;">
            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                <span style="font-weight: 600; color: var(--color-forest-green);">Veterinary Consultation</span>
                <span style="font-weight: 700;">42% ($440.00)</span>
              </div>
              <div style="height: 7px; background: #eee; border-radius: 4px; overflow: hidden;">
                <div style="height: 100%; width: 42%; background: var(--color-forest-green); border-radius: 4px;"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                <span style="font-weight: 600; color: var(--color-forest-green);">Dental & Surgical</span>
                <span style="font-weight: 700;">28% ($290.00)</span>
              </div>
              <div style="height: 7px; background: #eee; border-radius: 4px; overflow: hidden;">
                <div style="height: 100%; width: 28%; background: var(--color-soft-coral); border-radius: 4px;"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                <span style="font-weight: 600; color: var(--color-forest-green);">Vaccinations & Diagnostics</span>
                <span style="font-weight: 700;">20% ($210.00)</span>
              </div>
              <div style="height: 7px; background: #eee; border-radius: 4px; overflow: hidden;">
                <div style="height: 100%; width: 20%; background: #27AE60; border-radius: 4px;"></div>
              </div>
            </div>

            <div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                <span style="font-weight: 600; color: var(--color-forest-green);">Emergency & Oncology</span>
                <span style="font-weight: 700;">10% ($105.00)</span>
              </div>
              <div style="height: 7px; background: #eee; border-radius: 4px; overflow: hidden;">
                <div style="height: 100%; width: 10%; background: #6C5CE7; border-radius: 4px;"></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Recent Appointments Activity Table -->
      <div style="background: var(--color-white); padding: 1.5rem; border-radius: var(--radius-xl); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm);">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; flex-wrap: wrap; gap: 0.75rem;">
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <i class="fa-solid fa-clock-rotate-left" style="color: var(--color-forest-green); font-size: 1.15rem;"></i>
            <h3 style="font-size: 1.15rem; color: var(--color-forest-green); margin: 0;">Recent Hospital Appointments</h3>
          </div>
          <button type="button" class="btn btn-outline" onclick="window.petzyAdminTab('appointments')" style="font-size: 0.82rem; padding: 0.35rem 0.85rem;">
            <span>View All Global Appointments</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
            <thead>
              <tr style="border-bottom: 1.5px solid var(--color-forest-green); color: var(--color-forest-green); text-align: left; font-family: var(--font-heading); font-size: 0.78rem; text-transform: uppercase;">
                <th style="padding: 0.65rem 0.5rem;">Booking ID</th>
                <th style="padding: 0.65rem 0.5rem;">Patient / Pet</th>
                <th style="padding: 0.65rem 0.5rem;">Service</th>
                <th style="padding: 0.65rem 0.5rem;">Attending Doctor</th>
                <th style="padding: 0.65rem 0.5rem;">Date & Time</th>
                <th style="padding: 0.65rem 0.5rem;">Status</th>
                <th style="padding: 0.65rem 0.5rem;">Payment</th>
                <th style="padding: 0.65rem 0.5rem; text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${recentAppts.map(a => `
                <tr style="border-bottom: 1px solid var(--color-border); transition: background 0.15s ease;">
                  <td style="padding: 0.75rem 0.5rem; font-family: monospace; font-weight: 700; color: var(--color-forest-green);">#${a.id}</td>
                  <td style="padding: 0.75rem 0.5rem;">
                    <strong style="color: var(--color-charcoal);">${a.petName}</strong>
                    <span style="display: block; font-size: 0.75rem; color: var(--color-charcoal-muted);">${a.species || 'Pet'}</span>
                  </td>
                  <td style="padding: 0.75rem 0.5rem; color: var(--color-forest-green); font-weight: 600;">${a.service}</td>
                  <td style="padding: 0.75rem 0.5rem; color: var(--color-charcoal);">${a.veterinarian}</td>
                  <td style="padding: 0.75rem 0.5rem;">
                    <div>${a.date}</div>
                    <span style="font-size: 0.75rem; color: var(--color-charcoal-muted);">${a.time}</span>
                  </td>
                  <td style="padding: 0.75rem 0.5rem;">
                    <span class="appointment-status-badge ${a.status.toLowerCase()}" style="font-size: 0.72rem; padding: 0.2rem 0.55rem;">
                      ${a.status}
                    </span>
                  </td>
                  <td style="padding: 0.75rem 0.5rem;">
                    <span class="section-badge" style="background: ${a.paymentStatus === 'Paid' ? '#DCFCE7' : '#FEF3C7'}; color: ${a.paymentStatus === 'Paid' ? '#16A34A' : '#D97706'}; font-size: 0.7rem; padding: 0.15rem 0.5rem; margin: 0;">
                      ${a.paymentStatus || 'Paid'}
                    </span>
                  </td>
                  <td style="padding: 0.75rem 0.5rem; text-align: right;">
                    <div style="display: inline-flex; gap: 0.35rem;">
                      <button type="button" class="btn btn-outline" onclick="window.petzyAdminUpdateAppt('${a.id}')" style="padding: 0.25rem 0.55rem; font-size: 0.75rem;" title="Update Status & Clinical Notes">
                        <i class="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button type="button" class="btn btn-outline" onclick="window.petzyAdminReceipt('${a.paymentId || a.id}')" style="padding: 0.25rem 0.55rem; font-size: 0.75rem;" title="View Digital Receipt">
                        <i class="fa-solid fa-receipt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

export function setupAdminOverviewEvents(refreshAdmin) {
  document.getElementById('admin-quick-add-srv-btn')?.addEventListener('click', () => {
    openServiceFormModal(null, refreshAdmin);
  });

  document.getElementById('admin-quick-add-vet-btn')?.addEventListener('click', () => {
    openVeterinarianFormModal(null, refreshAdmin);
  });
}
