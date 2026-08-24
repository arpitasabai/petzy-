/* PETZY Register View (Milestone 1) */
import { siteData } from '../data.js';
import { showToast } from '../components/toast.js';

export function renderRegister() {
  return `
    <div class="auth-page-wrap animate-fade-in">
      <div class="auth-container">
        
        <!-- Realistic Pet Companion Peeking Over Card -->
        <div class="auth-peeking-pet float-gentle" title="Excited puppy ready to welcome you">
          <img src="${siteData.petImages.storyPuppy}" alt="Friendly puppy">
        </div>

        <div class="auth-card">
          <div class="auth-header">
            <div class="section-subtitle coral" style="margin-bottom: 0.5rem;">
              <i class="fa-solid fa-sparkles"></i>
              <span>Join The Family</span>
            </div>
            <h2>Create Your PETZY Account</h2>
            <p>Enjoy 15% off your first order, curated pet advice, and priority care concierge.</p>
          </div>

          <!-- Continue With Google Mock Button -->
          <button class="oauth-btn" id="register-google-btn">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
            </svg>
            <span>Sign Up with Google</span>
          </button>

          <div class="auth-divider">or register with email</div>

          <!-- Registration Form -->
          <form id="petzy-register-form">
            <div class="form-group">
              <label class="form-label" for="reg-name">Full Name *</label>
              <input type="text" id="reg-name" class="form-input" placeholder="e.g. Samantha Hayes" required>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="reg-email">Email Address *</label>
                <input type="email" id="reg-email" class="form-input" placeholder="samantha@example.com" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="reg-phone">Phone Number</label>
                <input type="tel" id="reg-phone" class="form-input" placeholder="(555) 000-0000">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label" for="reg-password">Password *</label>
                <input type="password" id="reg-password" class="form-input" placeholder="At least 8 characters" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="reg-confirm-password">Confirm Password *</label>
                <input type="password" id="reg-confirm-password" class="form-input" placeholder="Repeat password" required>
              </div>
            </div>

            <div style="margin-bottom: 1.5rem;">
              <label class="remember-label" style="font-size: 0.85rem;">
                <input type="checkbox" required checked style="accent-color: var(--color-forest-green);">
                <span>I agree to the <a href="javascript:void(0)" style="color: var(--color-forest-green); text-decoration: underline;">Terms of Service</a> & <a href="javascript:void(0)" style="color: var(--color-forest-green); text-decoration: underline;">Privacy Policy</a></span>
              </label>
            </div>

            <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;" id="register-submit-btn">
              <i class="fa-solid fa-user-plus"></i>
              <span>Create Account</span>
            </button>
          </form>

          <div class="auth-switch-link">
            Already have an account? <a href="#/login">Sign In here</a>
          </div>
        </div>

      </div>
    </div>
  `;
}

export function setupRegisterEvents() {
  const form = document.getElementById('petzy-register-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name')?.value || 'Pet Parent';
    const pwd = document.getElementById('reg-password')?.value;
    const confirmPwd = document.getElementById('reg-confirm-password')?.value;

    if (pwd !== confirmPwd) {
      showToast('Passwords do not match. Please re-enter.', 'coral', 'fa-solid fa-triangle-exclamation');
      return;
    }

    showToast(`Welcome to the family, ${name}! Your PETZY account is ready.`, 'coral', 'fa-solid fa-circle-check');
    setTimeout(() => {
      window.location.hash = '#/';
    }, 1500);
  });

  const googleBtn = document.getElementById('register-google-btn');
  googleBtn?.addEventListener('click', () => {
    showToast('Signed up via Google successfully! Welcome to PETZY.', 'sage', 'fa-brands fa-google');
    setTimeout(() => {
      window.location.hash = '#/';
    }, 1500);
  });
}
