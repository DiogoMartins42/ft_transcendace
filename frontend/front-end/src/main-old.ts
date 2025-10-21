import './style.css'
import homeHtml from './pages/home.html?raw'
import navbarHtml from './components/navbar.html?raw'
import aboutHtml from './pages/about.html?raw'
import tournamentHtml from './pages/tournament.html?raw'
import chatHtml from './pages/chat.html?raw'
import contactHtml from './pages/contact.html?raw'
import statsHtml from './pages/stats.html?raw'
import userSettingsHtml from './pages/userSettings.html?raw'
import loginModalHtml from './components/login-modal.html?raw'
import signupModalHtml from './components/signup-modal.html?raw'
import sidebarHtml from './components/sidebar.html?raw'
import navLoggedinHtml from './components/navLoggedin.html?raw'
import navLoggedoutHtml from './components/navLoggedout.html?raw'

const app = document.querySelector<HTMLDivElement>('#app')!

let isLoggedIn = false

async function renderPage(pageHtml: string) {
  app.innerHTML = `
    ${navbarHtml}
    <main id="page-content" class="transition-all duration-300 pt-16 p-4">
      ${pageHtml}
    </main>
    ${loginModalHtml}
    ${signupModalHtml}
    ${sidebarHtml}
  `

  setupModalEvents()
  setupSidebarEvents()
  setupUserSection()
}

let sidebarOpen = false

function handleRoute() {
  const route = window.location.hash.slice(1) || 'home'

  switch (route) {
    case 'about':
      renderPage(aboutHtml)
      break
    case 'tournament':
      renderPage(tournamentHtml)
      break  
    case 'chat':
      renderPage(chatHtml)
      break
    case 'contact':
      renderPage(contactHtml)
      break
    case 'stats':
      renderPage(statsHtml)
      break
    case 'userSettings':
      renderPage(userSettingsHtml)
      break
    default:
      renderPage(homeHtml)
  }
  sidebarOpen = false
}

window.addEventListener('DOMContentLoaded', handleRoute)
window.addEventListener('hashchange', handleRoute)



//////////////////// Frontend only //////////////////////////
///////////// Status: tested and working



function setupModalEvents() {
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

      isLoggedIn = true
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

async function setupUserSection() {
  const userSection = document.getElementById('user-section') as HTMLDivElement

  const username = "Anakin Skywalker"
  const avatarUrl = "../assets/avatar-default-icon.png"

  if (isLoggedIn) {
    userSection.innerHTML = navLoggedinHtml.replace('{{username}}', username).replace('{{avatarUrl}}', avatarUrl)

    const toggle = document.getElementById('user-toggle')!
    const menu = document.getElementById('user-menu')!

    toggle.addEventListener('click', () => {
      menu.classList.toggle('hidden')
    })

    document.addEventListener('click', (e) => {
      if (!userSection.contains(e.target as Node)) {
        menu.classList.add('hidden')
      }
    })

    const logoutBtn = document.getElementById('logout-btn')!
    logoutBtn.addEventListener('click', async () => {
      // userSection.innerHTML = navLoggedoutHtml
      isLoggedIn = false
      await setupUserSection()
    })

  } else {
    // const navLoggedoutHtml = await loadHtml('./components/navLoggedout.html')
    userSection.innerHTML = navLoggedoutHtml
    setupModalEvents()
  }
}




//////////////////// Frontend & Backend //////////////////////////
//// Status: not tested

// function setupModalEvents() {
//   const loginModal = document.getElementById('login-modal')
//   const signupModal = document.getElementById('signup-modal')
//   const openBtnLogin = document.getElementById('open-login')
//   const cancelBtnLogin = document.getElementById('cancel-login')
//   const openBtnSignup = document.getElementById('open-signup')
//   const cancelBtnSignUp = document.getElementById('cancel-signup')

//   const loginForm = document.getElementById('login-form') as HTMLFormElement
//   const usernameInput = document.getElementById('login-username') as HTMLInputElement
//   const passwordInput = document.getElementById('login-password') as HTMLInputElement
//   const signupForm = document.getElementById('signup-form') as HTMLFormElement
//   const signupUsernameInput = document.getElementById('signup-username') as HTMLInputElement
//   const signupPasswordInput = document.getElementById('signup-password') as HTMLInputElement
//   const signupEmailInput = document.getElementById('signup-email') as HTMLInputElement

//   openBtnLogin?.addEventListener('click', () => {
//     loginModal?.classList.remove('hidden')
//   })

//   cancelBtnLogin?.addEventListener('click', () => {
//     loginModal?.classList.add('hidden')
//   })

//    if (loginForm && !loginForm.dataset.listenerAttached) {
//     loginForm.addEventListener('submit', async (e) => {
//       e.preventDefault()

//       const username = usernameInput.value.trim()
//       const password = passwordInput.value.trim()

//       if (!username || !password) {
//         alert('Please fill in both username and password.')
//         return
//       }

//       try {
//         const response = await fetch('/api/login', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'app/json',
//           },
//           body: JSON.stringify({ username, password })
//         })

//         const data = await response.json()

//         if (data.success) {
//           isLoggedIn = true
//           loginModal?.classList.add('hidden')
//           loginForm.reset()
//           await setupUserSection(data.user) // pass user info
//         } else {
//           alert('Invalid login credentials.')
//         }

//       } catch (err) {
//         console.error(err)
//         alert('Failed to connect to the server.')
//       }
//     })  
//   }

//   if (signupForm && !signupForm.dataset.listenerAttached) {
//     signupForm.addEventListener('submit', async (e) => {
//       e.preventDefault()

//       const username = signupUsernameInput.value.trim()
//       const password = signupPasswordInput.value.trim()
//       const email = signupEmailInput.value.trim()

//       if (!username || !password || !email) {
//         alert('Please fill in both fields.')
//         return
//       }
    
//       try {
//         const response = await fetch('/api/signup', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'app/json',
//           },
//           body: JSON.stringify({ username, password })
//         })
      
//         const data = await response.json()
      
//         if (data.success) {
//           isLoggedIn = true
//           signupModal?.classList.add('hidden')
//           signupForm.reset()
//           await setupUserSection(data.user)
//         } else {
//           alert('Signup failed: ' + data.message)
//         }
      
//       } catch (err) {
//         console.error(err)
//         alert('Failed to connect to the server.')
//       }
//     })
//   }

//   loginModal?.addEventListener('click', (e) => {
//     if (e.target === loginModal) {
//       loginModal.classList.add('hidden')
//     }
//   })

//   openBtnSignup?.addEventListener('click', () => {
//     signupModal?.classList.remove('hidden')
//   })

//   cancelBtnSignUp?.addEventListener('click', () => {
//     signupModal?.classList.add('hidden')
//   })

//   // Optional: Close modal if you click outside the form
//   signupModal?.addEventListener('click', (e) => {
//     if (e.target === signupModal) {
//       signupModal.classList.add('hidden')
//     }
//   })
// }

// async function setupUserSection(user?: { username: string, avatarUrl: string }) {
//   const userSection = document.getElementById('user-section') as HTMLDivElement

//   const username = user?.username || 'User'
//   const avatarUrl = user?.avatarUrl || '../assets/avatar-default-icon.png'

//   if (isLoggedIn) {
//     userSection.innerHTML = navLoggedinHtml.replace('{{username}}', username).replace('{{avatarUrl}}', avatarUrl)

//     const toggle = document.getElementById('user-toggle')!
//     const menu = document.getElementById('user-menu')!

//     toggle.addEventListener('click', () => {
//       menu.classList.toggle('hidden')
//     })

//     document.addEventListener('click', (e) => {
//       if (!userSection.contains(e.target as Node)) {
//         menu.classList.add('hidden')
//       }
//     })

//     const logoutBtn = document.getElementById('logout-btn')!
//     logoutBtn.addEventListener('click', async () => {
//       // userSection.innerHTML = navLoggedoutHtml
//       isLoggedIn = false
//       await setupUserSection()
//     })

//   } else {
//     // const navLoggedoutHtml = await loadHtml('./components/navLoggedout.html')
//     userSection.innerHTML = navLoggedoutHtml
//     setupModalEvents()
//   }
// }


///////// End of differences /////////

function setupSidebarEvents() {
  const menuToggleBtn = document.getElementById('menu-toggle') as HTMLButtonElement
  const menuIcon = document.getElementById('menu-icon') as HTMLImageElement
  const sidebar = document.getElementById('sidebar') as HTMLElement
  const pageContent = document.getElementById('page-content') as HTMLElement

  const iconUnclicked = '../assets/menu-icon-default.png'
  const iconClicked = '../assets/menu-icon-clicked.png'

  if (!menuToggleBtn || !sidebar || !pageContent || !menuIcon) return

  menuToggleBtn.addEventListener('click', () => {
    sidebarOpen = !sidebarOpen

    if (sidebarOpen) {
      sidebar.classList.remove('-translate-x-full')
      menuIcon.src = iconClicked
      pageContent.classList.add('ml-48') // push content to the right
    } else {
      sidebar.classList.add('-translate-x-full')
      menuIcon.src = iconUnclicked
      pageContent.classList.remove('ml-48')
    }
  })
}
