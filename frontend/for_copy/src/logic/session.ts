// session.ts - Updated to handle OAuth users
import { setSharedState } from "../main";

// Extend Window interface to include anonymousId
declare global {
  interface Window {
    anonymousId?: string;
  }
}

export function loadSession() {
  try {
    const data = localStorage.getItem("userSession");
    if (!data) return null;
    
    const session = JSON.parse(data);
    
    // Validate session structure
    if (!session || typeof session !== 'object' || !session.token) {
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Error loading session:', error);
    return null;
  }
}

export function saveSession(token: string, user: any) {
  const sessionData = { 
    token, 
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      avatarUrl: user.avatar_url || user.avatarUrl || "/default-avatar.png"
    }
  };
  localStorage.setItem("userSession", JSON.stringify(sessionData));
}

export function clearSession() {
  localStorage.removeItem("userSession");
}

export function getCurrentUser() {
  const session = loadSession();
  return session?.user || null;
}

export function getToken(): string | null {
  try {
    const session = loadSession();
    return session?.token || null;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return !!getCurrentUser();
}

export function getUsername(): string {
  const user = getCurrentUser();
  return user?.username || generateAnonymousId();
}

function generateAnonymousId(): string {
  // Generate a consistent anonymous ID for this session
  if (!window.anonymousId) {
    window.anonymousId = 'Anonymous' + Math.floor(1000 + Math.random() * 9000);
  }
  return window.anonymousId;
}

export async function verifyStoredSession() {
  try {
    const session = loadSession();
    if (!session?.token) {
      console.log("No stored session found");
      setSharedState({ isLoggedIn: false, username: undefined, avatarUrl: undefined });
      return false;
    }

    console.log("Found stored token, verifying...");

    // Use Vite environment variable
    const API_URL = import.meta.env.VITE_API_URL || 'https://pongpong.duckdns.org:3000';
    
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${session.token}`
      }
    });

    if (!res.ok) {
      console.warn("Stored session invalid, clearing...");
      clearSession();
      setSharedState({ isLoggedIn: false, username: undefined, avatarUrl: undefined });
      return false;
    }

    const user = await res.json();
    console.log("User data received:", user);

    // Update session with fresh user data
    saveSession(session.token, user);

    setSharedState({
      isLoggedIn: true,
      username: user.username,
      avatarUrl: user.avatar_url || user.avatarUrl || "/default-avatar.png"
    });

    console.log("✅ Session restored:", user.username);
    return true;
  } catch (err) {
    console.error("Error verifying stored session:", err);
    clearSession();
    setSharedState({ isLoggedIn: false, username: undefined, avatarUrl: undefined });
    return false;
  }
}