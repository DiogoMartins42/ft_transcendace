let ws: WebSocket | null = null;

export function initWebSocket( 
    onMessage?: (msg: unknown) => void
): WebSocket {
    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:3000/ws";
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        console.log("Connected to WebSocket:", wsUrl);
        // Send a proper JSON message instead of plain text
        sendMessage({ type: "connection", text: "Hello from frontend!" });
    };

    ws.onmessage = (event: MessageEvent) => {
        console.log("Message from server:", event.data);
        if (onMessage) {
            try {
                const parsedMessage = JSON.parse(event.data);
                onMessage(parsedMessage);
                
                // Handle different message types
                if (parsedMessage.type === "welcome") {
                    console.log("✅", parsedMessage.message);
                } else if (parsedMessage.type === "chat") {
                    console.log("💬", parsedMessage.text);
                }
            } catch {
                console.warn("Received non-json message:", event.data);
            }
        }
    };

    ws.onclose = () => {
        console.log("Disconnected from server!");
    };

    ws.onerror = (err) => {
        console.log("WebSocket error!", err);
    };

    return ws;
}

export function sendMessage(message: unknown): void {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else {
        console.warn("WebSocket not connected!");
    }
}