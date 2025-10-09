import { setSharedState, saveUserSession } from '../main'
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

	// Create error spans dynamically
	function createErrorSpan(input: HTMLElement): HTMLElement {
		let span = input.nextElementSibling as HTMLElement | null;
		if (!span || !span.classList.contains("error-msg")) {
			span = document.createElement("span");
			span.className = "error-msg text-red-500 text-sm block hidden";
			input.insertAdjacentElement("afterend", span);
		}
		return span;
	}

	const usernameError = createErrorSpan(usernameInput);
	const emailError = createErrorSpan(emailInput);
	const confirmEmailError = createErrorSpan(confirmEmailInput);
	const passwordError = createErrorSpan(passwordInput);
	const confirmPasswordError = createErrorSpan(confirmPasswordInput);

	signupSubmit.disabled = true;

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

		if (usernameInput!.value.trim().length === 0) {
			setInputState(usernameInput!, false, "Username is required.", usernameError);
			valid = false;
		} else setInputState(usernameInput!, true, "", usernameError);

		if (emailInput!.value.trim().length === 0) {
			setInputState(emailInput!, false, "Email is required.", emailError);
			valid = false;
		} else setInputState(emailInput!, true, "", emailError);

		if (confirmEmailInput!.value.trim() !== emailInput!.value.trim()) {
			setInputState(confirmEmailInput!, false, "Emails do not match.", confirmEmailError);
			valid = false;
		} else setInputState(confirmEmailInput!, true, "", confirmEmailError);

		if (!isPasswordValid(passwordInput!.value)) {
			setInputState(passwordInput!, false, "Password must be ≥ 8 chars, 1 uppercase & 1 number.", passwordError);
			valid = false;
		} else setInputState(passwordInput!, true, "", passwordError);

		if (confirmPasswordInput!.value !== passwordInput!.value) {
			setInputState(confirmPasswordInput!, false, "Passwords do not match.", confirmPasswordError);
			valid = false;
		} else setInputState(confirmPasswordInput!, true, "", confirmPasswordError);

		signupSubmit!.disabled = !valid;
	}

	usernameInput.addEventListener('input', validateInputs);
	emailInput.addEventListener('input', validateInputs);
	confirmEmailInput.addEventListener('input', validateInputs);
	passwordInput.addEventListener('input', validateInputs);
	confirmPasswordInput.addEventListener('input', validateInputs);

	// Modal open/close
	if (openBtnLogin) {
		openBtnLogin.addEventListener('click', () => signupModal.classList.add('hidden'));
	}

	signupModal.addEventListener('click', (e) => {
		if (e.target === signupModal) signupModal.classList.add('hidden');
	});

	// --- Submit handling ---
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
			console.log("Signup response:", data);

			// ✅ Save JWT + session
			if (data.token) {
				saveUserSession({
					username: data.username || username,
					avatarUrl: data.avatarUrl || "/default-avatar.png",
					token: data.token
				});
			}

			// ✅ Update reactive shared state
			setSharedState({
				isLoggedIn: true,
				username: data.username || username,
				avatarUrl: data.avatarUrl || "/default-avatar.png"
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
