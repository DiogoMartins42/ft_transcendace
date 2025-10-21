import { setPong } from "./pong";
import { initClientPong } from "./pong_client";
import { GameState } from "./pong_types";
import { startTournament } from "./tournament";

export function showOverlay(btn_type: number, buttons: { text: string; onClick: () => void }[], message?: string) {
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

export function hideOverlay() {
  const overlay = document.getElementById("game-overlay");
  if (overlay) overlay.classList.add("hidden");
}

export function setupPong() {
  showOverlay(1, [
    { text: "🎮 Single Player", onClick: () => { hideOverlay(); startSinglePlayer(); } },
    { text: "🌐 Multiplayer", onClick: () => { hideOverlay(); startMultiplayer(); } },
    { text: "🏆 Tournament", onClick: () => { hideOverlay(); startTournament(); } }
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
  // Verify canvas exists
  const canvas = document.getElementById("pong") as HTMLCanvasElement;
  if (!canvas) {
    console.error("❌ Canvas #pong not found in DOM!");
    showOverlay(2, [
      { text: "Back", onClick: () => { hideOverlay(); setupPong(); } }
    ], "Error: Game canvas not found. Please refresh the page.");
    return;
  }

  console.log("✅ Canvas found, starting multiplayer...");
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

  console.log("🔌 Connecting to:", wsUrl);
  multiplayerSocket = new WebSocket(wsUrl);

  multiplayerSocket.addEventListener("open", () => {
    console.log("✅ Connected to Pong WebSocket:", wsUrl);
    multiplayerSocket!.send(JSON.stringify({ type: "findMatch" }));
  });

  multiplayerSocket.addEventListener("message", (event) => {
    try {
      const msg = JSON.parse(event.data);
      handleWebSocketMessage(msg);
    } catch (err) {
      console.error("Failed to parse WS message:", err, event.data);
    }
  });

  multiplayerSocket.addEventListener("close", (ev) => {
    console.warn("❌ Pong WebSocket closed", ev.code, ev.reason);
    stopSearchingOverlay();
  });

  multiplayerSocket.addEventListener("error", (err) => {
    console.error("❌ WebSocket error:", err);
    stopSearchingOverlay();
    showOverlay(2, [
      { text: "Retry", onClick: () => { hideOverlay(); startMultiplayer(); } },
      { text: "Back", onClick: () => { hideOverlay(); setupPong(); } }
    ], "Connection error. Please try again.");
  });
}

function handleWebSocketMessage(msg: any) {
  console.log("📥 Multiplayer WS message:", msg.type, msg);

  // Only handle pre-match messages here
  // Let pong_client.ts handle in-game messages
  switch (msg.type) {
    case "waiting":
      const m = document.getElementById("game-message");
      if (m) m.textContent = msg.message;
      break;

    case "matchFound":
      console.log("🎉 Match found! Initializing client...");
      stopSearchingOverlay();
      
      // CRITICAL: Initialize the client with the socket AND match data
      // This sets up all the game logic and rendering
      if (typeof initClientPong === "function") {
        initClientPong(multiplayerSocket!, msg);
      } else {
        console.error("❌ initClientPong function not found!");
      }
      break;

    case "error":
      stopSearchingOverlay();
      showOverlay(2, [
        { text: "Retry", onClick: () => { hideOverlay(); startMultiplayer(); } },
        { text: "Back", onClick: () => { hideOverlay(); setupPong(); } }
      ], msg.message || "An error occurred");
      break;

    // All other messages (state, gameOver, etc.) are handled by pong_client.ts
    default:
      console.debug("Message will be handled by pong_client:", msg.type);
  }
}

/* Searching overlay */
function showSearchingOverlay() {
  const overlay = document.getElementById("game-overlay");
  const msg = document.getElementById("game-message");
  const btns = document.getElementById("overlay-buttons");
  if (!overlay || !msg || !btns) return;
  
  btns.innerHTML = "";
  const cancelBtn = document.createElement("button");
  cancelBtn.textContent = "Cancel";
  cancelBtn.className = "px-8 py-2 text-white font-lucky text-lg rounded-full shadow-lg transition-transform transform bg-[#00091D] border-2 border-white hover:scale-105 hover:border-red-600 hover:shadow-red-500/50 hover:shadow-2xl focus:outline-none hover:text-red-600";
  cancelBtn.onclick = () => {
    if (multiplayerSocket) {
      multiplayerSocket.close();
    }
    stopSearchingOverlay();
    setupPong();
  };
  btns.appendChild(cancelBtn);
  
  msg.textContent = "🔍 Searching for opponent...";
  overlay.classList.remove("hidden");
}

export function stopSearchingOverlay() {
  if (matchmakingTimeout) {
    clearTimeout(matchmakingTimeout);
    matchmakingTimeout = 0;
  }
  console.log("🛑 Searching overlay stopped");
}

// Make stopSearchingOverlay available globally for pong_client
(window as any).stopSearchingOverlay = stopSearchingOverlay;