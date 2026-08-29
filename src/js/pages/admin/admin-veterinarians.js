/* PETZY Admin Veterinarian Management View (Milestone 4) */
import {
  getStoredVeterinarians,
  getDoctorAvailability,
  toggleDoctorStatus,
  deleteVeterinarian
} from '../../services/storage.js';
import {
  openVeterinarianFormModal,
  openDoctorScheduleModal
} from '../../components/admin-modals.js';
import { showToast } from '../../components/toast.js';

let vetSearchQuery = '';

export function renderAdminVeterinarians() {
  const vets = getStoredVeterinarians();

  const filtered = vets.filter(v => {
    if (!vetSearchQuery || !vetSearchQuery.trim()) return true;

    const rawQ = vetSearchQuery.toLowerCase().trim();
    // Remove punctuation like dots, commas, dashes to support "Dr. Ananya", "Dr Ananya", "Ananya", etc.
    const cleanQ = rawQ.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
    const tokens = cleanQ.split(' ').filter(t => t.length > 0 && t !== 'dr' && t !== 'doctor');
    
    // If the query was solely "dr" or "doctor", match all specialists
    if (tokens.length === 0) return true;

    const name = (v.name || '').toLowerCase();
    const cleanName = name.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ');
    const id = (v.id || '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
    const title = (v.title || '').toLowerCase();
    const degrees = (v.degrees || '').toLowerCase();
    const specs = (Array.isArray(v.specialties) ? v.specialties.join(' ') : (v.specialties || '')).toLowerCase();
    const exp = (v.experience || '').toLowerCase();
    const bio = (v.bio || '').toLowerCase();
    const searchable = `${cleanName} ${name} ${id} ${title} ${degrees} ${specs} ${exp} ${bio}`;

    return tokens.every(token => searchable.includes(token));
  });

  return `
    <div class="admin-tab-content animate-fade-up">
      
      <!-- Top Subhead & CTA -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h2 style="font-size: 1.5rem; color: var(--color-forest-green); margin: 0 0 0.25rem; font-family: var(--font-heading);">
            <i class="fa-solid fa-user-doctor" style="color: var(--color-soft-coral); margin-right: 0.4rem;"></i>
            Veterinary Specialists & Staff
          </h2>
          <span style="font-size: 0.85rem; color: var(--color-charcoal-muted);">Maintain doctor profiles, degrees, clinical working days, and leave schedules.</span>
        </div>

        <button type="button" class="btn btn-teal" id="admin-add-vet-btn">
          <i class="fa-solid fa-user-plus"></i>
          <span>Add New Specialist</span>
        </button>
      </div>

      <!-- Search Filter -->
      <div style="background: var(--color-white); padding: 1.15rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border); margin-bottom: 1.5rem;">
        <div style="position: relative; max-width: 400px;">
          <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--color-charcoal-muted); font-size: 0.85rem;"></i>
          <input type="text" id="admin-vet-search-input" class="form-input" placeholder="Search specialists by name, role, or credentials..." value="${vetSearchQuery}" autocomplete="off" style="padding-left: 2.25rem; padding-right: ${vetSearchQuery ? '2.25rem' : '0.85rem'}; font-size: 0.85rem;">
          ${vetSearchQuery ? `
            <button type="button" id="admin-vet-clear-btn" title="Clear Search" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--color-charcoal-muted); cursor: pointer; padding: 4px;">
              <i class="fa-solid fa-xmark"></i>
            </button>
          ` : ''}
        </div>
      </div>

      <!-- Veterinarians Grid/Table -->
      <div style="background: var(--color-white); border-radius: var(--radius-xl); border: 1px solid var(--color-border); box-shadow: var(--shadow-sm); overflow: hidden;">
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
            <thead>
              <tr style="background: var(--color-warm-cream); border-bottom: 1.5px solid var(--color-forest-green); color: var(--color-forest-green); text-align: left; font-family: var(--font-heading); font-size: 0.78rem; text-transform: uppercase;">
                <th style="padding: 0.85rem 1rem;">Veterinarian Specialist</th>
                <th style="padding: 0.85rem 1rem;">Clinical Title</th>
                <th style="padding: 0.85rem 1rem;">Credentials</th>
                <th style="padding: 0.85rem 1rem;">Experience</th>
                <th style="padding: 0.85rem 1rem;">Working Days</th>
                <th style="padding: 0.85rem 1rem;">Status</th>
                <th style="padding: 0.85rem 1rem; text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filtered.length === 0 ? `
                <tr>
                  <td colspan="7" style="text-align: center; padding: 3rem 1.5rem;">
                    <div style="width: 50px; height: 50px; border-radius: 50%; background: var(--color-warm-cream); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 0.75rem;">
                      <i class="fa-solid fa-user-doctor" style="font-size: 1.5rem; color: var(--color-forest-green);"></i>
                    </div>
                    <h4 style="color: var(--color-forest-green); font-family: var(--font-heading); margin: 0 0 0.35rem; font-size: 1.15rem;">No Veterinary Specialists Found</h4>
                    <p style="color: var(--color-charcoal-muted); font-size: 0.88rem; margin: 0 0 1rem; max-width: 420px; display: inline-block;">No specialists match "<strong>${vetSearchQuery}</strong>". Try searching by first name, last name, specialty, or clinical title.</p>
                    <div>
                      <button type="button" class="btn btn-outline" id="admin-vet-empty-clear-btn" style="font-size: 0.82rem; padding: 0.4rem 1rem;">
                        <i class="fa-solid fa-rotate-left"></i>
                        <span>Reset Search Filter</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ` : filtered.map(v => {
                const avail = getDoctorAvailability(v.id);
                const isInactive = v.status === 'Disabled' || v.status === 'Inactive';
                const workingDaysShort = (avail.workingDays || []).map(d => d.substring(0, 3)).join(', ');

                return `
                  <tr style="border-bottom: 1px solid var(--color-border); opacity: ${isInactive ? '0.6' : '1'}; transition: opacity 0.2s ease;">
                    <td style="padding: 0.85rem 1rem;">
                      <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <img src="${v.image}" alt="${v.name}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 2px solid var(--color-forest-green); flex-shrink: 0;">
                        <div>
                          <strong style="color: var(--color-forest-green); font-size: 0.95rem; display: block;">${v.name}</strong>
                          <span style="font-size: 0.75rem; color: var(--color-charcoal-muted); font-family: monospace;">ID: #${v.id}</span>
                        </div>
                      </div>
                    </td>
                    <td style="padding: 0.85rem 1rem; color: var(--color-charcoal); font-weight: 600;">
                      ${v.title}
                    </td>
                    <td style="padding: 0.85rem 1rem; color: var(--color-forest-green); font-weight: 700;">
                      ${v.degrees || 'DVM'}
                    </td>
                    <td style="padding: 0.85rem 1rem; color: var(--color-charcoal-muted);">
                      <i class="fa-solid fa-medal" style="color: #DEB853; margin-right: 0.3rem;"></i>${v.experience || '5+ Years'}
                    </td>
                    <td style="padding: 0.85rem 1rem;">
                      <div style="display: flex; align-items: center; gap: 0.35rem;">
                        <span style="font-size: 0.78rem; font-weight: 600; color: var(--color-forest-green); background: var(--color-warm-cream); padding: 0.15rem 0.5rem; border-radius: var(--radius-sm); border: 1px solid var(--color-border-subtle);">
                          ${workingDaysShort || 'Mon–Sat'}
                        </span>
                        ${(avail.blockedDates && avail.blockedDates.length > 0) ? `
                          <span title="${avail.blockedDates.length} blocked dates" style="background: #FEE2E2; color: #DC2626; font-size: 0.7rem; font-weight: 700; padding: 0.1rem 0.4rem; border-radius: var(--radius-full);">
                            ${avail.blockedDates.length} off
                          </span>
                        ` : ''}
                      </div>
                    </td>
                    <td style="padding: 0.85rem 1rem;">
                      <span class="section-badge" style="background: ${isInactive ? '#FDEDEC' : 'var(--color-sage-green-soft)'}; color: ${isInactive ? '#C0392B' : 'var(--color-forest-green)'}; font-size: 0.72rem; padding: 0.15rem 0.55rem; margin: 0;">
                        ${isInactive ? 'Disabled' : 'Active'}
                      </span>
                    </td>
                    <td style="padding: 0.85rem 1rem; text-align: right;">
                      <div style="display: inline-flex; gap: 0.35rem;">
                        <button type="button" class="btn btn-outline" onclick="window.petzyEditVet('${v.id}')" style="padding: 0.3rem 0.65rem; font-size: 0.78rem;" title="Edit Doctor Profile">
                          <i class="fa-solid fa-pen"></i>
                          <span>Edit</span>
                        </button>

                        <button type="button" class="btn btn-outline" onclick="window.petzyManageSchedule('${v.id}')" style="padding: 0.3rem 0.65rem; font-size: 0.78rem; color: var(--color-forest-green); border-color: var(--color-forest-green);" title="Configure Working Days & Blocked Dates">
                          <i class="fa-solid fa-calendar-week"></i>
                          <span>Schedule</span>
                        </button>
                        
                        <button type="button" class="btn btn-outline" onclick="window.petzyToggleVet('${v.id}')" style="padding: 0.3rem 0.55rem; font-size: 0.78rem;" title="${isInactive ? 'Enable Doctor' : 'Disable Doctor'}">
                          <i class="fa-solid ${isInactive ? 'fa-user-check' : 'fa-user-slash'}"></i>
                        </button>

                        <button type="button" class="btn btn-outline" onclick="window.petzyDeleteVet('${v.id}', '${v.name}')" style="padding: 0.3rem 0.55rem; font-size: 0.78rem; border-color: #F5B7B1; color: #C0392B;" title="Delete Specialist">
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

export function setupAdminVeterinariansEvents(refreshAdmin) {
  document.getElementById('admin-add-vet-btn')?.addEventListener('click', () => {
    openVeterinarianFormModal(null, refreshAdmin);
  });

  const searchInput = document.getElementById('admin-vet-search-input');
  searchInput?.addEventListener('input', (e) => {
    vetSearchQuery = e.target.value;
    refreshAdmin();
  });

  document.getElementById('admin-vet-clear-btn')?.addEventListener('click', () => {
    vetSearchQuery = '';
    refreshAdmin();
  });

  document.getElementById('admin-vet-empty-clear-btn')?.addEventListener('click', () => {
    vetSearchQuery = '';
    refreshAdmin();
  });

  window.petzyEditVet = (vetId) => {
    openVeterinarianFormModal(vetId, refreshAdmin);
  };

  window.petzyManageSchedule = (vetId) => {
    openDoctorScheduleModal(vetId, refreshAdmin);
  };

  window.petzyToggleVet = (vetId) => {
    const updated = toggleDoctorStatus(vetId);
    showToast(`Doctor ${updated.name} ${updated.status === 'Disabled' ? 'disabled' : 'enabled'}.`, 'sage', 'fa-solid fa-user-gear');
    refreshAdmin();
  };

  window.petzyDeleteVet = (vetId, name) => {
    if (confirm(`Are you sure you want to delete ${name}'s profile? This cannot be undone.`)) {
      deleteVeterinarian(vetId);
      showToast(`Specialist ${name} deleted.`, 'coral', 'fa-solid fa-trash-can');
      refreshAdmin();
    }
  };
}
