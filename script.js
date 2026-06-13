// UI Elements
const loginBtns = document.querySelectorAll("[data-login-btn]");
const signupBtns = document.querySelectorAll("[data-signup-btn]");
const loginModal = document.querySelector("[data-login-modal]");
const signupModal = document.querySelector("[data-signup-modal]");
const loginClose = document.querySelector("[data-login-close]");
const signupClose = document.querySelector("[data-signup-close]");
const switchToSignup = document.querySelector("[data-switch-to-signup]");
const switchToLogin = document.querySelector("[data-switch-to-login]");

// Open Modal
const openModal = (modal) => {
  modal.classList.add("active");
  document.body.style.overflow = "hidden"; // Prevent background scrolling
};

// Close Modal
const closeModal = (modal) => {
  modal.classList.remove("active");
  document.body.style.overflow = "auto";
};

// Bind Open Events
loginBtns.forEach(btn => btn.addEventListener("click", () => openModal(loginModal)));
signupBtns.forEach(btn => btn.addEventListener("click", () => openModal(signupModal)));

// Bind Close Events
loginClose.addEventListener("click", () => closeModal(loginModal));
signupClose.addEventListener("click", () => closeModal(signupModal));

// Close if clicking outside the modal card
window.addEventListener("click", (e) => {
  if (e.target === loginModal) closeModal(loginModal);
  if (e.target === signupModal) closeModal(signupModal);
});

// Switch Modals
switchToSignup.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal(loginModal);
  setTimeout(() => openModal(signupModal), 200);
});

switchToLogin.addEventListener("click", (e) => {
  e.preventDefault();
  closeModal(signupModal);
  setTimeout(() => openModal(loginModal), 200);
});