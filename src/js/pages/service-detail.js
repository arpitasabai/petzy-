/* PETZY Service Detail View (Veterinary Platform) */
import { siteData } from '../data.js';
import { renderBackButton } from '../components/back-button.js';

export function renderServiceDetail() {
  const service = siteData.services[0]; // Veterinary Consultation

  return `
    <!-- Service Hero -->
    <section class="inner-page-hero animate-fade-up">
      <div class="container">
        ${renderBackButton('#/services')}
        <div class="section-badge coral" style="background: var(--color-soft-coral); color: var(--color-white); border: none;">
          <i class="fa-solid fa-stethoscope"></i>
          <span>Clinical Examination</span>
        </div>
        <h1>Veterinary Consultation & Diagnostics</h1>
        <p>Comprehensive nose-to-tail physical health examinations, diagnostic imaging evaluations, and compassionate care tailored to your pet's life stage.</p>
      </div>
    </section>

    <!-- Main Content Layout -->
    <section class="section">
      <div class="container">
        <div class="service-detail-layout">
          
          <!-- Left Column -->
          <div>
            <!-- About The Consultation -->
            <div style="margin-bottom: 2.5rem;">
              <h2 class="section-title">About the Consultation Experience</h2>
              <p style="font-size: 1.05rem; line-height: 1.7; margin-bottom: 1rem;">A veterinary consultation at PETZY is designed to be thorough, low-stress, and collaborative. We understand that visiting the clinic can cause anxiety for some pets, which is why our examination rooms are equipped with pheromone diffusers, warm non-slip mats, and gentle positive-reinforcement treats.</p>
              <p style="font-size: 1.05rem; line-height: 1.7;">Our board-certified veterinarians conduct a complete physical evaluation, review medical history and nutritional habits, and answer every question you have about your pet’s vitality.</p>
            </div>

            <!-- What's Included (8-Point Checklist) -->
            <div style="margin-bottom: 2.5rem;">
              <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--color-forest-green);">What's Included in Every Examination</h3>
              <p style="color: var(--color-charcoal-muted); margin-bottom: 1.25rem;">Our standard comprehensive checkup covers 8 vital clinical points:</p>
              
              <div class="service-checklist-grid">
                <div class="checklist-card">
                  <i class="fa-solid fa-circle-check"></i>
                  <span>Nose-to-Tail Physical Exam</span>
                </div>
                <div class="checklist-card">
                  <i class="fa-solid fa-circle-check"></i>
                  <span>Heart & Lung Auscultation</span>
                </div>
                <div class="checklist-card">
                  <i class="fa-solid fa-circle-check"></i>
                  <span>Oral Health & Dental Grading</span>
                </div>
                <div class="checklist-card">
                  <i class="fa-solid fa-circle-check"></i>
                  <span>Ophthalmic (Eye) & Ear Otoscopy</span>
                </div>
                <div class="checklist-card">
                  <i class="fa-solid fa-circle-check"></i>
                  <span>Abdominal Palpation & Organ Check</span>
                </div>
                <div class="checklist-card">
                  <i class="fa-solid fa-circle-check"></i>
                  <span>Joint Mobility & Musculoskeletal Exam</span>
                </div>
                <div class="checklist-card">
                  <i class="fa-solid fa-circle-check"></i>
                  <span>Skin & Coat Dermal Analysis</span>
                </div>
                <div class="checklist-card">
                  <i class="fa-solid fa-circle-check"></i>
                  <span>Customized Diet & Lifestyle Roadmap</span>
                </div>
              </div>
            </div>

            <!-- Health & Longevity Benefits -->
            <div style="margin-bottom: 2.5rem;">
              <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: var(--color-forest-green);">Health & Longevity Benefits</h3>
              <div class="benefits-grid-4" style="grid-template-columns: 1fr 1fr;">
                <div class="benefit-card-box">
                  <div class="benefit-icon-pill" style="margin-bottom: 0.75rem;"><i class="fa-solid fa-shield-virus"></i></div>
                  <h4>Early Disease Detection</h4>
                  <p style="font-size: 0.92rem; color: var(--color-charcoal-muted); margin: 0;">Catches subtle cardiac, renal, or endocrine changes before symptoms worsen.</p>
                </div>
                <div class="benefit-card-box">
                  <div class="benefit-icon-pill" style="margin-bottom: 0.75rem;"><i class="fa-solid fa-heart-pulse"></i></div>
                  <h4>Optimal Weight & Nutrition</h4>
                  <p style="font-size: 0.92rem; color: var(--color-charcoal-muted); margin: 0;">Preserves joint health and adds years of active vitality to your pet's life.</p>
                </div>
              </div>
            </div>

            <!-- Service Specific FAQ Accordion -->
            <div>
              <h3 style="font-size: 1.5rem; margin-bottom: 1.25rem; color: var(--color-forest-green);">Frequently Asked Questions</h3>
              <div class="accordion-wrapper" id="service-faq-accordion">
                <div class="accordion-item active">
                  <button class="accordion-header">
                    <span>How long does a comprehensive consultation take?</span>
                    <span class="accordion-icon"><i class="fa-solid fa-chevron-down"></i></span>
                  </button>
                  <div class="accordion-content">
                    <p>Our standard examination visits last between 30 to 45 minutes to ensure plenty of time for thorough evaluations and answering all your questions.</p>
                  </div>
                </div>

                <div class="accordion-item">
                  <button class="accordion-header">
                    <span>What should I bring to my pet's consultation?</span>
                    <span class="accordion-icon"><i class="fa-solid fa-chevron-down"></i></span>
                  </button>
                  <div class="accordion-content">
                    <p>Please bring past vaccination history, records of current medications or flea/tick preventatives, and any specific questions you have noted down.</p>
                  </div>
                </div>

                <div class="accordion-item">
                  <button class="accordion-header">
                    <span>Are diagnostic blood tests done during the same visit?</span>
                    <span class="accordion-icon"><i class="fa-solid fa-chevron-down"></i></span>
                  </button>
                  <div class="accordion-content">
                    <p>Yes! With our in-house laboratory suite, routine blood chemistry, hematology, and urinalysis results are available within 15–20 minutes.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Sticky Sidebar Information Box -->
          <div style="position: sticky; top: 110px; background: var(--color-white); border-radius: var(--radius-xl); padding: 2.25rem; border: 1px solid var(--color-border); box-shadow: var(--shadow-lg);">
            <div style="width: 100%; height: 210px; border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 1.5rem;">
              <img src="${service.image}" alt="${service.title}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>

            <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem; color: var(--color-forest-green);">Consultation Details</h3>
            <p style="font-size: 0.95rem; color: var(--color-charcoal-muted); margin-bottom: 1.25rem;">Available for dogs, cats, rabbits, and small companion animals.</p>
            
            <div style="border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); padding: 1rem 0; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.65rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                <span style="color: var(--color-charcoal-muted);">Duration:</span>
                <strong>30 – 45 mins</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                <span style="color: var(--color-charcoal-muted);">Doctor:</span>
                <strong>Board Certified Vet</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                <span style="color: var(--color-charcoal-muted);">Standard:</span>
                <strong>Fear-Free Protocol</strong>
              </div>
            </div>

            <a href="#/contact" class="btn btn-teal" style="width: 100%; margin-bottom: 0.75rem;">
              <i class="fa-solid fa-calendar-check"></i>
              <span>Book an Appointment</span>
            </a>

            <a href="#/services" class="btn btn-outline" style="width: 100%;">
              <span>← Back to All Services</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  `;
}

export function setupServiceDetailEvents() {
  const accordion = document.getElementById('service-faq-accordion');
  if (!accordion) return;

  const items = accordion.querySelectorAll('.accordion-item');
  items.forEach(item => {
    const header = item.querySelector('.accordion-header');
    header?.addEventListener('click', () => {
      const wasActive = item.classList.contains('active');
      items.forEach(i => i.classList.remove('active'));
      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });
}
