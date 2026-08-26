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

        <div class="vets-grid">
          ${siteData.veterinarians.map(vet => `
            <div class="vet-card">
              <div class="vet-image-box">
                <img src="${vet.image}" alt="${vet.name}" loading="lazy">
                <span class="vet-badge-overlay">${vet.badge}</span>
              </div>
              <div class="vet-card-body">
                <div class="vet-card-info">
                  <h3>${vet.name}</h3>
                  <div class="vet-specialty">${vet.title}</div>
                  <div class="vet-qualification">${vet.degrees}</div>
                  <div class="vet-experience">
                    <i class="fa-solid fa-medal" style="color: #DEB853;"></i>
                    <span>${vet.experience}</span>
                  </div>
                  <p class="vet-short-desc">${vet.shortDesc || vet.bio}</p>
                </div>

                <a href="#/veterinarians/${vet.slug || vet.id}" class="vet-view-profile-btn">
                  <span>View Profile</span>
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
            <a href="#/book-appointment" class="btn btn-coral btn-lg">
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
