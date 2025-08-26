import { sidebarState } from '../main'

export function setupSidebarEvents()
{
	const menuToggleInput = document.getElementById('menu-toggle') as HTMLInputElement;
	const sidebar = document.getElementById('sidebar') as HTMLElement;
	const pageContent = document.getElementById('page-content') as HTMLElement;

	if (!menuToggleInput || !sidebar || !pageContent) return;

	menuToggleInput.addEventListener('change', () => {
		sidebarState.sidebarOpen = menuToggleInput.checked;

		if (sidebarState.sidebarOpen) {
			sidebar.classList.remove('-translate-x-full');
			pageContent.classList.add('ml-48'); // push content to the right
		} else {
			sidebar.classList.add('-translate-x-full');
			pageContent.classList.remove('ml-48');
		}
	})
}
