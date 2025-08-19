import { sendMessage } from "./ws";

export function setupChat() {
  const input = document.querySelector<HTMLInputElement>("#chat-input");
  const button = document.querySelector<HTMLButtonElement>("#chat-send");

  if (input && button) {
    button.addEventListener("click", () => {
      if (input.value.trim()) {
        sendMessage({ type: "chat", text: input.value });
        input.value = "";
      }
    });
  }
}