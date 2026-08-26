/* PETZY About Us View (Veterinary Platform) */
import { siteData } from '../data.js';
import { renderBackButton } from '../components/back-button.js';

export function renderAbout() {
  return `
    <!-- Inner Page Hero -->
    <section class="inner-page-hero animate-fade-up">
      <div class="container">
        ${renderBackButton('#/')}
        <div class="section-badge" style="background: rgba(255,255,255,0.15); color: var(--color-warm-cream); border: none;">
          <i class="fa-solid fa-heart"></i>
          <span>Our Mission & Story</span>
        </div>
        <h1>Dedicated to Your Pet's Health & Happiness</h1>
        <p>Providing compassionate veterinary care, state-of-the-art medical technology, and personalized wellness support for every stage of your pet's life.</p>
      </div>
    </section>

    <!-- Our Story Section -->
    <section class="section">
      <div class="container">
        <div class="about-petzy-layout">
          <div class="about-visual-side">
            <img src="${siteData.images.aboutVet}" alt="Veterinarian examining cute dog" class="about-primary-photo">
            
            <div class="about-trusted-badge float-gentle">
              <div class="trusted-badge-icon">
                <i class="fa-solid fa-medal"></i>
              </div>
              <div>
                <h4 style="color: var(--color-warm-cream); font-size: 1.1rem; margin-bottom: 0.2rem;">AAHA Accredited</h4>
                <p style="color: var(--color-sage-green-light); font-size: 0.82rem; margin: 0;">Top 15% of Veterinary Hospitals</p>
              </div>
            </div>
          </div>

          <div class="about-text-side">
            <div class="section-badge">
              <i class="fa-solid fa-sparkles"></i>
              <span>Our Origins</span>
            </div>
            <h2 class="section-title">Founded on Compassion & Clinical Excellence</h2>
            <p style="margin-bottom: 1.25rem; font-size: 1.05rem;">PETZY was founded by a passionate collective of veterinarians and veterinary nurses with a clear vision: to create a healthcare environment where pets feel safe, stress-free, and loved like family.</p>
            <p style="margin-bottom: 1.75rem; font-size: 1.05rem;">From our Fear-Free accredited clinical examination suites to our 24/7 intensive emergency trauma response team, every single protocol we design puts the comfort and health of your pet at the center.</p>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; border-top: 1px solid var(--color-border); padding-top: 1.5rem;">
              <div>
                <h3 style="font-size: 2rem; color: var(--color-forest-green);">500+</h3>
                <p style="font-size: 0.9rem;">Happy Pets</p>
              </div>
              <div>
                <h3 style="font-size: 2rem; color: var(--color-forest-green);">20+</h3>
                <p style="font-size: 0.9rem;">Expert Vets</p>
              </div>
              <div>
                <h3 style="font-size: 2rem; color: var(--color-forest-green);">98%</h3>
                <p style="font-size: 0.9rem;">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose PETZY Benefits -->
    <section class="section" style="background-color: var(--color-warm-cream-dark); border-radius: var(--radius-2xl);">
      <div class="container">
        <div class="section-header">
          <div class="section-badge coral">
            <i class="fa-solid fa-shield-heart"></i>
            <span>Our Guiding Principles</span>
          </div>
          <h2 class="section-title">The Pillars of PETZY Veterinary Care</h2>
          <p class="section-desc">Our foundational clinical standards ensure your companion receives the highest standard of modern medicine.</p>
        </div>

        <div class="benefits-grid-4">
          ${siteData.benefits.map((b, idx) => `
            <div class="benefit-card-box stagger-${idx + 1}">
              <div class="benefit-top-row">
                <span class="benefit-number">${b.number}</span>
                <div class="benefit-icon-pill">
                  <i class="${b.icon}"></i>
                </div>
              </div>
              <h3>${b.title}</h3>
              <p style="font-size: 0.95rem; color: var(--color-charcoal-muted);">${b.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Closing CTA -->
    <section class="section">
      <div class="container">
        <div class="pet-care-cta-box">
          <div class="cta-content-side">
            <div class="section-badge" style="background: rgba(255,255,255,0.15); color: var(--color-warm-cream); border: none;">
              <i class="fa-solid fa-calendar-check"></i>
              <span>Schedule a Visit</span>
            </div>
            <h2>Meet Our Doctors & Tour Our Hospital</h2>
            <p>Schedule a routine wellness exam or consult with our veterinary specialists today.</p>
            <a href="#/book-appointment" class="btn btn-coral btn-lg">
              <i class="fa-solid fa-calendar-check"></i>
              <span>Book an Appointment</span>
            </a>
          </div>

          <div class="cta-img-side">
            <img src="${siteData.images.ctaPet}" alt="Golden retriever pet" class="cta-main-pet-img">
          </div>
        </div>
      </div>
    </section>
  `;
}

export function setupAboutEvents() {}
