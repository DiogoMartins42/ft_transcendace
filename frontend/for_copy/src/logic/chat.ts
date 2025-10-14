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
  if (!session) {
    console.warn('⚠️ No user session found, chat disabled.')
    return
  }

  const chatInput = document.getElementById('chat-input') as HTMLInputElement | null
  const sendBtn = document.getElementById('chat-send') as HTMLButtonElement | null
  const messagesDiv = document.getElementById('chat-messages') as HTMLDivElement | null
  const usersDiv = document.getElementById('chat-users') as HTMLDivElement | null

  if (!chatInput || !sendBtn || !messagesDiv) {
    console.warn('⚠️ Chat elements not found on page.')
    return
  }

  // --- Load and show active users (example fetch, backend should provide this endpoint) ---
  fetch('/api/users')
    .then(res => res.json())
    .then((users: User[]) => {
      if (!usersDiv) return
      usersDiv.innerHTML = ''

      users.forEach(u => {
        if (u.username === session.username) return

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
          if (currentRecipient)
            sendMessage({
              type: 'invite',
              to: u.username,
              from: session.username,
              text: `${session.username} invited you to a Pong match!`,
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
      from: session.username,
      to: currentRecipient,
      text,
      type: 'direct',
      timestamp: new Date().toISOString(),
    }

    sendMessage(msg)
    addChatMessage(msg)
    chatInput.value = ''
  })
}

// --- Message rendering helpers ---
export function addChatMessage(msg: ChatMessage) {
  const messagesDiv = document.getElementById('chat-messages')
  if (!messagesDiv) return

  if (msg.type === 'direct' && msg.to && blockedUsers.has(msg.from)) return

  const div = document.createElement('div')
  div.className = 'text-sm text-gray-200 mb-1'

  const isOutgoing = msg.from === loadSession()?.username
  div.classList.add(isOutgoing ? 'text-green-400' : 'text-blue-400')

  let prefix = ''
  if (msg.type === 'invite') prefix = '🏓 '
  if (msg.type === 'tournament') prefix = '🏆 '
  if (msg.type === 'system') prefix = '⚙️ '

  div.textContent = `${prefix}${msg.from}: ${msg.text}`
  messagesDiv.appendChild(div)
  messagesDiv.scrollTop = messagesDiv.scrollHeight
}

export function addSystemMessage(text: string) {
  addChatMessage({
    from: 'System',
    text,
    type: 'system',
    timestamp: new Date().toISOString(),
  })
}

// --- Handle special notifications from WebSocket ---
export function handleIncomingMessage(data: any) {
  if (typeof data !== 'object') return

  const msgType = data.type || 'direct'

  if (msgType === 'tournament') {
    addSystemMessage(`🏆 Tournament update: ${data.text}`)
  } else if (msgType === 'invite') {
    addSystemMessage(`🏓 ${data.from} invited you to a Pong game!`)
  } else if (msgType === 'direct') {
    addChatMessage({
      from: data.from,
      to: data.to,
      text: data.text,
      type: 'direct',
      timestamp: new Date().toISOString(),
    })
  }
}
