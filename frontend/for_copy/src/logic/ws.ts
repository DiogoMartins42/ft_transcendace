let ws: WebSocket | null = null;

export function initWebSocket( 
    onMessage?: (msg: unknown) => void
): WebSocket {
    if (ws && ws.readyState === WebSocket.OPEN) {
        // Only add the new handler
        ws.onmessage = (event: MessageEvent) => {
            if (onMessage) {
                try {
                    const parsedMessage = JSON.parse(event.data);
                    onMessage(parsedMessage);
                } catch {
                    // ignore
                }
            }
        };
        return ws;
    }

    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:3000/ws";
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
        // Send a proper JSON message instead of plain text
        sendMessage({ type: "connection", text: "Hello from frontend!" });
    };

    ws.onmessage = (event: MessageEvent) => {
        if (onMessage) {
            try {
                const parsedMessage = JSON.parse(event.data);
                onMessage(parsedMessage);
            } catch {
                // ignore
            }
        }
    };

    ws.onclose = () => {
        ws = null;
    };

    ws.onerror = () => {
        ws = null;
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