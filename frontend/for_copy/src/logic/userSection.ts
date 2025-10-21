import navLoggedoutHtml from '../components/navLoggedout.html?raw'
import navLoggedinHtml from '../components/navLoggedin.html?raw'
import { setupLoginForm } from './login_handler'
import { setupSignupForm } from './signup_handler'
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
      if (sharedState.avatarUrl) {
        if (avatar) {
          avatar.src = sharedState.avatarUrl
          avatar.classList.remove("hidden")
        }
        if (defaultAvatar) defaultAvatar.classList.add("hidden")
      } else {
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

