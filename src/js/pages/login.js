/* PETZY Login View (Milestone 1) */
import { siteData } from '../data.js';
import { showToast } from '../components/toast.js';

export function renderLogin() {
  return `
    <div class="auth-page-wrap animate-fade-in">
      <div class="auth-container">
        
        <!-- Realistic Pet Peeking Over Login Card -->
        <div class="auth-peeking-pet float-gentle" title="Friendly companion watching over your account">
          <img src="${siteData.petImages.catCat}" alt="Cute peeking cat">
        </div>

        <div class="auth-card">
          <div class="auth-header">
            <div class="section-subtitle" style="margin-bottom: 0.5rem;">
              <i class="fa-solid fa-lock"></i>
              <span>Welcome Back</span>
            </div>
            <h2>Sign In to PETZY</h2>
            <p>Access your pet’s favorite treats, saved wishlist, and care notes.</p>
          </div>

          <!-- Continue With Google Mock Button -->
          <button class="oauth-btn" id="google-auth-btn">
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
              <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
              <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
            </svg>
            <span>Continue with Google</span>
          </button>

          <div class="auth-divider">or sign in with email</div>

          <!-- Sign In Form -->
          <form id="petzy-login-form">
            <div class="form-group">
              <label class="form-label" for="login-email">Email Address</label>
              <input type="email" id="login-email" class="form-input" placeholder="you@domain.com" required value="parent@petzy.com">
            </div>

            <div class="form-group">
              <label class="form-label" for="login-password">Password</label>
              <input type="password" id="login-password" class="form-input" placeholder="••••••••" required value="password123">
            </div>

            <div class="auth-row-options">
              <label class="remember-label">
                <input type="checkbox" checked style="accent-color: var(--color-forest-green);">
                <span>Remember me</span>
              </label>
              <a href="javascript:void(0)" class="forgot-link" id="forgot-password-link">Forgot password?</a>
            </div>

            <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;" id="login-submit-btn">
              <i class="fa-solid fa-right-to-bracket"></i>
              <span>Sign In</span>
            </button>
          </form>

          <div class="auth-switch-link">
            Don't have a PETZY account yet? <a href="#/register">Create Account</a>
          </div>
        </div>

      </div>
    </div>
  `;
}

export function setupLoginEvents() {
  const form = document.getElementById('petzy-login-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email')?.value || 'Pet Parent';
    showToast(`Welcome back, ${email.split('@')[0]}! Signed in successfully.`, 'coral', 'fa-solid fa-circle-check');
    setTimeout(() => {
      window.location.hash = '#/';
    }, 1200);
  });

  const googleBtn = document.getElementById('google-auth-btn');
  googleBtn?.addEventListener('click', () => {
    showToast('Signed in via Google successfully!', 'sage', 'fa-brands fa-google');
    setTimeout(() => {
      window.location.hash = '#/';
    }, 1200);
  });

  const forgotBtn = document.getElementById('forgot-password-link');
  forgotBtn?.addEventListener('click', () => {
    showToast('Password reset link sent to your registered email.', 'coral', 'fa-solid fa-paper-plane');
  });
}
