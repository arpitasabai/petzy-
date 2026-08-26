/* PETZY Client-Side SPA Router (Dynamic Routes & Milestone 1 + Milestone 2 Pages) */
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
import { renderPrivacyPolicy, setupPrivacyPolicyEvents } from './pages/privacy-policy.js';
import { renderTermsConditions, setupTermsConditionsEvents } from './pages/terms-conditions.js';
import { renderDashboard, setupDashboardEvents } from './pages/dashboard.js';
import { renderPetProfile, setupPetProfileEvents } from './pages/pet-profile.js';
import { renderScheduleAppointment, setupScheduleAppointmentEvents } from './pages/schedule-appointment.js';
import { updateActiveNav } from './components/header.js';
import { getDoctorById, getServiceById } from './data.js';

const routes = {
  '/': { render: renderHome, setup: setupHomeEvents, title: 'PETZY — Because Every Paw Deserves the Best Care' },
  '/about': { render: renderAbout, setup: setupAboutEvents, title: 'About Us — PETZY Veterinary Care' },
  '/services': { render: renderServices, setup: setupServicesEvents, title: 'Services — PETZY Veterinary Hospital' },
  '/service-detail': { render: renderServiceDetail, setup: setupServiceDetailEvents, title: 'Veterinary Consultation — PETZY' },
  '/veterinarians': { render: renderVeterinarians, setup: setupVeterinariansEvents, title: 'Meet Our Veterinary Experts — PETZY' },
  '/veterinarian-profile': { render: renderVeterinarianProfile, setup: setupVeterinarianProfileEvents, title: 'Veterinarian Profile — PETZY' },
  '/contact': { render: renderContact, setup: setupContactEvents, title: 'Contact & Appointments — PETZY Veterinary Hospital' },
  '/faq': { render: renderFaq, setup: setupFaqEvents, title: 'Frequently Asked Questions — PETZY' },
  '/login': { render: renderLogin, setup: setupLoginEvents, title: 'Pet Parent Portal Sign In — PETZY' },
  '/register': { render: renderRegister, setup: setupRegisterEvents, title: 'Register New Patient Account — PETZY' },
  '/dashboard': { render: renderDashboard, setup: setupDashboardEvents, title: 'Customer Dashboard — PETZY Veterinary Care' },
  '/schedule-appointment': { render: renderScheduleAppointment, setup: setupScheduleAppointmentEvents, title: 'Schedule Veterinary Appointment — PETZY' },
  '/book-appointment': { render: renderScheduleAppointment, setup: setupScheduleAppointmentEvents, title: 'Schedule Veterinary Appointment — PETZY' },
  '/privacy-policy': { render: renderPrivacyPolicy, setup: setupPrivacyPolicyEvents, title: 'Privacy Policy — PETZY Veterinary Care' },
  '/privacy': { render: renderPrivacyPolicy, setup: setupPrivacyPolicyEvents, title: 'Privacy Policy — PETZY Veterinary Care' },
  '/terms-conditions': { render: renderTermsConditions, setup: setupTermsConditionsEvents, title: 'Terms & Conditions — PETZY Veterinary Care' },
  '/terms': { render: renderTermsConditions, setup: setupTermsConditionsEvents, title: 'Terms & Conditions — PETZY Veterinary Care' }
};

export function navigateTo(path) {
  window.location.hash = `#${path}`;
}

let currentActiveRoute = null;

export function handleRoute() {
  const fullHash = window.location.hash.slice(1) || '/';
  const cleanPath = fullHash.split('?')[0].split('#')[0] || '/';
  
  if (currentActiveRoute && currentActiveRoute !== cleanPath) {
    window.petzyPreviousRoute = currentActiveRoute;
  }
  currentActiveRoute = cleanPath;

  const appRoot = document.getElementById('app-root');
  if (!appRoot) return;

  // 1. Dynamic veterinarian profile route: /veterinarians/:doctorId
  if (cleanPath.startsWith('/veterinarians/') && cleanPath.length > '/veterinarians/'.length) {
    const doctorId = cleanPath.replace('/veterinarians/', '').replace(/\/$/, '');
    const doctor = getDoctorById(doctorId);
    
    appRoot.innerHTML = renderVeterinarianProfile(doctorId);
    if (typeof setupVeterinarianProfileEvents === 'function') {
      setupVeterinarianProfileEvents();
    }

    document.title = `${doctor.name} (${doctor.title}) — PETZY`;
    updateActiveNav('/veterinarians');
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;
  }

  // 2. Dynamic service detail route: /service-detail?id=... or /services/:serviceId
  if (cleanPath === '/service-detail' || (cleanPath.startsWith('/services/') && cleanPath.length > '/services/'.length)) {
    let serviceId = null;
    if (fullHash.includes('?id=')) {
      serviceId = fullHash.split('?id=')[1]?.split('&')[0];
    } else if (cleanPath.startsWith('/services/')) {
      serviceId = cleanPath.replace('/services/', '').replace(/\/$/, '');
    }
    const service = getServiceById(serviceId);
    
    appRoot.innerHTML = renderServiceDetail(serviceId);
    if (typeof setupServiceDetailEvents === 'function') {
      setupServiceDetailEvents();
    }

    document.title = `${service.title} — PETZY`;
    updateActiveNav('/services');
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;
  }

  // 3. Query/Legacy based veterinarian-profile route: /veterinarian-profile?id=...
  if (cleanPath === '/veterinarian-profile') {
    let doctorId = null;
    if (fullHash.includes('?id=')) {
      doctorId = fullHash.split('?id=')[1]?.split('&')[0];
    }
    const doctor = getDoctorById(doctorId);

    appRoot.innerHTML = renderVeterinarianProfile(doctorId);
    if (typeof setupVeterinarianProfileEvents === 'function') {
      setupVeterinarianProfileEvents();
    }

    document.title = `${doctor.name} (${doctor.title}) — PETZY`;
    updateActiveNav('/veterinarians');
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;
  }

  // 3. Dynamic Individual Pet Profile Route: /pet-profile?id=... or /pet-profile/:id
  if (cleanPath === '/pet-profile' || cleanPath.startsWith('/pet-profile/')) {
    let petId = null;
    if (fullHash.includes('?id=')) {
      petId = fullHash.split('?id=')[1]?.split('&')[0];
    } else if (cleanPath.startsWith('/pet-profile/')) {
      petId = cleanPath.replace('/pet-profile/', '').replace(/\/$/, '');
    }

    appRoot.innerHTML = renderPetProfile(petId);
    if (typeof setupPetProfileEvents === 'function') {
      setupPetProfileEvents(petId);
    }

    document.title = `Pet Health Record — PETZY`;
    updateActiveNav('/dashboard');
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;
  }

  // 4. Standard static routes
  const route = routes[cleanPath] || routes['/'];
  appRoot.innerHTML = route.render();
  if (typeof route.setup === 'function') {
    route.setup();
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
