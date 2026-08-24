/* PETZY FAQ View (Milestone 1) */
import { siteData } from '../data.js';

let activeCategory = 'all';

export function renderFaq() {
  return `
    <!-- FAQ Hero -->
    <section class="page-hero animate-fade-in">
      <div class="container" style="text-align: center;">
        <div class="section-subtitle coral" style="margin: 0 auto 1rem;">
          <i class="fa-solid fa-circle-question"></i>
          <span>Help & Answers</span>
        </div>
        <h1>Frequently Asked Questions</h1>
        <p style="margin: 0 auto;">Everything you need to know about our products, veterinary care, grooming appointments, and shipping.</p>
      </div>
    </section>

    <!-- FAQ Search & Categories Filter -->
    <section class="section">
      <div class="container container-narrow">
        
        <!-- Live FAQ Search Input -->
        <div class="faq-search-wrapper">
          <i class="fa-solid fa-magnifying-glass faq-search-icon"></i>
          <input type="text" id="faq-search-input" class="faq-search-input" placeholder="Search questions (e.g., shipping, grooming, ingredients)...">
        </div>

        <!-- Category Tab Filters -->
        <div class="faq-filter-tabs" id="faq-filter-tabs">
          <button class="faq-tab-btn active" data-cat="all">All Questions</button>
          <button class="faq-tab-btn" data-cat="general"><i class="fa-solid fa-sparkles"></i> General</button>
          <button class="faq-tab-btn" data-cat="products"><i class="fa-solid fa-box-open"></i> Products</button>
          <button class="faq-tab-btn" data-cat="services"><i class="fa-solid fa-stethoscope"></i> Services</button>
          <button class="faq-tab-btn" data-cat="account"><i class="fa-solid fa-user-gear"></i> Account</button>
        </div>

        <!-- Accordions Container -->
        <div class="accordion-wrapper" id="main-faq-accordion">
          ${renderFaqList('all')}
        </div>

        <!-- Support Card Prompt -->
        <div style="background: var(--color-sage-green-soft); border-radius: var(--radius-2xl); padding: 3rem; text-align: center; margin-top: 4rem; border: 1px solid var(--color-sage-green);">
          <div class="cta-peeking-rabbit float-gentle" style="position: static; transform: none; display: inline-flex; margin-bottom: 1.5rem;">
            <img src="${siteData.petImages.heroMiniCat}" alt="Curious cat">
            <span>Can't find what you're looking for?</span>
          </div>
          <h3 style="font-size: 1.85rem; margin-bottom: 0.75rem; color: var(--color-forest-green);">We're Always Here to Help!</h3>
          <p style="max-width: 500px; margin: 0 auto 1.75rem; color: var(--color-charcoal-muted);">Our knowledgeable pet care specialists are on standby to answer any questions about your specific pet's needs.</p>
          <a href="#/contact" class="btn btn-primary btn-lg">
            <i class="fa-solid fa-envelope"></i>
            <span>Contact Customer Care</span>
          </a>
        </div>

      </div>
    </section>
  `;
}

function renderFaqList(category = 'all', searchQuery = '') {
  let items = [];
  const q = searchQuery.toLowerCase().trim();

  const categoriesToPull = category === 'all' 
    ? ['general', 'products', 'services', 'account'] 
    : [category];

  categoriesToPull.forEach(catKey => {
    const list = siteData.faqs[catKey] || [];
    list.forEach(item => {
      if (!q || item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q)) {
        items.push({ ...item, cat: catKey });
      }
    });
  });

  if (items.length === 0) {
    return `
      <div style="text-align: center; padding: 3rem 1.5rem; background: var(--color-white); border-radius: var(--radius-xl);">
        <i class="fa-solid fa-paw" style="font-size: 2.5rem; color: var(--color-sage-green); margin-bottom: 1rem;"></i>
        <h4 style="color: var(--color-forest-green); margin-bottom: 0.5rem;">No matching questions found</h4>
        <p style="color: var(--color-charcoal-muted);">Try searching with different keywords or contact our team directly.</p>
      </div>
    `;
  }

  return items.map((faq, index) => `
    <div class="accordion-item ${index === 0 ? 'active' : ''}">
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
  const container = document.getElementById('main-faq-accordion');
  const searchInput = document.getElementById('faq-search-input');
  const tabBtns = document.querySelectorAll('.faq-tab-btn');

  // Bind accordion collapse/expand
  function bindAccordionClicks() {
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

  bindAccordionClicks();

  // Tab Filtering
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.getAttribute('data-cat') || 'all';
      if (container) {
        container.innerHTML = renderFaqList(activeCategory, searchInput?.value || '');
        bindAccordionClicks();
      }
    });
  });

  // Search Filtering
  searchInput?.addEventListener('input', (e) => {
    if (container) {
      container.innerHTML = renderFaqList(activeCategory, e.target.value);
      bindAccordionClicks();
    }
  });
}
