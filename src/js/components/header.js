/* PETZY Header Component (Veterinary Platform) */
import { siteData } from '../data.js';
import { showToast } from './toast.js';
import { getCurrentUser } from '../services/auth.js';

let authListenerInitialized = false;

export function renderHeader() {
  const headerEl = document.getElementById('site-header');
  if (!headerEl) return;

  const currentUser = getCurrentUser();

  headerEl.innerHTML = `
    <div class="container header-container">
      <!-- PETZY Brand Logo -->
      <a href="#/" class="brand-logo" id="brand-logo-link" aria-label="PETZY Home">
        <img src="/images/logo.png" alt="PETZY Veterinary & Pet Care" class="brand-logo-img">
      </a>

      <!-- Desktop Navigation Links -->
      <nav class="nav-menu" aria-label="Main Navigation">
        <a href="#/" class="nav-link" data-route="/">Home</a>
        <a href="#/about" class="nav-link" data-route="/about">About</a>
        <a href="#/services" class="nav-link" data-route="/services">Services</a>
        <a href="#/veterinarians" class="nav-link" data-route="/veterinarians">Veterinarians</a>
        <a href="#/contact" class="nav-link" data-route="/contact">Contact</a>
      </nav>

      <!-- Right Header Actions -->
      <div class="header-actions">
        <!-- Search Trigger -->
        <button class="action-search-btn" id="open-search-btn" title="Search medical services" aria-label="Search">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>

        <!-- Customer Login / Dashboard Link -->
        ${currentUser ? `
          <a href="#/dashboard" class="header-login-link" data-route="/dashboard" style="display: inline-flex; align-items: center; gap: 0.5rem; background: var(--color-sage-green-soft);">
            <img src="${currentUser.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'}" alt="${currentUser.name}" style="width: 26px; height: 26px; border-radius: 50%; object-fit: cover; border: 1.5px solid var(--color-forest-green);">
            <span style="font-weight: 700;">Dashboard</span>
          </a>
        ` : `
          <a href="#/login" class="header-login-link" data-route="/login">Login</a>
        `}

        <!-- Mobile Hamburger Toggle -->
        <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle Navigation">
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <div class="mobile-drawer" id="mobile-drawer">
      <a href="#/" class="nav-link mobile-link" data-route="/">Home</a>
      <a href="#/about" class="nav-link mobile-link" data-route="/about">About</a>
      <a href="#/services" class="nav-link mobile-link" data-route="/services">Services</a>
      <a href="#/veterinarians" class="nav-link mobile-link" data-route="/veterinarians">Veterinarians</a>
      <a href="#/service-detail" class="nav-link mobile-link" data-route="/service-detail">Service Detail</a>
      <a href="#/faq" class="nav-link mobile-link" data-route="/faq">FAQ</a>
      <a href="#/contact" class="nav-link mobile-link" data-route="/contact">Contact</a>
      ${currentUser ? `
        <a href="#/dashboard" class="nav-link mobile-link" data-route="/dashboard" style="color: var(--color-forest-green); font-weight: 800;">
          <i class="fa-solid fa-chart-pie" style="color: var(--color-soft-coral); margin-right: 0.35rem;"></i> My Dashboard (${currentUser.name.split(' ')[0]})
        </a>
      ` : `
        <a href="#/login" class="nav-link mobile-link" data-route="/login">Login</a>
      `}
    </div>
  `;

  setupHeaderListeners();

  if (!authListenerInitialized) {
    authListenerInitialized = true;
    window.addEventListener('petzy-auth-change', () => {
      renderHeader();
    });
  }
}

function setupHeaderListeners() {
  const drawer = document.getElementById('mobile-drawer');
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const searchModal = document.getElementById('search-modal');
  const openSearchBtn = document.getElementById('open-search-btn');
  const closeSearchBtn = document.getElementById('search-close-btn');
  const clearSearchBtn = document.getElementById('search-clear-btn');
  const searchOverlay = searchModal?.querySelector('.search-modal-overlay');
  const searchInput = document.getElementById('global-search-input');
  const quickTagBtns = document.querySelectorAll('.quick-tag-btn');

  // Mobile Drawer Toggle
  if (toggleBtn && drawer) {
    toggleBtn.addEventListener('click', () => {
      drawer.classList.toggle('open');
      const icon = toggleBtn.querySelector('i');
      if (drawer.classList.contains('open')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        drawer.classList.remove('open');
        toggleBtn.querySelector('i').className = 'fa-solid fa-bars';
      });
    });
  }

  // Search Modal
  if (openSearchBtn && searchModal) {
    openSearchBtn.addEventListener('click', () => {
      searchModal.classList.add('open');
      searchModal.setAttribute('aria-hidden', 'false');
      setTimeout(() => searchInput?.focus(), 100);
      renderLiveSearchResults('');
    });
  }

  const closeSearch = () => {
    if (searchModal) {
      searchModal.classList.remove('open');
      searchModal.setAttribute('aria-hidden', 'true');
    }
  };

  closeSearchBtn?.addEventListener('click', closeSearch);
  searchOverlay?.addEventListener('click', closeSearch);

  clearSearchBtn?.addEventListener('click', () => {
    if (searchInput) {
      searchInput.value = '';
      searchInput.focus();
      renderLiveSearchResults('');
    }
  });

  searchInput?.addEventListener('input', (e) => {
    renderLiveSearchResults(e.target.value);
  });

  quickTagBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const term = btn.getAttribute('data-search');
      if (searchInput) {
        searchInput.value = term;
        renderLiveSearchResults(term);
      }
    });
  });

  // Scroll effect for header
  window.addEventListener('scroll', () => {
    const header = document.getElementById('site-header');
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });
}

export function updateActiveNav(path) {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    const route = link.getAttribute('data-route');
    if (route === path) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function renderLiveSearchResults(query) {
  const resultsContainer = document.getElementById('search-results-container');
  if (!resultsContainer) return;

  const q = query.trim().toLowerCase();
  const matchedServices = siteData.services.filter(s =>
    !q || s.title.toLowerCase().includes(q) || s.shortDesc.toLowerCase().includes(q)
  );
  const matchedVets = siteData.veterinarians.filter(v =>
    !q || v.name.toLowerCase().includes(q) || v.title.toLowerCase().includes(q) || v.specialties.some(sp => sp.toLowerCase().includes(q))
  );

  if (matchedServices.length === 0 && matchedVets.length === 0) {
    resultsContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--color-charcoal-muted);">
        <i class="fa-solid fa-magnifying-glass" style="font-size: 2rem; color: var(--color-sage-green); margin-bottom: 0.75rem;"></i>
        <p>No veterinary services found matching "<strong>${query}</strong>". Try searching for "Consultation", "Surgery", or "Dr. Ananya".</p>
      </div>
    `;
    return;
  }

  let html = '';
  matchedServices.forEach(srv => {
    html += `
      <div class="search-result-item" onclick="window.location.hash='#/service-detail'; document.getElementById('search-modal').classList.remove('open');">
        <img src="${srv.image}" alt="${srv.title}">
        <div>
          <h5>${srv.title}</h5>
          <p>${srv.badge} • Full Diagnostic Care</p>
        </div>
      </div>
    `;
  });

  matchedVets.forEach(vet => {
    html += `
      <div class="search-result-item" onclick="window.location.hash='#/veterinarian-profile'; document.getElementById('search-modal').classList.remove('open');">
        <img src="${vet.image}" alt="${vet.name}">
        <div>
          <h5>${vet.name}</h5>
          <p>${vet.title} • ${vet.experience}</p>
        </div>
      </div>
    `;
  });

  resultsContainer.innerHTML = html;
}
