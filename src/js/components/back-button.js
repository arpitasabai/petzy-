/* PETZY Reusable Back Button & Navigation Component */

// Smart semantic parent resolver for direct URL entries / refreshes with no prior history
export function getSmartParentRoute(rawHash) {
  const hash = (rawHash || (typeof window !== 'undefined' ? window.location.hash : '') || '#/').replace(/^#/, '');
  const cleanPath = hash.split('?')[0].split('#')[0] || '/';
  
  // 1. Service Details or sub-services -> Services Catalog
  if (cleanPath === '/service-detail' || cleanPath.startsWith('/services/') || cleanPath.startsWith('/service/')) {
    return '#/services';
  }

  // 2. Veterinarian Profiles or sub-veterinarians -> Meet Our Veterinarians
  if (cleanPath === '/veterinarian-profile' || cleanPath.startsWith('/veterinarians/')) {
    return '#/veterinarians';
  }

  // 3. Pet Individual Profile -> Customer Pets Tab
  if (cleanPath === '/pet-profile' || cleanPath.startsWith('/pet-profile/')) {
    return '#/dashboard?tab=pets';
  }

  // 4. Booking / Schedule Appointment -> Customer Appointments Tab or Dashboard
  if (cleanPath === '/schedule-appointment' || cleanPath === '/book-appointment') {
    return '#/dashboard?tab=appointments';
  }

  // 5. Admin Panel Subpages -> Admin Overview or Customer Portal
  if (cleanPath.startsWith('/admin')) {
    if (hash.includes('tab=') && !hash.includes('tab=overview')) {
      return '#/admin?tab=overview';
    }
    return '#/dashboard';
  }

  // 6. Customer Dashboard Subtabs -> Dashboard Overview
  if (cleanPath.startsWith('/dashboard')) {
    if (hash.includes('tab=') && !hash.includes('tab=overview')) {
      return '#/dashboard?tab=overview';
    }
    return '#/';
  }

  // 7. Standard top-level pages -> Home
  return '#/';
}

// Global browser navigation handler
if (typeof window !== 'undefined') {
  window.petzyGoBack = function(fallbackUrl = null) {
    const currentHash = window.location.hash || '#/';
    
    // Check if the user has navigated within this browser session
    const hasHistoryInSession = (window.petzyNavCount && window.petzyNavCount > 1) || (window.history && window.history.length > 2);

    if (hasHistoryInSession) {
      // Use standard browser history back
      window.history.back();
    } else {
      // If direct entry or refreshed page, use smart parent fallback
      const target = fallbackUrl || getSmartParentRoute(currentHash);
      const normalizedTarget = target.startsWith('#') ? target : '#' + target;
      
      if (window.location.hash !== normalizedTarget) {
        window.location.hash = normalizedTarget;
      } else if (typeof window.petzyHandleRoute === 'function') {
        window.petzyHandleRoute();
      }
    }
  };
}

export function renderBackButton(fallbackUrl = null, styleOverrides = '') {
  const safeFallback = fallbackUrl ? `'${fallbackUrl}'` : 'null';
  return `
    <div class="petzy-back-btn-container" style="${styleOverrides}">
      <button type="button" class="petzy-back-btn" onclick="window.petzyGoBack(${safeFallback})" aria-label="Go back to previous page">
        <i class="fa-solid fa-arrow-left petzy-back-arrow"></i>
        <span>Back</span>
      </button>
    </div>
  `;
}
