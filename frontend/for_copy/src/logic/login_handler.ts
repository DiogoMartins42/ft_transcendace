import { sharedState } from '../main'
import { setupUserSection } from "./userSection";
import  loading  from '../components/loading.html?raw'

const BACKEND_LOGIN_URL = `${import.meta.env.VITE_API_URL}/auth/login`; // placeholder backend URL

export function setupLoginForm()
{
	const loginModal = document.getElementById('login-modal') as HTMLElement | null;
	const signupModal = document.getElementById('signup-modal') as HTMLElement | null;
	const openBtnLogin = document.getElementById('open-login') as HTMLButtonElement | null;
	const openBtnSignup = document.getElementById('open-signup') as HTMLElement | null;
	const loginForm = document.getElementById('login-form') as HTMLFormElement | null;
	const emailInput = document.getElementById('login-email') as HTMLInputElement | null;
	const passwordInput = document.getElementById('login-password') as HTMLInputElement | null;
	const loginSubmit = document.getElementById('login-submit') as HTMLButtonElement | null;
	const loginMessage = document.getElementById('login-message') as HTMLElement | null;

	if (!loginModal || !openBtnLogin || !loginForm || !emailInput || !passwordInput || !loginSubmit) {
		console.warn("Login modal setup failed: missing elements.");
		return;
	}

	// Open / close login modal
	openBtnLogin.addEventListener('click', () => {
		loginModal.classList.toggle('hidden');
	});

	// Close login modal when clicking outside content
	loginModal.addEventListener('click', (e) => {
		if (e.target === loginModal) {
			loginModal.classList.add('hidden');
		}
	});

	// Switch to signup modal
	if (openBtnSignup && signupModal) {
		openBtnSignup.addEventListener('click', () => {
			loginModal.classList.add('hidden');
			signupModal.classList.remove('hidden');
		});
	}

	// Enable/disable login button
	function validateInputs() {
		if (emailInput!.value.trim() && passwordInput!.value.trim()) {
			loginSubmit!.disabled = false;
		} else {
			loginSubmit!.disabled = true;
		}
	}
	emailInput.addEventListener('input', validateInputs);
	passwordInput.addEventListener('input', validateInputs);

	// Show message helper
	function showMessage(msg: string) {
		if (!loginMessage) return;
		loginMessage.textContent = msg;
		loginMessage.classList.remove('hidden');
		loginMessage.classList.toggle('text-red-500');
	}

	// Reset message
	function clearMessage() {
		if (loginMessage) loginMessage.classList.add('hidden');
	}

	// Handle form submit
	loginForm.addEventListener('submit', async (e) => {
		e.preventDefault();
		clearMessage();

		// Save button original text
		const originalText = loginSubmit.innerHTML;

		// Set loading spinner
		loginSubmit.innerHTML = `${loading}`;
		loginSubmit.disabled = true;

		// Timeout setup
		const controller = new AbortController();
		const timeoutId = setTimeout(() => controller.abort(), 15000);

		try {
			const response = await fetch(BACKEND_LOGIN_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: emailInput.value,
					password: passwordInput.value
				}),
				signal: controller.signal
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				// Login failed
				showMessage("Invalid email or password");
				passwordInput.value = "";
				validateInputs();
				loginSubmit.innerHTML = originalText;
				loginSubmit.disabled = false;
				return;
			}

			// Parse JSON from backend
    		const data = await response.json();

			// Success
			sharedState.isLoggedIn = true;
			sharedState.username = data.username;
			sharedState.avatarUrl = data.avatarUrl;
			loginModal.classList.add('hidden');
			emailInput.value = "";
			passwordInput.value = "";
			loginSubmit.innerHTML = originalText;
			loginSubmit.disabled = true;
			setupUserSection();

		} catch (err) {
			if (controller.signal.aborted) {
				// Timeout
				showMessage("Login request timed out. Please try again.");
				emailInput.value = "";
				passwordInput.value = "";
			} else {
				showMessage("An error occurred. Please try again.");
			}
			loginSubmit.innerHTML = originalText;
			loginSubmit.disabled = true;
		}
	});


	// ******** TEST ONLY ******** //

	const TEST_ONLY = document.getElementById('forgotPass') as HTMLElement | null;
	TEST_ONLY!.addEventListener('click', () => {
			sharedState.isLoggedIn = true;
			loginModal.classList.add('hidden');
		});
	

	// ******** TEST ONLY ******** //
}
