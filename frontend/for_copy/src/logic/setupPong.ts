import { setPong } from "./pong";
import { initClientPong } from "./pong_client";
import { GameState } from "./pong_types";

function showOverlay(btn_type: number, buttons: { text: string; onClick: () => void }[], message?: string) {
  const overlay = document.getElementById("game-overlay") as HTMLDivElement | null;
  const msg = document.getElementById("game-message") as HTMLParagraphElement | null;
  const btns = document.getElementById("overlay-buttons") as HTMLDivElement | null;
  if (!overlay || !btns) return;

  btns.innerHTML = "";
  if (msg) msg.textContent = message ?? "";

  buttons.forEach((b) => {
    const btn = document.createElement("button");
    btn.textContent = b.text;
    btn.className =
      "px-8 py-2 text-white font-lucky text-lg rounded-full shadow-lg transition-transform " +
      "transform bg-[#00091D] border-2 border-white hover:scale-105 hover:border-green-600 " +
      "hover:shadow-green-500/50 hover:shadow-2xl focus:outline-none hover:text-green-600";
    btn.onclick = b.onClick;
    btns.appendChild(btn);
  });

  overlay.classList.remove("hidden");
}

function hideOverlay() {
  const overlay = document.getElementById("game-overlay");
  if (overlay) overlay.classList.add("hidden");
}

export function setupPong() {
  showOverlay(1, [
    { text: "🎮 Single Player", onClick: () => { hideOverlay(); startSinglePlayer(); } },
    { text: "🌐 Multiplayer", onClick: () => { hideOverlay(); startMultiplayer(); } }
  ], "Select Game Mode");
}

function startSinglePlayer() {
  console.log("Starting single player...");
  (window as any).gameState = GameState.START;
  setPong();
}

/* Multiplayer */
let matchmakingTimeout: number;
let multiplayerSocket: WebSocket | null = null;

function startMultiplayer() {
  showSearchingOverlay();

  matchmakingTimeout = window.setTimeout(() => {
    stopSearchingOverlay();
    showOverlay(2, [
      { text: "Retry", onClick: () => { hideOverlay(); startMultiplayer(); } },
      { text: "Back", onClick: () => { hideOverlay(); setupPong(); } }
    ], "⏰ No opponents found.");
  }, 30000);

  createDirectWebSocketConnection();
}

function createDirectWebSocketConnection() {
  const wsUrl =
    import.meta.env.VITE_WS_URL ||
    (window.location.protocol === "https:"
      ? `wss://${window.location.host}/ws`
      : `ws://${window.location.host}:3000/ws`);

  multiplayerSocket = new WebSocket(wsUrl);

  multiplayerSocket.addEventListener("open", () => {
    console.log("✅ Connected to Pong WebSocket:", wsUrl);
    multiplayerSocket!.send(JSON.stringify({ type: "findMatch" }));
  });

  multiplayerSocket.addEventListener("message", (event) => {
    const msg = JSON.parse(event.data);
    handleWebSocketMessage(msg);
  });

  multiplayerSocket.addEventListener("close", (ev) => {
    console.warn("❌ Pong WebSocket closed", ev.code, ev.reason);
  });

  multiplayerSocket.addEventListener("error", (err) => {
    console.error("❌ WebSocket error:", err);
  });
}

function handleWebSocketMessage(msg: any) {
  console.log("📥 Multiplayer WS message:", msg);

  if (msg.type === "waiting") {
    const m = document.getElementById("game-message");
    if (m) m.textContent = msg.message;
  }

  if (msg.type === "matchFound") {
    stopSearchingOverlay();
    hideOverlay();
    console.log("🎉 Match found! Starting game...");
    if (typeof initClientPong === "function") {
      initClientPong(multiplayerSocket!);
    }
  }

  if (msg.type === "opponentDisconnected") {
    showOverlay(2, [], "⚠️ Opponent disconnected — waiting...");
  }

  if (msg.type === "opponentRejoined") {
    hideOverlay();
    console.log(`✅ ${msg.username} rejoined.`);
  }

  if (msg.type === "rejoined") {
    hideOverlay();
    console.log("🔁 You rejoined your match:", msg.matchId);
  }
}

/* Searching overlay */
function showSearchingOverlay() {
  const overlay = document.getElementById("game-overlay");
  const msg = document.getElementById("game-message");
  const btns = document.getElementById("overlay-buttons");
  if (!overlay || !msg || !btns) return;
  btns.innerHTML = "";
  msg.textContent = "🔍 Searching for opponent";
  overlay.classList.remove("hidden");
}

export function stopSearchingOverlay() {
  const overlay = document.getElementById("game-overlay");
  if (!overlay) return;
  if (matchmakingTimeout) clearTimeout(matchmakingTimeout);
  console.log("🛑 Searching overlay stopped");
}
