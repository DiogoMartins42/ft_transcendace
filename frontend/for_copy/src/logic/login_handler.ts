import { setSharedState } from '../main'
import loading from '../components/loading.html?raw'

const BACKEND_LOGIN_URL = "/api/login"

export function setupLoginForm() {
  const loginModal = document.getElementById('login-modal') as HTMLElement | null
  const signupModal = document.getElementById('signup-modal') as HTMLElement | null
  const openBtnLogin = document.getElementById('open-login') as HTMLButtonElement | null
  const openBtnSignup = document.getElementById('open-signup') as HTMLElement | null
  const loginForm = document.getElementById('login-form') as HTMLFormElement | null
  const emailInput = document.getElementById('login-email') as HTMLInputElement | null
  const passwordInput = document.getElementById('login-password') as HTMLInputElement | null
  const loginSubmit = document.getElementById('login-submit') as HTMLButtonElement | null
  const loginMessage = document.getElementById('login-message') as HTMLElement | null

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
    loginSubmit!.disabled = !(emailInput!.value.trim() && passwordInput!.value.trim())
  }

  emailInput.addEventListener('input', validateInputs)
  passwordInput.addEventListener('input', validateInputs)

  function showMessage(msg: string) {
    if (!loginMessage) return
    loginMessage.textContent = msg
    loginMessage.classList.remove('hidden')
    loginMessage.classList.add('text-red-500')
  }

  function clearMessage() {
    if (loginMessage) loginMessage.classList.add('hidden')
  }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    clearMessage()

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
  })
}
