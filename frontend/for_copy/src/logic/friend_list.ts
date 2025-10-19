/* import { sharedState } from "../main";

export function initFriendsPage() {
  const input = document.getElementById('friendInput') as HTMLInputElement;
  const button = document.getElementById('addFriendBtn') as HTMLButtonElement;
  const list = document.getElementById('friendsList') as HTMLUListElement;

  // message area for errors/success
  let msg = document.getElementById('friendsMsg') as HTMLParagraphElement;
  if (!msg) {
    msg = document.createElement('p');
    msg.id = 'friendsMsg';
    msg.style.marginTop = '8px';
    msg.style.fontSize = '14px';
    list.parentElement?.insertBefore(msg, list);
  }

  if (!input || !button || !list) {
    console.error("Friends page elements not found");
    return;
  }

  const currentUsername = sharedState.username;
  console.log(currentUsername);

  if (!currentUsername) {
    list.innerHTML = `<li>You must be logged in to manage friends.</li>`;
    button.disabled = true;
    input.disabled = true;
    return;
  }

  // Fetch and display friends
  async function loadFriends() {
    try {
      const res = await fetch(`/stats/api/friends/${currentUsername}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch friends");

      list.innerHTML = '';
      msg.textContent = ''; // clear message

      data.friends.forEach((friend: string) => {
        const li = document.createElement('li');
        li.textContent = friend;
        list.appendChild(li);
      });
    } catch (err) {
      console.error(err);
      msg.textContent = "⚠️ Error loading friends.";
      msg.style.color = "red";
    }
  }

  // Add a friend (must be logged in)
  async function addFriend() {
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
        msg.textContent = `❌ ${data.error || "Could not add friend."}`;
        msg.style.color = "red";
        return;
      }

      input.value = '';
      loadFriends(); // refresh list
    } catch (err) {
      console.error(err);
      msg.textContent = "⚠️ Could not connect to server.";
      msg.style.color = "red";
    }
  }

  button.addEventListener('click', addFriend);
  loadFriends();
}
 */

// Init Friends page
import { sharedState } from "../main";

export function initFriendsPage() {
  const input = document.getElementById('friendInput') as HTMLInputElement;
  const button = document.getElementById('addFriendBtn') as HTMLButtonElement;
  const list = document.getElementById('friendsList') as HTMLUListElement;

  if (!input || !button || !list) {
    console.error("Friends page elements not found");
    return;
  }

  // Load friends only if logged in
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

  // Add a friend (check login dynamically)
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
