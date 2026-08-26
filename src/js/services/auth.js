/* PETZY Customer Authentication & Session Management Service */
import { seedDemoData } from './storage.js';

const USERS_STORAGE_KEY = 'petzy_registered_users';
const CURRENT_USER_KEY = 'petzy_current_user';
const REMEMBER_ME_KEY = 'petzy_remember_me';

// Default Demo Customer Account
const DEFAULT_DEMO_USER = {
  id: 'usr_samantha_hayes_01',
  name: 'Samantha Hayes',
  email: 'samantha@petzy.com',
  phone: '+1 (555) 234-5678',
  password: 'password123',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
  address: '742 Evergreen Paws Way, Apt 3B, San Francisco, CA',
  emergencyContact: '+1 (555) 987-6543 (Mark Hayes)',
  joinedDate: 'March 2025',
  membershipTier: 'PETZY CarePlus Member'
};

// Initialize persistent user accounts list
function getStoredUsers() {
  const raw = localStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) {
    const initial = [DEFAULT_DEMO_USER];
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
    seedDemoData(DEFAULT_DEMO_USER.id);
    return initial;
  }
  try {
    const users = JSON.parse(raw);
    if (!users.some(u => u.email.toLowerCase() === DEFAULT_DEMO_USER.email.toLowerCase())) {
      users.push(DEFAULT_DEMO_USER);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      seedDemoData(DEFAULT_DEMO_USER.id);
    }
    return users;
  } catch (e) {
    return [DEFAULT_DEMO_USER];
  }
}

function saveStoredUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// Current Session
export function getCurrentUser() {
  const raw = localStorage.getItem(CURRENT_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}

export function isAuthenticated() {
  return !!getCurrentUser();
}

function dispatchAuthChange(user) {
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function' && typeof CustomEvent !== 'undefined') {
    window.dispatchEvent(new CustomEvent('petzy-auth-change', { detail: { user } }));
  }
}

// Customer Registration
export function registerUser({ name, email, phone, password }) {
  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  // Check existing
  if (users.some(u => u.email.toLowerCase() === normalizedEmail)) {
    throw new Error('An account with this email address already exists. Please sign in.');
  }

  const newUser = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    name: name.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    password: password,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    address: '',
    emergencyContact: '',
    joinedDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    membershipTier: 'PETZY Care Patient'
  };

  users.push(newUser);
  saveStoredUsers(users);

  // Set active session
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
  dispatchAuthChange(newUser);

  return newUser;
}

// Customer Login
export function loginUser(email, password, rememberMe = true) {
  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    throw new Error('No account found with this email address. Please check or register.');
  }

  if (user.password !== password) {
    throw new Error('Incorrect password. Please try again or use Forgot Password.');
  }

  // If demo user, make sure seed data exists
  if (user.id === DEFAULT_DEMO_USER.id) {
    seedDemoData(user.id);
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  if (rememberMe) {
    localStorage.setItem(REMEMBER_ME_KEY, normalizedEmail);
  } else {
    localStorage.removeItem(REMEMBER_ME_KEY);
  }

  dispatchAuthChange(user);
  return user;
}

// 1-Click Quick Demo Login Helper
export function loginAsDemoUser() {
  getStoredUsers(); // ensure init
  seedDemoData(DEFAULT_DEMO_USER.id);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(DEFAULT_DEMO_USER));
  dispatchAuthChange(DEFAULT_DEMO_USER);
  return DEFAULT_DEMO_USER;
}

// Logout
export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
  dispatchAuthChange(null);
}

// Update Profile
export function updateUserProfile(updates) {
  const current = getCurrentUser();
  if (!current) throw new Error('Not authenticated');

  const users = getStoredUsers();
  const userIdx = users.findIndex(u => u.id === current.id);
  if (userIdx === -1) throw new Error('User not found');

  const updatedUser = {
    ...current,
    ...updates,
    id: current.id,
    password: current.password // preserve password
  };

  users[userIdx] = updatedUser;
  saveStoredUsers(users);
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
  dispatchAuthChange(updatedUser);

  return updatedUser;
}

// Change Password
export function changeUserPassword(currentPassword, newPassword) {
  const current = getCurrentUser();
  if (!current) throw new Error('Not authenticated');

  const users = getStoredUsers();
  const user = users.find(u => u.id === current.id);
  if (!user) throw new Error('User not found');

  if (user.password !== currentPassword) {
    throw new Error('Current password is incorrect.');
  }

  if (newPassword.length < 8) {
    throw new Error('New password must be at least 8 characters long.');
  }

  user.password = newPassword;
  saveStoredUsers(users);
  current.password = newPassword;
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(current));

  return true;
}

// Get Remembered Email
export function getRememberedEmail() {
  return localStorage.getItem(REMEMBER_ME_KEY) || 'samantha@petzy.com';
}
