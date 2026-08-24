/* PETZY Reusable Back Button Component */

// Global navigation helper that gracefully goes back or redirects to parent fallback
if (typeof window !== 'undefined' && !window.petzyGoBack) {
  window.petzyGoBack = function(fallbackUrl = '#/') {
    // Check if there is actual history to go back to in the current session
    if (window.history.length > 1 && window.petzyPreviousRoute) {
      window.history.back();
    } else if (window.history.length > 2) {
      window.history.back();
    } else {
      window.location.hash = fallbackUrl;
    }
  };
}

export function renderBackButton(fallbackUrl = '#/', styleOverrides = '') {
  return `
    <div class="petzy-back-btn-container" style="${styleOverrides}">
      <button type="button" class="petzy-back-btn" onclick="window.petzyGoBack('${fallbackUrl}')" aria-label="Go back to previous page">
        <i class="fa-solid fa-arrow-left petzy-back-arrow"></i>
        <span>Back</span>
      </button>
    </div>
  `;
}
