/* PETZY Admin Service Management View (Milestone 4) */
import {
  getStoredServices,
  toggleServiceStatus,
  deleteService
} from '../../services/storage.js';
import { openServiceFormModal } from '../../components/admin-modals.js';
import { showToast } from '../../components/toast.js';

let serviceSearchQuery = '';

export function renderAdminServices() {
  const services = getStoredServices();

  const filtered = services.filter(s => {
    const q = serviceSearchQuery.toLowerCase();
    return !q ||
      (s.title || '').toLowerCase().includes(q) ||
      (s.badge || '').toLowerCase().includes(q) ||
      (s.category || '').toLowerCase().includes(q) ||
      (s.room || '').toLowerCase().includes(q);
  });

  return `
    <div class="admin-tab-content animate-fade-up">
      
      <!-- Header with Add Service CTA -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 style="font-size: 1.5rem; color: var(--color-forest-green); margin: 0 0 0.25rem; font-family: var(--font-heading);">
            <i class="fa-solid fa-stethoscope" style="color: var(--color-soft-coral); margin-right: 0.4rem;"></i>
            Clinical Services Catalog
          </h2>
          <span style="font-size: 0.85rem; color: var(--color-charcoal-muted);">Add, edit, pricing, and toggle clinical and surgical services synchronized across the website.</span>
        </div>

        <button type="button" class="btn btn-teal" id="admin-add-service-btn">
          <i class="fa-solid fa-plus"></i>
          <span>Add New Service</span>
        </button>
      </div>

      <!-- Search Filter -->
      <div style="background: var(--color-white); padding: 1.15rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border); margin-bottom: 1.5rem;">
        <div style="position: relative; max-width: 400px;">
          <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--color-charcoal-muted); font-size: 0.85rem;"></i>
          <input type="text" id="admin-srv-search-input" class="form-input" placeholder="Search services by title, category, or suite..." value="${serviceSearchQuery}" style="padding-left: 2.25rem; font-size: 0.85rem;">
        </div>
      </div>

      <!-- Services Table -->
      <div style="background: var(--color-white); border-radius: var(--radius-xl); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm); overflow: hidden;">
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
            <thead>
              <tr style="background: var(--color-warm-cream); border-bottom: 1.5px solid var(--color-forest-green); color: var(--color-forest-green); text-align: left; font-family: var(--font-heading); font-size: 0.78rem; text-transform: uppercase;">
                <th style="padding: 0.85rem 1rem;">Service Detail</th>
                <th style="padding: 0.85rem 1rem;">Category</th>
                <th style="padding: 0.85rem 1rem;">Target Species</th>
                <th style="padding: 0.85rem 1rem;">Duration</th>
                <th style="padding: 0.85rem 1rem;">Fee</th>
                <th style="padding: 0.85rem 1rem;">Suite / Room</th>
                <th style="padding: 0.85rem 1rem;">Status</th>
                <th style="padding: 0.85rem 1rem; text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.map(s => {
                const isInactive = s.status === 'Inactive' || s.status === 'Disabled';

                return `
                  <tr style="border-bottom: 1px solid var(--color-border); opacity: ${isInactive ? '0.6' : '1'}; transition: opacity 0.2s ease;">
                    <td style="padding: 0.85rem 1rem;">
                      <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <img src="${s.image}" alt="${s.title}" style="width: 44px; height: 44px; border-radius: var(--radius-md); object-fit: cover; border: 1px solid var(--color-border); flex-shrink: 0;">
                        <div>
                          <strong style="color: var(--color-forest-green); font-size: 0.95rem; display: block;">${s.title}</strong>
                          <span style="font-size: 0.75rem; color: var(--color-charcoal-muted); font-family: monospace;">ID: #${s.id}</span>
                        </div>
                      </div>
                    </td>
                    <td style="padding: 0.85rem 1rem;">
                      <span class="section-badge" style="font-size: 0.72rem; padding: 0.2rem 0.6rem; margin: 0;">
                        <i class="${s.icon || 'fa-solid fa-stethoscope'}"></i>
                        <span>${s.badge || s.category || 'Care'}</span>
                      </span>
                    </td>
                    <td style="padding: 0.85rem 1rem; color: var(--color-charcoal); font-weight: 600;">
                      ${s.petTypeLabel || 'All Pets'}
                    </td>
                    <td style="padding: 0.85rem 1rem; color: var(--color-charcoal-muted);">
                      <i class="fa-solid fa-clock" style="margin-right: 0.3rem;"></i>${s.duration || '30 Mins'}
                    </td>
                    <td style="padding: 0.85rem 1rem; font-weight: 800; color: var(--color-forest-green); font-size: 0.95rem;">
                      ${s.price || '$55'}
                    </td>
                    <td style="padding: 0.85rem 1rem; color: var(--color-charcoal-muted); font-size: 0.8rem;">
                      <i class="fa-solid fa-location-dot" style="margin-right: 0.3rem;"></i>${s.room || 'Suite 2B'}
                    </td>
                    <td style="padding: 0.85rem 1rem;">
                      <span class="section-badge" style="background: ${isInactive ? '#FDEDEC' : 'var(--color-sage-green-soft)'}; color: ${isInactive ? '#C0392B' : 'var(--color-forest-green)'}; font-size: 0.72rem; padding: 0.15rem 0.55rem; margin: 0;">
                        ${isInactive ? 'Disabled' : 'Active'}
                      </span>
                    </td>
                    <td style="padding: 0.85rem 1rem; text-align: right;">
                      <div style="display: inline-flex; gap: 0.35rem;">
                        <button type="button" class="btn btn-outline" onclick="window.petzyEditService('${s.id}')" style="padding: 0.3rem 0.65rem; font-size: 0.78rem;" title="Edit Service Details">
                          <i class="fa-solid fa-pen"></i>
                          <span>Edit</span>
                        </button>
                        
                        <button type="button" class="btn btn-outline" onclick="window.petzyToggleService('${s.id}')" style="padding: 0.3rem 0.55rem; font-size: 0.78rem;" title="${isInactive ? 'Enable Service' : 'Disable Service'}">
                          <i class="fa-solid ${isInactive ? 'fa-eye' : 'fa-eye-slash'}"></i>
                        </button>

                        <button type="button" class="btn btn-outline" onclick="window.petzyDeleteService('${s.id}', '${s.title}')" style="padding: 0.3rem 0.55rem; font-size: 0.78rem; border-color: #F5B7B1; color: #C0392B;" title="Delete Service">
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
      </div>

    </div>
  `;
}

export function setupAdminServicesEvents(refreshAdmin) {
  document.getElementById('admin-add-service-btn')?.addEventListener('click', () => {
    openServiceFormModal(null, refreshAdmin);
  });

  const searchInput = document.getElementById('admin-srv-search-input');
  searchInput?.addEventListener('input', (e) => {
    serviceSearchQuery = e.target.value;
    refreshAdmin();
  });

  window.petzyEditService = (serviceId) => {
    openServiceFormModal(serviceId, refreshAdmin);
  };

  window.petzyToggleService = (serviceId) => {
    const updated = toggleServiceStatus(serviceId);
    showToast(`Service "${updated.title}" ${updated.status === 'Inactive' ? 'disabled' : 'enabled'}.`, 'sage', 'fa-solid fa-toggle-on');
    refreshAdmin();
  };

  window.petzyDeleteService = (serviceId, title) => {
    if (confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      deleteService(serviceId);
      showToast(`Service "${title}" deleted.`, 'coral', 'fa-solid fa-trash-can');
      refreshAdmin();
    }
  };
}
