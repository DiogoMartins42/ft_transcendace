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
import controlPanelHtml from './components/controlPanel-modal.html?raw'
import gameSettingsHtml from './components/gameSettings.html?raw'
import friendsHtml from './pages/friend_list.html?raw'

import { setupUserSection } from './logic/userSection'
import { setupSidebarEvents } from './logic/sidebar'
import { initWebSocket, disconnectWebSocket, sendMessage } from './logic/ws'
import { verifyStoredSession } from './logic/session'
import { setupPong } from "./logic/setupPong";
import { setupChat, handleIncomingMessage } from './logic/chat'
import { setupControlPanel } from './logic/controlPanel'
// import { setupGameSettings } from './logic/gameSettings'
import { initFriendsPage } from './logic/friend_list';
import { setupStatsPage } from './logic/stats'
import { setupLoginForm } from './logic/login_handler'
import { setupSignupForm } from './logic/signup_handler'
import { setupOAuth, handleOAuthCallback, initOAuthUI } from './logic/oauth'

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
    const wasLoggedIn = this._isLoggedIn
    
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
    
    if (changed) {
      if (wasLoggedIn !== this._isLoggedIn) {
        handleAuthStateChange(this._isLoggedIn)
      }
      this.listeners.forEach(fn => fn())
    }
  }

  subscribe(fn: StateListener) {
    this.listeners.push(fn)
  }
}

// --- Auth State Management ---
export function handleAuthStateChange(isLoggedIn: boolean) {
  if (isLoggedIn) {
    console.log('🔌 Initializing WebSocket for logged-in user...')
    initWebSocket((msg: any) => {
      console.log('📥 WebSocket message received in main:', msg)
      handleIncomingMessage(msg)
    })
  } else {
    console.log('🔌 Disconnecting WebSocket - user logged out')
    disconnectWebSocket()
  }
}

// --- Persistent Login Setup ---
interface StoredUser {
  username: string
  avatarUrl?: string
  token: string
}

// Shared state instance and helpers
export const sharedState = new SharedState()

export function setSharedState(partial: Partial<{ isLoggedIn: boolean; username?: string; avatarUrl?: string }>) {
  sharedState.setState(partial)
}

export function saveSession(token: string, userData: any) {
  const stored: StoredUser = {
    username: userData.username,
    avatarUrl: userData.avatarUrl,
    token
  }
  localStorage.setItem('userSession', JSON.stringify(stored))
}

// Login/Logout functions for use in other modules
export async function handleLogin(token: string, userData: any) {
  saveSession(token, userData)
  setSharedState({
    isLoggedIn: true,
    username: userData.username,
    avatarUrl: userData.avatarUrl
  })
}

export function handleLogout() {
  localStorage.removeItem("userSession")
  setSharedState({
    isLoggedIn: false,
    username: undefined,
    avatarUrl: undefined
  })
}

// Expose WebSocket functions globally for other modules
function exposeWebSocketFunctions() {
  (window as any).initWebSocket = initWebSocket;
  (window as any).sendMessage = sendMessage;
  (window as any).disconnectWebSocket = disconnectWebSocket;
  console.log('🔌 WebSocket functions exposed globally');
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
    ${gameSettingsHtml}
  `

  // Always expose WebSocket functions, even if user is not logged in
  exposeWebSocketFunctions();
  
  setupUserSection()
  setupSidebarEvents()
  setupChat()
  setupPong()
  setupControlPanel()
  // setupGameSettings()
  setupStatsPage()
  setupLoginForm()   
  setupSignupForm()
  setupOAuth()
  setupStatsPage()
  initFriendsPage()
}

function handleRoute()
{
	const route = window.location.hash.slice(1) || 'home';

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
    case 'friends':
      renderPage(friendsHtml)
      break
		default:
			renderPage(homeHtml)
	}
	sidebarState.sidebarOpen = false;
}

window.addEventListener('error', (event) => {
  console.error('🛑 Global error caught:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🛑 Unhandled promise rejection:', event.reason);
});

window.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 App initializing...')

  // Process OAuth return (if any) BEFORE checking stored session
  try {
    await handleOAuthCallback()
  } catch (err) {
    console.error('OAuth callback handling failed:', err)
  }

  // Init OAuth UI (show/hide Google button) early
  try {
    await initOAuthUI()
  } catch (err) {
    console.warn('initOAuthUI failed:', err)
  }

  // 1. Verify session after possible OAuth login
  const hasValidSession = await verifyStoredSession()

  // 2. Initialize WebSocket only if user is logged in
  if (hasValidSession) {
    console.log('🔌 Initializing WebSocket for authenticated user...')
    initWebSocket((msg: any) => {
      console.log('📥 WebSocket message received in main:', msg)
      handleIncomingMessage(msg)
    })
  } else {
    console.log('🚫 No valid session, skipping WebSocket initialization')
  }
  
  // 3. Always expose WebSocket functions globally for other modules
  exposeWebSocketFunctions();
  
  // 4. Render initial page
  await handleRoute()
})

window.addEventListener('hashchange', handleRoute)