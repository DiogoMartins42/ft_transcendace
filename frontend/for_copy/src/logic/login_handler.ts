import { setSharedState } from '../main'
import loading from '../components/loading.html?raw'

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
    console.warn("Login modal setup failed: missing elements.")
    return
  }

  // open / close modal
  openBtnLogin.addEventListener('click', () => {
    loginModal.classList.toggle('hidden')
  })

  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.classList.add('hidden')
  })

  if (openBtnSignup && signupModal) {
    openBtnSignup.addEventListener('click', () => {
      loginModal.classList.add('hidden')
      signupModal.classList.remove('hidden')
    })
  }

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

    const originalText = loginSubmit.innerHTML
    loginSubmit.innerHTML = loading
    loginSubmit.disabled = true

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    try {
      const response = await fetch(BACKEND_LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailInput.value,
          password: passwordInput.value
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        showMessage("Invalid email or password")
        passwordInput.value = ""
        validateInputs()
        loginSubmit.innerHTML = originalText
        loginSubmit.disabled = false
        return
      }

      const data = await response.json()

      // ✅ Update reactive shared state
      setSharedState({
        isLoggedIn: true,
        username: data.username,
        avatarUrl: data.avatarUrl
      })

      loginModal.classList.add('hidden')
      emailInput.value = ""
      passwordInput.value = ""
      loginSubmit.innerHTML = originalText
      loginSubmit.disabled = true

    } catch (err) {
      if (controller.signal.aborted) {
        showMessage("Login request timed out. Please try again.")
      } else {
        showMessage("An error occurred. Please try again.")
      }
      loginSubmit.innerHTML = originalText
      loginSubmit.disabled = true
    }
  });

  console.log("✅ Login form setup complete");
}
