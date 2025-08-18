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

	const API_BASE = 'http://localhost:3000';
	const VALIDATE_LOGIN_EMAIL = '/auth/validate-login-email';
	const VALIDATE_LOGIN_PASSWORD = '/auth/validate-login-password';
	const VALIDATE_SIGNUP_USERNAME = '/auth/validate-username';
	const VALIDATE_SIGNUP_EMAIL = '/auth/validate-email';
	const VALIDATE_SIGNUP_PASSWORD = '/auth/validate-password';

	// --- helper for backend validation ---
	async function validateField(endpoint: string, payload: Record<string, unknown>): Promise<{ valid: boolean; message?: string }> {
		try {
			const response = await fetch(`${API_BASE}${endpoint}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload)
			});
			return await response.json();
		} catch {
			return { valid: false, message: 'Validation failed. Please try again.' };
		}
	}

	// --- universal input validator (local rule + optional backend) --- 
	async function validateInputField(
		input: HTMLInputElement,
		endpoint?: string | null,
		localCheck?: (value: string) => { valid: boolean; message?: string },
		payloadKey?: string
	): Promise<boolean> {
		const value = input.value.trim();

		// Local (frontend) rule first
		if (localCheck) {
			const res = localCheck(value);
			if (!res.valid) {
				alert(res.message || 'Invalid value.');
				input.focus();
				return false;
			}
		}

		// Backend check
		if (endpoint) {
			const key = payloadKey || input.name || 'value';
			const res = await validateField(endpoint, { [key]: value });
			if (!res.valid) {
				alert(res.message || 'Invalid value.');
				input.focus();
				return false;
			}
		}
		return true;
	}

	// --- frontend password rules for SIGNUP --- 
	function passwordRules(value: string): { valid: boolean; message?: string } {
		if (value.length < 8) {
			return { valid: false, message: 'Password must be at least 8 characters long.' };
		}
		if (!/[A-Z]/.test(value)) {
			return { valid: false, message: 'Password must contain at least one uppercase letter.' };
		}
		if (!/[0-9]/.test(value)) {
			return { valid: false, message: 'Password must contain at least one number.' };
		}
		return { valid: true };
	}
	// -------------------------------------------------------------------

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

			// --- backend validation before login ---
			const emailCheck = await validateField(VALIDATE_LOGIN_EMAIL, { email });
			if (!emailCheck.valid) {
				alert(emailCheck.message || 'Invalid email.');
				return;
			}

			// --- password validation against backend (uses email+password) ---  //
			const passwordCheck = await validateField(VALIDATE_LOGIN_PASSWORD, { email, password });
			if (!passwordCheck.valid) {
				alert(passwordCheck.message || 'Invalid email or password.');
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

				alert('Login successful! 🎉');

				localStorage.setItem('token', data.token);
				sharedState.isLoggedIn = true;
				loginModal?.classList.add('hidden');
				loginForm.reset();
				await setupUserSection({ username: data.username, avatarUrl: data.avatarUrl || '' });
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

			// --- backend validation before signup ---
			const usernameCheck = await validateField(VALIDATE_SIGNUP_USERNAME, { username });
			if (!usernameCheck.valid) {
				alert(usernameCheck.message || 'Invalid username.');
				return;
			}
			const emailCheck = await validateField(VALIDATE_SIGNUP_EMAIL, { email });
			if (!emailCheck.valid) {
				alert(emailCheck.message || 'Invalid email.');
				return;
			}

			// --- FRONTEND password rules, then BACKEND password validation ---- 
			const passedLocal = await validateInputField(
				signupPasswordInput,
				null,                 // no endpoint here; this call is ONLY local rules
				passwordRules,
				'password'
			);
			if (!passedLocal) return;

			const passwordCheck = await validateField(VALIDATE_SIGNUP_PASSWORD, { password });
			if (!passwordCheck.valid) {
				alert(passwordCheck.message || 'Invalid password.');
				return;
			}
			// --------------------------------------------------------------------

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

				alert('Signup successful! 🎉');

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
