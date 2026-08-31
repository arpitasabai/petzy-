/* PETZY Customer Dashboard View (Milestone 2) */
import { getCurrentUser, logoutUser, updateUserProfile, changeUserPassword } from '../services/auth.js';
import { getUserPets, getUserAppointments, deleteUserPet } from '../services/storage.js';
import { openPetModal } from '../components/pet-modal.js';
import { openAppointmentModal } from '../components/appointment-modal.js';
import { openPaymentReceiptModal } from '../components/payment-receipt-modal.js';
import { renderBackButton } from '../components/back-button.js';
import { showToast } from '../components/toast.js';

let activeTab = 'overview';
let activeSpeciesFilter = 'all';
let activeApptFilter = 'all';

// Preset avatar options for pet parents
const PARENT_AVATARS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
];

export function renderDashboard() {
  const user = getCurrentUser();
  if (!user) {
    // If not logged in, redirect to login
    setTimeout(() => {
      window.location.hash = '#/login';
      showToast('Please sign in to access your customer dashboard.', 'coral', 'fa-solid fa-lock');
    }, 10);
    return `
      <div class="auth-page-wrapper">
        <div class="auth-card-box" style="text-align: center;">
          <i class="fa-solid fa-spinner fa-spin" style="font-size: 2.5rem; color: var(--color-forest-green); margin-bottom: 1rem;"></i>
          <p>Redirecting to login portal...</p>
        </div>
      </div>
    `;
  }

  if (user.role === 'admin' || user.email.toLowerCase() === 'admin@petzy.com') {
    // Administrators should never see the customer portal
    setTimeout(() => {
      window.location.hash = '#/admin/dashboard';
    }, 10);
    return `
      <div class="auth-page-wrapper">
        <div class="auth-card-box" style="text-align: center;">
          <i class="fa-solid fa-spinner fa-spin" style="font-size: 2.5rem; color: var(--color-forest-green); margin-bottom: 1rem;"></i>
          <p>Redirecting to Hospital Administrator Portal...</p>
        </div>
      </div>
    `;
  }

  // Parse URL tab parameter if present: #/dashboard?tab=pets
  const fullHash = window.location.hash || '';
  if (fullHash.includes('tab=')) {
    const requestedTab = fullHash.split('tab=')[1]?.split('&')[0]?.toLowerCase();
    if (['overview', 'pets', 'appointments', 'profile'].includes(requestedTab)) {
      activeTab = requestedTab;
    }
  } else if (fullHash === '#/dashboard' || fullHash === '#/dashboard/') {
    activeTab = 'overview';
  }

  const pets = getUserPets(user.id);
  const appointments = getUserAppointments(user.id);

  // Compute summary stats
  const totalPets = pets.length;
  const upcomingAppts = appointments.filter(a => ['upcoming', 'confirmed', 'rescheduled'].includes((a.status || '').toLowerCase()));
  const completedAppts = appointments.filter(a => (a.status || '').toLowerCase() === 'completed');
  
  let totalVaccinations = 0;
  pets.forEach(p => {
    if (p.vaccinations) totalVaccinations += p.vaccinations.length;
  });

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return `
    <div class="dashboard-layout-container animate-fade-up">
      <!-- Sidebar Navigation -->
      <aside class="dashboard-sidebar" id="dashboard-sidebar">
        <div>
          <!-- Sidebar Header / User Card -->
          <div class="dashboard-sidebar-header">
            <div class="dashboard-user-card">
              <img src="${user.avatar || PARENT_AVATARS[0]}" alt="${user.name}" class="dashboard-user-avatar" id="sidebar-avatar-img">
              <div class="dashboard-user-info">
                <h4 class="dashboard-user-name">${user.name}</h4>
                <span class="dashboard-user-badge">
                  <i class="fa-solid fa-circle-check"></i>
                  <span>${user.membershipTier || 'Pet Parent Portal'}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Navigation Links -->
          <nav class="dashboard-nav-list" aria-label="Customer Dashboard Navigation">
            <button type="button" class="dashboard-nav-item ${activeTab === 'overview' ? 'active' : ''}" data-tab="overview" onclick="window.petzySwitchTab('overview')">
              <div class="dashboard-nav-item-content">
                <i class="fa-solid fa-chart-pie"></i>
                <span>Dashboard</span>
              </div>
            </button>

            <button type="button" class="dashboard-nav-item ${activeTab === 'pets' ? 'active' : ''}" data-tab="pets" onclick="window.petzySwitchTab('pets')">
              <div class="dashboard-nav-item-content">
                <i class="fa-solid fa-paw"></i>
                <span>My Pets</span>
              </div>
              <span class="dashboard-nav-pill">${totalPets}</span>
            </button>

            <button type="button" class="dashboard-nav-item ${activeTab === 'appointments' ? 'active' : ''}" data-tab="appointments" onclick="window.petzySwitchTab('appointments')">
              <div class="dashboard-nav-item-content">
                <i class="fa-solid fa-calendar-check"></i>
                <span>Appointments</span>
              </div>
              ${upcomingAppts.length > 0 ? `<span class="dashboard-nav-pill" style="background: var(--color-soft-coral); color: white;">${upcomingAppts.length}</span>` : ''}
            </button>

            <button type="button" class="dashboard-nav-item ${activeTab === 'profile' ? 'active' : ''}" data-tab="profile" onclick="window.petzySwitchTab('profile')">
              <div class="dashboard-nav-item-content">
                <i class="fa-solid fa-user-gear"></i>
                <span>Profile & Settings</span>
              </div>
            </button>
          </nav>
        </div>

        <!-- Sidebar Footer -->
        <div class="dashboard-sidebar-footer">
          <a href="#/" class="dashboard-back-link">
            <i class="fa-solid fa-arrow-left"></i>
            <span>Back to Main Website</span>
          </a>
          <button class="dashboard-logout-btn" id="dashboard-logout-btn">
            <i class="fa-solid fa-right-from-bracket"></i>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <!-- Main Content Outlet -->
      <main class="dashboard-main" id="dashboard-main-content">
        <!-- Topbar -->
        <div class="dashboard-topbar">
          <div style="display: flex; align-items: center; gap: 0.85rem;">
            ${renderBackButton('#/', 'margin-bottom: 0;')}
            <button class="dashboard-mobile-toggle-btn" id="dashboard-mobile-toggle-btn" aria-label="Toggle Dashboard Menu">
              <i class="fa-solid fa-bars"></i>
            </button>
            <div class="dashboard-topbar-title">
              <h1 id="active-tab-title">${getTabTitle(activeTab)}</h1>
              <p id="active-tab-subtitle">${getTabSubtitle(activeTab, user.name)}</p>
            </div>
          </div>

          <div class="dashboard-topbar-actions">
            <div class="dashboard-date-badge">
              <i class="fa-solid fa-calendar" style="color: var(--color-soft-coral);"></i>
              <span>${formattedDate}</span>
            </div>
          </div>
        </div>

        <!-- Dynamic Tab Content Render -->
        <div id="tab-content-wrapper">
          ${renderTabContent(activeTab, user, pets, appointments, totalPets, upcomingAppts, completedAppts, totalVaccinations)}
        </div>
      </main>
    </div>
  `;
}

function getTabTitle(tab) {
  switch (tab) {
    case 'overview': return 'Patient Care Dashboard';
    case 'pets': return 'My Pets & Family';
    case 'appointments': return 'Appointment History';
    case 'profile': return 'Account & Profile Settings';
    default: return 'Customer Dashboard';
  }
}

function getTabSubtitle(tab, userName) {
  switch (tab) {
    case 'overview': return `Welcome back to PETZY Hospital, ${userName}!`;
    case 'pets': return 'Manage your registered pets, medical profiles, and immunization schedules.';
    case 'appointments': return 'Review scheduled wellness visits, past diagnostic appointments, and doctor care summaries.';
    case 'profile': return 'Update your contact details, emergency phone numbers, and security credentials.';
    default: return 'PETZY Veterinary Care';
  }
}

function renderTabContent(tab, user, pets, appointments, totalPets, upcomingAppts, completedAppts, totalVaccinations) {
  switch (tab) {
    case 'overview':
      return renderOverviewTab(user, pets, appointments, totalPets, upcomingAppts, completedAppts, totalVaccinations);
    case 'pets':
      return renderPetsTab(pets);
    case 'appointments':
      return renderAppointmentsTab(appointments);
    case 'profile':
      return renderProfileTab(user);
    default:
      return renderOverviewTab(user, pets, appointments, totalPets, upcomingAppts, completedAppts, totalVaccinations);
  }
}

// ----------------------------------------------------
// 1. OVERVIEW TAB
// ----------------------------------------------------
function renderOverviewTab(user, pets, appointments, totalPets, upcomingAppts, completedAppts, totalVaccinations) {
  const nextAppt = upcomingAppts[0];

  return `
    <!-- Welcome Banner with Friendly Pet Care Message -->
    <div class="dashboard-welcome-banner animate-fade-up">
      <i class="fa-solid fa-shield-cat welcome-banner-decor"></i>
      <div class="welcome-banner-content">
        <div class="welcome-banner-badge">
          <i class="fa-solid fa-sparkles"></i>
          <span>PETZY Parent Hub</span>
        </div>
        <h2 class="welcome-banner-title">Welcome back, ${user.name}! 🐾</h2>
        <p class="welcome-banner-text">We are delighted to care for your beloved companion animals. Your pets' health records, vaccination schedules, and doctor notes are synchronized and up to date.</p>
        <div class="welcome-banner-tip">
          <i class="fa-solid fa-lightbulb"></i>
          <span><strong>Veterinary Wellness Tip:</strong> Regular annual dental cleanings and preventative checkups can extend your pet's life expectancy by 2 to 4 vibrant years! Make sure fresh water is readily accessible.</span>
        </div>
      </div>
    </div>

    <!-- 4 Animated Summary Statistic Cards -->
    <div class="dashboard-stats-grid">
      <!-- Total Pets -->
      <div class="stat-metric-card" onclick="window.petzySwitchTab('pets')">
        <div class="stat-metric-header">
          <div class="stat-icon-wrap teal">
            <i class="fa-solid fa-paw"></i>
          </div>
          <span class="stat-metric-action">Manage Pets <i class="fa-solid fa-arrow-right"></i></span>
        </div>
        <div>
          <div class="stat-metric-value count-up-val" data-target="${totalPets}">${totalPets}</div>
          <div class="stat-metric-label">Registered Pets</div>
        </div>
      </div>

      <!-- Upcoming Appointments -->
      <div class="stat-metric-card" onclick="window.petzySwitchTab('appointments')">
        <div class="stat-metric-header">
          <div class="stat-icon-wrap coral">
            <i class="fa-solid fa-calendar-check"></i>
          </div>
          <span class="stat-metric-action">View Visits <i class="fa-solid fa-arrow-right"></i></span>
        </div>
        <div>
          <div class="stat-metric-value count-up-val" data-target="${upcomingAppts.length}">${upcomingAppts.length}</div>
          <div class="stat-metric-label">Upcoming Appointments</div>
        </div>
      </div>

      <!-- Previous Appointments -->
      <div class="stat-metric-card" onclick="window.petzySwitchTab('appointments')">
        <div class="stat-metric-header">
          <div class="stat-icon-wrap sage">
            <i class="fa-solid fa-clock-rotate-left"></i>
          </div>
          <span class="stat-metric-action">History <i class="fa-solid fa-arrow-right"></i></span>
        </div>
        <div>
          <div class="stat-metric-value count-up-val" data-target="${completedAppts.length}">${completedAppts.length}</div>
          <div class="stat-metric-label">Previous Completed Visits</div>
        </div>
      </div>

      <!-- Vaccinations / Health Records -->
      <div class="stat-metric-card" onclick="window.petzySwitchTab('pets')">
        <div class="stat-metric-header">
          <div class="stat-icon-wrap yellow">
            <i class="fa-solid fa-syringe"></i>
          </div>
          <span class="stat-metric-action">Health Log <i class="fa-solid fa-arrow-right"></i></span>
        </div>
        <div>
          <div class="stat-metric-value count-up-val" data-target="${totalVaccinations}">${totalVaccinations}</div>
          <div class="stat-metric-label">Immunization Records</div>
        </div>
      </div>
    </div>

    <!-- Quick Action Pills -->
    <div class="dashboard-quick-actions">
      <button class="quick-action-pill primary" id="overview-add-pet-btn">
        <i class="fa-solid fa-plus"></i>
        <span>Add New Pet</span>
      </button>
      <a href="#/schedule-appointment" class="quick-action-pill">
        <i class="fa-solid fa-calendar-plus"></i>
        <span>Schedule Veterinary Appointment</span>
      </a>
      <button class="quick-action-pill" onclick="window.petzySwitchTab('profile')">
        <i class="fa-solid fa-user-pen"></i>
        <span>Update Profile Info</span>
      </button>
      <a href="#/services" class="quick-action-pill">
        <i class="fa-solid fa-stethoscope"></i>
        <span>Explore Hospital Services</span>
      </a>
    </div>

    <!-- Split Grid: Pets at a Glance & Upcoming Appointment Highlight -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; align-items: start;">
      <!-- Pets At A Glance -->
      <div class="profile-card-box">
        <div class="section-subhead-row" style="margin-bottom: 1rem;">
          <div class="section-subhead-title">
            <i class="fa-solid fa-paw" style="color: var(--color-forest-green);"></i>
            <h3 style="font-size: 1.15rem;">My Pets at a Glance</h3>
          </div>
          <button class="btn btn-outline" style="padding: 0.35rem 0.85rem; font-size: 0.82rem;" onclick="window.petzySwitchTab('pets')">View All</button>
        </div>

        ${pets.length === 0 ? `
          <div style="text-align: center; padding: 2rem; color: var(--color-charcoal-muted);">
            <i class="fa-solid fa-paw" style="font-size: 2.5rem; color: var(--color-sage-green); margin-bottom: 0.5rem;"></i>
            <p style="font-size: 0.95rem;">No pets registered yet. Add your first companion to unlock health records!</p>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 0.85rem;">
            ${pets.slice(0, 3).map(p => `
              <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 1rem; background: var(--color-warm-cream); border-radius: var(--radius-md); border: 1px solid var(--color-border-subtle);">
                <div style="display: flex; align-items: center; gap: 0.85rem;">
                  <img src="${p.photo}" alt="${p.name}" style="width: 48px; height: 48px; border-radius: var(--radius-md); object-fit: cover; border: 2px solid var(--color-forest-green);">
                  <div>
                    <h5 style="font-family: var(--font-heading); font-size: 1rem; color: var(--color-forest-green); margin: 0;">${p.name}</h5>
                    <span style="font-size: 0.82rem; color: var(--color-charcoal-muted);">${p.species} • ${p.breed}</span>
                  </div>
                </div>
                <a href="#/pet-profile?id=${p.id}" class="btn btn-teal" style="padding: 0.4rem 0.85rem; font-size: 0.8rem;">
                  <span>Profile</span>
                  <i class="fa-solid fa-chevron-right" style="font-size: 0.7rem;"></i>
                </a>
              </div>
            `).join('')}
          </div>
        `}
      </div>

      <!-- Next Scheduled Appointment Spotlight -->
      <div class="profile-card-box">
        <div class="section-subhead-row" style="margin-bottom: 1rem;">
          <div class="section-subhead-title">
            <i class="fa-solid fa-calendar-check" style="color: var(--color-soft-coral);"></i>
            <h3 style="font-size: 1.15rem;">Next Scheduled Visit</h3>
          </div>
          <button class="btn btn-outline" style="padding: 0.35rem 0.85rem; font-size: 0.82rem;" onclick="window.petzySwitchTab('appointments')">All Visits</button>
        </div>

        ${nextAppt ? `
          <div style="background: var(--color-warm-cream); border-radius: var(--radius-md); border: 1px solid var(--color-border); padding: 1.25rem;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.85rem; flex-wrap: wrap; gap: 0.5rem;">
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="appointment-status-badge ${nextAppt.status.toLowerCase()}"><i class="fa-solid fa-circle" style="font-size: 0.5rem;"></i> ${nextAppt.status}</span>
                <span style="font-size: 0.78rem; font-weight: 700; color: var(--color-forest-green); background: white; padding: 0.15rem 0.5rem; border-radius: var(--radius-full); border: 1px solid var(--color-border);">ID: ${nextAppt.id}</span>
              </div>
              <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-forest-green);"><i class="fa-solid fa-clock"></i> ${nextAppt.time}</span>
            </div>

            <h4 style="font-family: var(--font-heading); font-size: 1.05rem; color: var(--color-forest-green); margin: 0 0 0.35rem;">${nextAppt.service}</h4>
            <p style="font-size: 0.85rem; color: var(--color-charcoal-muted); margin-bottom: 1rem;">For <strong>${nextAppt.petName}</strong> with <strong>${nextAppt.veterinarian}</strong></p>

            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 0.75rem; border-top: 1px solid var(--color-border-subtle); flex-wrap: wrap; gap: 0.65rem;">
              <span style="font-size: 0.82rem; font-weight: 700; color: var(--color-forest-green);"><i class="fa-solid fa-calendar-days" style="color: var(--color-soft-coral); margin-right: 0.3rem;"></i> ${nextAppt.date}</span>
              
              <div style="display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap;">
                <button class="appointment-view-detail-btn" onclick="window.petzyOpenApptModal('${nextAppt.id}')">
                  <i class="fa-solid fa-circle-info"></i>
                  <span>View Details</span>
                </button>
                <button class="btn btn-outline" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; border-color: var(--color-forest-green); color: var(--color-forest-green);" onclick="window.petzyRescheduleAppt('${nextAppt.id}')">
                  <i class="fa-solid fa-clock-rotate-left"></i>
                  <span>Reschedule</span>
                </button>
                <button class="btn btn-outline" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; border-color: #F5B7B1; color: #C0392B;" onclick="window.petzyCancelApptConfirm('${nextAppt.id}')">
                  <i class="fa-solid fa-calendar-xmark"></i>
                  <span>Cancel</span>
                </button>
              </div>
            </div>
          </div>
        ` : `
          <div style="text-align: center; padding: 2rem; color: var(--color-charcoal-muted);">
            <i class="fa-solid fa-calendar-days" style="font-size: 2.5rem; color: var(--color-sage-green); margin-bottom: 0.5rem;"></i>
            <p style="font-size: 0.95rem; margin-bottom: 1rem;">No upcoming appointments scheduled.</p>
            <a href="#/book-appointment" class="btn btn-teal" style="padding: 0.45rem 1rem; font-size: 0.85rem;">
              <i class="fa-solid fa-calendar-plus"></i>
              <span>Book Appointment</span>
            </a>
          </div>
        `}
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// 2. MY PETS TAB
// ----------------------------------------------------
function renderPetsTab(pets) {
  const filteredPets = activeSpeciesFilter === 'all' 
    ? pets 
    : (activeSpeciesFilter === 'other'
        ? pets.filter(p => !['dog', 'cat', 'bird', 'rabbit'].includes((p.species || '').toLowerCase()) || (p.species || '').toLowerCase() === 'other')
        : pets.filter(p => (p.species || '').toLowerCase() === activeSpeciesFilter.toLowerCase())
      );

  return `
    <div>
      <!-- Header Actions & Species Filter -->
      <div class="section-subhead-row">
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="quick-action-pill ${activeSpeciesFilter === 'all' ? 'primary' : ''}" onclick="window.petzyFilterSpecies('all')">All Pets (${pets.length})</button>
          <button class="quick-action-pill ${activeSpeciesFilter === 'dog' ? 'primary' : ''}" onclick="window.petzyFilterSpecies('dog')"><i class="fa-solid fa-dog"></i> Dogs</button>
          <button class="quick-action-pill ${activeSpeciesFilter === 'cat' ? 'primary' : ''}" onclick="window.petzyFilterSpecies('cat')"><i class="fa-solid fa-cat"></i> Cats</button>
          <button class="quick-action-pill ${activeSpeciesFilter === 'bird' ? 'primary' : ''}" onclick="window.petzyFilterSpecies('bird')"><i class="fa-solid fa-dove"></i> Birds</button>
          <button class="quick-action-pill ${activeSpeciesFilter === 'rabbit' ? 'primary' : ''}" onclick="window.petzyFilterSpecies('rabbit')"><i class="fa-solid fa-carrot"></i> Rabbits</button>
          <button class="quick-action-pill ${activeSpeciesFilter === 'other' ? 'primary' : ''}" onclick="window.petzyFilterSpecies('other')"><i class="fa-solid fa-paw"></i> Others</button>
        </div>

        <button class="btn btn-teal" id="pets-tab-add-pet-btn">
          <i class="fa-solid fa-plus"></i>
          <span>Add New Pet</span>
        </button>
      </div>

      <!-- Pets Grid -->
      ${filteredPets.length === 0 ? `
        <div class="profile-card-box" style="text-align: center; padding: 4rem 2rem;">
          <i class="fa-solid fa-paw" style="font-size: 3.5rem; color: var(--color-sage-green); margin-bottom: 1rem;"></i>
          <h3 style="color: var(--color-forest-green); margin-bottom: 0.5rem;">No Pets Found</h3>
          <p style="color: var(--color-charcoal-muted); max-width: 450px; margin: 0 auto 1.5rem;">
            ${activeSpeciesFilter !== 'all' ? `You don't have any ${activeSpeciesFilter}s registered.` : 'You have not added any pets to your PETZY account yet.'}
          </p>
          <button class="btn btn-teal btn-lg" id="empty-add-pet-btn">
            <i class="fa-solid fa-plus"></i>
            <span>Register Your Pet Now</span>
          </button>
        </div>
      ` : `
        <div class="pets-grid animate-fade-up">
          ${filteredPets.map(p => {
            // Determine status badge
            let badgeClass = 'up-to-date';
            let badgeLabel = 'Vaccines Up to Date';
            if (p.vaccinations && p.vaccinations.some(v => v.status === 'Due Soon')) {
              badgeClass = 'due-soon';
              badgeLabel = 'Vaccine Due Soon';
            } else if (p.vaccinations && p.vaccinations.some(v => v.status === 'Overdue')) {
              badgeClass = 'overdue';
              badgeLabel = 'Vaccine Overdue';
            }

            return `
              <div class="pet-card">
                <div class="pet-card-image-wrap">
                  <img src="${p.photo}" alt="${p.name}" class="pet-card-image" loading="lazy">
                  <div class="pet-species-badge">
                    <i class="fa-solid ${getSpeciesIcon(p.species)}"></i>
                    <span>${p.species}</span>
                  </div>
                  <div class="pet-status-pill ${badgeClass}">
                    ${badgeLabel}
                  </div>
                </div>

                <div class="pet-card-body">
                  <div class="pet-card-name-row">
                    <h3 class="pet-card-name">${p.name}</h3>
                  </div>
                  <div class="pet-card-breed">${p.species} • ${p.breed}</div>

                  <div class="pet-card-attributes-grid">
                    <div class="pet-card-attr-item">
                      <span class="pet-card-attr-label">Age</span>
                      <span class="pet-card-attr-val">${p.age}</span>
                    </div>
                    <div class="pet-card-attr-item">
                      <span class="pet-card-attr-label">Gender</span>
                      <span class="pet-card-attr-val">${p.gender}</span>
                    </div>
                    <div class="pet-card-attr-item">
                      <span class="pet-card-attr-label">Weight</span>
                      <span class="pet-card-attr-val">${p.weight}</span>
                    </div>
                    <div class="pet-card-attr-item">
                      <span class="pet-card-attr-label">Microchip</span>
                      <span class="pet-card-attr-val">${p.microchip ? 'Active' : 'None'}</span>
                    </div>
                  </div>

                  <div class="pet-card-actions">
                    <a href="#/pet-profile?id=${p.id}" class="pet-action-view-btn">
                      <i class="fa-solid fa-notes-medical"></i>
                      <span>View Profile</span>
                    </a>
                    <button class="pet-action-edit-btn" onclick="window.petzyEditPet('${p.id}')" title="Edit Pet Details">
                      <i class="fa-solid fa-pen-to-square"></i>
                      <span>Edit</span>
                    </button>
                    <button class="pet-action-del-btn" onclick="window.petzyDeletePet('${p.id}', '${p.name}')" title="Delete Pet">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    </div>
  `;
}

function getSpeciesIcon(species) {
  switch ((species || '').toLowerCase()) {
    case 'dog': return 'fa-dog';
    case 'cat': return 'fa-cat';
    case 'bird': return 'fa-dove';
    case 'rabbit': return 'fa-carrot';
    default: return 'fa-paw';
  }
}

// ----------------------------------------------------
// 3. APPOINTMENTS TAB
// ----------------------------------------------------
function renderAppointmentsTab(appointments) {
  const upcomingCount = appointments.filter(a => ['upcoming', 'confirmed', 'rescheduled'].includes(a.status.toLowerCase())).length;
  const completedCount = appointments.filter(a => a.status.toLowerCase() === 'completed').length;
  const cancelledCount = appointments.filter(a => a.status.toLowerCase() === 'cancelled').length;

  let filteredAppts = appointments;
  if (activeApptFilter === 'upcoming') {
    filteredAppts = appointments.filter(a => ['upcoming', 'confirmed', 'rescheduled'].includes(a.status.toLowerCase()));
  } else if (activeApptFilter === 'completed') {
    filteredAppts = appointments.filter(a => a.status.toLowerCase() === 'completed');
  } else if (activeApptFilter === 'cancelled') {
    filteredAppts = appointments.filter(a => a.status.toLowerCase() === 'cancelled');
  }

  return `
    <div>
      <!-- Filter Bar -->
      <div class="section-subhead-row" style="margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <button class="quick-action-pill ${activeApptFilter === 'all' ? 'primary' : ''}" onclick="window.petzyFilterAppts('all')">
            All Visits (${appointments.length})
          </button>
          <button class="quick-action-pill ${activeApptFilter === 'upcoming' ? 'primary' : ''}" onclick="window.petzyFilterAppts('upcoming')">
            <i class="fa-solid fa-calendar"></i> Upcoming (${upcomingCount})
          </button>
          <button class="quick-action-pill ${activeApptFilter === 'completed' ? 'primary' : ''}" onclick="window.petzyFilterAppts('completed')">
            <i class="fa-solid fa-circle-check"></i> Completed (${completedCount})
          </button>
          <button class="quick-action-pill ${activeApptFilter === 'cancelled' ? 'primary' : ''}" onclick="window.petzyFilterAppts('cancelled')">
            <i class="fa-solid fa-calendar-xmark"></i> Cancelled (${cancelledCount})
          </button>
        </div>

        <a href="#/book-appointment" class="btn btn-teal">
          <i class="fa-solid fa-calendar-plus"></i>
          <span>Schedule New Appointment</span>
        </a>
      </div>

      <!-- Appointments List -->
      ${filteredAppts.length === 0 ? `
        <div class="profile-card-box" style="text-align: center; padding: 4rem 2rem;">
          <i class="fa-solid fa-calendar-xmark" style="font-size: 3.5rem; color: var(--color-sage-green); margin-bottom: 1rem;"></i>
          <h3 style="color: var(--color-forest-green); margin-bottom: 0.5rem;">No Appointments Found</h3>
          <p style="color: var(--color-charcoal-muted); max-width: 450px; margin: 0 auto 1.5rem;">There are no ${activeApptFilter !== 'all' ? activeApptFilter : ''} appointments in your records.</p>
          <a href="#/book-appointment" class="btn btn-teal btn-lg">
            <i class="fa-solid fa-calendar-plus"></i>
            <span>Schedule an Appointment</span>
          </a>
        </div>
      ` : `
        <div class="appointments-list animate-fade-up">
          ${filteredAppts.map(a => {
            const isActionable = ['upcoming', 'confirmed', 'rescheduled'].includes(a.status.toLowerCase());

            return `
              <div class="appointment-item-card" style="align-items: center; flex-wrap: wrap; gap: 1rem;">
                <div class="appointment-left-col">
                  <img src="${a.petPhoto || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'}" alt="${a.petName}" class="appointment-pet-thumb">
                  <div class="appointment-info-main">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
                      <h4 class="appointment-service-title" style="margin: 0;">${a.service}</h4>
                      <span style="font-size: 0.75rem; font-weight: 700; color: var(--color-forest-green); background: var(--color-warm-cream); padding: 0.15rem 0.5rem; border-radius: var(--radius-full); border: 1px solid var(--color-border);">ID: ${a.id}</span>
                    </div>
                    <div class="appointment-meta-row">
                      <span class="appointment-meta-item"><i class="fa-solid fa-paw"></i> <strong>${a.petName}</strong> (${a.species || 'Pet'})</span>
                      <span class="appointment-meta-item"><i class="fa-solid fa-user-doctor"></i> ${a.veterinarian}</span>
                      <span class="appointment-meta-item"><i class="fa-solid fa-calendar" style="color: var(--color-soft-coral);"></i> ${a.date}</span>
                      <span class="appointment-meta-item"><i class="fa-solid fa-clock"></i> ${a.time}</span>
                    </div>
                  </div>
                </div>

                <div style="display: flex; align-items: center; gap: 0.65rem; flex-wrap: wrap;">
                  <span class="appointment-status-badge ${a.status.toLowerCase()}">
                    <i class="fa-solid fa-circle" style="font-size: 0.45rem;"></i>
                    ${a.status}
                  </span>

                  <span class="section-badge" style="background: var(--color-sage-green-soft); color: var(--color-forest-green); font-size: 0.72rem; padding: 0.2rem 0.55rem; margin: 0;">
                    <i class="fa-solid fa-check" style="color: #27AE60;"></i> ${a.paymentStatus || 'Paid'} (${a.price || '$55'})
                  </span>

                  <button class="appointment-view-detail-btn" onclick="window.petzyOpenApptModal('${a.id}')">
                    <i class="fa-solid fa-circle-info"></i>
                    <span>Details</span>
                  </button>

                  <button class="btn btn-outline" style="padding: 0.35rem 0.65rem; font-size: 0.78rem;" onclick="window.petzyOpenReceipt('${a.paymentId || a.id}')" title="View Official Digital Receipt">
                    <i class="fa-solid fa-file-invoice"></i>
                    <span>Receipt</span>
                  </button>

                  ${isActionable ? `
                    <button class="btn btn-outline" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; border-color: var(--color-forest-green); color: var(--color-forest-green);" onclick="window.petzyRescheduleAppt('${a.id}')">
                      <i class="fa-solid fa-clock-rotate-left"></i>
                      <span>Reschedule</span>
                    </button>
                    <button class="btn btn-outline" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; border-color: #F5B7B1; color: #C0392B;" onclick="window.petzyCancelApptConfirm('${a.id}')">
                      <i class="fa-solid fa-calendar-xmark"></i>
                      <span>Cancel</span>
                    </button>
                  ` : (a.status.toLowerCase() === 'completed' ? `
                    <a href="#/book-appointment?followUpId=${a.id}" class="btn btn-teal" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem;">
                      <i class="fa-solid fa-calendar-plus"></i>
                      <span>Book Follow-Up</span>
                    </a>
                  ` : (a.status.toLowerCase() === 'cancelled' ? `
                    <a href="#/book-appointment?petId=${a.petId || ''}&service=${a.serviceId || ''}" class="btn btn-outline" style="padding: 0.35rem 0.75rem; font-size: 0.8rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem;">
                      <i class="fa-solid fa-calendar-plus"></i>
                      <span>Re-book Visit</span>
                    </a>
                  ` : ''))}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    </div>
  `;
}

// ----------------------------------------------------
// 4. PROFILE TAB
// ----------------------------------------------------
function renderProfileTab(user) {
  return `
    <div class="profile-grid-layout animate-fade-up">
      <!-- Left Column: Avatar & Summary Box -->
      <div class="profile-card-box" style="text-align: center;">
        <div class="profile-avatar-uploader">
          <img src="${user.avatar || PARENT_AVATARS[0]}" alt="${user.name}" class="profile-avatar-large" id="profile-preview-avatar">
          <h3 style="font-size: 1.35rem; color: var(--color-forest-green); margin: 0 0 0.25rem;">${user.name}</h3>
          <span style="font-size: 0.85rem; color: var(--color-charcoal-muted);">${user.email}</span>

          <div style="margin-top: 1.25rem;">
            <label class="form-label" style="font-size: 0.82rem; text-transform: uppercase;">Choose Profile Photo Preset</label>
            <div class="preset-avatar-grid">
              ${PARENT_AVATARS.map(url => `
                <button type="button" class="preset-avatar-btn ${url === user.avatar ? 'selected' : ''}" data-avatar="${url}">
                  <img src="${url}" alt="Avatar option">
                </button>
              `).join('')}
            </div>
          </div>
        </div>

        <div style="background: var(--color-warm-cream); padding: 1rem; border-radius: var(--radius-md); border: 1px solid var(--color-border); font-size: 0.85rem; text-align: left;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
            <span style="color: var(--color-charcoal-light);">Member Since:</span>
            <strong style="color: var(--color-forest-green);">${user.joinedDate || '2025'}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--color-charcoal-light);">Patient Tier:</span>
            <strong style="color: var(--color-soft-coral-hover);">${user.membershipTier || 'CarePlus'}</strong>
          </div>
        </div>
      </div>

      <!-- Right Column: Edit Forms -->
      <div style="display: flex; flex-direction: column; gap: 2rem;">
        <!-- Personal Information Form -->
        <div class="profile-card-box">
          <div class="section-subhead-row" style="margin-bottom: 1.5rem;">
            <div class="section-subhead-title">
              <i class="fa-solid fa-id-card" style="color: var(--color-forest-green);"></i>
              <h3>Personal Information</h3>
            </div>
          </div>

          <form id="profile-info-form">
            <div class="form-group">
              <label class="form-label" for="prof-name">Full Name *</label>
              <input type="text" id="prof-name" class="form-input" required value="${user.name}">
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label" for="prof-email">Email Address *</label>
                <input type="email" id="prof-email" class="form-input" required value="${user.email}">
              </div>
              <div class="form-group">
                <label class="form-label" for="prof-phone">Phone Number *</label>
                <input type="tel" id="prof-phone" class="form-input" required value="${user.phone || ''}">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="prof-address">Home Address</label>
              <input type="text" id="prof-address" class="form-input" placeholder="e.g. 742 Evergreen Paws Way, Apt 3B, San Francisco, CA" value="${user.address || ''}">
            </div>

            <div class="form-group">
              <label class="form-label" for="prof-emergency">Emergency Contact (Name & Phone)</label>
              <input type="text" id="prof-emergency" class="form-input" placeholder="e.g. +1 (555) 987-6543 (Mark Hayes)" value="${user.emergencyContact || ''}">
            </div>

            <input type="hidden" id="prof-avatar-url" value="${user.avatar || PARENT_AVATARS[0]}">

            <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem;">
              <button type="submit" class="btn btn-teal btn-lg">
                <i class="fa-solid fa-floppy-disk"></i>
                <span>Save Profile Changes</span>
              </button>
            </div>
          </form>
        </div>

        <!-- Security / Change Password Form -->
        <div class="profile-card-box">
          <div class="section-subhead-row" style="margin-bottom: 1.5rem;">
            <div class="section-subhead-title">
              <i class="fa-solid fa-lock" style="color: var(--color-forest-green);"></i>
              <h3>Security & Password</h3>
            </div>
          </div>

          <form id="profile-password-form">
            <div class="form-group">
              <label class="form-label" for="pwd-current">Current Password *</label>
              <div class="password-input-wrap">
                <input type="password" id="pwd-current" class="form-input" placeholder="••••••••" required>
                <button type="button" class="password-toggle-btn" data-target="pwd-current" aria-label="Toggle password visibility">
                  <i class="fa-solid fa-eye"></i>
                </button>
              </div>
            </div>

            <div class="form-row-2">
              <div class="form-group">
                <label class="form-label" for="pwd-new">New Password (Min 8 Characters) *</label>
                <div class="password-input-wrap">
                  <input type="password" id="pwd-new" class="form-input" placeholder="••••••••" required minlength="8">
                  <button type="button" class="password-toggle-btn" data-target="pwd-new" aria-label="Toggle password visibility">
                    <i class="fa-solid fa-eye"></i>
                  </button>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="pwd-confirm">Confirm New Password *</label>
                <div class="password-input-wrap">
                  <input type="password" id="pwd-confirm" class="form-input" placeholder="••••••••" required minlength="8">
                  <button type="button" class="password-toggle-btn" data-target="pwd-confirm" aria-label="Toggle password visibility">
                    <i class="fa-solid fa-eye"></i>
                  </button>
                </div>
              </div>
            </div>

            <div style="display: flex; justify-content: flex-end; margin-top: 1.5rem;">
              <button type="submit" class="btn btn-outline btn-lg">
                <i class="fa-solid fa-shield-halved"></i>
                <span>Update Password</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// EVENT LISTENERS & LIFECYCLE
// ----------------------------------------------------
export function setupDashboardEvents() {
  const user = getCurrentUser();
  if (!user) return;

  // Global window helpers for in-tab button clicks
  window.petzySwitchTab = (tabName) => {
    if (['overview', 'pets', 'appointments', 'profile'].includes(tabName)) {
      activeTab = tabName;
      const targetHash = `#/dashboard?tab=${tabName}`;
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      } else {
        refreshDashboard();
      }
    }
  };

  window.petzyFilterSpecies = (species) => {
    activeSpeciesFilter = species;
    refreshDashboard();
  };

  window.petzyFilterAppts = (filter) => {
    activeApptFilter = filter;
    refreshDashboard();
  };

  window.petzyOpenApptModal = (apptId) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    const appts = getUserAppointments(currentUser.id);
    const appt = appts.find(a => a.id === apptId);
    if (appt) {
      openAppointmentModal(appt, () => refreshDashboard(), false);
    }
  };

  window.petzyOpenReceipt = (paymentOrApptId) => {
    openPaymentReceiptModal(paymentOrApptId);
  };

  window.petzyRescheduleAppt = (apptId) => {
    window.location.hash = `#/book-appointment?rescheduleId=${apptId}`;
  };

  window.petzyCancelApptConfirm = (apptId) => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    const appts = getUserAppointments(currentUser.id);
    const appt = appts.find(a => a.id === apptId);
    if (appt) {
      openAppointmentModal(appt, () => refreshDashboard(), true);
    }
  };

  window.petzyEditPet = (petId) => {
    const pets = getUserPets(user.id);
    const pet = pets.find(p => p.id === petId);
    if (pet) {
      openPetModal(pet, () => refreshDashboard());
    }
  };

  window.petzyDeletePet = (petId, petName) => {
    if (confirm(`Are you sure you want to delete ${petName}'s profile from your account? This action cannot be undone.`)) {
      deleteUserPet(user.id, petId);
      showToast(`${petName}'s profile has been removed.`, 'coral', 'fa-solid fa-trash-can');
      refreshDashboard();
    }
  };

  // Nav item click handling
  document.querySelectorAll('.dashboard-nav-item').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = btn.getAttribute('data-tab');
      if (tab) {
        window.petzySwitchTab(tab);
      }
    });
  });

  // Mobile drawer toggle
  const mobileToggleBtn = document.getElementById('dashboard-mobile-toggle-btn');
  const sidebar = document.getElementById('dashboard-sidebar');
  mobileToggleBtn?.addEventListener('click', () => {
    sidebar?.classList.toggle('mobile-open');
  });

  // Logout button
  const logoutBtn = document.getElementById('dashboard-logout-btn');
  logoutBtn?.addEventListener('click', () => {
    logoutUser();
    showToast('You have been signed out successfully.', 'sage', 'fa-solid fa-right-from-bracket');
    setTimeout(() => {
      window.location.hash = '#/login';
    }, 600);
  });

  // Quick Action Buttons
  document.getElementById('overview-add-pet-btn')?.addEventListener('click', () => {
    openPetModal(null, () => refreshDashboard());
  });
  document.getElementById('pets-tab-add-pet-btn')?.addEventListener('click', () => {
    openPetModal(null, () => refreshDashboard());
  });
  document.getElementById('empty-add-pet-btn')?.addEventListener('click', () => {
    openPetModal(null, () => refreshDashboard());
  });

  // Avatar Presets selection
  document.querySelectorAll('.preset-avatar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.preset-avatar-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const url = btn.getAttribute('data-avatar');
      const preview = document.getElementById('profile-preview-avatar');
      const input = document.getElementById('prof-avatar-url');
      if (preview && url) preview.src = url;
      if (input && url) input.value = url;
    });
  });

  // Profile Form Submit
  const profileForm = document.getElementById('profile-info-form');
  profileForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    try {
      const name = document.getElementById('prof-name')?.value.trim();
      const email = document.getElementById('prof-email')?.value.trim();
      const phone = document.getElementById('prof-phone')?.value.trim();
      const address = document.getElementById('prof-address')?.value.trim();
      const emergencyContact = document.getElementById('prof-emergency')?.value.trim();
      const avatar = document.getElementById('prof-avatar-url')?.value;

      updateUserProfile({ name, email, phone, address, emergencyContact, avatar });
      showToast('Profile updated successfully!', 'sage', 'fa-solid fa-circle-check');
      refreshDashboard();
    } catch (err) {
      showToast(err.message || 'Error updating profile', 'coral', 'fa-solid fa-triangle-exclamation');
    }
  });

  // Password Form Submit
  const passwordForm = document.getElementById('profile-password-form');
  passwordForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const cur = document.getElementById('pwd-current')?.value;
    const newPwd = document.getElementById('pwd-new')?.value;
    const confirmPwd = document.getElementById('pwd-confirm')?.value;

    if (newPwd !== confirmPwd) {
      showToast('New passwords do not match. Please verify.', 'coral', 'fa-solid fa-triangle-exclamation');
      return;
    }

    try {
      changeUserPassword(cur, newPwd);
      showToast('Password updated securely!', 'sage', 'fa-solid fa-shield-halved');
      passwordForm.reset();
    } catch (err) {
      showToast(err.message || 'Failed to update password', 'coral', 'fa-solid fa-triangle-exclamation');
    }
  });

  // Password visibility toggle buttons
  document.querySelectorAll('.password-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const icon = btn.querySelector('i');
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          if (icon) icon.className = 'fa-solid fa-eye-slash';
        } else {
          input.type = 'password';
          if (icon) icon.className = 'fa-solid fa-eye';
        }
      }
    });
  });

  // Count-up animation for stat numbers
  runStatCountUps();
}

function refreshDashboard() {
  const root = document.getElementById('app-root');
  if (root) {
    root.innerHTML = renderDashboard();
    setupDashboardEvents();
  }
}

function runStatCountUps() {
  const elements = document.querySelectorAll('.count-up-val');
  elements.forEach(el => {
    const target = parseInt(el.getAttribute('data-target'), 10) || 0;
    if (target === 0) return;
    let count = 0;
    const step = Math.max(1, Math.ceil(target / 15));
    const timer = setInterval(() => {
      count += step;
      if (count >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = count;
      }
    }, 40);
  });
}
