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

import { setupStatsPage } from './logic/stats';

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

export function loadUserSession() {
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

  // --- SAFE websocket message handling (this is the changed part) ---
  initWebSocket((msg: unknown) => {
    const chatMessages = document.getElementById('chat-messages')
    if (!chatMessages) return

    const div = document.createElement('div')

    // helper to convert unknown msg into a display string
    const msgToText = (m: unknown): string => {
      if (m === null || m === undefined) return ''

      // string payload (maybe JSON string)
      if (typeof m === 'string') {
        // try to parse JSON string. If it fails, show the raw string.
        try {
          const parsed = JSON.parse(m) as any
          if (parsed && typeof parsed === 'object') {
            return String(parsed.chat ?? parsed.message ?? JSON.stringify(parsed))
          }
          return String(parsed)
        } catch {
          return m
        }
      }

      // object payload
      if (typeof m === 'object') {
        const o = m as Record<string, any>
        return String(o.chat ?? o.message ?? JSON.stringify(o))
      }

      // number/boolean/other
      return String(m)
    }

    div.textContent = msgToText(msg)
    chatMessages.appendChild(div)
    chatMessages.scrollTop = chatMessages.scrollHeight
  })

  setupChat()

  setPong()
  setupControlPanel()

  setupStatsPage()
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
  sidebarState.sidebarOpen = false
}

window.addEventListener('DOMContentLoaded', async () => {
  await verifyStoredSession()  // restores session if JWT exists
  handleRoute()                // then render the page
})
window.addEventListener('hashchange', handleRoute)

