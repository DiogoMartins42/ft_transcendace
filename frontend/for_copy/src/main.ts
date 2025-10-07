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

// import { setupModalEvents } from './logic/simulatedModals'
// import { setupUserSection } from './logic/simulatedUserSection'
// import { setupModalEvents } from './logic/modals'
import { setupUserSection } from './logic/userSection'

// import { setupLoginForm } from './logic/login_handler'

import { setupSidebarEvents } from './logic/sidebar'

import { initWebSocket } from './logic/ws';
import { setupChat } from './logic/chat';

import { setPong } from './logic/pong'
import { setupControlPanel } from './logic/controlPanel'

import { setupStatsPage } from './logic/stats';

const app = document.querySelector<HTMLDivElement>('#app')!

export const sidebarState: {sidebarOpen: boolean} = { sidebarOpen: false }

class SharedState 
{
	private _isLoggedIn = false;
	private listeners: (() => void)[] = [];

	username?: string;
	avatarUrl?: string;

	get isLoggedIn() {
		return this._isLoggedIn;
	}

	set isLoggedIn(val: boolean) {
		this._isLoggedIn = val;
		this.listeners.forEach(fn => fn()); // trigger re-render
	}

	subscribe(fn: () => void) {
		this.listeners.push(fn);
	}
}

export const sharedState = new SharedState();

async function renderPage(pageHtml: string)
{
	app.innerHTML =
	`
		${navbarHtml}
		<main id="page-content" class="transition-all duration-300 pt-16 p-4">
			${pageHtml}
		</main>
		${loginModalHtml}
		${signupModalHtml}
		${sidebarHtml}
		${controlPanelHtml}
	`

	// setupLoginForm()
	// setupModalEvents();
	setupUserSection();
	setupSidebarEvents();

	setupChat();


	setPong();
	setupControlPanel();

	setupStatsPage();
}

function handleRoute()
{
	const route = window.location.hash.slice(1) || 'home';

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
	sidebarState.sidebarOpen = false;
}

window.addEventListener('DOMContentLoaded', handleRoute);

window.addEventListener('hashchange', handleRoute);
