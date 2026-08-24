/* PETZY Main Application Initializer */
import { renderHeader } from './js/components/header.js';
import { renderFooter } from './js/components/footer.js';
import { initRouter } from './js/router.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Render Global Layout Components
  renderHeader();
  renderFooter();

  // 2. Initialize Client Router
  initRouter();

  // 3. Setup Global Anchor Smooth Scroll Handler
  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (href && href.startsWith('#featured-products')) {
      const target = document.getElementById('featured-products');
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });

  console.log('🐾 PETZY Web Application Initialized — Milestone 1');
});
