/* PETZY Contact Us View (Milestone 1) */
import { siteData } from '../data.js';
import { showToast } from '../components/toast.js';

export function renderContact() {
  return `
    <!-- Contact Hero -->
    <section class="page-hero animate-fade-in">
      <div class="container">
        <div class="section-subtitle coral">
          <i class="fa-solid fa-envelope"></i>
          <span>We're Here For You</span>
        </div>
        <h1>Get in Touch with Our Pet Care Team</h1>
        <p>Have questions about our organic nutrition, spa grooming, or order status? We are always happy to help you and your pet companions.</p>
      </div>
    </section>

    <!-- Main Contact Layout -->
    <section class="section">
      <div class="container">
        <div class="contact-layout">
          
          <!-- Interactive Contact Form -->
          <div class="contact-form-card">
            <div class="section-subtitle">
              <i class="fa-solid fa-paper-plane"></i>
              <span>Send a Message</span>
            </div>
            <h2 style="font-size: 1.85rem; margin-bottom: 0.5rem;">How Can We Help?</h2>
            <p style="margin-bottom: 2rem;">Fill out the form below and a pet care specialist will get back to you within 2–4 business hours.</p>

            <form id="petzy-contact-form">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="contact-name">Your Full Name *</label>
                  <input type="text" id="contact-name" class="form-input" placeholder="e.g. Jessica Miller" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="contact-email">Email Address *</label>
                  <input type="email" id="contact-email" class="form-input" placeholder="e.g. jessica@example.com" required>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label" for="contact-phone">Phone Number</label>
                  <input type="tel" id="contact-phone" class="form-input" placeholder="e.g. (555) 234-5678">
                </div>
                <div class="form-group">
                  <label class="form-label" for="contact-subject">Inquiry Subject *</label>
                  <select id="contact-subject" class="form-select" required>
                    <option value="" disabled selected>Select an option</option>
                    <option value="product-inquiry">Product & Nutrition Advice</option>
                    <option value="services-info">Grooming & Wellness Services</option>
                    <option value="order-support">Order & Shipping Support</option>
                    <option value="vet-partnership">Veterinary & Partnership Inquiry</option>
                    <option value="general-question">Other Question</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="contact-message">Your Message *</label>
                <textarea id="contact-message" class="form-textarea" placeholder="Tell us about your pet, your inquiry, or how we can assist you..." required></textarea>
              </div>

              <button type="submit" class="btn btn-primary btn-lg" style="width: 100%; margin-top: 0.5rem;" id="contact-submit-btn">
                <i class="fa-solid fa-paper-plane"></i>
                <span>Send Message</span>
              </button>
            </form>
          </div>

          <!-- Contact Information & Map -->
          <div class="contact-info-cards">
            
            <div class="info-item-card hover-lift">
              <div class="info-icon-box">
                <i class="fa-solid fa-phone"></i>
              </div>
              <div class="info-details">
                <h4>Call Our Care Concierge</h4>
                <p><strong>${siteData.brand.phone}</strong></p>
                <p style="color: var(--color-charcoal-muted); font-size: 0.85rem;">Toll-free customer support</p>
              </div>
            </div>

            <div class="info-item-card hover-lift">
              <div class="info-icon-box">
                <i class="fa-solid fa-envelope"></i>
              </div>
              <div class="info-details">
                <h4>Email Care Desk</h4>
                <p><strong>${siteData.brand.email}</strong></p>
                <p style="color: var(--color-charcoal-muted); font-size: 0.85rem;">Quick response within 2-4 hours</p>
              </div>
            </div>

            <div class="info-item-card hover-lift">
              <div class="info-icon-box">
                <i class="fa-solid fa-location-dot"></i>
              </div>
              <div class="info-details">
                <h4>Headquarters & Flagship Salon</h4>
                <p>${siteData.brand.address}</p>
                <p style="color: var(--color-charcoal-muted); font-size: 0.85rem;">${siteData.brand.hours}</p>
              </div>
            </div>

            <!-- Map Placeholder Card -->
            <div class="map-mockup-card">
              <div style="text-align: center; padding: 1.5rem;">
                <i class="fa-solid fa-map-location-dot" style="font-size: 2.5rem; margin-bottom: 0.75rem; color: var(--color-forest-green);"></i>
                <h4 style="color: var(--color-forest-green); margin-bottom: 0.25rem;">San Francisco Flagship</h4>
                <p style="font-size: 0.85rem; color: var(--color-forest-green-dark);">742 Evergreen Paws Way • Valet pet drop-off available</p>
              </div>
            </div>

            <!-- Social Links Box -->
            <div style="background: var(--color-white); padding: 1.5rem; border-radius: var(--radius-xl); border: 1px solid var(--color-border); text-align: center;">
              <h4 style="font-size: 1rem; margin-bottom: 0.85rem;">Connect with @PETZY</h4>
              <div style="display: flex; justify-content: center; gap: 0.75rem;">
                <a href="https://instagram.com" target="_blank" rel="noreferrer" class="social-icon-btn" style="background: var(--color-sage-green-soft); color: var(--color-forest-green);"><i class="fa-brands fa-instagram"></i></a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer" class="social-icon-btn" style="background: var(--color-sage-green-soft); color: var(--color-forest-green);"><i class="fa-brands fa-facebook-f"></i></a>
                <a href="https://tiktok.com" target="_blank" rel="noreferrer" class="social-icon-btn" style="background: var(--color-sage-green-soft); color: var(--color-forest-green);"><i class="fa-brands fa-tiktok"></i></a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer" class="social-icon-btn" style="background: var(--color-sage-green-soft); color: var(--color-forest-green);"><i class="fa-brands fa-youtube"></i></a>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  `;
}

export function setupContactEvents() {
  const form = document.getElementById('petzy-contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name')?.value || 'Pet Parent';
    showToast(`Thank you, ${name}! Your message has been sent to our care desk.`, 'coral', 'fa-solid fa-circle-check');
    form.reset();
  });
}
