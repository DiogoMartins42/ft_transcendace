import { setupUserSection } from './simulatedUserSection'
import { sharedState } from '../main'

export function setupModalEvents() {
  const loginModal = document.getElementById('login-modal')
  const signupModal = document.getElementById('signup-modal')
  const openBtnLogin = document.getElementById('open-login')
  const cancelBtnLogin = document.getElementById('cancel-login')
  const openBtnSignup = document.getElementById('open-signup')
  const cancelBtnSignUp = document.getElementById('cancel-signup')

  const loginForm = document.getElementById('login-form') as HTMLFormElement
  const usernameInput = document.getElementById('login-username') as HTMLInputElement
  const passwordInput = document.getElementById('login-password') as HTMLInputElement

  openBtnLogin?.addEventListener('click', () => {
    loginModal?.classList.remove('hidden')
  })

  cancelBtnLogin?.addEventListener('click', () => {
    loginModal?.classList.add('hidden')
  })

   if (loginForm && !loginForm.dataset.listenerAttached) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault()

      const username = usernameInput?.value.trim()
      const password = passwordInput?.value.trim()

      if (!username || !password) {
        alert('Please fill in both username and password.')
        return
      }

      sharedState.isLoggedIn = true
      loginModal?.classList.add('hidden')
      loginForm.reset()
      await setupUserSection()
    })

    loginForm.dataset.listenerAttached = 'true'
  }

  loginModal?.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      loginModal.classList.add('hidden')
    }
  })

  openBtnSignup?.addEventListener('click', () => {
    signupModal?.classList.remove('hidden')
  })

  cancelBtnSignUp?.addEventListener('click', () => {
    signupModal?.classList.add('hidden')
  })

  // Optional: Close modal if you click outside the form
  signupModal?.addEventListener('click', (e) => {
    if (e.target === signupModal) {
      signupModal.classList.add('hidden')
    }
  })
}