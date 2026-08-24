/* PETZY Service Detail View (Milestone 1) */
import { siteData } from '../data.js';

export function renderServiceDetail() {
  const service = siteData.services[0]; // Signature Spa Grooming & Styling

  return `
    <!-- Service Hero -->
    <section class="service-detail-hero animate-fade-in">
      <div class="container">
        <div class="section-subtitle coral">
          <i class="fa-solid fa-scissors"></i>
          <span>Service Deep Dive</span>
        </div>
        <h1>Signature Spa Grooming & Styling</h1>
        <p>A tranquil, therapeutic pampering experience featuring warm hydro-massage baths, organic botanicals, gentle deshedding, and breed-standard artisan scissoring.</p>
      </div>
    </section>

    <!-- Main Content Layout -->
    <section class="section">
      <div class="container">
        <div class="service-detail-layout">
          
          <!-- Main Content -->
          <div class="service-detail-main">
            
            <!-- About The Service -->
            <div>
              <h2 class="section-title">About the Signature Spa Experience</h2>
              <p style="margin-bottom: 1rem;">At PETZY, grooming is more than hygiene — it is a therapeutic wellness ritual. Our salons are specially crafted with sound-insulating acoustics, non-slip ergonomic hydraulic tables, and private drying suites to minimize sensory overwhelm.</p>
              <p>Every session begins with a personalized nose-to-tail coat and skin evaluation by our Master Certified Groomer to select the exact botanical formulations matched to your pet’s dermal pH and coat texture.</p>
            </div>

            <!-- What's Included (Interactive Checklist) -->
            <div>
              <h3 style="margin-bottom: 0.5rem; font-size: 1.5rem;">What's Included in Every Session</h3>
              <p style="margin-bottom: 1rem; color: var(--color-charcoal-muted);">Comprehensive 8-point care included as standard with no hidden add-on fees:</p>
              
              <div class="included-checklist">
                <div class="checklist-item">
                  <i class="fa-solid fa-circle-check"></i>
                  <span>Warm Hydro-Surge Massage Bath</span>
                </div>
                <div class="checklist-item">
                  <i class="fa-solid fa-circle-check"></i>
                  <span>Organic Blueberry Brightening Facial</span>
                </div>
                <div class="checklist-item">
                  <i class="fa-solid fa-circle-check"></i>
                  <span>Deep Coat Conditioner & Fluff Dry</span>
                </div>
                <div class="checklist-item">
                  <i class="fa-solid fa-circle-check"></i>
                  <span>Gentle Undercoat Deshedding</span>
                </div>
                <div class="checklist-item">
                  <i class="fa-solid fa-circle-check"></i>
                  <span>Precision Breed Hand-Scissor Styling</span>
                </div>
                <div class="checklist-item">
                  <i class="fa-solid fa-circle-check"></i>
                  <span>Nail Trimming & Dremel Polishing</span>
                </div>
                <div class="checklist-item">
                  <i class="fa-solid fa-circle-check"></i>
                  <span>Ear Cleansing & Sanitary Trim</span>
                </div>
                <div class="checklist-item">
                  <i class="fa-solid fa-circle-check"></i>
                  <span>Moisturizing Organic Paw Pad Balm</span>
                </div>
              </div>
            </div>

            <!-- Benefits -->
            <div>
              <h3 style="margin-bottom: 0.75rem; font-size: 1.5rem;">Health & Wellness Benefits</h3>
              <div class="service-benefits-grid" style="margin-top: 1rem;">
                <div class="benefit-card">
                  <div class="benefit-icon"><i class="fa-solid fa-shield-virus"></i></div>
                  <h4>Dermal Health & Protection</h4>
                  <p style="font-size: 0.92rem;">Removes environmental allergens, dead dander, and trapped debris to prevent itchy hot spots and infections.</p>
                </div>
                <div class="benefit-card">
                  <div class="benefit-icon"><i class="fa-solid fa-heart-pulse"></i></div>
                  <h4>Stimulated Circulation</h4>
                  <p style="font-size: 0.92rem;">Gentle hydrotherapy massage stimulates blood flow to hair follicles, promoting glossy, resilient coat growth.</p>
                </div>
              </div>
            </div>

            <!-- Why Choose PETZY Comparison -->
            <div>
              <h3 style="margin-bottom: 1rem; font-size: 1.5rem;">Why Choose PETZY for Grooming</h3>
              <div class="why-petzy-cards">
                <div class="why-petzy-card">
                  <h4><i class="fa-solid fa-check" style="color: var(--color-forest-green);"></i> Fear-Free Certified</h4>
                  <p style="font-size: 0.9rem; color: var(--color-charcoal-muted);">Our groomers are trained in body language cues, using calming positive reinforcement without rushing.</p>
                </div>
                <div class="why-petzy-card">
                  <h4><i class="fa-solid fa-check" style="color: var(--color-forest-green);"></i> Cage-Free Comfort</h4>
                  <p style="font-size: 0.9rem; color: var(--color-charcoal-muted);">Pets are never left unattended in noisy drying crates. Every pet receives dedicated 1-on-1 stylist care.</p>
                </div>
              </div>
            </div>

            <!-- Service Specific FAQ Accordion -->
            <div>
              <h3 style="margin-bottom: 1.25rem; font-size: 1.5rem;">Frequently Asked Questions</h3>
              <div class="accordion-wrapper" id="service-faq-accordion">
                <div class="accordion-item active">
                  <button class="accordion-header">
                    <span>How long does a full spa grooming session take?</span>
                    <span class="accordion-icon"><i class="fa-solid fa-chevron-down"></i></span>
                  </button>
                  <div class="accordion-content">
                    <p>A full signature spa session typically takes 90 to 120 minutes depending on your pet's coat length, thickness, and breed styling requirements. We never rush the process.</p>
                  </div>
                </div>

                <div class="accordion-item">
                  <button class="accordion-header">
                    <span>What if my pet gets anxious around clippers or driers?</span>
                    <span class="accordion-icon"><i class="fa-solid fa-chevron-down"></i></span>
                  </button>
                  <div class="accordion-content">
                    <p>We use ultra-quiet variable-speed dryers, soothing lavender pheromone therapy, and gentle towel-blotting techniques. We take gentle break intervals whenever needed.</p>
                  </div>
                </div>

                <div class="accordion-item">
                  <button class="accordion-header">
                    <span>Can I bring my pet’s prescribed medicated shampoo?</span>
                    <span class="accordion-icon"><i class="fa-solid fa-chevron-down"></i></span>
                  </button>
                  <div class="accordion-content">
                    <p>Absolutely! If your veterinarian has prescribed a specific dermatological wash, our stylists will apply it following exact contact time instructions.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Sticky Sidebar Information Box -->
          <div class="service-detail-sidebar">
            <div style="width: 100%; height: 200px; border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 1.5rem;">
              <img src="${siteData.petImages.catDog}" alt="Clean happy groomed dog" style="width: 100%; height: 100%; object-fit: cover;">
            </div>

            <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem; color: var(--color-forest-green);">Signature Spa Overview</h3>
            <p style="font-size: 0.95rem; color: var(--color-charcoal-muted); margin-bottom: 1.25rem;">Customized for small, medium, and large dog breeds & long-haired cats.</p>
            
            <div style="border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); padding: 1rem 0; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.65rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                <span style="color: var(--color-charcoal-muted);">Typical Duration:</span>
                <strong>90 – 120 mins</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                <span style="color: var(--color-charcoal-muted);">Stylist Level:</span>
                <strong>Master Certified</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                <span style="color: var(--color-charcoal-muted);">Products Used:</span>
                <strong>100% Organic Eco-Cert</strong>
              </div>
            </div>

            <a href="#/contact" class="btn btn-primary" style="width: 100%; margin-bottom: 0.75rem;">
              <i class="fa-solid fa-envelope"></i>
              <span>Inquire About Care</span>
            </a>

            <a href="#/services" class="btn btn-outline" style="width: 100%;">
              <span>← Back to All Services</span>
            </a>
          </div>

        </div>
      </div>
    </section>

    <!-- Closing CTA -->
    <section class="section final-cta-section">
      <div class="container">
        <div class="final-cta-card">
          <div class="cta-peeking-rabbit float-gentle">
            <img src="${siteData.petImages.peekingRabbitCta}" alt="Rabbit">
            <span>Fresh, Soft & Happy Pets</span>
          </div>
          <h2>Ready to Treat Your Pet to the Ultimate Spa Day?</h2>
          <p>Contact our concierge care desk to learn more about our Fear-Free grooming sessions and customized styling options.</p>
          <div class="cta-btn-group">
            <a href="#/contact" class="btn btn-primary btn-lg">
              <i class="fa-solid fa-phone"></i>
              <span>Contact Care Concierge</span>
            </a>
            <a href="#/" class="btn btn-outline-white btn-lg">
              <i class="fa-solid fa-bag-shopping"></i>
              <span>Shop Pet Grooming Essentials</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function setupServiceDetailEvents() {
  // Accordion Expand/Collapse Logic
  const accordion = document.getElementById('service-faq-accordion');
  if (!accordion) return;

  const items = accordion.querySelectorAll('.accordion-item');
  items.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header.addEventListener('click', () => {
      const wasActive = item.classList.contains('active');
      items.forEach(i => i.classList.remove('active'));
      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });
}
