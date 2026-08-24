/* PETZY Services Overview View (Veterinary Platform) */
import { siteData } from '../data.js';

export function renderServices() {
  return `
    <!-- Inner Page Hero -->
    <section class="inner-page-hero animate-fade-up">
      <div class="container">
        <div class="section-badge" style="background: rgba(255,255,255,0.15); color: var(--color-warm-cream); border: none;">
          <i class="fa-solid fa-stethoscope"></i>
          <span>Clinical & Wellness Services</span>
        </div>
        <h1>Everything Your Pet Needs, Under One Roof</h1>
        <p>Comprehensive preventive health, surgical excellence, diagnostic screening, and therapeutic wellness under the care of certified veterinary professionals.</p>
      </div>
    </section>

    <!-- Services Deep-Dive Grid -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <div class="section-badge coral">
            <i class="fa-solid fa-sparkles"></i>
            <span>Our Full Spectrum Care</span>
          </div>
          <h2 class="section-title">Specialized Veterinary Services</h2>
          <p class="section-desc">Each service is tailored with Fear-Free clinical protocols to ensure your pet is relaxed, comfortable, and thoroughly evaluated.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 3.5rem;">
          ${siteData.services.map((srv, idx) => `
            <div class="about-petzy-layout ${idx % 2 !== 0 ? 'reverse' : ''}" style="${idx % 2 !== 0 ? 'direction: rtl;' : ''}">
              <div class="about-visual-side" style="${idx % 2 !== 0 ? 'direction: ltr;' : ''}">
                <img src="${srv.image}" alt="${srv.title}" class="about-primary-photo hover-card-lift">
              </div>

              <div class="about-text-side" style="${idx % 2 !== 0 ? 'direction: ltr;' : ''}">
                <div class="section-badge">
                  <i class="${srv.icon}"></i>
                  <span>${srv.badge}</span>
                </div>
                <h2 class="section-title">${srv.title}</h2>
                <p style="font-size: 1.05rem; line-height: 1.7; margin-bottom: 1.5rem;">${srv.description}</p>
                
                <ul style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem;">
                  ${srv.features.map(f => `
                    <li style="display: flex; align-items: center; gap: 0.75rem; font-weight: 600; color: var(--color-charcoal);">
                      <i class="fa-solid fa-circle-check" style="color: var(--color-forest-green);"></i>
                      <span>${f}</span>
                    </li>
                  `).join('')}
                </ul>

                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                  <a href="#/service-detail" class="btn btn-teal">
                    <span>View Service Inclusions</span>
                    <i class="fa-solid fa-arrow-right"></i>
                  </a>
                  <a href="#/contact" class="btn btn-outline">
                    <i class="fa-solid fa-calendar-check"></i>
                    <span>Book for This Service</span>
                  </a>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Closing CTA -->
    <section class="section" style="background-color: var(--color-warm-cream-dark); border-radius: var(--radius-2xl);">
      <div class="container">
        <div class="pet-care-cta-box">
          <div class="cta-content-side">
            <div class="section-badge" style="background: rgba(255,255,255,0.15); color: var(--color-warm-cream); border: none;">
              <i class="fa-solid fa-phone"></i>
              <span>Direct Assistance</span>
            </div>
            <h2>Need Advice on the Right Service for Your Pet?</h2>
            <p>Our concierge veterinary desk is available to answer your questions and book the right diagnostic or wellness checkup.</p>
            <a href="#/contact" class="btn btn-coral btn-lg">
              <i class="fa-solid fa-calendar-check"></i>
              <span>Book an Appointment</span>
            </a>
          </div>

          <div class="cta-img-side">
            <img src="${siteData.images.ctaPet}" alt="Happy pet" class="cta-main-pet-img">
          </div>
        </div>
      </div>
    </section>
  `;
}

export function setupServicesEvents() {}
