/* export function setupSettingsButton() {
  const settingsBtn = document.getElementById("settings-btn");
  const settingsModal = document.getElementById("settings-modal");
  const settingsClose = document.getElementById("settings-close");

  if (!settingsBtn || !settingsModal) return;

  settingsBtn.addEventListener("click", (ev) => {
    ev.stopPropagation();
    settingsModal.classList.toggle("hidden");
  });

  if (settingsClose) {
    settingsClose.addEventListener("click", (ev) => {
      ev.stopPropagation();
      settingsModal.classList.add("hidden");
    });
  }

  document.addEventListener("click", (e) => {
    if (!settingsModal.classList.contains("hidden") && !settingsModal.contains(e.target as Node) && e.target !== settingsBtn) {
      settingsModal.classList.add("hidden");
    }
  });
}
 */