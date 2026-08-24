/* PETZY Veterinarians Directory View (Milestone 1) */
import { siteData } from '../data.js';
import { renderBackButton } from '../components/back-button.js';

export function renderVeterinarians() {
  return `
    <!-- Inner Page Hero -->
    <section class="inner-page-hero animate-fade-up">
      <div class="container">
        ${renderBackButton('#/')}
        <div class="section-badge coral" style="background: var(--color-soft-coral); color: var(--color-white); border: none;">
          <i class="fa-solid fa-user-doctor"></i>
          <span>Clinical Specialists</span>
        </div>
        <h1>Meet Our Veterinary Experts</h1>
        <p>Our team of board-certified veterinary surgeons, internists, and wellness practitioners bring deep expertise and gentle compassion to every patient visit.</p>
      </div>
    </section>

    <!-- Doctors Grid -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <div class="section-badge">
            <i class="fa-solid fa-medal"></i>
            <span>Certified Excellence</span>
          </div>
          <h2 class="section-title">Compassionate Leaders in Animal Medicine</h2>
          <p class="section-desc">Each doctor at PETZY participates in ongoing veterinary research and Fear-Free behavior training.</p>
        </div>

        <div class="vets-grid" style="grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));">
          ${siteData.veterinarians.map(vet => `
            <div class="vet-card">
              <div class="vet-image-box hover-zoom-img">
                <img src="${vet.image}" alt="${vet.name}" loading="lazy">
                <span class="vet-badge-overlay">${vet.badge}</span>
              </div>
              <div class="vet-card-body">
                <h3>${vet.name}</h3>
                <div class="vet-specialty">${vet.title}</div>
                <p style="font-size: 0.85rem; color: var(--color-forest-green); font-weight: 700; margin-bottom: 0.5rem;">${vet.degrees}</p>
                <div class="vet-experience">
                  <i class="fa-solid fa-medal" style="color: #DEB853;"></i>
                  <span>${vet.experience}</span>
                </div>
                <p style="font-size: 0.92rem; color: var(--color-charcoal-muted); line-height: 1.6; margin-bottom: 1.25rem;">${vet.bio}</p>
                
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 1.5rem;">
                  ${vet.specialties.map(sp => `
                    <span class="specialty-tag" style="font-size: 0.75rem; padding: 0.2rem 0.65rem;">${sp}</span>
                  `).join('')}
                </div>

                <a href="#/veterinarians/${vet.slug || vet.id}" class="vet-view-profile-btn">
                  <span>View Full Profile & Schedule</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </a>
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
              <i class="fa-solid fa-calendar-check"></i>
              <span>Book With Your Preferred Doctor</span>
            </div>
            <h2>Schedule a Visit With Our Clinical Specialists</h2>
            <p>Select your preferred veterinarian when booking your consultation or routine health checkup.</p>
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

export function setupVeterinariansEvents() {}
