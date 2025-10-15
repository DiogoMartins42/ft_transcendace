// logic/ws.ts - Try connecting without explicit port
import { loadSession } from './session'

let socket: WebSocket | null = null

export function initWebSocket(onMessage?: (msg: unknown) => void) {
  const session = loadSession()
  if (!session || !session.token) {
    console.warn("⚠️ No session or token found")
    return
  }

  // Try multiple connection strategies
  const strategies = [
    // Strategy 1: Use same protocol and host (recommended)
    () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      return `${protocol}//${window.location.host}/ws?token=${session.token}`
    },
    // Strategy 2: Direct to port 3000 (fallback)
    () => {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
      return `${protocol}//${window.location.hostname}:3000/ws?token=${session.token}`
    },
    // Strategy 3: ws:// instead of wss:// (if HTTPS is causing issues)
    () => {
      return `ws://${window.location.hostname}:3000/ws?token=${session.token}`
    }
  ]

  let strategyIndex = 0

  function tryConnect() {
    if (strategyIndex >= strategies.length) {
      console.error("❌ All WebSocket connection strategies failed")
      return
    }

    const url = strategies[strategyIndex]()
    console.log(`🔌 Connecting to (strategy ${strategyIndex + 1}):`, url)
    
    socket = new WebSocket(url)
    let connected = false

    socket.addEventListener("open", () => {
      connected = true
      console.log("✅ WebSocket connected successfully!")
      // Send username to server
      socket?.send(JSON.stringify({ 
        type: "setUsername", 
        username: session.user?.username || session.username 
      }))
    })

    socket.addEventListener("error", (error) => {
      console.error(`❌ WebSocket error (strategy ${strategyIndex + 1}):`, error)
    })

    socket.addEventListener("close", (event) => {
      if (!connected && strategyIndex < strategies.length - 1) {
        console.log(`⚠️ Strategy ${strategyIndex + 1} failed, trying next...`)
        strategyIndex++
        setTimeout(tryConnect, 1000)
      } else {
        console.log("❌ WebSocket disconnected", event.code, event.reason)
        socket = null
      }
    })

    socket.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data)
        console.log("📨 Received:", data)
        if (onMessage) onMessage(data)
      } catch {
        console.log("📩 WS:", event.data)
        if (onMessage) onMessage(event.data)
      }
    })
  }

  tryConnect()
}

export function sendMessage(payload: object) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    console.log("📤 Sending:", payload)
    socket.send(JSON.stringify(payload))
  } else {
    console.warn("⚠️ WebSocket not connected. Cannot send message.", {
      socket: !!socket,
      readyState: socket?.readyState,
      CONNECTING: WebSocket.CONNECTING,
      OPEN: WebSocket.OPEN,
      CLOSING: WebSocket.CLOSING,
      CLOSED: WebSocket.CLOSED
    })
  }
}