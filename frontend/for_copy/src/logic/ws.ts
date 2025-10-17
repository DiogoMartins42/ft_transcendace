// logic/ws.ts - Fixed WebSocket connection with robust error handling
import { getToken, getUsername } from './session'

declare global {
  interface Window {
    anonymousId?: string
  }
}

let socket: WebSocket | null = null
let outgoingQueue: string[] = []
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 5
let isConnecting = false

export function initWebSocket(onMessage?: (msg: unknown) => void) {
  if (isConnecting) {
    console.log('🔄 WebSocket connection already in progress...')
    return
  }

  // Safely get token and username with fallbacks
  let token: string | null = null;
  let username: string = 'Anonymous';
  
  try {
    token = getToken();
    username = getUsername();
  } catch (error) {
    console.error('❌ Error getting session info:', error);
    // Use fallback values
    username = 'Anonymous' + Math.floor(1000 + Math.random() * 9000);
  }

  // Use same protocol as current page
  const isSecure = window.location.protocol === 'https:'
  const wsProtocol = isSecure ? 'wss:' : 'ws:'
  
  // Build WebSocket URL
  const wsBase = `${wsProtocol}//${window.location.host}/ws`
  const wsUrl = token ? `${wsBase}?token=${encodeURIComponent(token)}` : wsBase

  console.log(`🔌 Connecting to WebSocket:`, wsUrl)
  console.log(`   Username: ${username}, Token: ${token ? 'Yes' : 'No'}`)

  isConnecting = true

  try {
    socket = new WebSocket(wsUrl)
  } catch (err) {
    console.error(`❌ Failed to create WebSocket:`, err)
    isConnecting = false
    return
  }

  socket.addEventListener("open", () => {
    console.log("✅ WebSocket connected successfully")
    isConnecting = false
    reconnectAttempts = 0

    // Inform server of username
    try {
      const usernameMsg = { type: "setUsername", username }
      socket?.send(JSON.stringify(usernameMsg))
      console.log("📤 Sent setUsername:", username)
    } catch (err) {
      console.warn("⚠️ Failed to send setUsername:", err)
    }

    // Flush queued messages
    flushQueuedMessages()
  })

  socket.addEventListener("error", (error) => {
    console.error(`❌ WebSocket error:`, error)
    isConnecting = false
  })

  socket.addEventListener("close", (event) => {
    console.log(`❌ WebSocket disconnected:`, {
      code: event.code,
      reason: event.reason,
      wasClean: event.wasClean
    })
    isConnecting = false
    socket = null

    // Reconnect logic for unexpected closures
    if (event.code !== 1000 && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000)
      reconnectAttempts++
      console.log(`🔄 Reconnecting in ${delay}ms... (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`)
      setTimeout(() => initWebSocket(onMessage), delay)
    }
  })

  socket.addEventListener("message", (event) => {
    try {
      const data = JSON.parse(event.data)
      console.log("📨 Received WebSocket message:", data)
      if (onMessage) onMessage(data)
    } catch {
      console.log("📩 WS (raw):", event.data)
      if (onMessage) onMessage(event.data)
    }
  })
}

function flushQueuedMessages() {
  if (!socket || socket.readyState !== WebSocket.OPEN) return

  while (outgoingQueue.length > 0) {
    const msg = outgoingQueue.shift()!
    try {
      console.log("📤 Flushing queued message:", JSON.parse(msg))
      socket.send(msg)
    } catch (err) {
      console.error("❌ Failed to send queued message:", err)
      // Re-queue failed message
      outgoingQueue.unshift(msg)
      break
    }
  }
}

export function sendMessage(payload: object) {
  const str = JSON.stringify(payload)

  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("📤 Sending message:", payload)
    try {
      socket.send(str)
    } catch (err) {
      console.error("❌ Failed to send message:", err)
      outgoingQueue.push(str)
    }
  } else {
    console.warn("⚠️ WebSocket not connected. Queueing message.", { 
      readyState: socket?.readyState,
      isConnecting 
    })
    outgoingQueue.push(str)
    
    // Try to reconnect if not already connecting
    if (!isConnecting && (!socket || socket.readyState === WebSocket.CLOSED)) {
      console.log("🔄 Triggering reconnection...")
      initWebSocket()
    }
  }
}

// Export connection status for debugging
export function getWebSocketStatus() {
  return {
    socket: !!socket,
    readyState: socket?.readyState,
    isConnecting,
    queueLength: outgoingQueue.length,
    reconnectAttempts
  }
}