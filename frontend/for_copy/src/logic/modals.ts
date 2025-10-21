import { setupUserSection } from './userSection'
import { sharedState } from '../main'

export function setupModalEvents()
{
	const loginModal = document.getElementById('login-modal');
	const signupModal = document.getElementById('signup-modal');
	const openBtnLogin = document.getElementById('open-login');
	const cancelBtnLogin = document.getElementById('cancel-login');
	const openBtnSignup = document.getElementById('open-signup');
	const cancelBtnSignUp = document.getElementById('cancel-signup');

	const loginForm = document.getElementById('login-form') as HTMLFormElement;
	const emailInput = document.getElementById('login-email') as HTMLInputElement;
	const passwordInput = document.getElementById('login-password') as HTMLInputElement;
	const signupForm = document.getElementById('signup-form') as HTMLFormElement;
	const signupUsernameInput = document.getElementById('signup-username') as HTMLInputElement;
	const signupPasswordInput = document.getElementById('signup-password') as HTMLInputElement;
	const signupEmailInput = document.getElementById('signup-email') as HTMLInputElement;

	const API_BASE = 'http://localhost:3000'; // change if you deploy elsewhere

	
	// -------- LOGIN --------
	if (loginForm && !loginForm.dataset.listenerAttached) {
		loginForm.addEventListener('submit', async (e) => {
			e.preventDefault();

			const email = emailInput.value.trim();
			const password = passwordInput.value.trim();

		if (!email || !password) {
			alert('Please fill in both email and password.');
			return;
		}

		try {
			const response = await fetch(`${API_BASE}/login`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ email, password })
			})

			const data = await response.json();

        	if (!response.ok) {
        		alert(data.error || 'Invalid login credentials.');
        		return;
        	}

			localStorage.setItem('token', data.token);
			sharedState.isLoggedIn = true;
			sharedState.username = data.username;
			sharedState.avatarUrl = data.avatarUrl || '';
			loginModal?.classList.add('hidden');
			loginForm.reset();
			await setupUserSection();
			} catch (err) {
				console.error(err);
				alert('Failed to connect to the server.');
			}
		})
		loginForm.dataset.listenerAttached = 'true';
	}

	// -------- SIGNUP --------
	if (signupForm && !signupForm.dataset.listenerAttached) {
		signupForm.addEventListener('submit', async (e) => {
			e.preventDefault();

		const username = signupUsernameInput.value.trim();
		const email = signupEmailInput.value.trim();
		const password = signupPasswordInput.value.trim();

		if (!username || !email || !password) {
			alert('Please fill in all fields.');
			return;
		}

		try {
			const response = await fetch(`${API_BASE}/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ username, email, password })
			})

			const data = await response.json();

    		if (!response.ok) {
    			alert(data.error || 'Signup failed.');
    			return;
    		}

			alert('Signup successful! You can now log in.');
			signupModal?.classList.add('hidden');
			signupForm.reset();
			} catch (err) {
				console.error(err);
				alert('Failed to connect to the server.');
			}
		})
		signupForm.dataset.listenerAttached = 'true';
	}

	// -------- MODAL EVENTS --------
	openBtnLogin?.addEventListener('click', () => loginModal?.classList.remove('hidden'));
	cancelBtnLogin?.addEventListener('click', () => loginModal?.classList.add('hidden'));
	openBtnSignup?.addEventListener('click', () => signupModal?.classList.remove('hidden'));
	cancelBtnSignUp?.addEventListener('click', () => signupModal?.classList.add('hidden'));

	loginModal?.addEventListener('click', (e) => { if (e.target === loginModal) loginModal.classList.add('hidden') });
	signupModal?.addEventListener('click', (e) => { if (e.target === signupModal) signupModal.classList.add('hidden') });
}
