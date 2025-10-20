import navLoggedoutHtml from '../components/navLoggedout.html?raw'
import navLoggedinHtml from '../components/navLoggedin.html?raw'
import { setupLoginForm } from './login_handler'
import { setupSignupForm } from './signup_handler'
import { setupUserSettings } from "./UpdateUserInformation";
import { uploadAvatar, setUserAvatar } from './user-avatar';
import { sharedState } from '../main'

export async function setupUserSection() {
  const userSection = document.getElementById('user-section') as HTMLDivElement | null
  if (!userSection) {
    console.warn("⚠️ user-section not found in DOM")
    return
  }

  function render() {
    if (sharedState.isLoggedIn) {
      userSection!.innerHTML = navLoggedinHtml

      // update greeting
      const greeting = document.getElementById("user-greeting")
      if (greeting) greeting.textContent = sharedState.username || "User"

      // handle avatar
      const avatar = document.getElementById("user-avatar") as HTMLImageElement | null
      const defaultAvatar = document.getElementById("default-avatar") as SVGElement | null
      if (avatar && sharedState.username) {
        setUserAvatar(sharedState.username, "user-avatar")
        avatar.classList.remove("hidden")
        if (defaultAvatar) defaultAvatar.classList.add("hidden")
      }
      else{
        if (avatar) avatar.classList.add("hidden")
        if (defaultAvatar) defaultAvatar.classList.remove("hidden")
      }

      // setup logout
      const logoutBtn = document.getElementById("logout-btn") as HTMLButtonElement | null
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          sharedState.setState({ isLoggedIn: false, username: undefined, avatarUrl: undefined })
        })
      }

      // setup settings / Change user info
      const settingsBtn = document.getElementById("settings-btn") as HTMLButtonElement | null;
      const settingsModal = document.getElementById("settings-modal") as HTMLElement | null;
      const settingsClose = document.getElementById("settings-close") as HTMLButtonElement | null;

      if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener("click", (ev) => {
          ev.stopPropagation();
          settingsModal.classList.remove("hidden");
          settingsModal.classList.add("opacity-100", "pointer-events-auto");
        });
        if (settingsClose) {
          settingsClose.addEventListener("click", () => {
            settingsModal.classList.add("hidden");
            settingsModal.classList.remove("opacity-100", "pointer-events-auto");
          });
        }
        // close when clicking outside modal
        settingsModal.addEventListener("click", (e) => {
          if (e.target === settingsModal) {
            settingsModal.classList.add("hidden");
            settingsModal.classList.remove("opacity-100", "pointer-events-auto");
          }
        });
        
        const avatarInput = document.getElementById("avatar-upload") as HTMLInputElement | null;
        if (avatarInput) {
          avatarInput.addEventListener("change", async (ev) => {
            ev.stopPropagation();
            ev.preventDefault(); // Prevent modal refresh
            const file = avatarInput.files?.[0];
            if (file && sharedState.username) {
              await uploadAvatar(file, sharedState.username);
            
              // 🔁 Refresh both avatars immediately (main + modal)
              const timestamp = Date.now();
              const base = import.meta.env.VITE_API_URL;
              ["user-avatar", "user-avatar-modal"].forEach(id => {
                const el = document.getElementById(id) as HTMLImageElement | null;
                const def = document.getElementById(id.replace("user-avatar", "default-avatar")) as SVGElement | null;
                if (el) {
                  el.src = `${base}/uploads/avatars/${sharedState.username}.png?${timestamp}`;
                  el.classList.remove("hidden");
                }
                if (def) def.classList.add("hidden");
              });
            
              console.log("✅ Avatar refreshed successfully");
            }
          });
        }

        
        
      }


    } else {
      userSection!.innerHTML = navLoggedoutHtml
      setupLoginForm()
      setupSignupForm()
    }
  }

  render()

  // auto re-render on state change
  sharedState.subscribe(render)
}


