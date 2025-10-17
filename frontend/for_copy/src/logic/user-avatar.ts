

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

  img.src = `${backendBase}/uploads/avatars/${username}.png`;
}
