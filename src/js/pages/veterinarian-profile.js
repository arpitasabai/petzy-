/* PETZY Dynamic Veterinarian Profile View (Milestone 1) */
import { siteData, getDoctorById } from '../data.js';
import { renderBackButton } from '../components/back-button.js';

export function renderVeterinarianProfile(doctorId) {
  // Extract doctorId from parameter, route hash, or query parameter
  let targetId = doctorId;
  if (!targetId) {
    const hash = window.location.hash || '';
    if (hash.includes('/veterinarians/')) {
      targetId = hash.split('/veterinarians/')[1]?.split('?')[0]?.split('#')[0];
    } else if (hash.includes('?id=')) {
      targetId = hash.split('?id=')[1]?.split('&')[0];
    }
  }

  const vet = getDoctorById(targetId);

  return `
    <!-- Inner Page Hero -->
    <section class="inner-page-hero animate-fade-up">
      <div class="container">
        ${renderBackButton('#/veterinarians')}
        <div class="section-badge coral" style="background: var(--color-soft-coral); color: var(--color-white); border: none;">
          <i class="fa-solid fa-user-doctor"></i>
          <span>Clinical Specialist Profile</span>
        </div>
        <h1>${vet.name}</h1>
        <p>${vet.title} • ${vet.degrees}</p>
      </div>
    </section>

    <!-- Profile Breakdown Layout -->
    <section class="section">
      <div class="container">
        <div class="vet-profile-card">
          <!-- Left Column Photo & Info -->
          <div>
            <div class="hover-zoom-img" style="border-radius: var(--radius-xl); overflow: hidden; box-shadow: var(--shadow-md);">
              <img src="${vet.image}" alt="${vet.name}" class="vet-profile-photo" style="width: 100%; height: 380px; object-fit: cover;">
            </div>
            
            <div style="margin-top: 1.5rem; background: var(--color-warm-cream); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
              <h4 style="color: var(--color-forest-green); margin-bottom: 0.75rem; font-size: 1.1rem;">Quick Facts</h4>
              <div style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.92rem;">
                <div><span style="color: var(--color-charcoal-muted);">Experience:</span> <strong>${vet.quickFacts?.experience || vet.experience}</strong></div>
                <div><span style="color: var(--color-charcoal-muted);">Clinical Record:</span> <strong>${vet.quickFacts?.cases || '1,500+ Patients'}</strong></div>
                <div><span style="color: var(--color-charcoal-muted);">Languages:</span> <strong>${vet.quickFacts?.languages || 'English'}</strong></div>
                <div><span style="color: var(--color-charcoal-muted);">Certification:</span> <strong>${vet.quickFacts?.certification || vet.degrees}</strong></div>
              </div>
            </div>

            <div style="margin-top: 1.5rem;">
              <a href="#/contact" class="btn btn-teal" style="width: 100%;">
                <i class="fa-solid fa-calendar-check"></i>
                <span>Book With ${vet.name}</span>
              </a>
            </div>
          </div>

          <!-- Right Column Details -->
          <div>
            <div class="section-badge">
              <i class="fa-solid fa-sparkles"></i>
              <span>About ${vet.name}</span>
            </div>
            <h2 style="font-size: 2.15rem; color: var(--color-forest-green); margin-bottom: 1rem;">${vet.headline || vet.title}</h2>
            <p style="font-size: 1.05rem; line-height: 1.7; margin-bottom: 1.5rem;">${vet.bio}</p>
            ${vet.bioExtended ? `<p style="font-size: 1.05rem; line-height: 1.7; margin-bottom: 2rem;">${vet.bioExtended}</p>` : ''}

            <h3 style="font-size: 1.35rem; margin-bottom: 0.75rem; color: var(--color-forest-green);">Areas of Clinical Expertise</h3>
            <div class="vet-specialty-tags" style="margin-bottom: 2rem;">
              ${vet.specialties.map(sp => `
                <span class="specialty-tag">${sp}</span>
              `).join('')}
            </div>

            <h3 style="font-size: 1.35rem; margin-bottom: 1rem; color: var(--color-forest-green);">Clinical Education & Board Certifications</h3>
            <ul style="display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 2.5rem;">
              ${vet.education ? vet.education.map(ed => `
                <li style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.98rem; font-weight: 600;">
                  <i class="fa-solid fa-graduation-cap" style="color: var(--color-forest-green); font-size: 1.15rem;"></i>
                  <span>${ed}</span>
                </li>
              `).join('') : `
                <li style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.98rem; font-weight: 600;">
                  <i class="fa-solid fa-certificate" style="color: var(--color-forest-green); font-size: 1.15rem;"></i>
                  <span>${vet.degrees}</span>
                </li>
              `}
            </ul>

            ${vet.testimonial ? `
              <div style="background: var(--color-warm-cream-dark); padding: 1.75rem; border-radius: var(--radius-xl); border: 1px solid var(--color-border);">
                <h4 style="color: var(--color-forest-green); margin-bottom: 0.5rem; font-size: 1.15rem;">Parent Testimonial</h4>
                <p style="font-style: italic; color: var(--color-charcoal); font-size: 0.98rem; margin-bottom: 0.75rem;">"${vet.testimonial.quote}"</p>
                <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-forest-green);">— ${vet.testimonial.author}</div>
              </div>
            ` : ''}

            <div style="margin-top: 2.5rem; display: flex; gap: 1rem; flex-wrap: wrap;">
              <a href="#/veterinarians" class="btn btn-outline">
                <span>← Back to All Veterinarians</span>
              </a>
              <a href="#/contact" class="btn btn-teal">
                <i class="fa-solid fa-calendar-check"></i>
                <span>Schedule Consultation</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function setupVeterinarianProfileEvents() {}
