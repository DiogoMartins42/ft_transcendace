let ws: WebSocket | null = null;

export function initWebSocket( 
    onMessage?: (msg: unknown) => void
): WebSocket {
    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:3000/ws";

    if (!ws || ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
        ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log("Connected to WebSocket:", wsUrl);
            // Don't send an automatic message - let users send their own messages
        };

        ws.onclose = () => {
            console.log("Disconnected from server!");
            ws = null;
        };

        ws.onerror = (err) => {
            console.log("WebSocket error!", err);
            ws = null;
        };
    }

    // Always replace the onmessage handler
    ws.onmessage = (event: MessageEvent) => {
        if (onMessage) {
            try {
                const parsedMessage = JSON.parse(event.data);
                onMessage(parsedMessage);
            } catch {
                console.warn("Received non-JSON message:", event.data);
            }
        }
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