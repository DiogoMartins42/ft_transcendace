// main.ts
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
import controlPanelHtml from './components/controlPanel-modal.html?raw'


import { setupUserSection } from './logic/userSection'
import { setupSidebarEvents } from './logic/sidebar'
import { initWebSocket } from './logic/ws'
import { verifyStoredSession } from './logic/session'
import { setupChat, handleIncomingMessage } from './logic/chat'
import { setPong } from './logic/pong'
import { setupControlPanel } from './logic/controlPanel'
import { setupStatsPage } from './logic/stats'


const app = document.querySelector<HTMLDivElement>('#app')!

export const sidebarState: { sidebarOpen: boolean } = { sidebarOpen: false }

type StateListener = () => void

class SharedState {
  private _isLoggedIn = false
  private _username?: string
  private _avatarUrl?: string
  private listeners: StateListener[] = []

  get isLoggedIn() {
    return this._isLoggedIn
  }

  get username() {
    return this._username
  }

  get avatarUrl() {
    return this._avatarUrl
  }

  setState(partial: Partial<{ isLoggedIn: boolean; username?: string; avatarUrl?: string }>) {
    let changed = false
    if (partial.isLoggedIn !== undefined && partial.isLoggedIn !== this._isLoggedIn) {
      this._isLoggedIn = partial.isLoggedIn
      changed = true
    }
    if (partial.username !== undefined && partial.username !== this._username) {
      this._username = partial.username
      changed = true
    }
    if (partial.avatarUrl !== undefined && partial.avatarUrl !== this._avatarUrl) {
      this._avatarUrl = partial.avatarUrl
      changed = true
    }
    if (changed) this.listeners.forEach(fn => fn())
  }

  subscribe(fn: StateListener) {
    this.listeners.push(fn)
  }
}

export const sharedState = new SharedState()

// --- Persistent Login Setup ---
interface StoredUser {
  username: string
  avatarUrl?: string
  token: string
}

export function saveSession(token: string, user: { username: string; avatarUrl?: string }) {
  localStorage.setItem("userSession", JSON.stringify({ token, ...user }));
}

export function loadUserSession(): StoredUser | null {
  const data = localStorage.getItem("userSession");
  return data ? JSON.parse(data) : null;
}

export function setSharedState(partial: Partial<{ isLoggedIn: boolean; username?: string; avatarUrl?: string }>) {
  sharedState.setState(partial)
}

async function renderPage(pageHtml: string) {
  app.innerHTML = `
    ${navbarHtml}
    <main id="page-content" class="transition-all duration-300 pt-16 p-4">
      ${pageHtml}
    </main>
    ${loginModalHtml}
    ${signupModalHtml}
    ${sidebarHtml}
    ${controlPanelHtml}
  `

  setupUserSection()
  setupSidebarEvents()
  setupChat()
  setPong()
  setupControlPanel()
  setupStatsPage()
}

async function handleRoute() {
  const route = window.location.hash.slice(1) || 'home'

  switch (route) {
    case 'about':
      await renderPage(aboutHtml)
      break
    case 'chat':
      await renderPage(chatHtml)
      break
    case 'contact':
      await renderPage(contactHtml)
      break
    case 'stats':
      await renderPage(statsHtml)
      break
    case 'userSettings':
      await renderPage(userSettingsHtml)
      break
    default:
      await renderPage(homeHtml)
  }
  sidebarState.sidebarOpen = false
}

window.addEventListener('error', (event) => {
  console.error('🛑 Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🛑 Unhandled promise rejection:', event.reason);
});

window.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 App initializing...')
  
  // 1. Verify session first
  await verifyStoredSession()
  
  // 2. Initialize WebSocket with the chat message handler
  console.log('🔌 Initializing WebSocket...')
  initWebSocket((msg: any) => {
    console.log('📥 WebSocket message received in main:', msg)
    handleIncomingMessage(msg)
  })
  
  // 3. Render initial page
  await handleRoute()
})

window.addEventListener('hashchange', handleRoute)