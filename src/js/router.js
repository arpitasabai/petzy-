/* PETZY Client-Side Router */
import { renderHome, setupHomeEvents } from './pages/home.js';
import { renderAbout, setupAboutEvents } from './pages/about.js';
import { renderServices, setupServicesEvents } from './pages/services.js';
import { renderServiceDetail, setupServiceDetailEvents } from './pages/service-detail.js';
import { renderContact, setupContactEvents } from './pages/contact.js';
import { renderFaq, setupFaqEvents } from './pages/faq.js';
import { renderLogin, setupLoginEvents } from './pages/login.js';
import { renderRegister, setupRegisterEvents } from './pages/register.js';
import { updateActiveNav } from './components/header.js';

const routes = {
  '/': { render: renderHome, setup: setupHomeEvents, title: 'PETZY — Everything Your Pet Needs, All in One Place' },
  '/about': { render: renderAbout, setup: setupAboutEvents, title: 'About Us — PETZY Pet Care & Mission' },
  '/services': { render: renderServices, setup: setupServicesEvents, title: 'Services — PETZY Spa Grooming & Veterinary Care' },
  '/service-detail': { render: renderServiceDetail, setup: setupServiceDetailEvents, title: 'Signature Spa Grooming — PETZY Care' },
  '/contact': { render: renderContact, setup: setupContactEvents, title: 'Contact Us — PETZY Pet Care Concierge' },
  '/faq': { render: renderFaq, setup: setupFaqEvents, title: 'FAQ & Help — PETZY' },
  '/login': { render: renderLogin, setup: setupLoginEvents, title: 'Sign In — PETZY' },
  '/register': { render: renderRegister, setup: setupRegisterEvents, title: 'Create Account — PETZY' }
};

export function navigateTo(path) {
  window.location.hash = `#${path}`;
}

export function handleRoute() {
  const hash = window.location.hash.slice(1) || '/';
  // Strip query or sub-anchors
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
