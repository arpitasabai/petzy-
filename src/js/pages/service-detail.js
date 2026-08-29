/* PETZY Dynamic Service Detail View (Veterinary Platform) */
import { siteData } from '../data.js';
import { getServiceById } from '../services/storage.js';
import { renderBackButton } from '../components/back-button.js';

export function renderServiceDetail(serviceId) {
  // Extract serviceId from parameter or URL hash
  let targetId = serviceId;
  if (!targetId) {
    const hash = window.location.hash || '';
    if (hash.includes('?id=')) {
      targetId = hash.split('?id=')[1]?.split('&')[0];
    } else if (hash.includes('/services/')) {
      targetId = hash.split('/services/')[1]?.split('?')[0]?.split('#')[0];
    }
  }

  const service = getServiceById(targetId);

  // Fallback defaults if not set
  const inclusions = service.inclusions || [
    "Comprehensive Physical Examination",
    "Vital Signs & Clinical Evaluation",
    "Specialist Consultation & Guidance",
    "Preventive Health Plan",
    "Medical Record Documentation",
    "Patient Monitoring Protocol",
    "Nutrition & Wellness Assessment",
    "Post-Visit Home Care Roadmap"
  ];

  const benefits = service.benefits || [
    {
      icon: "fa-solid fa-shield-virus",
      title: "Clinical Excellence",
      desc: "Delivered by board-certified veterinarians with low-stress handling protocols."
    },
    {
      icon: "fa-solid fa-heart-pulse",
      title: "Tailored Patient Care",
      desc: "Customized specifically to your pet's life stage, breed, and health requirements."
    }
  ];

  const faqs = service.faqs || [
    {
      question: `How long does ${service.title} take?`,
      answer: `The average procedure duration is ${service.duration || '30 to 45 minutes'} depending on patient requirements.`
    },
    {
      question: "How should I prepare my pet for this appointment?",
      answer: "Please bring any previous medical or vaccination records and ensure your pet is secure in a carrier or on a leash."
    },
    {
      question: "Can I book this service online?",
      answer: "Yes! You can choose your pet, select your preferred veterinarian, and reserve an available time slot instantly online."
    }
  ];

  return `
    <!-- Service Hero -->
    <section class="inner-page-hero animate-fade-up">
      <div class="container">
        ${renderBackButton('#/services')}
        <div class="section-badge coral" style="background: var(--color-soft-coral); color: var(--color-white); border: none;">
          <i class="${service.icon || 'fa-solid fa-stethoscope'}"></i>
          <span>${service.badge || 'Clinical Care'}</span>
        </div>
        <h1>${service.title}</h1>
        <p>${service.shortDesc || service.description}</p>
      </div>
    </section>

    <!-- Main Content Layout -->
    <section class="section">
      <div class="container">
        <div class="service-detail-layout">
          
          <!-- Left Column -->
          <div>
            <!-- About The Service -->
            <div style="margin-bottom: 2.5rem;">
              <h2 class="section-title">About the ${service.title} Experience</h2>
              <p style="font-size: 1.05rem; line-height: 1.7; margin-bottom: 1rem;">${service.description}</p>
              ${service.procedureDetail ? `
                <div style="background: var(--color-warm-cream); padding: 1rem 1.25rem; border-radius: var(--radius-md); border-left: 4px solid var(--color-forest-green); margin-top: 1rem;">
                  <strong style="color: var(--color-forest-green); font-size: 0.95rem;">
                    <i class="${service.icon || 'fa-solid fa-circle-info'}" style="margin-right: 0.4rem; color: var(--color-soft-coral);"></i>
                    Clinical Protocol:
                  </strong>
                  <span style="font-size: 0.92rem; color: var(--color-charcoal);">${service.procedureDetail}</span>
                </div>
              ` : ''}
            </div>

            <!-- What's Included (8-Point Checklist) -->
            <div style="margin-bottom: 2.5rem;">
              <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--color-forest-green);">What's Included in This Service</h3>
              <p style="color: var(--color-charcoal-muted); margin-bottom: 1.25rem;">Our standard protocol covers 8 vital clinical points:</p>
              
              <div class="service-checklist-grid">
                ${inclusions.map(inc => `
                  <div class="checklist-card">
                    <i class="fa-solid fa-circle-check"></i>
                    <span>${inc}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Health & Longevity Benefits -->
            <div style="margin-bottom: 2.5rem;">
              <h3 style="font-size: 1.5rem; margin-bottom: 1rem; color: var(--color-forest-green);">Health & Longevity Benefits</h3>
              <div class="benefits-grid-4" style="grid-template-columns: 1fr 1fr;">
                ${benefits.map(b => `
                  <div class="benefit-card-box">
                    <div class="benefit-icon-pill" style="margin-bottom: 0.75rem;"><i class="${b.icon}"></i></div>
                    <h4>${b.title}</h4>
                    <p style="font-size: 0.92rem; color: var(--color-charcoal-muted); margin: 0;">${b.desc}</p>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Service Specific FAQ Accordion -->
            <div>
              <h3 style="font-size: 1.5rem; margin-bottom: 1.25rem; color: var(--color-forest-green);">Frequently Asked Questions</h3>
              <div class="accordion-wrapper" id="service-faq-accordion">
                ${faqs.map((faq, idx) => `
                  <div class="accordion-item ${idx === 0 ? 'active' : ''}">
                    <button class="accordion-header">
                      <span>${faq.question}</span>
                      <span class="accordion-icon"><i class="fa-solid fa-chevron-down"></i></span>
                    </button>
                    <div class="accordion-content">
                      <p>${faq.answer}</p>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

          </div>

          <!-- Sticky Sidebar Information Box -->
          <div style="position: sticky; top: 110px; background: var(--color-white); border-radius: var(--radius-xl); padding: 2.25rem; border: 1px solid var(--color-border); box-shadow: var(--shadow-lg); align-self: flex-start;">
            <div style="width: 100%; height: 210px; border-radius: var(--radius-lg); overflow: hidden; margin-bottom: 1.5rem;">
              <img src="${service.image}" alt="${service.title}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>

            <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem; color: var(--color-forest-green);">${service.title}</h3>
            <p style="font-size: 0.95rem; color: var(--color-charcoal-muted); margin-bottom: 1.25rem;">Available for dogs, cats, and companion pets.</p>
            
            <div style="border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); padding: 1rem 0; margin-bottom: 1.5rem; display: flex; flex-direction: column; gap: 0.65rem;">
              <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                <span style="color: var(--color-charcoal-muted);">Duration:</span>
                <strong>${service.duration || '30 Mins'}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                <span style="color: var(--color-charcoal-muted);">Price / Fee:</span>
                <strong style="color: var(--color-forest-green); font-size: 1.05rem;">${service.price || '$55'}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                <span style="color: var(--color-charcoal-muted);">Location:</span>
                <strong>${service.room || 'Main Clinical Wing'}</strong>
              </div>
              <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                <span style="color: var(--color-charcoal-muted);">Protocol:</span>
                <strong>Fear-Free Certified</strong>
              </div>
            </div>

            <a href="#/book-appointment?service=${service.id}" class="btn btn-teal" style="width: 100%; margin-bottom: 0.75rem;">
              <i class="fa-solid fa-calendar-check"></i>
              <span>Book This Service</span>
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
