import { sharedState } from '../main';

export function setupUserSettings(settingsModal: HTMLElement | null){

    // Setup settings form submit
    const settingsForm = document.getElementById("settings-form") as HTMLFormElement | null;
    if (settingsForm) {
        settingsForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // prevent page reload
            
            const usernameInput = document.getElementById("settings-username") as HTMLInputElement;
            const emailInput = document.getElementById("settings-email") as HTMLInputElement;
            const passwordInput = document.getElementById("settings-password") as HTMLInputElement;
            
            const updates: Record<string, string> = {};
            if (usernameInput?.value) updates.newUsername = usernameInput.value;
            if (emailInput?.value) updates.email = emailInput.value;
            if (passwordInput?.value) updates.password = passwordInput.value;
            
            if (Object.keys(updates).length === 0) {
                return;
            }
            
            try {
                const res = await fetch(`/stats/api/user/${sharedState.username}`, {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(updates),
                });
                
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to update user");
                
                // update sharedState so UI reflects new username/avatar
                sharedState.setState({
                    username: updates.newUsername || sharedState.username,
                });
                
                // close modal
                settingsModal?.classList.add("hidden");
                settingsModal?.classList.remove("opacity-100", "pointer-events-auto");
                
                // reset form
                settingsForm.reset();
                
            } catch (err) {
                console.log(`Error: ${(err as Error).message}`);
            }
        });
    }
}
