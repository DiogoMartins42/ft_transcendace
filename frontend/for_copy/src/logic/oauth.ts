// logic/oauth.ts - OAuth 2.0 Google Login for SPA (Redirect Flow)
import { handleLogin } from '../main';

const BACKEND_URL = import.meta.env.VITE_API_URL || 'https://pongpong.duckdns.org:3000';

/**
 * Setup OAuth login buttons
 */
export function setupOAuth() {
    const googleLoginBtn = document.getElementById('google-login-btn');
    
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', handleGoogleLogin);
    }

    // Also check for Google login buttons in modals
    const modalGoogleBtns = document.querySelectorAll('.google-login-modal');
    modalGoogleBtns.forEach(btn => {
        btn.addEventListener('click', handleGoogleLogin);
    });
}

/**
 * Initiate Google OAuth login (redirect flow)
 */
async function handleGoogleLogin(e: Event) {
    e.preventDefault();
    
    try {
        console.log('✅ Google login clicked');
        
        // Store current hash/route to return after OAuth
        const currentHash = window.location.hash || '#home';
        sessionStorage.setItem('preOAuthHash', currentHash);
        
        // Redirect to backend OAuth endpoint
        window.location.href = `${BACKEND_URL}/oauth/google`;
    } catch (error) {
        console.error('❌ Google OAuth error:', error);
        showOAuthError('Failed to initiate Google login. Please try again.');
    }
}

/**
 * Check if we're returning from OAuth callback with a token
 * This should be called on app initialization
 */
export function handleOAuthCallback() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const error = urlParams.get('error');
    
    if (error) {
        console.error('❌ OAuth error:', error);
        
        let errorMessage = 'Authentication failed. Please try again.';
        if (error === 'missing_code') {
            errorMessage = 'Authorization code was missing. Please try again.';
        } else if (error === 'oauth_failed') {
            errorMessage = 'OAuth authentication failed. Please check your credentials.';
        }
        
        showOAuthError(errorMessage);
        
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
        return;
    }
    
    if (token) {
        console.log('✅ OAuth token received, logging in...');
        
        // Decode JWT to get user info (simple base64 decode of payload)
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            
            // Call the handleLogin function with token and user data
            handleLogin(token, {
                username: payload.username,
                email: payload.email,
                avatarUrl: payload.avatarUrl || payload.avatar_url
            }).then(() => {
                console.log('✅ OAuth login successful');
                
                // Clean up URL (remove token from address bar)
                window.history.replaceState({}, document.title, window.location.pathname);
                
                // Restore previous hash or go to home
                const preOAuthHash = sessionStorage.getItem('preOAuthHash');
                sessionStorage.removeItem('preOAuthHash');
                window.location.hash = preOAuthHash || '#home';
                
                // Close login modal if it's open
                const loginModal = document.getElementById('login-modal');
                if (loginModal) {
                    loginModal.classList.add('hidden');
                }
                
                // Show success message
                showOAuthSuccess('Successfully logged in with Google!');
            });
        } catch (err) {
            console.error('❌ Failed to process OAuth token:', err);
            showOAuthError('Login failed. Invalid token received.');
            window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
        }
    }
}

/**
 * Show OAuth error message
 */
function showOAuthError(message: string) {
    // Try to show in login modal first
    const loginMessage = document.getElementById('login-message');
    if (loginMessage) {
        loginMessage.textContent = message;
        loginMessage.className = 'text-red-500 text-sm mt-2';
        loginMessage.classList.remove('hidden');
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            loginMessage.classList.add('hidden');
        }, 5000);
    } else {
        // Fallback to alert
        alert(message);
    }
}

/**
 * Show OAuth success message
 */
function showOAuthSuccess(message: string) {
    const loginMessage = document.getElementById('login-message');
    if (loginMessage) {
        loginMessage.textContent = message;
        loginMessage.className = 'text-green-500 text-sm mt-2';
        loginMessage.classList.remove('hidden');
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            loginMessage.classList.add('hidden');
        }, 3000);
    }
}

/**
 * Check if OAuth is available from backend
 */
export async function checkOAuthAvailability(): Promise<boolean> {
    try {
        const response = await fetch(`${BACKEND_URL}/oauth/config`);
        const config = await response.json();
        return config.googleEnabled === true;
    } catch (error) {
        console.error('❌ Error checking OAuth availability:', error);
        return false;
    }
}

/**
 * Initialize OAuth button visibility based on backend configuration
 */
export async function initOAuthUI() {
    const isOAuthAvailable = await checkOAuthAvailability();
    
    // Handle main Google login button
    const googleLoginBtn = document.getElementById('google-login-btn');
    if (googleLoginBtn) {
        googleLoginBtn.style.display = isOAuthAvailable ? 'flex' : 'none';
    }
    
    // Handle modal Google login buttons
    const modalGoogleBtns = document.querySelectorAll('.google-login-modal');
    modalGoogleBtns.forEach(btn => {
        (btn as HTMLElement).style.display = isOAuthAvailable ? 'flex' : 'none';
    });
}