import { sendMessage, initWebSocket } from "./ws";

export function setupChat() {
  const input = document.querySelector<HTMLInputElement>("#chat-input");
  const button = document.querySelector<HTMLButtonElement>("#chat-send");
  const chatBox = document.getElementById("chat-messages");

  // Clear chat box on setup
  if (chatBox) chatBox.innerHTML = "";

  // Handle incoming messages and display them
  initWebSocket((msg: any) => {
    if (!chatBox) return;
    
    console.log("Received message:", msg); // Debug log
    
    if (msg.type === "chat") {
      const div = document.createElement("div");
      div.className = "mb-2 p-2 rounded bg-gray-100";
      
      // Ensure we're displaying the text properly
      const username = msg.username || "Anonymous";
      const text = msg.text || "";
      
      div.textContent = `${username}: ${text}`;
      chatBox.appendChild(div);
      chatBox.scrollTop = chatBox.scrollHeight;
      
    } else if (msg.type === "welcome") {
      const div = document.createElement("div");
      div.className = "mb-2 p-2 rounded bg-blue-100 text-blue-800";
      div.textContent = msg.message;
      chatBox.appendChild(div);
      chatBox.scrollTop = chatBox.scrollHeight;
      
    } else {
      // Handle unexpected message types
      console.warn("Unknown message type:", msg);
    }
  });

  if (input && button) {
    const handleSend = () => {
      if (input.value.trim()) {
        sendMessage({ type: "chat", text: input.value.trim() });
        input.value = "";
      }
    };

    button.addEventListener("click", handleSend);
    
    // Allow Enter key to send messages
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSend();
      }
    });
  }
}