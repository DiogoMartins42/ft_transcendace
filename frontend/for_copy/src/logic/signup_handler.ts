import { setSharedState } from '../main'
import loading from '../components/loading.html?raw'

const BACKEND_SIGNUP_URL = "/api/signup"

export function setupSignupForm() {
  const signupModal = document.getElementById('signup-modal') as HTMLElement | null
  const loginModal = document.getElementById('login-modal') as HTMLElement | null
  const openBtnSignup = document.getElementById('open-signup') as HTMLElement | null
  const signupForm = document.getElementById('signup-form') as HTMLFormElement | null
  const nameInput = document.getElementById('signup-username') as HTMLInputElement | null
  const emailInput = document.getElementById('signup-email') as HTMLInputElement | null
  const passwordInput = document.getElementById('signup-password') as HTMLInputElement | null
  const confirmInput = document.getElementById('signup-confirm') as HTMLInputElement | null
  const signupSubmit = document.getElementById('signup-submit') as HTMLButtonElement | null
  const signupMessage = document.getElementById('signup-message') as HTMLElement | null
  const openBtnLogin = document.getElementById('open-login') as HTMLElement | null

  if (!signupModal || !signupForm || !nameInput || !emailInput || !passwordInput || !confirmInput || !signupSubmit) {
    console.warn("Signup modal setup failed: missing elements.")
    return
  }

  // Open/close modal
  if (openBtnSignup) {
    openBtnSignup.addEventListener('click', () => {
      signupModal.classList.toggle('hidden')
    })
  }

  signupModal.addEventListener('click', (e) => {
    if (e.target === signupModal) signupModal.classList.add('hidden')
  })

  if (openBtnLogin && loginModal) {
    openBtnLogin.addEventListener('click', () => {
      signupModal.classList.add('hidden')
      loginModal.classList.remove('hidden')
    })
  }

  function validateInputs() {
    const filled = nameInput!.value.trim() && emailInput!.value.trim() && passwordInput!.value.trim() && confirmInput!.value.trim()
    const match = passwordInput!.value === confirmInput!.value
    signupSubmit!.disabled = !(filled && match)
  }

  nameInput.addEventListener('input', validateInputs)
  emailInput.addEventListener('input', validateInputs)
  passwordInput.addEventListener('input', validateInputs)
  confirmInput.addEventListener('input', validateInputs)

  function showMessage(msg: string, isError = true) {
    if (!signupMessage) return
    signupMessage.textContent = msg
    signupMessage.classList.remove('hidden')
    signupMessage.classList.toggle('text-red-500', isError)
    signupMessage.classList.toggle('text-green-500', !isError)
  }

  function clearMessage() {
    if (signupMessage) signupMessage.classList.add('hidden')
  }

  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    clearMessage()

    const originalText = signupSubmit.innerHTML
    signupSubmit.innerHTML = loading
    signupSubmit.disabled = true

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)

    try {
      const response = await fetch(BACKEND_SIGNUP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: nameInput.value,
          email: emailInput.value,
          password: passwordInput.value
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorMsg = await response.text()
        showMessage(errorMsg || "Signup failed. Try again.")
        signupSubmit.innerHTML = originalText
        signupSubmit.disabled = false
        return
      }

      const data = await response.json()

      // ✅ Reactive login right after signup
      setSharedState({
        isLoggedIn: true,
        username: data.username,
        avatarUrl: data.avatarUrl
      })

      showMessage("Account created successfully!", false)

      // Reset inputs
      nameInput.value = ""
      emailInput.value = ""
      passwordInput.value = ""
      confirmInput.value = ""
      validateInputs()

      signupModal.classList.add('hidden')
      signupSubmit.innerHTML = originalText

    } catch (err) {
      if (controller.signal.aborted) {
        showMessage("Signup request timed out. Please try again.")
      } else {
        showMessage("An error occurred. Please try again.")
      }
      signupSubmit.innerHTML = originalText
      signupSubmit.disabled = false
    }
  })
}
