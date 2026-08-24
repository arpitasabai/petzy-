/* PETZY About Us View (Milestone 1) */
import { siteData } from '../data.js';

export function renderAbout() {
  return `
    <!-- Page Hero -->
    <section class="page-hero animate-fade-in">
      <div class="container">
        <div class="section-subtitle coral">
          <i class="fa-solid fa-heart"></i>
          <span>Our Story & Mission</span>
        </div>
        <h1>Committed to Healthier, Happier Pets.</h1>
        <p>Founded by passionate veterinarians and lifelong pet parents, PETZY was born from a simple belief: every pet deserves uncompromising quality and compassionate care.</p>
      </div>
    </section>

    <!-- Our Story Section -->
    <section class="section">
      <div class="container">
        <div class="about-story-grid">
          <div class="about-img-composite">
            <img src="${siteData.petImages.storyDogOwner}" alt="PETZY founders with friendly golden retriever" class="about-main-photo">
            <!-- Overlapping dog element -->
            <img src="${siteData.petImages.heroDog}" alt="Golden retriever companion" class="about-overlapping-dog float-gentle">
          </div>

          <div class="about-story-text">
            <div class="section-subtitle">
              <i class="fa-solid fa-sparkles"></i>
              <span>How We Started</span>
            </div>
            <h2 class="section-title">Built From Love, Driven by Veterinary Science.</h2>
            <p style="margin-bottom: 1.25rem;">In 2021, our founding team noticed a concerning trend in the pet industry: mass-produced pet foods packed with chemical preservatives and clinical spaces that made pets feel scared and anxious.</p>
            <p style="margin-bottom: 1.5rem;">We set out to create a sanctuary where pet parents could find 100% transparent organic nutrition, enriching interactive toys, and fear-free grooming and veterinary wellness — all in one modern, friendly destination.</p>
            
            <div style="display: flex; gap: 2rem; border-top: 1px solid var(--color-border); padding-top: 1.5rem;">
              <div>
                <h3 style="font-size: 2rem; color: var(--color-forest-green);">50K+</h3>
                <p style="font-size: 0.9rem;">Happy Pets Cared For</p>
              </div>
              <div>
                <h3 style="font-size: 2rem; color: var(--color-forest-green);">100%</h3>
                <p style="font-size: 0.9rem;">Non-Toxic Vetted</p>
              </div>
              <div>
                <h3 style="font-size: 2rem; color: var(--color-forest-green);">4.9★</h3>
                <p style="font-size: 0.9rem;">Parent Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Our Core Values -->
    <section class="section" style="background-color: var(--color-warm-cream-dark); border-radius: var(--radius-2xl);">
      <div class="container">
        <div class="section-header">
          <div class="section-subtitle coral">
            <i class="fa-solid fa-compass"></i>
            <span>Our Guiding Principles</span>
          </div>
          <h2 class="section-title">Values That Guide Every Wag & Purr</h2>
          <p class="section-desc">Our foundational pillars ensure that your pet receives only the safest, most enriching care possible.</p>
        </div>

        <div class="values-grid">
          ${siteData.values.map(val => `
            <div class="value-card hover-lift">
              <div class="value-icon-box">
                <i class="${val.icon}"></i>
              </div>
              <h3>${val.title}</h3>
              <p>${val.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Brand Philosophy Banner -->
    <section class="section">
      <div class="container">
        <div class="philosophy-banner">
          <div>
            <div class="section-subtitle" style="background: rgba(255,255,255,0.7); color: var(--color-forest-green);">
              <i class="fa-solid fa-leaf"></i>
              <span>Holistic Pet Wellness</span>
            </div>
            <h2 style="margin-bottom: 1rem;">Nurturing Body, Mind & Spirit</h2>
            <p style="font-size: 1.08rem; line-height: 1.7; margin-bottom: 1.5rem;">Just like humans, pets need balanced nutrition, mental stimulation, physical conditioning, and deep emotional security to thrive. That’s why our veterinary specialists and pet nutritionists curate every single item on our shelves.</p>
            <a href="#/services" class="btn btn-forest">
              <span>Explore Our Services</span>
              <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>

          <div style="position: relative;">
            <img src="${siteData.petImages.catCat}" alt="Cat relaxing comfortably" style="width: 100%; height: 320px; object-fit: cover; border-radius: var(--radius-xl); border: 4px solid var(--color-white); box-shadow: var(--shadow-lg);">
          </div>
        </div>
      </div>
    </section>

    <!-- Closing CTA Banner -->
    <section class="section final-cta-section">
      <div class="container">
        <div class="final-cta-card">
          <div class="cta-peeking-rabbit float-gentle">
            <img src="${siteData.petImages.peekingRabbitCta}" alt="Friendly rabbit">
            <span>Join 50,000+ Happy Pet Families</span>
          </div>
          <h2>Ready to Elevate Your Pet's Everyday Life?</h2>
          <p>Join the PETZY family today and experience the difference of pure organic ingredients and loving care.</p>
          <div class="cta-btn-group">
            <a href="#/" class="btn btn-primary btn-lg">
              <i class="fa-solid fa-bag-shopping"></i>
              <span>Shop Pet Essentials</span>
            </a>
            <a href="#/contact" class="btn btn-outline-white btn-lg">
              <i class="fa-solid fa-envelope"></i>
              <span>Get in Touch</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function setupAboutEvents() {
  // Any specific interaction listeners for about page
}
