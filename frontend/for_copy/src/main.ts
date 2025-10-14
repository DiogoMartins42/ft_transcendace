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
import { setupChat } from './logic/chat'
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

  // ✅ Initialize WebSocket with token and message handler
  const session = loadUserSession()
  const token = session?.token

  initWebSocket((msg: any) => {
  const chatMessages = document.getElementById('chat-messages')
  if (!chatMessages) return

  const div = document.createElement('div')

  if (msg.type === 'message') {
    div.textContent = `💬 ${msg.from}: ${msg.content}`
  } else if (msg.type === 'invite_game') {
    div.textContent = `🎮 Game invite from ${msg.from}`
  } else if (msg.type === 'tournament_notify') {
    div.textContent = `🏆 Tournament: ${msg.message}`
  } else if (msg.type === 'profile') {
    div.textContent = `👤 Profile: ${JSON.stringify(msg.profile)}`
  } else if (msg.type === 'info') {
    div.textContent = `ℹ️ ${msg.message}`
  } else {
    div.textContent = `⚙️ ${JSON.stringify(msg)}`
  }

  chatMessages.appendChild(div)
  chatMessages.scrollTop = chatMessages.scrollHeight
})


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

window.addEventListener('DOMContentLoaded', async () => {
  await verifyStoredSession()
  await handleRoute()
})

window.addEventListener('hashchange', handleRoute)
