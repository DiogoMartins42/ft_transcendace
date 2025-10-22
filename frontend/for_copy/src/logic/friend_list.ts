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
    //console.error("Friends page elements not found");
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
      
      data.friends.forEach((friend: any) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 10px; height: 10px; border-radius: 50%; background: ${friend.status === 'online' ? '#4CAF50' : '#f44336'};"></div>
            <span>${friend.username}</span>
            <small style="color: #666;">(${friend.status})</small>
          </div>
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
