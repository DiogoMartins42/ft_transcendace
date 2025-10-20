import { setSharedState } from "../main";
import { saveSession } from "./session";
import loading from "../components/loading.html?raw";

const BACKEND_LOGIN_URL = `${import.meta.env.VITE_API_URL}/auth/login`;

export function setupLoginForm() {
  console.log("🔄 setupLoginForm() called");
  
  const loginModal = document.getElementById("login-modal");
  const openBtnLogin = document.getElementById("open-login");
  const loginForm = document.getElementById("login-form");
  const emailInput = document.getElementById("login-email") as HTMLInputElement;
  const passwordInput = document.getElementById("login-password") as HTMLInputElement;
  const loginSubmit = document.getElementById("login-submit") as HTMLButtonElement;
  const loginMessage = document.getElementById("login-message");
  
  // 🔹 SIGNUP ELEMENTS
  const openBtnSignup = document.getElementById("open-signup");
  const signupModal = document.getElementById("signup-modal");
  const googleLoginBtn = document.getElementById("google-login-btn");

  console.log("🔍 All elements found:", {
    loginModal: !!loginModal,
    openBtnLogin: !!openBtnLogin,
    loginForm: !!loginForm,
    openBtnSignup: !!openBtnSignup, // This is the key one!
    signupModal: !!signupModal,
    googleLoginBtn: !!googleLoginBtn
  });

  if (!loginModal || !openBtnLogin || !loginForm || !emailInput || !passwordInput || !loginSubmit) {
    console.warn("Login modal setup failed: missing elements.");
    return;
  }

  // 🔹 Enable/disable button based on input fields
  function validateInputs() {
    const isValid = emailInput.value.trim() && passwordInput.value.trim();
    loginSubmit.disabled = !isValid;
  }

  emailInput.addEventListener("input", validateInputs);
  passwordInput.addEventListener("input", validateInputs);
  validateInputs();

  // 🔹 Modal open/close logic
  openBtnLogin.addEventListener("click", () => {
    console.log("✅ Login button clicked - opening login modal");
    loginModal.classList.remove("hidden");
  });

  loginModal.addEventListener("click", (e) => {
    if (e.target === loginModal) {
      console.log("✅ Login modal background clicked - closing");
      loginModal.classList.add("hidden");
    }
  });

  // 🔹 Google OAuth button handler
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener("click", () => {
      console.log("✅ Google login clicked");
      window.location.href = `${import.meta.env.VITE_API_URL}/oauth/google`;
    });
  }

  // 🔹 SIGNUP BUTTON HANDLER - Enhanced debugging
  if (openBtnSignup) {
    console.log("✅ Found open-signup button, adding event listener");
    openBtnSignup.addEventListener("click", (e) => {
      e.preventDefault();
      console.log("✅ Signup button clicked in login modal");
      console.log("   - Closing login modal");
      loginModal.classList.add("hidden");
      
      if (signupModal) {
        console.log("   - Opening signup modal");
        signupModal.classList.remove("hidden");
      } else {
        console.error("❌ Signup modal not found!");
      }
    });
  } else {
    console.error("❌ open-signup button not found in DOM!");
    
    // Debug: Check what buttons exist in login modal
    const loginModalButtons = loginModal.querySelectorAll('button');
    console.log("🔍 Buttons in login modal:", loginModalButtons.length);
    loginModalButtons.forEach(btn => {
      console.log("   - Button:", {
        id: btn.id,
        text: btn.textContent,
        type: btn.type
      });
    });
  }

  // 🔹 Handle login submission
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!emailInput.value || !passwordInput.value) return;

    if (loginMessage) loginMessage.textContent = "";

    const originalText = loginSubmit.innerHTML;
    loginSubmit.innerHTML = loading;
    loginSubmit.disabled = true;

    try {
      const response = await fetch(BACKEND_LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput.value,
          password: passwordInput.value,
        }),
      });

      if (!response.ok) {
        if (loginMessage) loginMessage.textContent = "Invalid email or password";
        loginSubmit.innerHTML = originalText;
        loginSubmit.disabled = false;
        return;
      }

      const data = await response.json();

      if (data.token && data.user) {
        saveSession(data.token, {
          username: data.user.username,
          avatarUrl: "/default-avatar.png",
        });

        setSharedState({
          isLoggedIn: true,
          username: data.user.username,
          avatarUrl: "/default-avatar.png",
        });
      }

      loginModal.classList.add("hidden");
      emailInput.value = "";
      passwordInput.value = "";
      validateInputs();
    } catch (err) {
      console.error("Login error:", err);
      if (loginMessage) loginMessage.textContent = "An error occurred. Please try again.";
    } finally {
      loginSubmit.innerHTML = originalText;
      validateInputs();
    }
  });

  console.log("✅ Login form setup complete");
}