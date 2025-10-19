import { sharedState } from "../main";

// Init Friends page
export function initFriendsPage() {
  const input = document.getElementById('friendInput') as HTMLInputElement;
  const button = document.getElementById('addFriendBtn') as HTMLButtonElement;
  const list = document.getElementById('friendsList') as HTMLUListElement;

  if (!input || !button || !list) {
    console.error("Friends page elements not found");
    return;
  }

  // Load friends only if the user is logged in
  async function loadFriends() {
    const currentUsername = sharedState.username;
    if (!currentUsername) {
      list.innerHTML = `<li>Please log in to see your friends.</li>`;
      return;
    }

    try {
      const res = await fetch(`/stats/api/friends/${currentUsername}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch friends");

      list.innerHTML = '';
      data.friends.forEach((friend: string) => {
        const li = document.createElement('li');
        li.textContent = friend;
        list.appendChild(li);
      });
    } catch (err) {
      console.error(err);
      list.innerHTML = `<li style="color:red;">Error loading friends</li>`;
    }
  }

  // Add a friend
  async function addFriend() {
    const currentUsername = sharedState.username;
    if (!currentUsername) {
      list.innerHTML = `<li style="color:orange;">You must be logged in to add friends.</li>`;
      return;
    }

    const friendUsername = input.value.trim();
    if (!friendUsername) return;

    try {
      const res = await fetch(`/stats/api/friends/${currentUsername}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendUsername }),
      });

      const data = await res.json();

      if (!res.ok) {
        list.innerHTML = `<li style="color:red;">${data.error || "Failed to add friend"}</li>`;
        return;
      }

      input.value = '';
      loadFriends(); // refresh list
    } catch (err) {
      console.error(err);
      list.innerHTML = `<li style="color:red;">Error adding friend</li>`;
    }
  }

  button.addEventListener('click', addFriend);
  loadFriends();
}
