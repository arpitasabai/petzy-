/* PETZY Login View (Veterinary Platform) */
import { loginUser, loginAsDemoUser, getCurrentUser, getRememberedEmail } from '../services/auth.js';
import { showToast } from '../components/toast.js';
import { renderBackButton } from '../components/back-button.js';

export function renderLogin() {
  const currentUser = getCurrentUser();
  if (currentUser) {
    setTimeout(() => {
      window.location.hash = '#/dashboard';
    }, 10);
    return `<div class="auth-page-wrapper"><p>Redirecting to dashboard...</p></div>`;
  }

  const rememberedEmail = getRememberedEmail();

  return `
    <div class="auth-page-wrapper animate-fade-up">
      <div class="auth-card-box">
        <div style="display: flex; justify-content: flex-start; margin-bottom: 1rem;">
          ${renderBackButton('#/')}
        </div>
        <div class="auth-card-header">
          <div class="section-badge" style="margin-bottom: 0.5rem;">
            <i class="fa-solid fa-lock"></i>
            <span>Pet Parent Portal</span>
          </div>
          <h2 style="font-size: 1.95rem; color: var(--color-forest-green); margin-bottom: 0.35rem;">Sign In to PETZY</h2>
          <p style="font-size: 0.95rem; color: var(--color-charcoal-muted);">Access your pet's vaccination records, appointment history, and doctor care plans.</p>
        </div>

        <!-- Google OAuth Mock Button -->
        <button class="oauth-google-btn" id="google-auth-btn">
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.616z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.039l3.007-2.332z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <div class="auth-or-divider">or sign in with email</div>

        <!-- Form -->
        <form id="petzy-login-form">
          <div class="form-group">
            <label class="form-label" for="login-email">Email Address *</label>
            <input type="email" id="login-email" class="form-input" placeholder="parent@example.com" required value="${rememberedEmail}">
          </div>

          <div class="form-group">
            <label class="form-label" for="login-password">Password *</label>
            <div class="password-input-wrap">
              <input type="password" id="login-password" class="form-input" placeholder="••••••••" required value="password123">
              <button type="button" class="password-toggle-btn" id="login-pwd-toggle" aria-label="Toggle password visibility">
                <i class="fa-solid fa-eye"></i>
              </button>
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.88rem; margin-bottom: 1.5rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--color-charcoal-muted);">
              <input type="checkbox" id="login-remember-me" checked style="accent-color: var(--color-forest-green);">
              <span>Remember me</span>
            </label>
            <a href="javascript:void(0)" style="color: var(--color-soft-coral); font-weight: 700;" id="forgot-password-link">Forgot password?</a>
          </div>

          <button type="submit" class="btn btn-teal btn-lg" style="width: 100%;">
            <i class="fa-solid fa-right-to-bracket"></i>
            <span>Sign In to Portal</span>
          </button>
        </form>

        <!-- 1-Click Demo Account Quick Access -->
        <div class="quick-demo-login-box">
          <p><i class="fa-solid fa-key" style="margin-right: 0.35rem; color: var(--color-forest-green);"></i> Evaluation Mode: Instant 1-Click Demo Login</p>
          <button type="button" class="demo-login-btn" id="quick-demo-btn">
            <i class="fa-solid fa-paw"></i>
            <span>Sign In as Samantha (Demo Parent)</span>
          </button>
        </div>

        <div style="text-align: center; margin-top: 1.75rem; font-size: 0.92rem; color: var(--color-charcoal-muted);">
          New to PETZY? <a href="#/register" style="color: var(--color-soft-coral); font-weight: 800;">Create Parent Account</a>
        </div>
      </div>
    </div>
  `;
}

export function setupLoginEvents() {
  const form = document.getElementById('petzy-login-form');
  const pwdInput = document.getElementById('login-password');
  const pwdToggle = document.getElementById('login-pwd-toggle');
  const emailInput = document.getElementById('login-email');
  const rememberCheckbox = document.getElementById('login-remember-me');
  const quickDemoBtn = document.getElementById('quick-demo-btn');
  const googleBtn = document.getElementById('google-auth-btn');
  const forgotBtn = document.getElementById('forgot-password-link');

  // Password visibility toggle
  pwdToggle?.addEventListener('click', () => {
    if (pwdInput.type === 'password') {
      pwdInput.type = 'text';
      pwdToggle.querySelector('i').className = 'fa-solid fa-eye-slash';
    } else {
      pwdInput.type = 'password';
      pwdToggle.querySelector('i').className = 'fa-solid fa-eye';
    }
  });

  // Login Submit
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput?.value.trim();
    const password = pwdInput?.value;
    const rememberMe = rememberCheckbox?.checked;

    if (!email || !password) {
      showToast('Please provide both email and password.', 'coral', 'fa-solid fa-triangle-exclamation');
      return;
    }

    try {
      const user = loginUser(email, password, rememberMe);
      showToast(`Welcome back, ${user.name}! Signed in to your patient portal.`, 'sage', 'fa-solid fa-circle-check');
      setTimeout(() => {
        window.location.hash = getRedirectTarget();
      }, 400);
    } catch (err) {
      showToast(err.message || 'Login failed', 'coral', 'fa-solid fa-triangle-exclamation');
    }
  });

  // Quick 1-Click Demo Login
  quickDemoBtn?.addEventListener('click', () => {
    const user = loginAsDemoUser();
    showToast(`Welcome back, ${user.name}! Signed in as Demo Pet Parent.`, 'sage', 'fa-solid fa-paw');
    setTimeout(() => {
      window.location.hash = getRedirectTarget();
    }, 400);
  });

  // Google OAuth Demo
  googleBtn?.addEventListener('click', () => {
    const user = loginAsDemoUser();
    showToast('Signed in via Google successfully! Welcome to PETZY.', 'sage', 'fa-brands fa-google');
    setTimeout(() => {
      window.location.hash = getRedirectTarget();
    }, 400);
  });

  // Forgot Password
  forgotBtn?.addEventListener('click', () => {
    const email = emailInput?.value.trim() || 'your email';
    showToast(`Password recovery link sent to ${email}. Please check your inbox.`, 'coral', 'fa-solid fa-paper-plane');
  });
}

function getRedirectTarget() {
  const hash = window.location.hash || '';
  if (hash.includes('?redirect=')) {
    const r = hash.split('?redirect=')[1]?.split('&')[0];
    if (r) return `#/${r}`;
  }
  return '#/dashboard';
}

