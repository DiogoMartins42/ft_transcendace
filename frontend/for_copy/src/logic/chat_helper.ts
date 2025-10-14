export default function chatHelpers() {
  return {
    saveMessage(senderId: number, receiverId: number, content: string, type = 'text') {
      fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId, receiverId, content, type })
      });
    },

    getUserById(userId: number) {
      return fetch(`/api/users/${userId}`).then(res => res.json());
    },

    addBlock(userId: number, blockedUserId: number) {
      fetch('/api/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, blockedUserId })
      });
    },

    removeBlock(userId: number, blockedUserId: number) {
      fetch('/api/unblock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, blockedUserId })
      });
    },

    isBlocked(userId: number, blockedUserId: number) {
      return fetch(`/api/isBlocked?userId=${userId}&blockedUserId=${blockedUserId}`)
        .then(res => res.json());
    }
  };
}

