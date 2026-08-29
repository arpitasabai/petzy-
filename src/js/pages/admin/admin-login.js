/* PETZY Dedicated Hospital Administrator Login Portal (Separated from Customer UI) */
import { loginUser, loginAsAdmin, getCurrentUser, isAdmin, getRememberedEmail } from '../../services/auth.js';
import { showToast } from '../../components/toast.js';
import { renderBackButton } from '../../components/back-button.js';

export function renderAdminLogin() {
  const currentUser = getCurrentUser();
  if (currentUser && isAdmin()) {
    setTimeout(() => {
      window.location.hash = '#/admin/dashboard';
    }, 10);
    return `<div class="auth-page-wrapper"><p>Verifying administrative credentials...</p></div>`;
  }

  const rememberedEmail = getRememberedEmail();

  return `
    <div class="auth-page-wrapper animate-fade-up" style="background: linear-gradient(135deg, rgba(23, 74, 58, 0.08) 0%, rgba(255, 249, 240, 1) 100%); min-height: calc(100vh - 84px); display: flex; align-items: center; justify-content: center; padding: 2.5rem 1rem;">
      <div class="auth-card-box" style="max-width: 480px; border-top: 5px solid var(--color-forest-green); box-shadow: var(--shadow-xl);">
        
        <div style="display: flex; justify-content: flex-start; margin-bottom: 1.25rem;">
          ${renderBackButton('#/', 'margin-bottom: 0;')}
        </div>

        <div class="auth-card-header" style="text-align: center; margin-bottom: 1.75rem;">
          <div style="width: 58px; height: 58px; border-radius: var(--radius-lg); background: var(--color-forest-green); color: var(--color-warm-cream); display: inline-flex; align-items: center; justify-content: center; font-size: 1.6rem; margin-bottom: 1rem; box-shadow: var(--shadow-sm);">
            <i class="fa-solid fa-shield-halved" style="color: var(--color-soft-coral);"></i>
          </div>
          
          <div class="section-badge" style="background: var(--color-sage-green-soft); color: var(--color-forest-green); border: 1px solid var(--color-border); margin: 0 auto 0.75rem;">
            <i class="fa-solid fa-lock"></i>
            <span>Restricted Personnel Access</span>
          </div>

          <h2 style="font-size: 1.75rem; color: var(--color-forest-green); margin-bottom: 0.35rem; font-family: var(--font-heading);">
            PETZY Hospital Administration
          </h2>
          <p style="font-size: 0.88rem; color: var(--color-charcoal-muted); margin: 0 auto;">
            Secure operations portal for hospital executives, clinical directors, and veterinary administrators.
          </p>
        </div>

        <!-- Admin Login Form -->
        <form id="petzy-admin-login-form">
          <div class="form-group">
            <label class="form-label" for="admin-login-email" style="font-size: 0.85rem; font-weight: 700; color: var(--color-forest-green);">
              <i class="fa-solid fa-envelope" style="margin-right: 0.3rem; color: var(--color-forest-green);"></i> Hospital Staff Email *
            </label>
            <input type="email" id="admin-login-email" class="form-input" placeholder="admin@petzy.com" required value="${rememberedEmail && rememberedEmail.includes('admin') ? rememberedEmail : 'admin@petzy.com'}">
          </div>

          <div class="form-group">
            <label class="form-label" for="admin-login-password" style="font-size: 0.85rem; font-weight: 700; color: var(--color-forest-green);">
              <i class="fa-solid fa-key" style="margin-right: 0.3rem; color: var(--color-forest-green);"></i> Administrative Access Key *
            </label>
            <div class="password-input-wrap">
              <input type="password" id="admin-login-password" class="form-input" placeholder="••••••••" required value="admin123">
              <button type="button" class="password-toggle-btn" id="admin-login-pwd-toggle" aria-label="Toggle password visibility">
                <i class="fa-solid fa-eye"></i>
              </button>
            </div>
          </div>

          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.85rem; margin-bottom: 1.5rem;">
            <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: var(--color-charcoal-muted);">
              <input type="checkbox" id="admin-login-remember-me" checked style="accent-color: var(--color-forest-green);">
              <span>Keep session authenticated</span>
            </label>
          </div>

          <button type="submit" class="btn btn-teal btn-lg" style="width: 100%; justify-content: center; font-size: 0.95rem; font-weight: 800;">
            <i class="fa-solid fa-right-to-bracket"></i>
            <span>Authenticate Administrative Access</span>
          </button>
        </form>

        <!-- Quick 1-Click Evaluation Access -->
        <div class="quick-demo-login-box" style="margin-top: 1.5rem; background: var(--color-warm-white); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1rem;">
          <p style="font-size: 0.78rem; color: var(--color-charcoal-muted); margin: 0 0 0.6rem; font-weight: 600; text-align: center;">
            <i class="fa-solid fa-shield-check" style="color: var(--color-forest-green); margin-right: 0.3rem;"></i> Evaluation Mode • 1-Click Admin Access
          </p>
          <button type="button" class="demo-login-btn" id="quick-admin-login-btn" style="background: var(--color-forest-green); color: var(--color-warm-cream); border-color: var(--color-forest-green); width: 100%; justify-content: center;">
            <i class="fa-solid fa-user-shield" style="color: var(--color-soft-coral);"></i>
            <span>Sign In as Chief Administrator (Dr. Marcus Vance)</span>
          </button>
        </div>

        <div style="text-align: center; margin-top: 1.5rem; font-size: 0.85rem; color: var(--color-charcoal-muted); border-top: 1px solid var(--color-border-subtle); padding-top: 1rem;">
          <a href="#/" style="color: var(--color-forest-green); font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 0.35rem;">
            <i class="fa-solid fa-arrow-left"></i>
            <span>Return to PETZY Customer Website</span>
          </a>
        </div>

      </div>
    </div>
  `;
}

export function setupAdminLoginEvents() {
  const form = document.getElementById('petzy-admin-login-form');
  const emailInput = document.getElementById('admin-login-email');
  const pwdInput = document.getElementById('admin-login-password');
  const pwdToggle = document.getElementById('admin-login-pwd-toggle');
  const rememberCheckbox = document.getElementById('admin-login-remember-me');
  const quickAdminBtn = document.getElementById('quick-admin-login-btn');

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

  // Form Submit
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = emailInput?.value.trim();
    const password = pwdInput?.value;
    const rememberMe = rememberCheckbox?.checked;

    if (!email || !password) {
      showToast('Please provide both hospital email and password.', 'coral', 'fa-solid fa-triangle-exclamation');
      return;
    }

    try {
      const user = loginUser(email, password, rememberMe);
      if (user.role !== 'admin' && user.email.toLowerCase() !== 'admin@petzy.com') {
        showToast('Access Restricted: This portal is reserved for PETZY administrative personnel.', 'coral', 'fa-solid fa-shield-halved');
        return;
      }

      showToast(`Welcome, ${user.name}! Administrator session verified.`, 'sage', 'fa-solid fa-shield-halved');
      setTimeout(() => {
        window.location.hash = '#/admin/dashboard';
      }, 400);
    } catch (err) {
      showToast(err.message || 'Authentication failed.', 'coral', 'fa-solid fa-triangle-exclamation');
    }
  });

  // 1-Click Admin Demo Login
  quickAdminBtn?.addEventListener('click', () => {
    const user = loginAsAdmin();
    showToast(`Administrator session verified for ${user.name}.`, 'sage', 'fa-solid fa-shield-halved');
    setTimeout(() => {
      window.location.hash = '#/admin/dashboard';
    }, 400);
  });
}
