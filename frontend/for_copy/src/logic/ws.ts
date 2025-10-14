// logic/ws.ts (frontend)
import { loadSession } from './session'

let socket: WebSocket | null = null

export function initWebSocket(onMessage?: (msg: unknown) => void) {
  const session = loadSession()
  if (!session || !session.token) {
    console.warn("⚠️ No session token, skipping WebSocket connection.")
    return
  }

  const url = `ws://${window.location.hostname}:3000/ws?token=${session.token}`
  socket = new WebSocket(url)

  socket.addEventListener("open", () => {
    console.log("✅ WebSocket connected")
  })

  socket.addEventListener("close", () => {
    console.log("❌ WebSocket disconnected")
    socket = null
  })

  socket.addEventListener("message", (event) => {
    try {
      const data = JSON.parse(event.data)
      if (onMessage) onMessage(data)
    } catch {
      console.log("📩 WS:", event.data)
      if (onMessage) onMessage(event.data)
    }
  })
}

export function sendMessage(payload: object) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload))
  } else {
    console.warn("⚠️ WebSocket not connected. Cannot send message.")
  }
}
