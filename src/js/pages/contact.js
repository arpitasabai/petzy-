/* PETZY Contact Us View (Veterinary Platform) */
import { siteData } from '../data.js';
import { showToast } from '../components/toast.js';
import { renderBackButton } from '../components/back-button.js';

export function renderContact() {
  return `
    <!-- Contact Hero -->
    <section class="inner-page-hero animate-fade-up">
      <div class="container">
        ${renderBackButton('#/')}
        <div class="section-badge coral" style="background: var(--color-soft-coral); color: var(--color-white); border: none;">
          <i class="fa-solid fa-phone"></i>
          <span>We're Here 24/7</span>
        </div>
        <h1>Contact PETZY Veterinary Care</h1>
        <p>Schedule a routine wellness exam, consult our surgical team, or connect with our 24/7 emergency care department.</p>
      </div>
    </section>

    <!-- Main Contact Layout -->
    <section class="section">
      <div class="container">
        <div class="contact-grid-wrap">
          
          <!-- Contact Form -->
          <div class="contact-form-container">
            <div class="section-badge">
              <i class="fa-solid fa-paper-plane"></i>
              <span>Direct Inquiry</span>
            </div>
            <h2 style="font-size: 1.85rem; margin-bottom: 0.5rem;">Request an Appointment or Send a Message</h2>
            <p style="margin-bottom: 2rem; color: var(--color-charcoal-muted);">Fill out the form below and our care concierge will confirm your appointment within 2–4 hours.</p>

            <form id="main-contact-form">
              <div class="form-row-2">
                <div class="form-group">
                  <label class="form-label" for="contact-fullname">Full Name *</label>
                  <input type="text" id="contact-fullname" class="form-input" placeholder="e.g. Jessica Miller" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="contact-user-email">Email Address *</label>
                  <input type="email" id="contact-user-email" class="form-input" placeholder="e.g. jessica@example.com" required>
                </div>
              </div>

              <div class="form-row-2">
                <div class="form-group">
                  <label class="form-label" for="contact-user-phone">Phone Number *</label>
                  <input type="tel" id="contact-user-phone" class="form-input" placeholder="(555) 000-0000" required>
                </div>
                <div class="form-group">
                  <label class="form-label" for="contact-reason">Service or Doctor</label>
                  <select id="contact-reason" class="form-select">
                    <option value="general-consultation">Veterinary Consultation</option>
                    <option value="vaccination">Vaccination & Immunity</option>
                    <option value="grooming">Spa & Medical Grooming</option>
                    <option value="dental">Dental Cleaning & Exam</option>
                    <option value="surgery">Surgical Consultation</option>
                    <option value="dr-ananya">Dr. Ananya Sharma (Surgeon)</option>
                    <option value="emergency">Urgent Emergency Care</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="contact-user-message">Message or Pet Notes *</label>
                <textarea id="contact-user-message" class="form-textarea" placeholder="Tell us your pet's name, breed, age, and reason for the visit..." required></textarea>
              </div>

              <button type="submit" class="btn btn-teal btn-lg" style="width: 100%;">
                <i class="fa-solid fa-paper-plane"></i>
                <span>Send Message</span>
              </button>
            </form>
          </div>

          <!-- Contact Info Cards & Map -->
          <div class="contact-info-list">
            
            <div class="contact-info-card hover-card-lift">
              <div class="contact-info-icon"><i class="fa-solid fa-hospital"></i></div>
              <div>
                <h4 style="color: var(--color-forest-green); margin-bottom: 0.25rem;">Flagship Hospital Address</h4>
                <p style="font-size: 0.95rem; color: var(--color-charcoal);">${siteData.brand.address}</p>
                <p style="font-size: 0.85rem; color: var(--color-charcoal-muted); margin-top: 0.2rem;">Free valet parking for pet parents</p>
              </div>
            </div>

            <div class="contact-info-card hover-card-lift">
              <div class="contact-info-icon"><i class="fa-solid fa-phone-volume"></i></div>
              <div>
                <h4 style="color: var(--color-forest-green); margin-bottom: 0.25rem;">Phone & 24/7 Hotline</h4>
                <p style="font-size: 0.95rem; color: var(--color-charcoal); margin-bottom: 0.2rem;">Appointments: <strong>${siteData.brand.phone}</strong></p>
                <p style="font-size: 0.88rem; color: var(--color-soft-coral); font-weight: 700;">Emergency: ${siteData.brand.emergencyPhone}</p>
              </div>
            </div>

            <div class="contact-info-card hover-card-lift">
              <div class="contact-info-icon"><i class="fa-solid fa-envelope"></i></div>
              <div>
                <h4 style="color: var(--color-forest-green); margin-bottom: 0.25rem;">Email Care Desk</h4>
                <p style="font-size: 0.95rem; color: var(--color-charcoal);">${siteData.brand.email}</p>
                <p style="font-size: 0.85rem; color: var(--color-charcoal-muted); margin-top: 0.2rem;">Replies within 2 hours during clinic hours</p>
              </div>
            </div>

            <div class="contact-info-card hover-card-lift">
              <div class="contact-info-icon"><i class="fa-solid fa-clock"></i></div>
              <div>
                <h4 style="color: var(--color-forest-green); margin-bottom: 0.25rem;">Operating Hours</h4>
                <p style="font-size: 0.95rem; color: var(--color-charcoal);">${siteData.brand.hours}</p>
              </div>
            </div>

            <!-- Modern Map Placeholder -->
            <div class="map-placeholder-box">
              <i class="fa-solid fa-map-location-dot" style="font-size: 2.5rem; margin-bottom: 0.5rem; color: var(--color-forest-green);"></i>
              <h4 style="color: var(--color-forest-green); margin-bottom: 0.2rem;">San Francisco Veterinary Center</h4>
              <p style="font-size: 0.85rem; color: var(--color-charcoal-muted); margin: 0;">742 Evergreen Paws Way, Suite 400</p>
            </div>

          </div>

        </div>
      </div>
    </section>
  `;
}

export function setupContactEvents() {
  const form = document.getElementById('main-contact-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-fullname')?.value || 'Pet Parent';
    showToast(`Thank you, ${name}! Your request has been sent to our veterinary team.`, 'coral', 'fa-solid fa-circle-check');
    form.reset();
  });
}
