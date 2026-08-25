/* PETZY Footer Component (Veterinary Platform) */
import { siteData } from '../data.js';
import { showToast } from './toast.js';

export function renderFooter() {
  const footerEl = document.getElementById('site-footer');
  if (!footerEl) return;

  footerEl.innerHTML = `
    <div class="container">
      <div class="footer-grid-cols">
        <!-- Brand Summary -->
        <div class="footer-brand-col">
          <a href="#/" class="brand-logo footer-logo" aria-label="PETZY Home">
            <img src="/images/logo-light.png" alt="PETZY Veterinary & Pet Care" class="brand-logo-img footer-logo-img">
          </a>
          <p>Modern veterinary hospital and pet wellness center committed to compassionate, professional, and personalized care for every stage of your pet's life.</p>
          <div class="footer-social-row">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" class="social-circle-btn" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" class="social-circle-btn" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" class="social-circle-btn" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" class="social-circle-btn" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
          </div>
        </div>

        <!-- Company Column -->
        <div>
          <h4 class="footer-heading">Company</h4>
          <div class="footer-links-list">
            <a href="#/about" class="footer-link-item"><i class="fa-solid fa-angle-right"></i> About PETZY</a>
            <a href="#/services" class="footer-link-item"><i class="fa-solid fa-angle-right"></i> All Services</a>
            <a href="#/veterinarians" class="footer-link-item"><i class="fa-solid fa-angle-right"></i> Our Veterinarians</a>
            <a href="#/contact" class="footer-link-item"><i class="fa-solid fa-angle-right"></i> Contact Care Desk</a>
          </div>
        </div>

        <!-- Services Column -->
        <div>
          <h4 class="footer-heading">Clinical Services</h4>
          <div class="footer-links-list">
            <a href="#/service-detail" class="footer-link-item"><i class="fa-solid fa-stethoscope"></i> Consultation</a>
            <a href="#/services" class="footer-link-item"><i class="fa-solid fa-syringe"></i> Vaccination</a>
            <a href="#/services" class="footer-link-item"><i class="fa-solid fa-scissors"></i> Spa Grooming</a>
            <a href="#/services" class="footer-link-item"><i class="fa-solid fa-tooth"></i> Dental Care</a>
            <a href="#/services" class="footer-link-item"><i class="fa-solid fa-truck-medical"></i> Emergency Care</a>
          </div>
        </div>

        <!-- Support Column -->
        <div>
          <h4 class="footer-heading">Support & Clinic</h4>
          <div class="footer-links-list">
            <a href="#/faq" class="footer-link-item"><i class="fa-solid fa-circle-question"></i> Help & FAQ</a>
            <a href="#/contact" class="footer-link-item"><i class="fa-solid fa-phone"></i> +1 (800) 555-PETZY</a>
            <a href="#/contact" class="footer-link-item" style="color: var(--color-soft-coral);"><i class="fa-solid fa-heart-pulse"></i> 24/7 Emergency Hotline</a>
            <a href="javascript:void(0)" class="footer-link-item"><i class="fa-solid fa-shield-halved"></i> Privacy Policy</a>
            <a href="javascript:void(0)" class="footer-link-item"><i class="fa-solid fa-file-contract"></i> Terms & Conditions</a>
          </div>
        </div>
      </div>

      <!-- Footer Bottom Bar -->
      <div class="footer-bottom-bar">
        <p>&copy; 2026 PETZY. All rights reserved. Designed with compassion for all pets.</p>
        <div style="display: flex; gap: 1.5rem; align-items: center;">
          <span style="color: var(--color-sage-green); font-size: 0.85rem;"><i class="fa-solid fa-circle-check"></i> AAHA Accredited Hospital</span>
          <span style="color: var(--color-soft-yellow); font-size: 0.85rem;"><i class="fa-solid fa-star"></i> 4.9★ Rated Veterinary Care</span>
        </div>
      </div>
    </div>
  `;
}
