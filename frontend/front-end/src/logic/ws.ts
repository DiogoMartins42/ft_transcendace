let ws: WebSocket | null = null;

export function initWebSocket( 
    onMessage?: (msg:unknown) => void
): WebSocket {
    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:3000/ws";
    ws = new WebSocket(wsUrl);

    ws.onopen= () => {
        console.log("Connected to WebSocket:", wsUrl);
        ws?.send("Hello from frontend!");
    };

    ws.onmessage = (event: MessageEvent) => {
        console.log("Message from server:", event.data);
        if (onMessage) {
            try{
                onMessage(JSON.parse(event.data));
            } catch {
                console.warn("Received non-json message", event.data);
            }
        }
    };

    ws.onclose = () => {
        console.log("Disconected from server!");
    }

    ws.onerror = (err) => {
        console.log("WebSocket error!", err);
    }

    return ws;
}

export function sendMessage(message: unknown): void {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
    } else {
        console.warn("Websocket closed!");
    }
}