import { setSharedState } from "../main";
import { saveSession } from "./session";
import loading from "../components/loading.html?raw";

const BACKEND_LOGIN_URL = `${import.meta.env.VITE_API_URL}/auth/login`;

export function setupLoginForm() {
  const loginModal = document.getElementById("login-modal") as HTMLElement | null;
  const signupModal = document.getElementById("signup-modal") as HTMLElement | null;
  const openBtnLogin = document.getElementById("open-login") as HTMLButtonElement | null;
  const openBtnSignup = document.getElementById("open-signup") as HTMLElement | null;
  const loginForm = document.getElementById("login-form") as HTMLFormElement | null;
  const emailInput = document.getElementById("login-email") as HTMLInputElement | null;
  const passwordInput = document.getElementById("login-password") as HTMLInputElement | null;
  const loginSubmit = document.getElementById("login-submit") as HTMLButtonElement | null;
  const loginMessage = document.getElementById("login-message") as HTMLElement | null;

  if (!loginModal || !openBtnLogin || !loginForm || !emailInput || !passwordInput || !loginSubmit) {
    console.warn("Login modal setup failed: missing elements.");
    return;
  }

  openBtnLogin.addEventListener("click", () => loginModal.classList.toggle("hidden"));
  loginModal.addEventListener("click", (e) => { if (e.target === loginModal) loginModal.classList.add("hidden"); });
  if (openBtnSignup && signupModal) openBtnSignup.addEventListener("click", () => { loginModal.classList.add("hidden"); signupModal.classList.remove("hidden"); });

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

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

      // ✅ Sync with backend structure
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
    } catch (err) {
      console.error("Login error:", err);
      if (loginMessage) loginMessage.textContent = "An error occurred. Please try again.";
    } finally {
      loginSubmit.innerHTML = originalText;
      loginSubmit.disabled = false;
    }
  });
}

