// session.ts
import { setSharedState } from "../main";

export function loadSession() {
  try {
    const data = localStorage.getItem("userSession");
    if (!data) return null;
    
    const session = JSON.parse(data);
    
    // Validate session structure
    if (!session || typeof session !== 'object') {
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Error loading session:', error);
    return null;
  }
}

export function saveSession(token: string, user: any) {
  localStorage.setItem("userSession", JSON.stringify({ token, user }));
}

export function clearSession() {
  localStorage.removeItem("userSession");
}

export function getUsername(): string {
  try {
    const session = loadSession();
    
    // If no session, return anonymous
    if (!session) {
      return generateAnonymousId();
    }
    
    // Safely access user object with proper null checks
    if (session.user && typeof session.user === 'object' && session.user.username) {
      return session.user.username;
    }
    
    // Check for direct username property
    if (session.username) {
      return session.username;
    }
    
    // Fallback to anonymous
    return generateAnonymousId();
  } catch (error) {
    console.warn('⚠️ Error getting username, using anonymous:', error);
    return generateAnonymousId();
  }
}

export function getToken(): string | null {
  try {
    const session = loadSession();
    return session?.token || null;
  } catch {
    return null;
  }
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
      return;
    }

    console.log("Found stored token, verifying...");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${session.token}`
      }
    });

    console.log("Verify response status:", res.status);

    if (!res.ok) {
      console.warn("Stored session invalid, clearing...");
      clearSession();
      setSharedState({ isLoggedIn: false, username: undefined, avatarUrl: undefined });
      return;
    }

    // Check if response is actually JSON
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Response is not JSON:", contentType);
      const text = await res.text();
      console.error("Response body:", text);
      clearSession();
      setSharedState({ isLoggedIn: false, username: undefined, avatarUrl: undefined });
      return;
    }

    const user = await res.json();
    console.log("User data received:", user);

    setSharedState({
      isLoggedIn: true,
      username: user.username,
      avatarUrl: user.avatarUrl || "/default-avatar.png"
    });

    console.log("✅ Session restored:", user.username);
  } catch (err) {
    console.error("Error verifying stored session:", err);
    clearSession();
    setSharedState({ isLoggedIn: false, username: undefined, avatarUrl: undefined });
  }
}