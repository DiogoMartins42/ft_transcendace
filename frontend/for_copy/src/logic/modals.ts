import { setupUserSection } from './userSection'
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
  const signupForm = document.getElementById('signup-form') as HTMLFormElement
  const signupUsernameInput = document.getElementById('signup-username') as HTMLInputElement
  const signupPasswordInput = document.getElementById('signup-password') as HTMLInputElement
  const signupEmailInput = document.getElementById('signup-email') as HTMLInputElement

  openBtnLogin?.addEventListener('click', () => {
    loginModal?.classList.remove('hidden')
  })

  cancelBtnLogin?.addEventListener('click', () => {
    loginModal?.classList.add('hidden')
  })

   if (loginForm && !loginForm.dataset.listenerAttached) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault()

      const username = usernameInput.value.trim()
      const password = passwordInput.value.trim()

      if (!username || !password) {
        alert('Please fill in both username and password.')
        return
      }

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'app/json',
          },
          body: JSON.stringify({ username, password })
        })

        const data = await response.json()

        if (data.success) {
          sharedState.isLoggedIn = true
          loginModal?.classList.add('hidden')
          loginForm.reset()
          await setupUserSection(data.user) // pass user info
        } else {
          alert('Invalid login credentials.')
        }

      } catch (err) {
        console.error(err)
        alert('Failed to connect to the server.')
      }
    })  
  }

  if (signupForm && !signupForm.dataset.listenerAttached) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault()

      const username = signupUsernameInput.value.trim()
      const password = signupPasswordInput.value.trim()
      const email = signupEmailInput.value.trim()

      if (!username || !password || !email) {
        alert('Please fill in both fields.')
        return
      }
    
      try {
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'app/json',
          },
          body: JSON.stringify({ username, password })
        })
      
        const data = await response.json()
      
        if (data.success) {
          sharedState.isLoggedIn = true
          signupModal?.classList.add('hidden')
          signupForm.reset()
          await setupUserSection(data.user)
        } else {
          alert('Signup failed: ' + data.message)
        }
      
      } catch (err) {
        console.error(err)
        alert('Failed to connect to the server.')
      }
    })
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
