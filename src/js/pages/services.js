/* PETZY Services Overview View (Veterinary Platform - Dynamic Services) */
import { siteData } from '../data.js';
import { getActiveServices } from '../services/storage.js';
import { renderBackButton } from '../components/back-button.js';

export function renderServices() {
  const services = getActiveServices();
  return `
    <!-- Inner Page Hero -->
    <section class="inner-page-hero animate-fade-up">
      <div class="container">
        ${renderBackButton('#/')}
        <div class="section-badge" style="background: rgba(255,255,255,0.15); color: var(--color-warm-cream); border: none;">
          <i class="fa-solid fa-stethoscope"></i>
          <span>Clinical & Wellness Services</span>
        </div>
        <h1>Everything Your Pet Needs, Under One Roof</h1>
        <p>Comprehensive veterinary care, surgical excellence, diagnostic screening, and therapeutic wellness for dogs, cats, rabbits, birds, and small companion pets.</p>
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
          <h2 class="section-title">Specialized Veterinary Services for Every Companion</h2>
          <p class="section-desc">Each service is tailored with Fear-Free clinical protocols to ensure your pet is relaxed, comfortable, and thoroughly evaluated.</p>
        </div>

        <div style="display: flex; flex-direction: column; gap: 3.5rem;">
          ${services.map((srv, idx) => `
            <div class="about-petzy-layout ${idx % 2 !== 0 ? 'reverse' : ''}" style="${idx % 2 !== 0 ? 'direction: rtl;' : ''}">
              
              <!-- Visual Container with Rounded 20-24px corners & subtle hover zoom -->
              <div class="about-visual-side" style="${idx % 2 !== 0 ? 'direction: ltr;' : ''}">
                <div class="service-img-container hover-zoom-img" style="border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-lg); border: 4px solid var(--color-white); position: relative;">
                  <img src="${srv.image}" alt="${srv.title}" class="about-primary-photo" style="width: 100%; height: 420px; object-fit: cover;">
                  
                  <!-- Subtle Floating Pet Category Badge -->
                  <div style="position: absolute; bottom: 16px; left: 16px; background: rgba(23, 74, 58, 0.88); backdrop-filter: blur(10px); color: var(--color-warm-cream); font-size: 0.82rem; font-weight: 700; padding: 0.35rem 0.95rem; border-radius: var(--radius-full); display: flex; align-items: center; gap: 0.45rem; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                    <i class="${srv.petTypeIcon || 'fa-solid fa-paw'}" style="color: var(--color-soft-coral);"></i>
                    <span>${srv.petTypeLabel}</span>
                  </div>
                </div>
              </div>

              <!-- Text Content Side -->
              <div class="about-text-side" style="${idx % 2 !== 0 ? 'direction: ltr;' : ''}">
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; flex-wrap: wrap;">
                  <div class="section-badge" style="margin-bottom: 0;">
                    <i class="${srv.icon}"></i>
                    <span>${srv.badge}</span>
                  </div>
                  <span style="font-size: 0.82rem; font-weight: 700; color: var(--color-forest-green); background: var(--color-sage-green-soft); padding: 0.3rem 0.8rem; border-radius: var(--radius-full); border: 1px solid var(--color-border);">
                    ${srv.petTypeLabel}
                  </span>
                </div>

                <h2 class="section-title" style="font-size: 2rem;">${srv.title}</h2>
                <p style="font-size: 1.05rem; line-height: 1.7; margin-bottom: 1.25rem;">${srv.description}</p>
                
                <!-- Clinical Procedure Highlight -->
                <div style="background: var(--color-warm-cream); padding: 0.85rem 1.25rem; border-radius: var(--radius-md); border-left: 4px solid var(--color-soft-coral); margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.75rem;">
                  <i class="${srv.icon}" style="color: var(--color-soft-coral); font-size: 1.15rem;"></i>
                  <span style="font-size: 0.92rem; font-weight: 700; color: var(--color-forest-green);">Clinical Focus: ${srv.procedureDetail}</span>
                </div>
                
                <ul style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem;">
                  ${srv.features.map(f => `
                    <li style="display: flex; align-items: center; gap: 0.75rem; font-weight: 600; color: var(--color-charcoal);">
                      <i class="fa-solid fa-circle-check" style="color: var(--color-forest-green);"></i>
                      <span>${f}</span>
                    </li>
                  `).join('')}
                </ul>

                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                  <a href="#/service-detail?id=${srv.id}" class="btn btn-teal">
                    <span>View Service Inclusions</span>
                    <i class="fa-solid fa-arrow-right"></i>
                  </a>
                  <a href="#/book-appointment?service=${srv.id}" class="btn btn-outline">
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
            <h2>Need Advice on the Right Care for Your Pet?</h2>
            <p>Our concierge veterinary desk is available to answer your questions and book the right diagnostic, grooming, or wellness checkup for dogs, cats, birds, and small pets.</p>
            <a href="#/book-appointment" class="btn btn-coral btn-lg">
              <i class="fa-solid fa-calendar-check"></i>
              <span>Book an Appointment</span>
            </a>
          </div>

          <div class="cta-img-side">
            <img src="${siteData.images.ctaPet}" alt="Happy companion pet" class="cta-main-pet-img">
          </div>
        </div>
      </div>
    </section>
  `;
}

export function setupServicesEvents() {}
