/* PETZY Admin Customer & Pet Management View (Milestone 4) */
import {
  getAllRegisteredCustomers,
  toggleCustomerStatus,
  deleteCustomerByAdmin
} from '../../services/auth.js';
import {
  getUserPets
} from '../../services/storage.js';
import { openCustomerDetailsModal } from '../../components/admin-modals.js';
import { showToast } from '../../components/toast.js';

let customerSearchQuery = '';
let customerStatusFilter = 'all';

export function renderAdminCustomers() {
  const allCustomers = getAllRegisteredCustomers();

  // Filter customers based on search and status
  const filtered = allCustomers.filter(c => {
    const q = customerSearchQuery.toLowerCase();
    const pets = getUserPets(c.id);
    const petNames = pets.map(p => (p.name || '').toLowerCase()).join(' ');

    const matchesSearch = !q || 
      (c.name || '').toLowerCase().includes(q) ||
      (c.email || '').toLowerCase().includes(q) ||
      (c.phone || '').toLowerCase().includes(q) ||
      petNames.includes(q);

    const matchesStatus = customerStatusFilter === 'all' ||
      (customerStatusFilter === 'active' && c.status !== 'Disabled') ||
      (customerStatusFilter === 'disabled' && c.status === 'Disabled');

    return matchesSearch && matchesStatus;
  });

  return `
    <div class="admin-tab-content animate-fade-up">
      
      <!-- Top Subhead & Controls -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 style="font-size: 1.5rem; color: var(--color-forest-green); margin: 0 0 0.25rem; font-family: var(--font-heading);">
            <i class="fa-solid fa-users" style="color: var(--color-soft-coral); margin-right: 0.4rem;"></i>
            Customer & Patient Profiles
          </h2>
          <span style="font-size: 0.85rem; color: var(--color-charcoal-muted);">Inspect registered pet parents, monitor companion pet health files, and manage account statuses.</span>
        </div>

        <div class="section-badge" style="background: var(--color-sage-green-soft); color: var(--color-forest-green); margin: 0;">
          <i class="fa-solid fa-paw"></i>
          <span>Total Customers: ${allCustomers.length}</span>
        </div>
      </div>

      <!-- Search & Filter Bar -->
      <div style="background: var(--color-white); padding: 1.15rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border); margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div style="display: flex; align-items: center; gap: 0.5rem; flex: 1; min-width: 260px;">
          <div style="position: relative; width: 100%;">
            <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--color-charcoal-muted); font-size: 0.85rem;"></i>
            <input type="text" id="admin-cust-search-input" class="form-input" placeholder="Search by parent name, email, phone, or pet name..." value="${customerSearchQuery}" style="padding-left: 2.25rem; font-size: 0.85rem;">
          </div>
        </div>

        <div style="display: flex; gap: 0.5rem;">
          <button type="button" class="quick-action-pill ${customerStatusFilter === 'all' ? 'primary' : ''}" onclick="window.petzyAdminCustFilter('all')">
            All (${allCustomers.length})
          </button>
          <button type="button" class="quick-action-pill ${customerStatusFilter === 'active' ? 'primary' : ''}" onclick="window.petzyAdminCustFilter('active')">
            Active (${allCustomers.filter(c => c.status !== 'Disabled').length})
          </button>
          <button type="button" class="quick-action-pill ${customerStatusFilter === 'disabled' ? 'primary' : ''}" onclick="window.petzyAdminCustFilter('disabled')">
            Disabled (${allCustomers.filter(c => c.status === 'Disabled').length})
          </button>
        </div>
      </div>

      <!-- Customers Table Card -->
      <div style="background: var(--color-white); border-radius: var(--radius-xl); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm); overflow: hidden;">
        ${filtered.length === 0 ? `
          <div style="text-align: center; padding: 3.5rem 1.5rem;">
            <i class="fa-solid fa-user-slash" style="font-size: 2.5rem; color: var(--color-sage-green); margin-bottom: 0.75rem;"></i>
            <h4 style="color: var(--color-forest-green); margin-bottom: 0.25rem;">No Customers Found</h4>
            <p style="color: var(--color-charcoal-muted); font-size: 0.88rem; margin: 0;">Try adjusting your search keywords or status filter.</p>
          </div>
        ` : `
          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
              <thead>
                <tr style="background: var(--color-warm-cream); border-bottom: 1.5px solid var(--color-forest-green); color: var(--color-forest-green); text-align: left; font-family: var(--font-heading); font-size: 0.78rem; text-transform: uppercase;">
                  <th style="padding: 0.85rem 1rem;">Client / Pet Parent</th>
                  <th style="padding: 0.85rem 1rem;">Contact Info</th>
                  <th style="padding: 0.85rem 1rem;">Registered Pets</th>
                  <th style="padding: 0.85rem 1rem;">Tier / Joined</th>
                  <th style="padding: 0.85rem 1rem;">Account Status</th>
                  <th style="padding: 0.85rem 1rem; text-align: right;">Management Actions</th>
                </tr>
              </thead>
              <tbody>
                ${filtered.map(c => {
                  const pets = getUserPets(c.id);
                  const isDisabled = c.status === 'Disabled';

                  return `
                    <tr style="border-bottom: 1px solid var(--color-border); transition: background 0.15s ease;">
                      <!-- Client -->
                      <td style="padding: 0.85rem 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                          <img src="${c.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}" alt="${c.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid var(--color-forest-green); flex-shrink: 0;">
                          <div>
                            <strong style="color: var(--color-forest-green); font-size: 0.95rem; display: block;">${c.name}</strong>
                            <span style="font-size: 0.75rem; color: var(--color-charcoal-muted); font-family: monospace;">ID: #${c.id}</span>
                          </div>
                        </div>
                      </td>

                      <!-- Contact Info -->
                      <td style="padding: 0.85rem 1rem;">
                        <div style="color: var(--color-charcoal);"><i class="fa-solid fa-envelope" style="color: var(--color-forest-green); margin-right: 0.3rem;"></i>${c.email}</div>
                        <div style="font-size: 0.78rem; color: var(--color-charcoal-muted); margin-top: 0.2rem;"><i class="fa-solid fa-phone" style="margin-right: 0.3rem;"></i>${c.phone || '+1 (555) 234-5678'}</div>
                      </td>

                      <!-- Pets -->
                      <td style="padding: 0.85rem 1rem;">
                        <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; align-items: center;">
                          ${pets.length === 0 ? '<span style="color: var(--color-charcoal-muted); font-size: 0.78rem;">No pets registered</span>' : pets.map(p => `
                            <span style="background: var(--color-warm-cream); color: var(--color-forest-green); font-size: 0.75rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--color-border-subtle); display: inline-flex; align-items: center; gap: 0.25rem;">
                              <i class="fa-solid fa-paw" style="color: var(--color-soft-coral); font-size: 0.65rem;"></i> ${p.name}
                            </span>
                          `).join('')}
                        </div>
                      </td>

                      <!-- Joined / Tier -->
                      <td style="padding: 0.85rem 1rem;">
                        <strong style="color: var(--color-forest-green); display: block;">${c.membershipTier || 'CarePlus'}</strong>
                        <span style="font-size: 0.75rem; color: var(--color-charcoal-muted);">Since ${c.joinedDate || '2025'}</span>
                      </td>

                      <!-- Status -->
                      <td style="padding: 0.85rem 1rem;">
                        <span class="section-badge" style="background: ${isDisabled ? '#FDEDEC' : 'var(--color-sage-green-soft)'}; color: ${isDisabled ? '#C0392B' : 'var(--color-forest-green)'}; font-size: 0.72rem; padding: 0.2rem 0.6rem; margin: 0;">
                          <i class="fa-solid ${isDisabled ? 'fa-ban' : 'fa-check'}"></i>
                          <span>${c.status || 'Active'}</span>
                        </span>
                      </td>

                      <!-- Actions -->
                      <td style="padding: 0.85rem 1rem; text-align: right;">
                        <div style="display: inline-flex; gap: 0.4rem;">
                          <button type="button" class="btn btn-outline" onclick="window.petzyInspectCustomer('${c.id}')" style="padding: 0.3rem 0.65rem; font-size: 0.78rem;" title="Inspect Pet Profiles & Medical Records">
                            <i class="fa-solid fa-folder-open"></i>
                            <span>Inspect</span>
                          </button>
                          
                          <button type="button" class="btn btn-outline" onclick="window.petzyToggleCust('${c.id}')" style="padding: 0.3rem 0.55rem; font-size: 0.78rem;" title="${isDisabled ? 'Enable Account' : 'Disable Account'}">
                            <i class="fa-solid ${isDisabled ? 'fa-user-check' : 'fa-user-slash'}"></i>
                          </button>

                          <button type="button" class="btn btn-outline" onclick="window.petzyDeleteCust('${c.id}', '${c.name}')" style="padding: 0.3rem 0.55rem; font-size: 0.78rem; border-color: #F5B7B1; color: #C0392B;" title="Delete Customer Account">
                            <i class="fa-solid fa-trash-can"></i>
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

export function setupAdminCustomersEvents(refreshAdmin) {
  // Search input handler with debounce
  const searchInput = document.getElementById('admin-cust-search-input');
  searchInput?.addEventListener('input', (e) => {
    customerSearchQuery = e.target.value;
    refreshAdmin();
  });

  // Global window helpers for customer actions
  window.petzyAdminCustFilter = (status) => {
    customerStatusFilter = status;
    refreshAdmin();
  };

  window.petzyInspectCustomer = (userId) => {
    openCustomerDetailsModal(userId, refreshAdmin);
  };

  window.petzyToggleCust = (userId) => {
    const updated = toggleCustomerStatus(userId);
    showToast(`Customer account ${updated.status === 'Disabled' ? 'disabled' : 'enabled'}.`, 'sage', 'fa-solid fa-user-gear');
    refreshAdmin();
  };

  window.petzyDeleteCust = (userId, name) => {
    if (confirm(`Are you sure you want to permanently delete ${name}'s customer account?`)) {
      deleteCustomerByAdmin(userId);
      showToast(`Customer ${name} deleted successfully.`, 'coral', 'fa-solid fa-trash-can');
      refreshAdmin();
    }
  };
}
