import { sendMessage, initWebSocket } from "./ws";

export function setupChat() {
  const input = document.querySelector<HTMLInputElement>("#chat-input");
  const button = document.querySelector<HTMLButtonElement>("#chat-send");
  const chatBox = document.getElementById("chat-messages");

  // Clear chat box on setup
  if (chatBox) chatBox.innerHTML = "";

  // Handle incoming messages and display them
  initWebSocket((msg: any) => {
    console.log("Chat handler received:", msg);
    if (!chatBox) return;
    if (msg.type === "chat") {
      const div = document.createElement("div");
      div.textContent = (msg.username ? msg.username + ": " : "") + msg.text;
      chatBox.appendChild(div);
      chatBox.scrollTop = chatBox.scrollHeight;
    } else if (msg.type === "welcome") {
      const div = document.createElement("div");
      div.textContent = msg.message;
      chatBox.appendChild(div);
      chatBox.scrollTop = chatBox.scrollHeight;
    }
  });

  if (input && button) {
    button.addEventListener("click", () => {
      if (input.value.trim()) {
        sendMessage({ type: "chat", text: input.value });
        input.value = "";
      }
    });
  }
}