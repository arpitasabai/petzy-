/* PETZY Client-Side SPA Router (10 Milestone 1 Pages) */
import { renderHome, setupHomeEvents } from './pages/home.js';
import { renderAbout, setupAboutEvents } from './pages/about.js';
import { renderServices, setupServicesEvents } from './pages/services.js';
import { renderServiceDetail, setupServiceDetailEvents } from './pages/service-detail.js';
import { renderVeterinarians, setupVeterinariansEvents } from './pages/veterinarians.js';
import { renderVeterinarianProfile, setupVeterinarianProfileEvents } from './pages/veterinarian-profile.js';
import { renderContact, setupContactEvents } from './pages/contact.js';
import { renderFaq, setupFaqEvents } from './pages/faq.js';
import { renderLogin, setupLoginEvents } from './pages/login.js';
import { renderRegister, setupRegisterEvents } from './pages/register.js';
import { updateActiveNav } from './components/header.js';

const routes = {
  '/': { render: renderHome, setup: setupHomeEvents, title: 'PETZY — Because Every Paw Deserves the Best Care' },
  '/about': { render: renderAbout, setup: setupAboutEvents, title: 'About Us — PETZY Veterinary Care' },
  '/services': { render: renderServices, setup: setupServicesEvents, title: 'Services — PETZY Veterinary Hospital' },
  '/service-detail': { render: renderServiceDetail, setup: setupServiceDetailEvents, title: 'Veterinary Consultation — PETZY' },
  '/veterinarians': { render: renderVeterinarians, setup: setupVeterinariansEvents, title: 'Meet Our Veterinary Experts — PETZY' },
  '/veterinarian-profile': { render: renderVeterinarianProfile, setup: setupVeterinarianProfileEvents, title: 'Dr. Ananya Sharma — PETZY Chief Surgeon' },
  '/contact': { render: renderContact, setup: setupContactEvents, title: 'Contact & Appointments — PETZY Veterinary Hospital' },
  '/faq': { render: renderFaq, setup: setupFaqEvents, title: 'Frequently Asked Questions — PETZY' },
  '/login': { render: renderLogin, setup: setupLoginEvents, title: 'Pet Parent Portal Sign In — PETZY' },
  '/register': { render: renderRegister, setup: setupRegisterEvents, title: 'Register New Patient Account — PETZY' }
};

export function navigateTo(path) {
  window.location.hash = `#${path}`;
}

export function handleRoute() {
  const hash = window.location.hash.slice(1) || '/';
  const cleanPath = hash.split('?')[0].split('#')[0] || '/';
  
  const route = routes[cleanPath] || routes['/'];
  const appRoot = document.getElementById('app-root');

  if (appRoot) {
    appRoot.innerHTML = route.render();
    if (typeof route.setup === 'function') {
      route.setup();
    }
  }

  // Update Page Title
  document.title = route.title;

  // Update Active Header Links
  updateActiveNav(cleanPath);

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'instant' });
}

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}
