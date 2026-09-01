/* Google Sign-In Account Chooser Modal Component (Authentic Google OAuth Flow) */
import { loginOrRegisterWithGoogle } from '../services/auth.js';
import { showToast } from './toast.js';

export function openGoogleAccountChooser(onSuccess) {
  const existing = document.getElementById('google-account-chooser-modal');
  if (existing) existing.remove();

  const modalEl = document.createElement('div');
  modalEl.id = 'google-account-chooser-modal';
  modalEl.className = 'profile-pic-modal-overlay animate-fade-in';
  modalEl.style.cssText = 'position: fixed; inset: 0; background: rgba(0,0,0,0.65); backdrop-filter: blur(5px); z-index: 999999; display: flex !important; align-items: center; justify-content: center; padding: 1rem; opacity: 1 !important; visibility: visible !important;';

  modalEl.innerHTML = `
    <div class="google-auth-card animate-scale-up" style="background: #ffffff; border-radius: 28px; width: 100%; max-width: 440px; padding: 2rem 2.25rem; box-shadow: 0 24px 60px rgba(0,0,0,0.35); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; position: relative;">
      
      <!-- Close Button -->
      <button type="button" id="close-google-chooser-btn" style="position: absolute; top: 1.25rem; right: 1.25rem; background: none; border: none; font-size: 1.2rem; color: #5f6368; cursor: pointer; padding: 0.25rem;" aria-label="Close">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <!-- Google Logo & Title -->
      <div style="text-align: center; margin-bottom: 1.5rem;">
        <svg width="40" height="40" viewBox="0 0 24 24" style="margin-bottom: 0.75rem;">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
        </svg>
        <h2 style="font-size: 1.45rem; font-weight: 500; color: #202124; margin: 0 0 0.4rem; letter-spacing: -0.01em;">Sign in with Google</h2>
        <p style="font-size: 0.95rem; color: #5f6368; margin: 0;">Choose an account to continue to <strong style="color: #1a73e8; font-weight: 600;">PETZY</strong></p>
      </div>

      <!-- Account List -->
      <div id="google-account-list" style="display: flex; flex-direction: column; gap: 0.25rem; margin-bottom: 1.5rem; border-top: 1px solid #dadce0; border-bottom: 1px solid #dadce0; padding: 0.5rem 0;">
        
        <!-- Option 1: Rakesh Singh -->
        <div class="google-acc-item" data-email="rakeshsingh8319@gmail.com" data-name="Rakesh Singh" style="display: flex; align-items: center; gap: 0.9rem; padding: 0.75rem 0.65rem; border-radius: 12px; cursor: pointer; transition: background 0.15s ease;">
          <div style="width: 38px; height: 38px; border-radius: 50%; background: #1a73e8; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 1.1rem; flex-shrink: 0;">
            R
          </div>
          <div style="flex: 1; min-width: 0;">
            <div style="font-size: 0.95rem; font-weight: 600; color: #202124;">Rakesh Singh</div>
            <div style="font-size: 0.82rem; color: #5f6368; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">rakeshsingh8319@gmail.com</div>
          </div>
          <span style="font-size: 0.75rem; color: #1e8e3e; background: #e6f4ea; padding: 0.2rem 0.5rem; border-radius: 10px; font-weight: 500;">Signed in</span>
        </div>

        <!-- Option 2: Samantha Hayes -->
        <div class="google-acc-item" data-email="samantha@petzy.com" data-name="Samantha Hayes" style="display: flex; align-items: center; gap: 0.9rem; padding: 0.75rem 0.65rem; border-radius: 12px; cursor: pointer; transition: background 0.15s ease;">
          <div style="width: 38px; height: 38px; border-radius: 50%; background: #188038; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 1.1rem; flex-shrink: 0;">
            S
          </div>
          <div style="flex: 1; min-width: 0;">
            <div style="font-size: 0.95rem; font-weight: 600; color: #202124;">Samantha Hayes</div>
            <div style="font-size: 0.82rem; color: #5f6368; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">samantha@petzy.com</div>
          </div>
          <span style="font-size: 0.75rem; color: #5f6368; background: #f1f3f4; padding: 0.2rem 0.5rem; border-radius: 10px; font-weight: 500;">Signed in</span>
        </div>

        <!-- Option 3: Use Another Account -->
        <div id="google-use-another-btn" style="display: flex; align-items: center; gap: 0.9rem; padding: 0.75rem 0.65rem; border-radius: 12px; cursor: pointer; transition: background 0.15s ease;">
          <div style="width: 38px; height: 38px; border-radius: 50%; background: #f1f3f4; color: #5f6368; display: flex; align-items: center; justify-content: center; font-size: 1rem; flex-shrink: 0;">
            <i class="fa-solid fa-user-plus"></i>
          </div>
          <div style="flex: 1; font-size: 0.95rem; font-weight: 500; color: #202124;">Use another account</div>
        </div>

      </div>

      <!-- Custom Account Form (Hidden by default) -->
      <form id="google-custom-account-form" style="display: none; margin-bottom: 1.5rem; border-top: 1px solid #dadce0; border-bottom: 1px solid #dadce0; padding: 1rem 0;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <span style="font-size: 0.9rem; font-weight: 600; color: #202124;">Enter Google Account:</span>
          <button type="button" id="google-cancel-custom-btn" style="background: none; border: none; color: #1a73e8; font-size: 0.82rem; font-weight: 600; cursor: pointer;">Back to list</button>
        </div>
        <div style="margin-bottom: 0.75rem;">
          <input type="email" id="g-custom-email" class="form-input" placeholder="Google email (e.g. name@gmail.com)" required style="width: 100%; border: 1.5px solid #dadce0; border-radius: 8px; padding: 0.65rem 0.85rem; font-size: 0.92rem; outline: none;">
        </div>
        <div style="margin-bottom: 0.75rem;">
          <input type="text" id="g-custom-name" class="form-input" placeholder="Your Name (e.g. Alex Morgan)" required style="width: 100%; border: 1.5px solid #dadce0; border-radius: 8px; padding: 0.65rem 0.85rem; font-size: 0.92rem; outline: none;">
        </div>
        <button type="submit" style="width: 100%; background: #1a73e8; color: #ffffff; border: none; border-radius: 8px; padding: 0.75rem; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: background 0.15s ease;">
          Continue to PETZY
        </button>
      </form>

      <!-- OAuth Consent Text -->
      <p style="font-size: 0.78rem; line-height: 1.45; color: #5f6368; margin: 0 0 1.25rem; text-align: left;">
        To continue, Google will share your name, email address, language preference, and profile picture with PETZY. Before using this app, you can review PETZY's <a href="#/privacy-policy" target="_blank" style="color: #1a73e8; text-decoration: none;">privacy policy</a> and <a href="#/terms-conditions" target="_blank" style="color: #1a73e8; text-decoration: none;">terms of service</a>.
      </p>

      <!-- Google Footer -->
      <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #70757a; border-top: 1px solid #f1f3f4; padding-top: 0.75rem;">
        <span>English (United States)</span>
        <div style="display: flex; gap: 0.85rem;">
          <a href="javascript:void(0)" style="color: #70757a; text-decoration: none;">Help</a>
          <a href="javascript:void(0)" style="color: #70757a; text-decoration: none;">Privacy</a>
          <a href="javascript:void(0)" style="color: #70757a; text-decoration: none;">Terms</a>
        </div>
      </div>

    </div>
  `;

  document.body.appendChild(modalEl);

  const closeModal = () => modalEl.remove();

  // Hover effects on account items
  modalEl.querySelectorAll('.google-acc-item, #google-use-another-btn').forEach(el => {
    el.addEventListener('mouseenter', () => el.style.background = '#f8f9fa');
    el.addEventListener('mouseleave', () => el.style.background = 'transparent');
  });

  // Close button & backdrop click
  document.getElementById('close-google-chooser-btn')?.addEventListener('click', closeModal);
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl) closeModal();
  });

  // Account item clicks
  modalEl.querySelectorAll('.google-acc-item').forEach(item => {
    item.addEventListener('click', () => {
      const email = item.getAttribute('data-email');
      const name = item.getAttribute('data-name');
      if (email) {
        selectAccount({ email, name });
      }
    });
  });

  // Use another account button
  const accList = document.getElementById('google-account-list');
  const customForm = document.getElementById('google-custom-account-form');
  document.getElementById('google-use-another-btn')?.addEventListener('click', () => {
    if (accList) accList.style.display = 'none';
    if (customForm) customForm.style.display = 'block';
  });

  document.getElementById('google-cancel-custom-btn')?.addEventListener('click', () => {
    if (customForm) customForm.style.display = 'none';
    if (accList) accList.style.display = 'flex';
  });

  // Custom account form submit
  customForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('g-custom-email')?.value.trim();
    const name = document.getElementById('g-custom-name')?.value.trim();
    if (email) {
      selectAccount({ email, name: name || email.split('@')[0] });
    }
  });

  function selectAccount({ email, name }) {
    closeModal();
    try {
      const user = loginOrRegisterWithGoogle({ email, name });
      showToast(`Signed in with Google as ${user.name} (${user.email})`, 'sage', 'fa-brands fa-google');
      if (typeof onSuccess === 'function') {
        onSuccess(user);
      }
    } catch (err) {
      showToast(err.message || 'Google sign in failed', 'coral', 'fa-solid fa-triangle-exclamation');
    }
  }
}
