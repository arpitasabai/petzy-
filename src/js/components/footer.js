/* PETZY Footer Component */
import { showToast } from './toast.js';

export function renderFooter() {
  const footerEl = document.getElementById('site-footer');
  if (!footerEl) return;

  footerEl.innerHTML = `
    <div class="container">
      <div class="footer-top-grid">
        <!-- Brand Summary -->
        <div class="footer-col footer-brand">
          <a href="#/" class="brand-logo" style="color: var(--color-warm-cream);">
            <div class="logo-icon-wrap" style="background-color: var(--color-soft-coral);">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M26 30 H74 L36 70 H74" stroke="#FFF9F0" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
                <path class="logo-tail-wag" d="M74 70 C84 62 86 48 80 40" stroke="#174A3A" stroke-width="7" stroke-linecap="round" fill="none"/>
                <circle cx="50" cy="20" r="4" fill="#F5D98B"/>
              </svg>
            </div>
            <span class="logo-text" style="color: var(--color-warm-cream);">PET<span class="z-tail" style="color: var(--color-warm-cream);">Z</span>Y</span>
          </a>
          <p>Thoughtfully selected organic pet essentials and certified veterinary care designed to make pet parenting joyful, effortless, and full of tail wags.</p>
          <div class="footer-social-links">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" class="social-icon-btn" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" class="social-icon-btn" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" class="social-icon-btn" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" class="social-icon-btn" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="footer-col">
          <h4>Explore PETZY</h4>
          <div class="footer-links">
            <a href="#/" class="footer-link"><i class="fa-solid fa-angle-right"></i> Homepage</a>
            <a href="#/about" class="footer-link"><i class="fa-solid fa-angle-right"></i> About Our Mission</a>
            <a href="#/services" class="footer-link"><i class="fa-solid fa-angle-right"></i> All Care Services</a>
            <a href="#/service-detail" class="footer-link"><i class="fa-solid fa-angle-right"></i> Spa & Grooming Detail</a>
            <a href="#/faq" class="footer-link"><i class="fa-solid fa-angle-right"></i> Help & FAQs</a>
            <a href="#/contact" class="footer-link"><i class="fa-solid fa-angle-right"></i> Contact Us</a>
          </div>
        </div>

        <!-- Pet Care Shop Categories -->
        <div class="footer-col">
          <h4>Shop by Pet</h4>
          <div class="footer-links">
            <a href="#/" class="footer-link"><i class="fa-solid fa-paw"></i> Dogs Essentials</a>
            <a href="#/" class="footer-link"><i class="fa-solid fa-cat"></i> Feline Nutrition & Toys</a>
            <a href="#/" class="footer-link"><i class="fa-solid fa-crow"></i> Bird Habitat & Seeds</a>
            <a href="#/" class="footer-link"><i class="fa-solid fa-shield-cat"></i> Small Pets & Rabbits</a>
            <a href="#/" class="footer-link"><i class="fa-solid fa-fish"></i> Aquarium Care</a>
            <a href="#/" class="footer-link"><i class="fa-solid fa-worm"></i> Reptile Terrariums</a>
          </div>
        </div>

        <!-- Newsletter Signup -->
        <div class="footer-col">
          <h4>Join the PETZY Family</h4>
          <p style="font-size: 0.9rem; margin-top: 0.5rem;">Subscribe to get <strong>15% OFF</strong> your first pet order, plus weekly pet wellness guides.</p>
          <form class="newsletter-form" id="newsletter-form">
            <input type="email" class="newsletter-input" placeholder="Enter your email" required id="newsletter-email">
            <button type="submit" class="btn btn-primary btn-sm" aria-label="Subscribe to newsletter">
              <i class="fa-solid fa-paper-plane"></i>
            </button>
          </form>
          <div style="margin-top: 1rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.8rem; color: rgba(255,249,240,0.65);">
            <i class="fa-solid fa-shield-check" style="color: var(--color-sage-green);"></i>
            <span>No spam ever. Unsubscribe anytime.</span>
          </div>
        </div>
      </div>

      <!-- Footer Bottom -->
      <div class="footer-bottom">
        <p>&copy; 2026 PETZY Inc. All rights reserved. Designed with love for all pets.</p>
        <div class="footer-trust-tags">
          <div class="trust-item">
            <i class="fa-solid fa-shield-halved"></i>
            <span>100% Non-Toxic Vetted</span>
          </div>
          <div class="trust-item">
            <i class="fa-solid fa-truck-fast"></i>
            <span>Fast 2-Day Shipping</span>
          </div>
          <div class="trust-item">
            <i class="fa-solid fa-star"></i>
            <span>4.9★ Rated Pet Care</span>
          </div>
        </div>
      </div>
    </div>
  `;

  // Newsletter Submit Listener
  const form = document.getElementById('newsletter-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    if (emailInput && emailInput.value) {
      showToast(`Welcome to PETZY! 15% discount code sent to ${emailInput.value}`, 'coral', 'fa-solid fa-envelope-open-text');
      emailInput.value = '';
    }
  });
}
