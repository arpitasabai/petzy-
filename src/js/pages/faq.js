/* PETZY FAQ View (Veterinary Platform) */
import { siteData } from '../data.js';

export function renderFaq() {
  return `
    <!-- Inner Page Hero -->
    <section class="inner-page-hero animate-fade-up">
      <div class="container" style="text-align: center;">
        <div class="section-badge coral" style="background: var(--color-soft-coral); color: var(--color-white); border: none; margin: 0 auto 1rem;">
          <i class="fa-solid fa-circle-question"></i>
          <span>Help & Information</span>
        </div>
        <h1>Frequently Asked Questions</h1>
        <p style="margin: 0 auto;">Everything you need to know about clinic visits, doctor appointments, emergency procedures, and hospital care.</p>
      </div>
    </section>

    <!-- FAQ Search & Accordion Section -->
    <section class="section">
      <div class="container container-narrow">
        
        <!-- Live FAQ Search Filter -->
        <div class="faq-search-wrapper" style="max-width: 580px; margin: 0 auto 2.5rem; position: relative;">
          <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 1.25rem; top: 50%; transform: translateY(-50%); color: var(--color-forest-green); font-size: 1.1rem;"></i>
          <input type="text" id="faq-page-search" placeholder="Search questions (e.g. appointment, emergency, prepare)..." style="width: 100%; padding: 0.95rem 1.25rem 0.95rem 3.25rem; border-radius: var(--radius-full); border: 2px solid var(--color-border); background: var(--color-white); font-family: inherit; font-size: 1rem; outline: none; box-shadow: var(--shadow-sm);">
        </div>

        <!-- Accordions Container -->
        <div class="accordion-wrapper" id="faq-page-accordion">
          ${renderFaqAccordionItems('')}
        </div>

        <!-- Support Card Prompt -->
        <div style="background: var(--color-sage-green-soft); border-radius: var(--radius-2xl); padding: 3rem; text-align: center; margin-top: 4rem; border: 1px solid var(--color-sage-green);">
          <div class="section-badge" style="background: var(--color-white); margin-bottom: 1rem;">
            <i class="fa-solid fa-headset"></i>
            <span>Have More Questions?</span>
          </div>
          <h3 style="font-size: 1.85rem; margin-bottom: 0.75rem; color: var(--color-forest-green);">Our Veterinary Care Desk Is Standing By</h3>
          <p style="max-width: 520px; margin: 0 auto 1.75rem; color: var(--color-charcoal-muted);">Whether you have questions about an upcoming surgery or need routine wellness advice, our team is happy to assist.</p>
          <a href="#/contact" class="btn btn-teal btn-lg">
            <i class="fa-solid fa-envelope"></i>
            <span>Contact Our Team</span>
          </a>
        </div>

      </div>
    </section>
  `;
}

function renderFaqAccordionItems(searchQuery = '') {
  const q = searchQuery.toLowerCase().trim();
  const filtered = siteData.faqs.filter(f => !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));

  if (filtered.length === 0) {
    return `
      <div style="text-align: center; padding: 3rem; background: var(--color-white); border-radius: var(--radius-xl); border: 1px solid var(--color-border);">
        <i class="fa-solid fa-circle-question" style="font-size: 2.5rem; color: var(--color-sage-green); margin-bottom: 1rem;"></i>
        <h4 style="color: var(--color-forest-green); margin-bottom: 0.5rem;">No matching questions found</h4>
        <p style="color: var(--color-charcoal-muted);">Try a different keyword or contact our clinic directly at ${siteData.brand.phone}.</p>
      </div>
    `;
  }

  return filtered.map((faq, idx) => `
    <div class="accordion-item ${idx === 0 ? 'active' : ''}">
      <button class="accordion-header">
        <span>${faq.q}</span>
        <span class="accordion-icon"><i class="fa-solid fa-chevron-down"></i></span>
      </button>
      <div class="accordion-content">
        <p>${faq.a}</p>
      </div>
    </div>
  `).join('');
}

export function setupFaqEvents() {
  const container = document.getElementById('faq-page-accordion');
  const searchInput = document.getElementById('faq-page-search');

  function bindClicks() {
    if (!container) return;
    const items = container.querySelectorAll('.accordion-item');
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

  bindClicks();

  searchInput?.addEventListener('input', (e) => {
    if (container) {
      container.innerHTML = renderFaqAccordionItems(e.target.value);
      bindClicks();
    }
  });
}
