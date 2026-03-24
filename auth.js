/* auth.js – Frontend authentication for 1753 SKINCARE */

const BACKEND_URL = "http://localhost:3001/api";
const TOKEN_KEY = "auth_token_1753";
const USER_KEY = "auth_user_1753";

const AuthClient = {

  async register(name, email, phone, password) {
    const res = await fetch(BACKEND_URL + "/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phone, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registreringen misslyckades");
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  },

  async login(email, password) {
    const res = await fetch(BACKEND_URL + "/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Inloggningen misslyckades");
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  },

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.location.href = "login.html";
  },

  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  getUser() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
      return null;
    }
  },

  isLoggedIn() {
    const token = this.getToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  async getProfile() {
    return this._authFetch(BACKEND_URL + "/auth/profile");
  },

  async updateProfile(data) {
    return this._authFetch(BACKEND_URL + "/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
  },

  async _authFetch(url, opts = {}) {
    const token = this.getToken();
    if (!token) throw new Error("Ej inloggad");
    opts.headers = Object.assign({}, opts.headers, {
      Authorization: "Bearer " + token
    });
    const res = await fetch(url, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Något gick fel");
    return data;
  }
};


// ---- Form handlers ----

async function handleLoginForm(e) {
  e.preventDefault();
  const form = e.target;
  const email = form.querySelector('[name="email"]').value.trim();
  const password = form.querySelector('[name="password"]').value;

  if (!email || !password) {
    showNotification("Fyll i alla fält");
    return;
  }

  const btn = form.querySelector(".auth-submit");
  btn.disabled = true;
  btn.textContent = "Loggar in...";

  try {
    await AuthClient.login(email, password);
    showNotification("Inloggningen lyckades");
    setTimeout(() => { window.location.href = "dashboard.html"; }, 400);
  } catch (err) {
    showNotification(err.message);
    btn.disabled = false;
    btn.textContent = "Logga in";
  }
}

async function handleRegisterForm(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.querySelector('[name="name"]').value.trim();
  const email = form.querySelector('[name="email"]').value.trim();
  const phone = form.querySelector('[name="phone"]').value.trim();
  const password = form.querySelector('[name="password"]').value;
  const confirm = form.querySelector('[name="password_confirm"]').value;

  if (!name || !email || !password || !confirm) {
    showNotification("Fyll i alla obligatoriska fält");
    return;
  }

  if (password.length < 8) {
    showNotification("Lösenordet måste vara minst 8 tecken");
    return;
  }

  if (password !== confirm) {
    showNotification("Lösenorden matchar inte");
    return;
  }

  const btn = form.querySelector(".auth-submit");
  btn.disabled = true;
  btn.textContent = "Skapar konto...";

  try {
    await AuthClient.register(name, email, phone || null, password);
    showNotification("Kontot har skapats");
    setTimeout(() => { window.location.href = "dashboard.html"; }, 400);
  } catch (err) {
    showNotification(err.message);
    btn.disabled = false;
    btn.textContent = "Skapa konto";
  }
}


// ---- Auth UI ----

function updateAuthUI() {
  const navLinks = document.querySelector(".nav-links");
  if (!navLinks) return;

  const existing = navLinks.querySelector(".auth-nav-item");
  if (existing) existing.remove();

  const li = document.createElement("li");
  li.className = "auth-nav-item";

  if (AuthClient.isLoggedIn()) {
    const a = document.createElement("a");
    a.href = "dashboard.html";
    a.textContent = "Mitt konto";
    a.className = "auth-nav-link";
    li.appendChild(a);
  } else {
    const a = document.createElement("a");
    a.href = "login.html";
    a.textContent = "Logga in";
    a.className = "auth-nav-link";
    li.appendChild(a);
  }

  const cartItem = navLinks.querySelector(".cart-btn");
  if (cartItem && cartItem.closest("li")) {
    navLinks.insertBefore(li, cartItem.closest("li"));
  } else {
    navLinks.appendChild(li);
  }
}


// ---- Init ----

document.addEventListener("DOMContentLoaded", () => {
  updateAuthUI();

  const loginForm = document.getElementById("login-form");
  if (loginForm) loginForm.addEventListener("submit", handleLoginForm);

  const registerForm = document.getElementById("register-form");
  if (registerForm) registerForm.addEventListener("submit", handleRegisterForm);
});
