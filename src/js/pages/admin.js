/* PETZY Master Admin Portal Controller (Milestone 4) */
import { getCurrentUser, isAdmin, logoutUser } from '../services/auth.js';
import { showToast } from '../components/toast.js';
import { renderBackButton } from '../components/back-button.js';
import { renderAdminOverview, setupAdminOverviewEvents } from './admin/admin-overview.js';
import { renderAdminCustomers, setupAdminCustomersEvents } from './admin/admin-customers.js';
import { renderAdminServices, setupAdminServicesEvents } from './admin/admin-services.js';
import { renderAdminVeterinarians, setupAdminVeterinariansEvents } from './admin/admin-veterinarians.js';
import { renderAdminAvailability, setupAdminAvailabilityEvents } from './admin/admin-availability.js';
import { renderAdminAppointments, setupAdminAppointmentsEvents } from './admin/admin-appointments.js';
import { renderAdminPayments, setupAdminPaymentsEvents } from './admin/admin-payments.js';

let activeAdminTab = 'overview';

export function renderAdmin() {
  const user = getCurrentUser();
  if (!user || !isAdmin()) {
    setTimeout(() => {
      window.location.hash = '#/admin/login';
      showToast('Restricted: Administrative authorization required.', 'coral', 'fa-solid fa-shield-halved');
    }, 10);
    return `
      <div class="auth-page-wrapper">
        <div class="auth-card-box" style="text-align: center;">
          <i class="fa-solid fa-spinner fa-spin" style="font-size: 2.5rem; color: var(--color-forest-green); margin-bottom: 1rem;"></i>
          <p>Verifying administrative credentials...</p>
        </div>
      </div>
    `;
  }

  // Parse active tab from URL hash if available
  const hash = window.location.hash || '';
  if (hash.includes('tab=')) {
    const t = hash.split('tab=')[1]?.split('&')[0];
    if (['overview', 'customers', 'services', 'veterinarians', 'availability', 'appointments', 'payments'].includes(t)) {
      activeAdminTab = t;
    }
  } else if (hash.includes('#/admin/dashboard') || hash === '#/admin') {
    activeAdminTab = 'overview';
  } else if (hash.includes('#/admin/customers')) {
    activeAdminTab = 'customers';
  } else if (hash.includes('#/admin/services')) {
    activeAdminTab = 'services';
  } else if (hash.includes('#/admin/veterinarians')) {
    activeAdminTab = 'veterinarians';
  } else if (hash.includes('#/admin/availability')) {
    activeAdminTab = 'availability';
  } else if (hash.includes('#/admin/appointments')) {
    activeAdminTab = 'appointments';
  } else if (hash.includes('#/admin/payments')) {
    activeAdminTab = 'payments';
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'fa-solid fa-chart-pie' },
    { id: 'customers', label: 'Customers & Pets', icon: 'fa-solid fa-users' },
    { id: 'services', label: 'Services Catalog', icon: 'fa-solid fa-stethoscope' },
    { id: 'veterinarians', label: 'Veterinarians', icon: 'fa-solid fa-user-doctor' },
    { id: 'availability', label: 'Doctor Schedules', icon: 'fa-solid fa-calendar-week' },
    { id: 'appointments', label: 'Appointments', icon: 'fa-solid fa-calendar-check' },
    { id: 'payments', label: 'Payments & Revenue', icon: 'fa-solid fa-receipt' }
  ];

  return `
    <div class="admin-portal-wrapper">
      
      <!-- Admin Sidebar -->
      <aside class="admin-sidebar" id="admin-sidebar">
        <div class="admin-sidebar-header">
          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <div style="width: 38px; height: 38px; border-radius: var(--radius-md); background: var(--color-forest-green); color: var(--color-warm-cream); display: flex; align-items: center; justify-content: center; font-size: 1.15rem;">
              <i class="fa-solid fa-paw"></i>
            </div>
            <div>
              <span style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--color-forest-green); letter-spacing: -0.5px;">PETZY</span>
              <span style="display: block; font-size: 0.7rem; font-weight: 700; color: var(--color-soft-coral); text-transform: uppercase; letter-spacing: 0.5px;">Hospital Admin</span>
            </div>
          </div>
        </div>

        <!-- Sidebar Navigation -->
        <nav class="admin-sidebar-nav">
          ${tabs.map(t => {
            const isActive = t.id === activeAdminTab;
            return `
              <button type="button" class="admin-nav-item ${isActive ? 'active' : ''}" data-admin-tab="${t.id}">
                <i class="${t.icon}"></i>
                <span>${t.label}</span>
              </button>
            `;
          }).join('')}
        </nav>

        <!-- Sidebar Footer Controls -->
        <div class="admin-sidebar-footer">
          <button type="button" class="btn btn-outline" id="admin-logout-btn" style="width: 100%; font-size: 0.82rem; justify-content: center; border-color: #F5B7B1; color: #C0392B;">
            <i class="fa-solid fa-right-from-bracket"></i>
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      <!-- Main Admin Content Area -->
      <main class="admin-main-viewport">
        
        <!-- Topbar -->
        <header class="admin-topbar">
          <div style="display: flex; align-items: center; gap: 0.85rem;">
            ${renderBackButton('#/dashboard', 'margin-bottom: 0;')}
            
            <button type="button" class="mobile-menu-toggle" id="admin-mobile-toggle" aria-label="Toggle Admin Menu">
              <i class="fa-solid fa-bars"></i>
            </button>
            
            <div>
              <h1 style="font-size: 1.35rem; color: var(--color-forest-green); margin: 0; font-family: var(--font-heading); text-transform: capitalize;">
                ${tabs.find(t => t.id === activeAdminTab)?.label || 'Dashboard Overview'}
              </h1>
              <span style="font-size: 0.78rem; color: var(--color-charcoal-muted);">PETZY Central Hospital System • Milestone 4 Production</span>
            </div>
          </div>

          <!-- Right Admin User Profile -->
          <div style="display: flex; align-items: center; gap: 1rem;">
            <div style="text-align: right; display: none; @media(min-width: 600px){ display: block; }">
              <strong style="color: var(--color-forest-green); font-size: 0.88rem; display: block;">${user.name}</strong>
              <span style="font-size: 0.75rem; color: var(--color-charcoal-muted);"><i class="fa-solid fa-shield-halved" style="color: var(--color-soft-coral);"></i> Super Admin</span>
            </div>

            <img src="${user.avatar || 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=400&q=80'}" alt="${user.name}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid var(--color-forest-green); box-shadow: var(--shadow-sm);">
          </div>
        </header>

        <!-- View Body Content -->
        <div class="admin-body-container">
          ${renderActiveAdminSubView()}
        </div>

      </main>

    </div>
  `;
}

function renderActiveAdminSubView() {
  switch (activeAdminTab) {
    case 'overview':
      return renderAdminOverview();
    case 'customers':
      return renderAdminCustomers();
    case 'services':
      return renderAdminServices();
    case 'veterinarians':
      return renderAdminVeterinarians();
    case 'availability':
      return renderAdminAvailability();
    case 'appointments':
      return renderAdminAppointments();
    case 'payments':
      return renderAdminPayments();
    default:
      return renderAdminOverview();
  }
}

export function setupAdminEvents() {
  const user = getCurrentUser();
  if (!user || !isAdmin()) return;

  const refreshAdmin = () => {
    const root = document.getElementById('app-root');
    if (root) {
      root.innerHTML = renderAdmin();
      setupAdminEvents();
    }
  };

  // Tab switcher
  window.petzyAdminTab = (tabId) => {
    if (['overview', 'customers', 'services', 'veterinarians', 'availability', 'appointments', 'payments'].includes(tabId)) {
      activeAdminTab = tabId;
      const targetHash = `#/admin?tab=${tabId}`;
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      } else {
        refreshAdmin();
      }
    }
  };

  // Nav Item Clicks
  document.querySelectorAll('.admin-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-admin-tab');
      if (target) {
        window.petzyAdminTab(target);
      }
    });
  });

  // Mobile drawer toggle
  const mobileToggle = document.getElementById('admin-mobile-toggle');
  const sidebar = document.getElementById('admin-sidebar');
  mobileToggle?.addEventListener('click', () => {
    sidebar?.classList.toggle('mobile-open');
  });

  // Logout button
  document.getElementById('admin-logout-btn')?.addEventListener('click', () => {
    logoutUser();
    showToast('Administrator signed out.', 'sage', 'fa-solid fa-right-from-bracket');
    setTimeout(() => {
      window.location.hash = '#/admin/login';
    }, 400);
  });

  // Subview event binders
  setupAdminOverviewEvents(refreshAdmin);
  setupAdminCustomersEvents(refreshAdmin);
  setupAdminServicesEvents(refreshAdmin);
  setupAdminVeterinariansEvents(refreshAdmin);
  setupAdminAvailabilityEvents(refreshAdmin);
  setupAdminAppointmentsEvents(refreshAdmin);
  setupAdminPaymentsEvents(refreshAdmin);
}
