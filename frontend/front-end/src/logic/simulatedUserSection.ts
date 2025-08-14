import navLoggedoutHtml from '../components/navLoggedout.html?raw'
import navLoggedinHtml from '../components/navLoggedin.html?raw'
import { setupModalEvents } from './simulatedModals'
import { sharedState } from '../main'

export async function setupUserSection() {
	const userSection = document.getElementById('user-section') as HTMLDivElement;

	const username = "Luke Skywalker";
	const avatarUrl = "../assets/avatar-default-icon.png";

	if (sharedState.isLoggedIn) {
		userSection.innerHTML = navLoggedinHtml.replace('{{username}}', username).replace('{{avatarUrl}}', avatarUrl);

		const toggle = document.getElementById('user-toggle')!
		const menu = document.getElementById('user-menu')!

		toggle.addEventListener('click', () => {
			menu.classList.toggle('hidden');
		})

		document.addEventListener('click', (e) => {
			if (!userSection.contains(e.target as Node)) {
				menu.classList.add('hidden');
			}
		})

		const logoutBtn = document.getElementById('logout-btn')!
		logoutBtn.addEventListener('click', async () => {
			// userSection.innerHTML = navLoggedoutHtml
			sharedState.isLoggedIn = false;
			await setupUserSection();
		})
	} else {
		// const navLoggedoutHtml = await loadHtml('./components/navLoggedout.html')
		userSection.innerHTML = navLoggedoutHtml;
		setupModalEvents();
	}
}
