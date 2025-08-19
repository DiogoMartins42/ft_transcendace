import { sharedState } from '../main'

export function setupSidebarEvents()
{
	const menuToggleBtn = document.getElementById('menu-toggle') as HTMLButtonElement;
	const menuIcon = document.getElementById('menu-icon') as HTMLImageElement;
	const sidebar = document.getElementById('sidebar') as HTMLElement;
	const pageContent = document.getElementById('page-content') as HTMLElement;

	const iconUnclicked = '../assets/menu-icon-default.png';
	const iconClicked = '../assets/menu-icon-clicked.png';

	if (!menuToggleBtn || !sidebar || !pageContent || !menuIcon) return;

	menuToggleBtn.addEventListener('click', () => {
		sharedState.sidebarOpen = !sharedState.sidebarOpen;

		if (sharedState.sidebarOpen) {
			sidebar.classList.remove('-translate-x-full');
			menuIcon.src = iconClicked;
			pageContent.classList.add('ml-48'); // push content to the right
		} else {
			sidebar.classList.add('-translate-x-full');
			menuIcon.src = iconUnclicked;
			pageContent.classList.remove('ml-48');
		}
	})
}
