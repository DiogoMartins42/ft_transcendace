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

import { initWebSocket, sendMessage } from './logic/ws'
import { setupChat } from './logic/chat'
//import { setupModalEvents } from './logic/simulatedModals'
//import { setupUserSection } from './logic/simulatedUserSection'
import { setupModalEvents } from './logic/modals'
import { setupUserSection } from './logic/userSection'

import { setupSidebarEvents } from './logic/sidebar'

import { setPong } from './logic/pong'
import { setupControlPanel } from './logic/controlPanel'

const app = document.querySelector<HTMLDivElement>('#app')!

export const sharedState: {isLoggedIn: boolean, sidebarOpen: boolean} = 
{
	isLoggedIn: false,
	sidebarOpen: false,
};

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

	setupModalEvents();
	setupSidebarEvents();
	setupUserSection();
  setupModalEvents()
  setupSidebarEvents()
  setupUserSection()
  setPong()
  setupChat()
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
	sharedState.sidebarOpen = false;
}

//window.addEventListener('DOMContentLoaded', handleRoute)
window.addEventListener('DOMContentLoaded', () => {
  handleRoute();

  // Start WebSocket
  initWebSocket((msg) => {
    console.log("Frontend received WS:", msg);

    // Example: if we’re on chat page, show message
    if (window.location.hash.slice(1) === "chat") {
      const chatBox = document.querySelector("#chat-messages");
      if (chatBox) {
        const div = document.createElement("div");
        div.textContent = JSON.stringify(msg);
        chatBox.appendChild(div);
      }
    }
  });
});

window.addEventListener('hashchange', handleRoute)
