// logic/chat.ts
import { sendMessage } from './ws'
import { loadSession } from './session'

interface ChatMessage {
  from: string
  to?: string
  text: string
  type: 'direct' | 'system' | 'invite' | 'tournament' | 'profile'
  timestamp: string
}

interface User {
  id: number
  username: string
}

let currentRecipient: string | null = null
let blockedUsers: Set<string> = new Set()

export function setupChat() {
  const session = loadSession()
  const username = session.user?.username || session.username;
  if (!username) {
    console.warn('⚠️ No user session found, chat disabled.')
    return;
  }


  const chatInput = document.getElementById('chat-input') as HTMLInputElement | null
  const sendBtn = document.getElementById('chat-send') as HTMLButtonElement | null
  const messagesDiv = document.getElementById('chat-messages') as HTMLDivElement | null
  const usersDiv = document.getElementById('chat-users') as HTMLDivElement | null

  if (!chatInput || !sendBtn || !messagesDiv) {
    console.warn('⚠️ Chat elements not found on page.')
    return
  }

  // --- Load active users ---
  fetch('/api/users', {
    headers: { Authorization: `Bearer ${session.token}` },
  })
    .then(res => res.json())
    .then((users: User[]) => {
      if (!usersDiv) return
      usersDiv.innerHTML = ''

      users.forEach(u => {
        if (u.username === username) return

        const userEl = document.createElement('div')
        userEl.className =
          'flex justify-between items-center bg-gray-800 p-2 rounded-lg mb-2 cursor-pointer hover:bg-gray-700'

        const name = document.createElement('span')
        name.textContent = u.username
        name.className = 'text-white'

        const actions = document.createElement('div')
        actions.className = 'flex gap-2'

        const msgBtn = document.createElement('button')
        msgBtn.textContent = '💬'
        msgBtn.title = 'Message'
        msgBtn.onclick = () => {
          currentRecipient = u.username
          messagesDiv.innerHTML = ''
          addSystemMessage(`Now chatting with ${u.username}`)
        }

        const blockBtn = document.createElement('button')
        blockBtn.textContent = '🚫'
        blockBtn.title = 'Block'
        blockBtn.onclick = () => {
          if (blockedUsers.has(u.username)) {
            blockedUsers.delete(u.username)
            blockBtn.textContent = '🚫'
            addSystemMessage(`Unblocked ${u.username}`)
          } else {
            blockedUsers.add(u.username)
            blockBtn.textContent = '❌'
            addSystemMessage(`Blocked ${u.username}`)
          }
        }

        const inviteBtn = document.createElement('button')
        inviteBtn.textContent = '🏓'
        inviteBtn.title = 'Invite to Pong'
        inviteBtn.onclick = () => {
          sendMessage({
            type: 'invite',
            to: u.username,
            from: username,
            text: `${username} invited you to a Pong match!`,
          })
        }

        const profileBtn = document.createElement('button')
        profileBtn.textContent = '👤'
        profileBtn.title = 'View Profile'
        profileBtn.onclick = () => {
          window.location.hash = `userSettings?user=${encodeURIComponent(u.username)}`
        }

        actions.append(msgBtn, inviteBtn, blockBtn, profileBtn)
        userEl.append(name, actions)
        usersDiv.appendChild(userEl)
      })
    })

  // --- Send chat message ---
  sendBtn.addEventListener('click', () => {
    if (!currentRecipient) {
      addSystemMessage('⚠️ Select a user first!')
      return
    }

    const text = chatInput.value.trim()
    if (!text) return

    const msg: ChatMessage = {
      from: username,
      to: currentRecipient,
      text,
      type: 'direct',
      timestamp: new Date().toISOString(),
    }

    // Send & render locally
    sendMessage(msg)
    addChatMessage(msg)
    chatInput.value = ''
  })
}

// --- Render chat messages ---
export function addChatMessage(msg: { from: string; text: string; timestamp: string }) {
  const messagesDiv = document.getElementById('chat-messages')
  if (!messagesDiv) return

  const div = document.createElement('div')
  const date = new Date(msg.timestamp).toLocaleString('en-GB')

  const username = msg.from || 'Anonymous'
  div.textContent = `${username}: ${msg.text} (${date})`

  const isOutgoing = username === loadSession()?.username
  div.classList.add(isOutgoing ? 'text-green-400' : 'text-blue-400')
  div.classList.add('text-sm', 'mb-1')

  messagesDiv.appendChild(div)
  messagesDiv.scrollTop = messagesDiv.scrollHeight
}

// --- System messages ---
export function addSystemMessage(text: string) {
  const messagesDiv = document.getElementById('chat-messages')
  if (!messagesDiv) return

  const time = new Date().toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  const div = document.createElement('div')
  div.className = 'text-gray-400 italic mb-1'
  div.textContent = `⚙️ ${text} (${time})`

  messagesDiv.appendChild(div)
  messagesDiv.scrollTop = messagesDiv.scrollHeight
}

// --- Handle incoming WebSocket messages ---
export function handleIncomingMessage(data: any) {
  if (!data || typeof data !== 'object') return

  const msgType = data.type || 'direct'

  switch (msgType) {
    case 'direct':
      addChatMessage({
        from: data.from || 'Anonymous',
        text: data.text || '',
        timestamp: data.timestamp || new Date().toISOString(),
      })
      break

    case 'system':
      addSystemMessage(data.text)
      break

    case 'invite':
      addSystemMessage(`🏓 ${data.from} invited you to a Pong game!`)
      break

    case 'tournament':
      addSystemMessage(`🏆 Tournament update: ${data.text}`)
      break
  }
}
