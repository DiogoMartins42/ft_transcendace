export function setUserAvatar(username: string, elementId = "user-avatar") {
  const img = document.getElementById(elementId) as HTMLImageElement | null;
  if (!img) return;
  img.src = `${import.meta.env.VITE_API_URL}/uploads/avatars/${username}?${Date.now()}`;
}

export async function uploadAvatar(file: File, username: string) {
  if (!file) return;
  try {
    const arrayBuffer = await file.arrayBuffer();

    console.log("Uploading avatar for", username, "size:", file.size);
    const start = performance.now();
    const response = await fetch(`${import.meta.env.VITE_API_URL}/uploads/upload-avatar/${username}`, {
      
      method: "POST",
      headers: { "Content-Type": "application/octet-stream" },
      body: arrayBuffer,
    });
    console.log("Upload finished in", performance.now() - start, "ms");


    if (!response.ok) {
      console.error("❌ Upload failed:", await response.text());
      return;
    }
    console.log("✅ Avatar uploaded successfully");
  } catch (err) {
    console.error("Error uploading avatar:", err);
  }
}
