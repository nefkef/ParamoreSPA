// Paramore SPA: navigation, language switch and admin login.

document.addEventListener('DOMContentLoaded', function () {
  const sections = document.querySelectorAll('.content-section');
  const navLinks = document.querySelectorAll('.nav a');
  const nav = document.getElementById('site-nav');
  const menuToggle = document.getElementById('menu-toggle');

  // ---------- Navigation (hash-based, so Back/refresh/links work) ----------
  function showSection(id) {
    const exists = Array.from(sections).some(function (s) { return s.id === id; });
    if (!exists) id = 'home';

    sections.forEach(function (section) {
      section.hidden = section.id !== id;
    });
    navLinks.forEach(function (link) {
      const active = link.getAttribute('href') === '#' + id;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    // Close the mobile menu after choosing a section
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');

    if (id === 'management') checkSession();
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', function () {
    showSection(location.hash.substring(1));
  });

  menuToggle.addEventListener('click', function () {
    const open = nav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  // ---------- Language switch (Greek / English) ----------
  const langButtons = document.querySelectorAll('.lang-switch button');

  function setLanguage(lang) {
    document.documentElement.lang = lang;
    langButtons.forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
    });
    try { localStorage.setItem('lang', lang); } catch (e) { /* storage may be blocked */ }
  }

  langButtons.forEach(function (b) {
    b.addEventListener('click', function () { setLanguage(b.dataset.lang); });
  });

  let savedLang = null;
  try { savedLang = localStorage.getItem('lang'); } catch (e) { /* ignore */ }
  setLanguage(savedLang === 'en' ? 'en' : 'el');

  // ---------- Admin login (checked on the server, see /api) ----------
  const loginForm = document.getElementById('login-form');
  const loginView = document.getElementById('login-view');
  const adminView = document.getElementById('admin-view');
  const adminName = document.getElementById('admin-name');
  const message = document.getElementById('login-message');
  const loginButton = document.getElementById('login-button');
  const logoutButton = document.getElementById('logout-button');

  const texts = {
    el: {
      empty: 'Συμπληρώστε όνομα χρήστη και κωδικό.',
      wrong: 'Λάθος όνομα χρήστη ή κωδικός.',
      error: 'Η σύνδεση δεν είναι διαθέσιμη αυτή τη στιγμή. Δοκιμάστε ξανά αργότερα.'
    },
    en: {
      empty: 'Enter your username and password.',
      wrong: 'Wrong username or password.',
      error: 'Sign-in is not available right now. Please try again later.'
    }
  };

  function t(key) { return texts[document.documentElement.lang][key]; }

  function showMessage(key) {
    message.textContent = t(key);
    message.hidden = false;
  }

  function showAdmin(username) {
    adminName.textContent = username;
    loginView.hidden = true;
    adminView.hidden = false;
  }

  function showLogin() {
    loginView.hidden = false;
    adminView.hidden = true;
  }

  function checkSession() {
    fetch('/api/me', { credentials: 'same-origin' })
      .then(function (r) { return r.ok ? r.json() : { loggedIn: false }; })
      .then(function (data) {
        if (data.loggedIn) showAdmin(data.username);
        else showLogin();
      })
      .catch(showLogin);
  }

  loginForm.addEventListener('submit', function (event) {
    event.preventDefault();
    message.hidden = true;

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    if (!username || !password) { showMessage('empty'); return; }

    loginButton.disabled = true;
    fetch('/api/login', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: username, password: password })
    })
      .then(function (r) {
        if (r.ok) return r.json().then(function (data) {
          loginForm.reset();
          showAdmin(data.username);
        });
        showMessage(r.status === 401 ? 'wrong' : 'error');
      })
      .catch(function () { showMessage('error'); })
      .finally(function () { loginButton.disabled = false; });
  });

  logoutButton.addEventListener('click', function () {
    fetch('/api/logout', { method: 'POST', credentials: 'same-origin' })
      .finally(showLogin);
  });

  // Show the section from the address bar (e.g. /#photos)
  showSection(location.hash.substring(1) || 'home');
});
