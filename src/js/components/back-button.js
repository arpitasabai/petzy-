/* PETZY Reusable Back Button & Intelligent Navigation Component */

// Smart semantic parent resolver for when no previous page exists in session
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

// Global router navigation stack
if (typeof window !== 'undefined') {
  if (!window.petzyNavigationStack) {
    window.petzyNavigationStack = [];
  }

  window.petzyRecordRoute = function(fullHash) {
    if (!fullHash) return;
    const normalized = fullHash.startsWith('#') ? fullHash : '#' + fullHash;
    const stack = window.petzyNavigationStack;
    
    // Don't push duplicate if the current top of stack is the same route
    if (stack.length === 0 || stack[stack.length - 1] !== normalized) {
      if (stack.length > 50) stack.shift();
      stack.push(normalized);
    }
  };

  window.petzyGoBack = function(fallbackUrl = null) {
    const currentHash = window.location.hash || '#/';
    const stack = window.petzyNavigationStack;
    
    // Remove current page from top of stack if present
    while (stack.length > 0 && stack[stack.length - 1] === currentHash) {
      stack.pop();
    }
    
    let previousTarget = null;
    if (stack.length > 0) {
      previousTarget = stack.pop();
    }

    // If no valid previous target or same as current, compute smart semantic fallback
    if (!previousTarget || previousTarget === currentHash) {
      previousTarget = fallbackUrl || getSmartParentRoute(currentHash);
    }

    if (!previousTarget.startsWith('#')) {
      previousTarget = '#' + previousTarget;
    }

    // Set navigation flag so handleRoute knows we are going back
    window.petzyIsGoingBack = true;

    if (window.location.hash !== previousTarget) {
      window.location.hash = previousTarget;
    } else if (typeof window.petzyHandleRoute === 'function') {
      window.petzyHandleRoute();
    }

    setTimeout(() => {
      window.petzyIsGoingBack = false;
    }, 80);
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
