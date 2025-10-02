import navLoggedoutHtml from '../components/navLoggedout.html?raw'
import navLoggedinHtml from '../components/navLoggedin.html?raw'
import { setupLoginForm } from './login_handler'
import { setupSignupForm } from './signup_handler'
import { sharedState } from '../main'

export async function setupUserSection(user?: { username?: string; avatarUrl?: string }) {
	if (user) {
        sharedState.username = user.username;
        sharedState.avatarUrl = user.avatarUrl;
    }
	const userSection = document.getElementById('user-section') as HTMLDivElement | null;
	if (!userSection) {
		console.warn("⚠️ user-section not found in DOM");
		return;
	}

	function render()
	{
		if (sharedState.isLoggedIn) {
			userSection!.innerHTML = navLoggedinHtml;

			// Populate username
			const greeting = document.getElementById("user-greeting");
			if (greeting) {
				greeting.textContent = sharedState.username ? ` ${sharedState.username}` : " User";
			}

			// Sync avatar images (navbar & modal)
			const avatar = document.getElementById("user-avatar") as HTMLImageElement | null;
			const defaultAvatar = document.getElementById("default-avatar") as SVGElement | null;
			const avatarModal = document.getElementById("user-avatar-modal") as HTMLImageElement | null;
			const defaultAvatarModal = document.getElementById("default-avatar-modal") as SVGElement | null;

			if (sharedState.avatarUrl) {
				if (avatar) { avatar.src = sharedState.avatarUrl; avatar.classList.remove("hidden"); }
				if (defaultAvatar) defaultAvatar.classList.add("hidden");
				if (avatarModal) { avatarModal.src = sharedState.avatarUrl; avatarModal.classList.remove("hidden"); }
				if (defaultAvatarModal) defaultAvatarModal.classList.add("hidden");
			} else {
				if (avatar) avatar.classList.add("hidden");
				if (defaultAvatar) defaultAvatar.classList.remove("hidden");
				if (avatarModal) avatarModal.classList.add("hidden");
				if (defaultAvatarModal) defaultAvatarModal.classList.remove("hidden");
			}

			// Setup logout click
			const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement | null;
			if (logoutBtn) {
				logoutBtn.addEventListener("click", () => {
					// reset state
					sharedState.isLoggedIn = false;
					sharedState.username = undefined;
					sharedState.avatarUrl = undefined;
				});
			}
		} else {
			userSection!.innerHTML = navLoggedoutHtml;
			// after injecting logged-out HTML we need to init login/signup handlers
			setupLoginForm();
			setupSignupForm();
		}
	}

	// initial render
	render();

	// re-render when sharedState changes (assuming sharedState has subscribe or you call render externally)
	if ((sharedState as any).subscribe) {
		(sharedState as any).subscribe(render);
	} else {
		// Fallback: if you don't have subscribe, you should call setupUserSection() again after login
	}
}

