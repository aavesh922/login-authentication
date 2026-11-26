// TASK 4 - Demo authentication using localStorage and Web Crypto SHA-256.
// For production, authentication must be handled by a secure backend.
const $ = (id) => document.getElementById(id);
const loginTab = $('login-tab');
const signupTab = $('signup-tab');
const loginForm = $('login-panel');
const signupForm = $('signup-panel');
const dashboard = $('dashboard');
const notice = $('notice');

const USERS_KEY = 'task4_demo_users';
const SESSION_KEY = 'task4_demo_session';

function getUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
  catch { return []; }
}
function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function showNotice(message, type = 'error') {
  notice.textContent = message;
  notice.className = `notice show ${type}`;
}
function clearNotice() {
  notice.textContent = '';
  notice.className = 'notice';
}
function switchTab(tab) {
  clearNotice();
  const isLogin = tab === 'login';
  loginTab.classList.toggle('active', isLogin);
  signupTab.classList.toggle('active', !isLogin);
  loginTab.setAttribute('aria-selected', String(isLogin));
  signupTab.setAttribute('aria-selected', String(!isLogin));
  loginForm.classList.toggle('hidden', !isLogin);
  signupForm.classList.toggle('hidden', isLogin);
  dashboard.classList.add('hidden');
}
loginTab.addEventListener('click', () => switchTab('login'));
signupTab.addEventListener('click', () => switchTab('signup'));

document.querySelectorAll('.show-password').forEach(button => {
  button.addEventListener('click', () => {
    const field = $(button.dataset.target);
    const reveal = field.type === 'password';
    field.type = reveal ? 'text' : 'password';
    button.textContent = reveal ? 'Hide' : 'Show';
    button.setAttribute('aria-label', reveal ? 'Hide password' : 'Show password');
  });
});

async function hashPassword(password) {
  const bytes = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('');
}
function validEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function openDashboard(user) {
  clearNotice();
  loginForm.classList.add('hidden');
  signupForm.classList.add('hidden');
  document.querySelector('.tabs').classList.add('hidden');
  dashboard.classList.remove('hidden');
  $('welcome-message').textContent = `Welcome, ${user.name}! You are logged in as ${user.email}.`;
}
function closeDashboard() {
  localStorage.removeItem(SESSION_KEY);
  dashboard.classList.add('hidden');
  document.querySelector('.tabs').classList.remove('hidden');
  switchTab('login');
  loginForm.reset();
  signupForm.reset();
}

signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearNotice();
  const name = $('signup-name').value.trim();
  const email = $('signup-email').value.trim().toLowerCase();
  const password = $('signup-password').value;
  if (!name || !email || !password) return showNotice('Please fill in all fields.');
  if (!validEmail(email)) return showNotice('Please enter a valid email address.');
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return showNotice('Password must be at least 8 characters and include a letter and a number.');
  }
  const users = getUsers();
  if (users.some(user => user.email === email)) return showNotice('An account with this email already exists. Please log in.');
  try {
    const passwordHash = await hashPassword(password);
    const user = { name, email, passwordHash };
    users.push(user);
    saveUsers(users);
    localStorage.setItem(SESSION_KEY, email);
    openDashboard(user);
  } catch {
    showNotice('Secure browser cryptography is unavailable. Please open this project on localhost or HTTPS.');
  }
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearNotice();
  const email = $('login-email').value.trim().toLowerCase();
  const password = $('login-password').value;
  if (!email || !password) return showNotice('Please enter your email and password.');
  if (!validEmail(email)) return showNotice('Please enter a valid email address.');
  try {
    const passwordHash = await hashPassword(password);
    const user = getUsers().find(item => item.email === email && item.passwordHash === passwordHash);
    if (!user) return showNotice('Incorrect email or password. Please try again.');
    localStorage.setItem(SESSION_KEY, email);
    openDashboard(user);
  } catch {
    showNotice('Secure browser cryptography is unavailable. Please open this project on localhost or HTTPS.');
  }
});

$('logout-btn').addEventListener('click', closeDashboard);

// Restore the demo session after a page refresh.
const savedEmail = localStorage.getItem(SESSION_KEY);
if (savedEmail) {
  const savedUser = getUsers().find(user => user.email === savedEmail);
  if (savedUser) openDashboard(savedUser);
  else localStorage.removeItem(SESSION_KEY);
}
