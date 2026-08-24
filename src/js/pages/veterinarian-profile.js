/* PETZY Veterinarian Profile View (Milestone 1) */
import { siteData } from '../data.js';

export function renderVeterinarianProfile() {
  const vet = siteData.veterinarians[0]; // Dr. Ananya Sharma

  return `
    <!-- Inner Page Hero -->
    <section class="inner-page-hero animate-fade-up">
      <div class="container">
        <div class="section-badge coral" style="background: var(--color-soft-coral); color: var(--color-white); border: none;">
          <i class="fa-solid fa-user-doctor"></i>
          <span>Doctor Profile</span>
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
            <img src="${vet.image}" alt="${vet.name}" class="vet-profile-photo">
            
            <div style="margin-top: 1.5rem; background: var(--color-warm-cream); padding: 1.5rem; border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
              <h4 style="color: var(--color-forest-green); margin-bottom: 0.75rem; font-size: 1.1rem;">Quick Facts</h4>
              <div style="display: flex; flex-direction: column; gap: 0.6rem; font-size: 0.92rem;">
                <div><span style="color: var(--color-charcoal-muted);">Experience:</span> <strong>${vet.experience}</strong></div>
                <div><span style="color: var(--color-charcoal-muted);">Surgeries Performed:</span> <strong>1,800+</strong></div>
                <div><span style="color: var(--color-charcoal-muted);">Languages:</span> <strong>English, Hindi</strong></div>
                <div><span style="color: var(--color-charcoal-muted);">Certification:</span> <strong>DACVS Board Certified</strong></div>
              </div>
            </div>

            <div style="margin-top: 1.5rem;">
              <a href="#/contact" class="btn btn-teal" style="width: 100%;">
                <i class="fa-solid fa-calendar-check"></i>
                <span>Book With Dr. Ananya</span>
              </a>
            </div>
          </div>

          <!-- Right Column Details -->
          <div>
            <div class="section-badge">
              <i class="fa-solid fa-sparkles"></i>
              <span>About Dr. Sharma</span>
            </div>
            <h2 style="font-size: 2.15rem; color: var(--color-forest-green); margin-bottom: 1rem;">Compassionate Surgical Leadership</h2>
            <p style="font-size: 1.05rem; line-height: 1.7; margin-bottom: 1.5rem;">Dr. Ananya Sharma serves as the Surgical Director at PETZY Veterinary Hospital. With over 8 years of advanced surgical practice, she is renowned for her calm bedside manner, precision laparoscopic procedures, and multimodal post-operative pain protocols.</p>
            <p style="font-size: 1.05rem; line-height: 1.7; margin-bottom: 2rem;">She completed her advanced surgical residency at the Veterinary Medical Center and has published clinical research on soft tissue recovery and orthopedic rehabilitation in companion canines.</p>

            <h3 style="font-size: 1.35rem; margin-bottom: 0.75rem; color: var(--color-forest-green);">Areas of Clinical Expertise</h3>
            <div class="vet-specialty-tags">
              ${vet.specialties.map(sp => `
                <span class="specialty-tag">${sp}</span>
              `).join('')}
              <span class="specialty-tag">Emergency Trauma Repair</span>
              <span class="specialty-tag">Geriatric Patient Safety</span>
            </div>

            <h3 style="font-size: 1.35rem; margin-bottom: 1rem; color: var(--color-forest-green);">Clinical Education & Board Certifications</h3>
            <ul style="display: flex; flex-direction: column; gap: 0.85rem; margin-bottom: 2.5rem;">
              <li style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.98rem; font-weight: 600;">
                <i class="fa-solid fa-graduation-cap" style="color: var(--color-forest-green); font-size: 1.15rem;"></i>
                <span>Master of Veterinary Science (MVSc Surgery) — Distinction Honors</span>
              </li>
              <li style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.98rem; font-weight: 600;">
                <i class="fa-solid fa-certificate" style="color: var(--color-forest-green); font-size: 1.15rem;"></i>
                <span>Diplomate, American College of Veterinary Surgeons (DACVS)</span>
              </li>
              <li style="display: flex; align-items: center; gap: 0.75rem; font-size: 0.98rem; font-weight: 600;">
                <i class="fa-solid fa-shield-heart" style="color: var(--color-forest-green); font-size: 1.15rem;"></i>
                <span>Fear-Free Elite Certified Veterinary Practitioner</span>
              </li>
            </ul>

            <div style="background: var(--color-warm-cream-dark); padding: 1.75rem; border-radius: var(--radius-xl); border: 1px solid var(--color-border);">
              <h4 style="color: var(--color-forest-green); margin-bottom: 0.5rem; font-size: 1.15rem;">Parent Testimonial</h4>
              <p style="font-style: italic; color: var(--color-charcoal); font-size: 0.98rem; margin-bottom: 0.75rem;">"Dr. Ananya operated on our dog Bruno’s knee with such immense care and patience. Bruno was walking comfortably in days, and Dr. Ananya called us personally every evening during his recovery."</p>
              <div style="font-size: 0.85rem; font-weight: 700; color: var(--color-forest-green);">— Priya & Rajesh Nair (Bruno's Parents)</div>
            </div>

            <div style="margin-top: 2.5rem;">
              <a href="#/veterinarians" class="btn btn-outline">
                <span>← Back to All Veterinarians</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function setupVeterinarianProfileEvents() {}
