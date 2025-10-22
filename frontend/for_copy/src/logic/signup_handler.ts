import { setSharedState} from '../main'
import { saveSession } from './session'
import loading from '../components/loading.html?raw'

const BACKEND_SIGNUP_URL = `${import.meta.env.VITE_API_URL}/auth/register`;

export function setupSignupForm() {
	const signupModal = document.getElementById('signup-modal') as HTMLElement | null;
	const openBtnLogin = document.getElementById('open-login') as HTMLElement | null;
	const signupForm = document.getElementById('signup-form') as HTMLFormElement | null;

	const usernameInput = document.getElementById('signup-username') as HTMLInputElement | null;
	const emailInput = document.getElementById('signup-email') as HTMLInputElement | null;
	const confirmEmailInput = document.getElementById('signup-comfirmEmail') as HTMLInputElement | null;
	const passwordInput = document.getElementById('signup-password') as HTMLInputElement | null;
	const confirmPasswordInput = document.getElementById('signup-confirmPassword') as HTMLInputElement | null;
	const signupSubmit = signupForm?.querySelector('button[type="submit"]') as HTMLButtonElement | null;

	if (!signupModal || !signupForm || !usernameInput || !emailInput || !confirmEmailInput || !passwordInput || !confirmPasswordInput || !signupSubmit) {
		console.warn("Signup modal setup failed: missing elements.");
		return;
	}

	// Validation helpers
	function isPasswordValid(pw: string): boolean {
		return pw.length >= 8 && /[A-Z]/.test(pw) && /[0-9]/.test(pw);
	}

	function setInputState(input: HTMLInputElement, isValid: boolean, errorMsg?: string, errorSpan?: HTMLElement) {
		if (isValid) {
			input.classList.remove("border-red-500", "focus:ring-red-500");
			input.classList.add("border-green-500", "focus:ring-green-500");
			errorSpan?.classList.add("hidden");
		} else {
			input.classList.remove("border-green-500", "focus:ring-green-500");
			input.classList.add("border-red-500", "focus:ring-red-500");
			if (errorSpan && errorMsg) {
				errorSpan.textContent = errorMsg;
				errorSpan.classList.remove("hidden");
			}
		}
	}

	function validateInputs() {
		let valid = true;

		if (!usernameInput!.value.trim()) { valid = false; setInputState(usernameInput!, false, "Username is required."); }
		else setInputState(usernameInput!, true);

		if (!emailInput!.value.trim()) { valid = false; setInputState(emailInput!, false, "Email is required."); }
		else setInputState(emailInput!, true);

		if (confirmEmailInput!.value.trim() !== emailInput!.value.trim()) { valid = false; setInputState(confirmEmailInput!, false, "Emails do not match."); }
		else setInputState(confirmEmailInput!, true);

		if (!isPasswordValid(passwordInput!.value)) { valid = false; setInputState(passwordInput!, false, "Password must be ≥ 8 chars, 1 uppercase & 1 number."); }
		else setInputState(passwordInput!, true);

		if (confirmPasswordInput!.value !== passwordInput!.value) { valid = false; setInputState(confirmPasswordInput!, false, "Passwords do not match."); }
		else setInputState(confirmPasswordInput!, true);

		signupSubmit!.disabled = !valid;
	}

	[usernameInput, emailInput, confirmEmailInput, passwordInput, confirmPasswordInput].forEach(input => input?.addEventListener('input', validateInputs));

	if (openBtnLogin) openBtnLogin.addEventListener('click', () => signupModal.classList.add('hidden'));
	signupModal.addEventListener('click', (e) => { if (e.target === signupModal) signupModal.classList.add('hidden'); });

	signupForm.addEventListener('submit', async (e) => {
		e.preventDefault();

		const username = usernameInput!.value.trim();
		const email = emailInput!.value.trim();
		const password = passwordInput!.value.trim();

		const originalButtonHTML = signupSubmit!.innerHTML;
		signupSubmit!.innerHTML = loading;
		signupSubmit!.disabled = true;

		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 15000);

			const response = await fetch(BACKEND_SIGNUP_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username, email, password }),
				signal: controller.signal
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				alert("Signup failed. Please try again.");
				passwordInput!.value = "";
				confirmPasswordInput!.value = "";
				return;
			}

			const data = await response.json();

			// ✅ Save JWT + session
			if (data.token) {
				saveSession(data.token, {
					username: data.username || username,
					avatarUrl: data.avatarUrl || "/default-avatar.png"
				});
			}

			// ✅ Update reactive shared state
			setSharedState({
				isLoggedIn: true,
				username: data.username || username,
				avatarUrl: data.avatarUrl || "/default-avatar.png"
			});
			await fetch("/stats/api/friends/online", {
      		  method: "POST",
      		  headers: { "Content-Type": "application/json" },
      		  body: JSON.stringify({ username: data.user.username}),
      		});

			signupModal.classList.add("hidden");
			console.log("Signup successful!");
		} catch (err) {
			console.error("Signup error:", err);
			alert("Network error or request timeout.");
		} finally {
			signupSubmit!.innerHTML = originalButtonHTML;
			signupSubmit!.disabled = false;
		}
	});
}