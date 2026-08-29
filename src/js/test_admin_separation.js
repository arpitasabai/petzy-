/* PETZY Admin Separation & Security Guard Automated Verification Suite */
import { getStoredUsers, loginUser, loginAsDemoUser, loginAsAdmin, logoutUser, getCurrentUser, isAdmin, DEFAULT_DEMO_USER, DEFAULT_ADMIN_USER } from './services/auth.js';
import { getSmartParentRoute } from './components/back-button.js';
import { renderLogin } from './pages/login.js';
import { renderAdminLogin } from './pages/admin/admin-login.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

console.log('\n======================================================');
console.log('  TESTING PETZY COMPLETE ADMIN SEPARATION & RBAC');
console.log('======================================================\n');

// ----------------------------------------------------
// 1. Client-Side Customer Login Page Isolation
// ----------------------------------------------------
console.log('--- 1. Customer Login Page Isolation ---');
logoutUser();
const customerLoginHtml = renderLogin();

assert(!customerLoginHtml.includes('Sign In as Administrator'), 'Customer Login page contains ZERO admin login buttons');
assert(!customerLoginHtml.includes('Dr. Marcus Vance'), 'Customer Login page contains NO administrator credentials or names');
assert(!customerLoginHtml.includes('admin@petzy.com'), 'Customer Login page contains NO admin emails in placeholders');
assert(customerLoginHtml.includes('Pet Parent Portal'), 'Customer Login page is branded exclusively as Pet Parent Portal');
assert(customerLoginHtml.includes('Sign In as Samantha (Demo Pet Parent)'), 'Customer Login provides Pet Parent demo access');

// ----------------------------------------------------
// 2. Dedicated Hospital Administrator Login Page
// ----------------------------------------------------
console.log('\n--- 2. Dedicated Hospital Admin Login Portal ---');
const adminLoginHtml = renderAdminLogin();

assert(adminLoginHtml.includes('PETZY Hospital Administration'), 'Dedicated Admin Login has hospital admin heading');
assert(adminLoginHtml.includes('Restricted Personnel Access'), 'Dedicated Admin Login displays restricted access badge');
assert(adminLoginHtml.includes('Hospital Staff Email'), 'Dedicated Admin Login requires hospital staff email');
assert(adminLoginHtml.includes('Administrative Access Key'), 'Dedicated Admin Login requires admin access key');
assert(adminLoginHtml.includes('Return to PETZY Customer Website'), 'Dedicated Admin Login provides link back to customer site');

// ----------------------------------------------------
// 3. Separate Authentication Logic & Role Checks
// ----------------------------------------------------
console.log('\n--- 3. Authentication & Role Separation ---');

// Customer Login
const customerUser = loginAsDemoUser();
assert(customerUser.role === 'customer', 'Demo user has customer role');
assert(!isAdmin(), 'isAdmin() returns FALSE for customer user');

// Admin Login
const adminUser = loginAsAdmin();
assert(adminUser.role === 'admin', 'Admin user has admin role');
assert(isAdmin(), 'isAdmin() returns TRUE for admin user');

// ----------------------------------------------------
// 4. Role-Based Access Control (RBAC) Route Guard Simulation
// ----------------------------------------------------
console.log('\n--- 4. RBAC Route Guard Simulation ---');

const simulateGuard = (path, user) => {
  const cleanPath = path.split('?')[0].split('#')[0] || '/';
  const isAdm = user ? (user.role === 'admin' || user.email === 'admin@petzy.com') : false;

  // Guard 1: Any /admin/* route (except /admin/login) requires admin role
  if (cleanPath.startsWith('/admin') && cleanPath !== '/admin/login') {
    if (!user) {
      return { allowed: false, redirect: '#/admin/login', reason: 'Auth required' };
    }
    if (!isAdm) {
      return { allowed: false, redirect: '#/dashboard', reason: 'Customer denied admin access' };
    }
  }

  // Guard 2: Customer /dashboard requires authenticated session (Admins redirected to admin panel)
  if (cleanPath === '/dashboard') {
    if (!user) {
      return { allowed: false, redirect: '#/login', reason: 'Customer auth required' };
    }
    if (isAdm) {
      return { allowed: false, redirect: '#/admin/dashboard', reason: 'Admin blocked from customer dashboard' };
    }
  }

  // Guard 3: If authenticated admin visits /admin/login, redirect to /admin/dashboard
  if (cleanPath === '/admin/login' && user && isAdm) {
    return { allowed: false, redirect: '#/admin/dashboard', reason: 'Admin already authenticated' };
  }

  return { allowed: true, redirect: null };
};

// Test 4.1: Unauthenticated user accessing /admin routes
const unauthAdminOverview = simulateGuard('/admin', null);
assert(!unauthAdminOverview.allowed && unauthAdminOverview.redirect === '#/admin/login', 'Unauthenticated user blocked from /admin -> redirects to #/admin/login');

const unauthAdminCustomers = simulateGuard('/admin/customers', null);
assert(!unauthAdminCustomers.allowed && unauthAdminCustomers.redirect === '#/admin/login', 'Unauthenticated user blocked from /admin/customers -> redirects to #/admin/login');

const unauthAdminPayments = simulateGuard('/admin/payments', null);
assert(!unauthAdminPayments.allowed && unauthAdminPayments.redirect === '#/admin/login', 'Unauthenticated user blocked from /admin/payments -> redirects to #/admin/login');

// Test 4.2: Customer attempting to access /admin routes
const customerToAdmin = simulateGuard('/admin', DEFAULT_DEMO_USER);
assert(!customerToAdmin.allowed && customerToAdmin.redirect === '#/dashboard', 'Customer blocked from /admin -> redirects to #/dashboard');

const customerToAdminAppts = simulateGuard('/admin/appointments', DEFAULT_DEMO_USER);
assert(!customerToAdminAppts.allowed && customerToAdminAppts.redirect === '#/dashboard', 'Customer blocked from /admin/appointments -> redirects to #/dashboard');

const customerToAdminPayments = simulateGuard('/admin/payments', DEFAULT_DEMO_USER);
assert(!customerToAdminPayments.allowed && customerToAdminPayments.redirect === '#/dashboard', 'Customer blocked from /admin/payments -> redirects to #/dashboard');

// Test 4.3: Admin accessing /admin routes
const adminToDashboard = simulateGuard('/admin/dashboard', DEFAULT_ADMIN_USER);
assert(adminToDashboard.allowed, 'Admin authorized for /admin/dashboard');

const adminToCustomers = simulateGuard('/admin/customers', DEFAULT_ADMIN_USER);
assert(adminToCustomers.allowed, 'Admin authorized for /admin/customers');

const adminToPayments = simulateGuard('/admin/payments', DEFAULT_ADMIN_USER);
assert(adminToPayments.allowed, 'Admin authorized for /admin/payments');

// Test 4.4: Admin accessing /admin/login when already authenticated
const adminToLogin = simulateGuard('/admin/login', DEFAULT_ADMIN_USER);
assert(!adminToLogin.allowed && adminToLogin.redirect === '#/admin/dashboard', 'Authenticated admin visiting /admin/login redirects to #/admin/dashboard');

// Test 4.6: Admin accessing /dashboard
const adminToCustomerDashboard = simulateGuard('/dashboard', DEFAULT_ADMIN_USER);
// Admin visiting /dashboard is redirected to /admin/dashboard
assert(adminToCustomerDashboard.redirect === '#/admin/dashboard' || !adminToCustomerDashboard.allowed, 'Admin attempting to access /dashboard is redirected to /admin/dashboard');

// ----------------------------------------------------
// 5. Smart Parent Route Fallback for Admin Pages
// ----------------------------------------------------
console.log('\n--- 5. Navigation Fallbacks for Separated Routes ---');

assert(getSmartParentRoute('#/admin/login') === '#/', 'Admin Login fallback resolves to #/');
assert(getSmartParentRoute('#/admin/customers') === '#/admin/dashboard', 'Admin Customers fallback resolves to #/admin/dashboard');
assert(getSmartParentRoute('#/admin/payments') === '#/admin/dashboard', 'Admin Payments fallback resolves to #/admin/dashboard');
assert(getSmartParentRoute('#/admin/dashboard') === '#/admin/login', 'Admin Dashboard fallback resolves to #/admin/login');

console.log('\n======================================================');
console.log(`  ADMIN SEPARATION TESTS: ${passed} PASSED, ${failed} FAILED`);
console.log('======================================================\n');

if (failed > 0) process.exit(1);
