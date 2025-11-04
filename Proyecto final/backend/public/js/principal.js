// proyecto-final.js
// Lógica de registro, inicio de sesión y persistencia de sesión en localStorage

const DOM = {
  registerForm: document.getElementById('registerForm'),
  loginForm: document.getElementById('loginForm'),
  registerMsg: document.getElementById('registerMsg'),
  loginMsg: document.getElementById('loginMsg'),
  dashboard: document.getElementById('dashboard'),
  userNameSpan: document.getElementById('userName'),
  logoutBtn: document.getElementById('logoutBtn')
};

// --- Helpers para localStorage ---
const DB = {
  usersKey: 'pf_users_v1',
  sessionKey: 'pf_currentUser',
  getUsers() {
    return JSON.parse(localStorage.getItem(this.usersKey) || '[]');
  },
  setUsers(users) {
    localStorage.setItem(this.usersKey, JSON.stringify(users));
  },
  setSession(email) {
    localStorage.setItem(this.sessionKey, email);
  },
  clearSession() {
    localStorage.removeItem(this.sessionKey);
  },
  getSession() {
    return localStorage.getItem(this.sessionKey);
  }
};

// --- Registro ---
DOM.registerForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;

  if(!name || !email || !password) {
    DOM.registerMsg.textContent = 'Complete todos los campos.';
    return;
  }

  const users = DB.getUsers();
  if(users.some(u => u.email === email)) {
    DOM.registerMsg.textContent = '⚠️ Ese correo ya está registrado.';
    return;
  }

  users.push({ name, email, password }); // demo: contraseña en texto plano
  DB.setUsers(users);
  DOM.registerMsg.textContent = '✅ Registro exitoso. Ahora puedes iniciar sesión.';
  DOM.registerForm.reset();
});

// --- Inicio de sesión ---
DOM.loginForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const password = document.getElementById('loginPassword').value;

  const users = DB.getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if(!user) {
    DOM.loginMsg.textContent = '❌ Correo o contraseña incorrectos.';
    return;
  }

  // Guardar sesión activa y redirigir a la página principal
  DB.setSession(user.email);
  window.location.href = 'principal.html';
});

// --- Mostrar dashboard si hay sesión (ya no se usa, pero se mantiene por compatibilidad) ---
function showDashboard(user) {
  DOM.userNameSpan.textContent = user.name;
  document.getElementById('login-section').classList.add('hidden');
  document.getElementById('register-section').classList.add('hidden');
  DOM.dashboard.classList.remove('hidden');
}

// --- Verificar sesión al cargar la página ---
window.addEventListener('DOMContentLoaded', () => {
  const currentEmail = DB.getSession();
  if(currentEmail) {
    // Si ya hay sesión, ir directamente a la página principal
    if (!window.location.href.includes('principal.html')) {
      window.location.href = 'principal.html';
    }
  }
});

// --- Cerrar sesión (solo si el botón existe en la página principal) ---
if (DOM.logoutBtn) {
  DOM.logoutBtn.addEventListener('click', () => {
    DB.clearSession();
    window.location.href = 'proyecto-final.html';
  });
}

