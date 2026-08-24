/* PETZY Header Component */
import { navigateTo } from '../router.js';
import { siteData } from '../data.js';
import { showToast } from './toast.js';

let wishlistCount = 3;
let cartCount = 2;

export function getWishlistCount() {
  return wishlistCount;
}

export function incrementWishlist() {
  wishlistCount++;
  updateCounters();
}

export function decrementWishlist() {
  if (wishlistCount > 0) wishlistCount--;
  updateCounters();
}

export function incrementCart() {
  cartCount++;
  updateCounters();
}

function updateCounters() {
  const wishBadge = document.getElementById('header-wishlist-count');
  const cartBadge = document.getElementById('header-cart-count');
  if (wishBadge) wishBadge.textContent = wishlistCount;
  if (cartBadge) cartBadge.textContent = cartCount;
}

export function renderHeader() {
  const headerEl = document.getElementById('site-header');
  if (!headerEl) return;

  headerEl.innerHTML = `
    <div class="container header-container">
      <!-- PETZY Brand Logo with Wagging Tail Z -->
      <a href="#/" class="brand-logo" id="brand-logo-link" aria-label="PETZY Home">
        <div class="logo-icon-wrap">
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M26 30 H74 L36 70 H74" stroke="#FFF9F0" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
            <path class="logo-tail-wag" d="M74 70 C84 62 86 48 80 40" stroke="#F28C7B" stroke-width="7" stroke-linecap="round" fill="none"/>
            <circle cx="50" cy="20" r="4" fill="#F5D98B"/>
            <circle cx="60" cy="18" r="3.5" fill="#F5D98B"/>
          </svg>
        </div>
        <span class="logo-text">PET<span class="z-tail">Z</span>Y</span>
      </a>

      <!-- Desktop Nav Menu -->
      <nav class="nav-menu" aria-label="Main Navigation">
        <a href="#/" class="nav-link" data-route="/">Home</a>
        <a href="#/about" class="nav-link" data-route="/about">About Us</a>
        <a href="#/services" class="nav-link" data-route="/services">Services</a>
        <a href="#/service-detail" class="nav-link" data-route="/service-detail">Service Detail</a>
        <a href="#/faq" class="nav-link" data-route="/faq">FAQ</a>
        <a href="#/contact" class="nav-link" data-route="/contact">Contact</a>
      </nav>

      <!-- Header Actions -->
      <div class="header-actions">
        <!-- Search Trigger -->
        <button class="action-icon-btn" id="open-search-btn" title="Search catalog" aria-label="Open search modal">
          <i class="fa-solid fa-magnifying-glass"></i>
        </button>

        <!-- Wishlist -->
        <button class="action-icon-btn" id="header-wishlist-btn" title="Saved Wishlist" aria-label="Wishlist">
          <i class="fa-regular fa-heart"></i>
          <span class="action-badge" id="header-wishlist-count">${wishlistCount}</span>
        </button>

        <!-- Cart Preview -->
        <button class="action-icon-btn" id="header-cart-btn" title="Shopping Bag" aria-label="Cart">
          <i class="fa-solid fa-bag-shopping"></i>
          <span class="action-badge" id="header-cart-count">${cartCount}</span>
        </button>

        <!-- Login -->
        <a href="#/login" class="header-login-link" data-route="/login">Login</a>

        <!-- Shop Now Soft Coral CTA -->
        <a href="#/" class="btn btn-primary btn-sm header-cta-btn" id="header-shop-now-btn">
          <span>Shop Now</span>
          <i class="fa-solid fa-arrow-right"></i>
        </a>

        <!-- Mobile Toggle Button -->
        <button class="mobile-menu-toggle" id="mobile-menu-toggle" aria-label="Toggle navigation drawer">
          <i class="fa-solid fa-bars"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Drawer -->
    <div class="mobile-drawer" id="mobile-drawer">
      <a href="#/" class="nav-link mobile-link" data-route="/">Home</a>
      <a href="#/about" class="nav-link mobile-link" data-route="/about">About Us</a>
      <a href="#/services" class="nav-link mobile-link" data-route="/services">Services</a>
      <a href="#/service-detail" class="nav-link mobile-link" data-route="/service-detail">Service Detail</a>
      <a href="#/faq" class="nav-link mobile-link" data-route="/faq">FAQ</a>
      <a href="#/contact" class="nav-link mobile-link" data-route="/contact">Contact</a>
      <a href="#/login" class="nav-link mobile-link" data-route="/login">Login</a>
      <a href="#/register" class="nav-link mobile-link" data-route="/register">Create Account</a>
      <a href="#/" class="btn btn-primary" style="margin-top: 1rem;" id="mobile-shop-now">
        <span>Shop Now</span>
        <i class="fa-solid fa-arrow-right"></i>
      </a>
    </div>
  `;

  setupHeaderListeners();
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
  const searchResults = document.getElementById('search-results-container');
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

  // Wishlist and Cart Quick Buttons
  const wishBtn = document.getElementById('header-wishlist-btn');
  const cartBtn = document.getElementById('header-cart-btn');

  wishBtn?.addEventListener('click', () => {
    showToast(`You have ${wishlistCount} favorite pet essentials saved!`, 'coral', 'fa-solid fa-heart');
  });

  cartBtn?.addEventListener('click', () => {
    showToast(`Shopping Bag: ${cartCount} items ready for your pet!`, 'sage', 'fa-solid fa-bag-shopping');
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
  const matchedProducts = siteData.products.filter(p => 
    !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  );
  const matchedServices = siteData.services.filter(s =>
    !q || s.title.toLowerCase().includes(q) || s.shortDesc.toLowerCase().includes(q)
  );

  if (matchedProducts.length === 0 && matchedServices.length === 0) {
    resultsContainer.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: var(--color-charcoal-muted);">
        <i class="fa-solid fa-magnifying-glass" style="font-size: 2rem; color: var(--color-sage-green); margin-bottom: 0.75rem;"></i>
        <p>No pet items found matching "<strong>${query}</strong>". Try searching for "treats", "bed", or "grooming".</p>
      </div>
    `;
    return;
  }

  let html = '';
  matchedProducts.forEach(prod => {
    html += `
      <div class="search-result-item" onclick="window.location.hash='#/'; document.getElementById('search-modal').classList.remove('open');">
        <img src="${prod.image}" alt="${prod.name}">
        <div>
          <h5>${prod.name}</h5>
          <p><strong>$${prod.price.toFixed(2)}</strong> • ${prod.category} • ★ ${prod.rating}</p>
        </div>
      </div>
    `;
  });

  matchedServices.forEach(srv => {
    html += `
      <div class="search-result-item" onclick="window.location.hash='#/service-detail'; document.getElementById('search-modal').classList.remove('open');">
        <img src="${srv.image}" alt="${srv.title}">
        <div>
          <h5>${srv.title}</h5>
          <p>${srv.badge} • Professional Care</p>
        </div>
      </div>
    `;
  });

  resultsContainer.innerHTML = html;
}

