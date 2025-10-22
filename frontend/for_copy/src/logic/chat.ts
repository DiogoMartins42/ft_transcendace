// logic/chat.ts - Enhanced chat with blocking
import { sendMessage } from './ws'
import { getCurrentUser, getToken } from './session'
import { blockUser, unblockUser, isUserBlocked } from './block'

interface ChatMessage {
  from: string
  to?: string
  text: string
  type: 'direct' | 'system' | 'invite' | 'tournament' | 'profile' | 'error'
  timestamp: string
}

interface User {
  id: number
  username: string
}

let currentRecipient: string | null = null
let currentRecipientId: number | null = null

export function setupChat() {
  const currentUser = getCurrentUser()
  if (!currentUser) {
    console.warn('⚠️ User not logged in, chat disabled.')
    const chatContainer = document.getElementById('chat-container')
    if (chatContainer) {
      chatContainer.innerHTML = `
        <div class="flex items-center justify-center p-8">
          <div class="text-red-500 text-center">
            <p class="text-lg font-semibold">Please log in to use chat</p>
            <p class="text-sm text-gray-600 mt-2">You need to be authenticated to send and receive messages.</p>
          </div>
        </div>
      `
    }
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

  // --- Load active users ---
  const token = getToken()
  if (!token) {
    console.error('❌ No authentication token available')
    addSystemMessage('Authentication required')
    return
  }

  const API_URL = import.meta.env.VITE_API_URL || 'https://pongpong.duckdns.org:3000';
  
  fetch(`${API_URL}/api/users`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Failed to fetch users: ${res.status}`)
      }
      return res.json()
    })
    .then((users: User[]) => {
      if (!usersDiv) return
      usersDiv.innerHTML = ''

      if (users.length === 0) {
        usersDiv.innerHTML = `
          <div class="text-center text-gray-500 py-4">
            No other users online
          </div>
        `
        return
      }

      users.forEach(u => {
        if (u.username === currentUser.username) return

        const userEl = document.createElement('div')
        userEl.className = 'flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-3 rounded-lg mb-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 user-item transition-colors duration-200'

        const nameContainer = document.createElement('div')
        nameContainer.className = 'flex items-center space-x-3'

        const statusIndicator = document.createElement('div')
        statusIndicator.className = 'w-2 h-2 bg-green-500 rounded-full'

        const name = document.createElement('span')
        name.textContent = u.username
        name.className = 'text-gray-900 dark:text-white font-medium'

        nameContainer.appendChild(statusIndicator)
        nameContainer.appendChild(name)

        const actions = document.createElement('div')
        actions.className = 'flex space-x-1'

        const msgBtn = document.createElement('button')
        msgBtn.innerHTML = '💬'
        msgBtn.title = 'Message'
        msgBtn.className = 'p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200'
        msgBtn.onclick = () => {
          currentRecipient = u.username
          currentRecipientId = u.id
          messagesDiv.innerHTML = ''
          addSystemMessage(`Now chatting with ${u.username}`)
          // Highlight selected user
          document.querySelectorAll('.user-item').forEach(el => {
            el.classList.remove('bg-blue-200', 'dark:bg-blue-600', 'ring-2', 'ring-blue-500')
          })
          userEl.classList.add('bg-blue-200', 'dark:bg-blue-600', 'ring-2', 'ring-blue-500')
        }

        const blockBtn = document.createElement('button')
        blockBtn.innerHTML = '🚫'
        blockBtn.title = 'Block'
        blockBtn.className = 'p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200'
        blockBtn.dataset.userId = String(u.id)
        
        // Check initial block status and update UI
        isUserBlocked(u.id).then(blocked => {
          if (blocked) {
            blockBtn.classList.add('text-red-500', 'bg-red-100', 'dark:bg-red-900')
            blockBtn.innerHTML = '✓ Blocked'
            blockBtn.title = 'Unblock'
          }
        }).catch(err => {
          console.error('Failed to check block status:', err)
        })

        blockBtn.onclick = async (e) => {
          e.stopPropagation()
          blockBtn.disabled = true
          
          try {
            const wasBlocked = blockBtn.classList.contains('text-red-500')
            
            if (wasBlocked) {
              await unblockUser(u.id)
              blockBtn.classList.remove('text-red-500', 'bg-red-100', 'dark:bg-red-900')
              blockBtn.innerHTML = '🚫'
              blockBtn.title = 'Block'
              addSystemMessage(`✅ Unblocked ${u.username}`)
            } else {
              await blockUser(u.id)
              blockBtn.classList.add('text-red-500', 'bg-red-100', 'dark:bg-red-900')
              blockBtn.innerHTML = '✓ Blocked'
              blockBtn.title = 'Unblock'
              addSystemMessage(`🚫 Blocked ${u.username}`)
            }
          } catch (err: any) {
            console.error('Block/unblock error:', err)
            addSystemMessage(`❌ Error: ${err.message}`)
          } finally {
            blockBtn.disabled = false
          }
        }

        const inviteBtn = document.createElement('button')
        inviteBtn.innerHTML = '🏓'
        inviteBtn.title = 'Invite to Pong'
        inviteBtn.className = 'p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200'
        inviteBtn.onclick = (e) => {
          e.stopPropagation()
          sendMessage({
            type: 'invite',
            to: u.username,
            from: currentUser.username,
            text: `${currentUser.username} invited you to a Pong match!`,
          })
          addSystemMessage(`Invite sent to ${u.username}`)
        }

        const profileBtn = document.createElement('button')
        profileBtn.innerHTML = '👤'
        profileBtn.title = 'View Profile'
        profileBtn.className = 'p-2 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors duration-200'
        profileBtn.onclick = (e) => {
          e.stopPropagation()
          window.location.hash = `userSettings?user=${encodeURIComponent(u.username)}`
        }

        actions.append(msgBtn, inviteBtn, blockBtn, profileBtn)
        userEl.append(nameContainer, actions)
        usersDiv.appendChild(userEl)
      })
    })
    .catch(err => {
      console.error('Failed to load users:', err)
      addSystemMessage('Failed to load user list')
      if (usersDiv) {
        usersDiv.innerHTML = `
          <div class="text-center text-red-500 py-4">
            Error loading users
          </div>
        `
      }
    })

  // --- Send chat message ---
  function sendChatMessage() {
    if (!chatInput) return
    
    if (!currentRecipient) {
      addSystemMessage('⚠️ Select a user first!')
      return
    }

    const text = chatInput.value.trim()
    if (!text) return

    const msg: ChatMessage = {
      from: currentUser.username,
      to: currentRecipient,
      text,
      type: 'direct',
      timestamp: new Date().toISOString(),
    }

    // Send & render locally
    sendMessage(msg)
    addChatMessage(msg, true)
    chatInput.value = ''
  }

  sendBtn.addEventListener('click', sendChatMessage)
  
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendChatMessage()
    }
  })

  chatInput.focus()
}

// --- Render chat messages ---
export function addChatMessage(msg: { from: string; text: string; timestamp: string }, isOutgoing = false) {
  const messagesDiv = document.getElementById('chat-messages')
  if (!messagesDiv) return

  const messageEl = document.createElement('div')
  messageEl.className = `flex ${isOutgoing ? 'justify-end' : 'justify-start'} mb-4`

  const bubbleEl = document.createElement('div')
  bubbleEl.className = `max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
    isOutgoing 
      ? 'bg-blue-500 text-white rounded-br-none' 
      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
  } shadow-sm`

  const senderEl = document.createElement('div')
  senderEl.className = `text-xs font-semibold mb-1 ${
    isOutgoing ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
  }`
  senderEl.textContent = msg.from

  const textEl = document.createElement('div')
  textEl.className = 'text-sm break-words'
  textEl.textContent = msg.text

  const timeEl = document.createElement('div')
  timeEl.className = `text-xs mt-1 text-right ${
    isOutgoing ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
  }`
  timeEl.textContent = new Date(msg.timestamp).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  })

  bubbleEl.appendChild(senderEl)
  bubbleEl.appendChild(textEl)
  bubbleEl.appendChild(timeEl)
  messageEl.appendChild(bubbleEl)
  messagesDiv.appendChild(messageEl)
  
  messagesDiv.scrollTop = messagesDiv.scrollHeight
}

// --- System messages ---
export function addSystemMessage(text: string) {
  const messagesDiv = document.getElementById('chat-messages')
  if (!messagesDiv) return

  const systemEl = document.createElement('div')
  systemEl.className = 'flex justify-center my-2'

  const systemText = document.createElement('div')
  systemText.className = 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-3 py-1 rounded-full italic'
  systemText.textContent = `⚙️ ${text}`

  systemEl.appendChild(systemText)
  messagesDiv.appendChild(systemEl)
  messagesDiv.scrollTop = messagesDiv.scrollHeight
}

// --- Handle incoming WebSocket messages ---
export function handleIncomingMessage(data: any) {
  if (!data || typeof data !== 'object') return

  const currentUser = getCurrentUser()
  if (!currentUser) return

  const msgType = data.type || 'direct'

  switch (msgType) {
    case 'direct':
      // Show messages where current user is the recipient (incoming messages)
      // If 'to' field exists, check if we're the recipient
      // If 'to' field is missing, show the message if it's from someone else
      const isRecipient = data.to 
        ? data.to.toLowerCase() === currentUser.username.toLowerCase()
        : data.from && data.from.toLowerCase() !== currentUser.username.toLowerCase()
      
      if (isRecipient) {
        console.log('📨 Displaying incoming message from', data.from)
        addChatMessage({
          from: data.from || 'Anonymous',
          text: data.text || '',
          timestamp: data.timestamp || new Date().toISOString(),
        }, false) // false = incoming message
      } else {
        console.log('📨 Message not for current user:', { 
          to: data.to, 
          currentUser: currentUser.username,
          from: data.from 
        })
      }
      break

    case 'system':
      addSystemMessage(data.text)
      break

    case 'error':
      // Show error messages (like block notifications)
      addSystemMessage(`❌ ${data.text}`)
      break

    case 'invite':
      if (data.to && data.to.toLowerCase() === currentUser.username.toLowerCase()) {
        addSystemMessage(`🏓 ${data.from} invited you to a Pong game!`)
      }
      break

    case 'tournament':
      addSystemMessage(`🏆 Tournament update: ${data.text}`)
      break
  }
}