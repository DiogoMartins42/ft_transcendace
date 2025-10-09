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
  if (!session?.token) return;

  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${session.token}`
      }
    });

    if (!res.ok) {
      console.warn("Stored session invalid, clearing...");
      clearSession();
      return;
    }

    const user = await res.json();

    setSharedState({
      isLoggedIn: true,
      username: user.username,
      avatarUrl: "/default-avatar.png"
    });

    console.log("✅ Session restored:", user.username);
  } catch (err) {
    console.error("Error verifying stored session:", err);
  }
}
