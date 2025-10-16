import { setSharedState } from "../main";

export function loadSession() {
  try {
    return JSON.parse(localStorage.getItem("userSession") || "null");
  } catch {
    return null;
  }
}

export function saveSession(token: string, user: any) {
  localStorage.setItem("userSession", JSON.stringify({ token, user }));
}

export function clearSession() {
  localStorage.removeItem("userSession");
}

export async function verifyStoredSession() {
  const session = loadSession();
  if (!session?.token) {
    console.log("No stored session found");
    return;
  }

  console.log("Found stored token, verifying...");

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${session.token}`
      }
    });

    console.log("Verify response status:", res.status);

    if (!res.ok) {
      console.warn("Stored session invalid, clearing...");
      clearSession();
      return;
    }

    // Check if response is actually JSON
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.error("Response is not JSON:", contentType);
      const text = await res.text();
      console.error("Response body:", text);
      clearSession();
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
  }
}