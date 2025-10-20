import { sharedState } from "../main";

// Init Friends page
export function initFriendsPage() {
  const input = document.getElementById('friendInput') as HTMLInputElement;
  const button = document.getElementById('addFriendBtn') as HTMLButtonElement;
  const list = document.getElementById('friendsList') as HTMLUListElement;
  
  // Create or get error message element
  let errorMessage = document.getElementById('friendsErrorMessage') as HTMLDivElement;
  if (!errorMessage) {
    errorMessage = document.createElement('div');
    errorMessage.id = 'friendsErrorMessage';
    errorMessage.style.cssText = `
      color: red;
      margin: 10px 0;
      padding: 10px;
      border-radius: 5px;
      background-color: #ffe6e6;
      border: 1px solid #ffcccc;
      min-height: 20px;
    `;
    // Insert error message before the friends list
    if (list && list.parentNode) {
      list.parentNode.insertBefore(errorMessage, list);
    }
  }

  if (!input || !button || !list) {
    console.error("Friends page elements not found");
    return;
  }

  // Show error message
  function showError(message: string) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    
    // Auto-hide error after 5 seconds
    setTimeout(() => {
      errorMessage.textContent = '';
      errorMessage.style.display = 'none';
    }, 5000);
  }

  // Clear error message
  function clearError() {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
  }

  // Load friends only if the user is logged in
  async function loadFriends() {
    const currentUsername = sharedState.username;
    if (!currentUsername) {
      list.innerHTML = `<li class="no-friends-message">Please log in to see your friends.</li>`;
      return;
    }

    try {
      const res = await fetch(`/stats/api/friends/${currentUsername}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to fetch friends");

      list.innerHTML = '';
      
      if (data.friends.length === 0) {
        list.innerHTML = `<li class="no-friends-message">No friends yet. Add some friends to get started!</li>`;
        return;
      }
      
      data.friends.forEach((friend: string) => {
        const li = document.createElement('li');
        li.textContent = friend;
        li.style.cssText = `
          padding: 10px;
          margin: 5px 0;
          background: #f5f5f5;
          border-radius: 5px;
          list-style: none;
        `;
        list.appendChild(li);
      });
    } catch (err) {
      console.error(err);
      showError('Error loading friends');
    }
  }

  // Add a friend
  async function addFriend() {
    const currentUsername = sharedState.username;
    if (!currentUsername) {
      showError('You must be logged in to add friends.');
      return;
    }

    const friendUsername = input.value.trim();
    if (!friendUsername) {
      showError('Please enter a username');
      return;
    }

    clearError(); // Clear any previous errors

    try {
      const res = await fetch(`/stats/api/friends/${currentUsername}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendUsername }),
      });

      const data = await res.json();

      if (!res.ok) {
        showError(data.error || "Failed to add friend");
        return;
      }

      input.value = '';
      loadFriends(); // refresh list
    } catch (err) {
      console.error(err);
      showError('Error adding friend');
    }
  }

  button.addEventListener('click', addFriend);
  
  // Clear error when user starts typing
  input.addEventListener('input', clearError);
  
  loadFriends();
}

/* import { sharedState } from "../main";

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
 */