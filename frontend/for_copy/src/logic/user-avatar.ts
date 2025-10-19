
// Fetch the URL avatar from the backend and serve it to the HTML file
export function setUserAvatar(username: string, elementId: string = "profile-pic"): void {
  const backendBase = import.meta.env.VITE_API_URL as string;
  const img = document.getElementById(elementId) as HTMLImageElement | null;

  if (!img) {
    console.error(`Image element with id="${elementId}" not found.`);
    return;
  }

  img.onerror = () => {
    img.src = `${backendBase}/uploads/avatars/default.png`;
  };

  img.src = `${backendBase}/uploads/avatars/${username}`;
}

//Frontend
/* 
const avatarUpload = document.getElementById("avatar-upload") as HTMLInputElement | null;
if (avatarUpload) {
  avatarUpload.addEventListener("change", async (e) => {
    const file = avatarUpload.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/upload-avatar/${sharedState.username}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("Upload failed:", await response.text());
        return;
      }

      // Update avatar immediately in UI
      setUserAvatar(sharedState.username!, "user-avatar");
      setUserAvatar(sharedState.username!, "user-avatar-modal");

      console.log("✅ Avatar uploaded successfully");
    } catch (err) {
      console.error("Error uploading avatar:", err);
    }
  });
}
*/

