import './style.css'
import homeHtml from './pages/home.html?raw'
import navbarHtml from './components/navbar.html?raw'
import aboutHtml from './pages/about.html?raw'
import chatHtml from './pages/chat.html?raw'
import contactHtml from './pages/contact.html?raw'
import statsHtml from './pages/stats.html?raw'
import userSettingsHtml from './pages/userSettings.html?raw'
import loginModalHtml from './components/login-modal.html?raw'
import signupModalHtml from './components/signup-modal.html?raw'
import sidebarHtml from './components/sidebar.html?raw'
// import navLoggedinHtml from './components/navLoggedin.html?raw'
// import navLoggedoutHtml from './components/navLoggedout.html?raw'

import { setupModalEvents } from './logic/simulatedModals'
import { setupUserSection } from './logic/simulatedUserSection'
// import { setupModalEvents } from './logic/modals'
// import { setupUserSection } from './logic/userSection'
import { setupSidebarEvents } from './logic/sidebar'

const app = document.querySelector<HTMLDivElement>('#app')!

export const sharedState = 
{
	isLoggedIn: false,
	sidebarOpen: false,
};

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

function handleRoute() {
  const route = window.location.hash.slice(1) || 'home'

  switch (route) {
    case 'about':
      renderPage(aboutHtml)
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
  sharedState.sidebarOpen = false
}

window.addEventListener('DOMContentLoaded', handleRoute)
window.addEventListener('hashchange', handleRoute)
