// logic/ws.ts - Fixed WebSocket connection
import { loadSession } from './session'

declare global {
  interface Window {
    anonymousId?: string
  }
}

let socket: WebSocket | null = null
let outgoingQueue: string[] = []
let reconnectAttempts = 0
const MAX_RECONNECT_ATTEMPTS = 5
let reconnectTimeout: number | null = null

function ensureAnonymousId() {
  if (!window.anonymousId) {
    window.anonymousId = 'Anonymous' + Math.floor(1000 + Math.random() * 9000)
  }
  return window.anonymousId
}

export function initWebSocket(onMessage?: (msg: unknown) => void) {
  // Clear any existing reconnect timeout
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout)
    reconnectTimeout = null
  }

  // Close existing socket if any
  if (socket) {
    try {
      socket.close(1000, 'Reconnecting')
    } catch (err) {
      console.warn('Error closing existing socket:', err)
    }
    socket = null
  }

  // Safe session load
  let session: any = null
  try {
    session = typeof loadSession === 'function' ? loadSession() : null
  } catch {
    session = null
  }

  const token = session?.token ?? null
  const username = session?.user?.username ?? session?.username ?? ensureAnonymousId()

  // Build WebSocket URL
  const isSecure = window.location.protocol === 'https:'
  const wsProtocol = isSecure ? 'wss:' : 'ws:'
  
  // For production, use the domain directly
  // For development, use window.location.host
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  const wsHost = isDev ? window.location.host : 'pongpong.duckdns.org:3000'
  
  const wsBase = `${wsProtocol}//${wsHost}/ws`
  const wsUrl = token ? `${wsBase}?token=${token}` : wsBase

  console.log(`🔌 Connecting to WebSocket (attempt ${reconnectAttempts + 1}/${MAX_RECONNECT_ATTEMPTS}):`)
  console.log(`   URL: ${wsUrl.replace(/token=[^&]+/, 'token=***')}`)
  console.log(`   Username: ${username}`)
  console.log(`   Secure: ${isSecure}`)

  try {
    socket = new WebSocket(wsUrl)
  } catch (err) {
    console.error(`❌ Failed to create WebSocket:`, err)
    scheduleReconnect(onMessage)
    return
  }

  // Set a connection timeout
  const connectionTimeout = setTimeout(() => {
    if (socket && socket.readyState !== WebSocket.OPEN) {
      console.warn('⏱️ WebSocket connection timeout')
      socket.close()
      scheduleReconnect(onMessage)
    }
  }, 10000) // 10 second timeout

  socket.addEventListener("open", () => {
    clearTimeout(connectionTimeout)
    reconnectAttempts = 0 // Reset on successful connection
    console.log("✅ WebSocket connected successfully")

    // Inform server of username
    try {
      socket?.send(JSON.stringify({ type: "setUsername", username }))
      console.log("📤 Sent setUsername:", username)
    } catch (err) {
      console.warn("⚠️ Failed to send setUsername:", err)
    }

    // Flush queued messages
    let flushedCount = 0
    while (outgoingQueue.length > 0 && socket && socket.readyState === WebSocket.OPEN) {
      const msg = outgoingQueue.shift()!
      try {
        socket.send(msg)
        flushedCount++
      } catch (err) {
        console.error('❌ Failed to send queued message:', err)
        outgoingQueue.unshift(msg) // Put it back
        break
      }
    }
    if (flushedCount > 0) {
      console.log(`📤 Flushed ${flushedCount} queued message(s)`)
    }
  })

  socket.addEventListener("error", (error) => {
    clearTimeout(connectionTimeout)
    console.error(`❌ WebSocket error:`, error)
  })

  socket.addEventListener("close", (event) => {
    clearTimeout(connectionTimeout)
    console.log("❌ WebSocket disconnected", {
      code: event.code,
      reason: event.reason || 'No reason provided',
      wasClean: event.wasClean
    })
    socket = null
    
    // Reconnect logic
    if (event.code !== 1000) { // 1000 = normal closure
      scheduleReconnect(onMessage)
    } else {
      console.log('✅ WebSocket closed normally')
      reconnectAttempts = 0
    }
  })

  socket.addEventListener("message", (event) => {
    try {
      const data = JSON.parse(event.data)
      console.log("📨 Received:", data)
      if (onMessage) onMessage(data)
    } catch {
      console.log("📩 WS (raw):", event.data)
      if (onMessage) onMessage(event.data)
    }
  })
}

function scheduleReconnect(onMessage?: (msg: unknown) => void) {
  if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
    console.error(`❌ Max reconnection attempts (${MAX_RECONNECT_ATTEMPTS}) reached. Giving up.`)
    return
  }

  const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000) // Exponential backoff, max 30s
  reconnectAttempts++
  
  console.log(`🔄 Reconnecting in ${delay}ms... (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS})`)
  
  reconnectTimeout = window.setTimeout(() => {
    initWebSocket(onMessage)
  }, delay)
}

export function sendMessage(payload: object) {
  const str = JSON.stringify(payload)

  if (socket && socket.readyState === WebSocket.OPEN) {
    try {
      console.log("📤 Sending:", payload)
      socket.send(str)
    } catch (err) {
      console.error("❌ Failed to send message:", err)
      outgoingQueue.push(str)
    }
  } else {
    console.warn("⚠️ WebSocket not connected. Queueing message.", { 
      socket: !!socket, 
      readyState: socket?.readyState 
    })
    outgoingQueue.push(str)
  }
}

export function closeWebSocket() {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout)
    reconnectTimeout = null
  }
  
  if (socket) {
    try {
      socket.close(1000, 'User logout')
    } catch (err) {
      console.warn('Error closing socket:', err)
    }
    socket = null
  }
  
  reconnectAttempts = 0
  outgoingQueue = []
  console.log('🔌 WebSocket closed by user')
}

// Alias for backward compatibility
export const disconnectWebSocket = closeWebSocket