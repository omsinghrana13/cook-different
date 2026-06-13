// DOM Elements
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const logoutBtn = document.getElementById("logout-btn");
const unauthButtons = document.getElementById("unauth-buttons");
const authButtons = document.getElementById("auth-buttons");
const userGreeting = document.getElementById("user-greeting");
const loginError = document.getElementById("login-error");
const signupError = document.getElementById("signup-error");

const closeAllModals = () => {
  document.querySelector("[data-login-modal]").classList.remove("active");
  document.querySelector("[data-signup-modal]").classList.remove("active");
  document.body.style.overflow = "auto";
};

// Check if user is logged in by looking for the token in LocalStorage
const checkAuthState = () => {
  const token = localStorage.getItem("cooking_town_token");
  const name = localStorage.getItem("cooking_town_name");

  if (token && name) {
    unauthButtons.style.display = "none";
    authButtons.style.display = "flex";
    userGreeting.innerText = `Hi, ${name}!`;
  } else {
    unauthButtons.style.display = "flex";
    authButtons.style.display = "none";
    userGreeting.innerText = "";
  }
};

// Run auth check when page loads
checkAuthState();

// --- SIGN UP ---
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    try {
      // Send data to our local backend
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Save token and name to browser
      localStorage.setItem("cooking_town_token", data.token);
      localStorage.setItem("cooking_town_name", data.name);
      
      signupForm.reset();
      closeAllModals();
      signupError.style.display = "none";
      checkAuthState(); // Update UI
    } catch (error) {
      signupError.innerText = error.message;
      signupError.style.display = "block";
    }
  });
}

// --- LOG IN ---
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      // Send data to our local backend
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Save token and name to browser
      localStorage.setItem("cooking_town_token", data.token);
      localStorage.setItem("cooking_town_name", data.name);
      
      loginForm.reset();
      closeAllModals();
      loginError.style.display = "none";
      checkAuthState(); // Update UI
    } catch (error) {
      loginError.innerText = error.message;
      loginError.style.display = "block";
    }
  });
}

// --- LOG OUT ---
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    // Delete tokens to log out
    localStorage.removeItem("cooking_town_token");
    localStorage.removeItem("cooking_town_name");
    checkAuthState(); // Update UI
  });
}