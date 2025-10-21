// Multiplayer Pong client logic

import { GameState } from "./pong_types";
import type { InputMessage, StateMessage, GameStateType } from "./pong_types";
import { gameSettings } from "./gameSettings";
import { stopSearchingOverlay, setupPong } from "./setupPong";


/* -------------------------- Canvas & Rendering -------------------------- */

export function getCanvasAndContext(): {
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
} {
  const canvas = document.getElementById("pong") as HTMLCanvasElement | null;
  if (!canvas) {
    console.error("Canvas element #pong not found");
    return { canvas: null, context: null };
  }
  const context = canvas.getContext("2d");
  if (!context) {
    console.error("2D context not available");
    return { canvas, context: null };
  }
  return { canvas, context };
}

export function render(
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  player1: any,
  player2: any,
  ball: any,
  net: { x: number; y: number; width: number; height: number }
) {
  // background
  context.fillStyle = gameSettings.bgColor || "#000";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // net
  for (let i = 0; i < canvas.height; i += net.height + 5) {
    context.fillStyle = gameSettings.itemsColor || "#fff";
    context.fillRect(net.x, net.y + i, net.width, net.height);
  }

  // scores
  context.fillStyle = "#fff";
  context.font = "32px sans-serif";
  context.textAlign = "center";
  context.fillText(String(player1.score ?? 0), canvas.width / 4, 60);
  context.fillText(String(player2.score ?? 0), (3 * canvas.width) / 4, 60);

  // paddles
  context.fillStyle = gameSettings.itemsColor || "#fff";
  context.fillRect(player1.x, player1.y, player1.width, player1.height);
  context.fillRect(player2.x, player2.y, player2.width, player2.height);

  // ball
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  context.closePath();
  context.fillStyle = "#05EDFF";
  context.fill();
}

/* ---------------------------- Overlay helpers --------------------------- */

function showOverlay(
  message: string,
  buttons: { text: string; onClick: () => void }[] = []
) {
  const overlay = document.getElementById("game-overlay");
  const msg = document.getElementById("game-message");
  const btns = document.getElementById("overlay-buttons");

  if (!overlay || !msg || !btns) {
    console.warn("Overlay elements not found in DOM");
    alert(message);
    return;
  }

  msg.textContent = message;
  btns.innerHTML = "";

  buttons.forEach((b) => {
    const el = document.createElement("button");
    el.textContent = b.text;
    el.className =
      "px-4 py-2 m-2 rounded bg-[#F5CB5C] text-[#1C39BB] font-semibold";
    el.onclick = b.onClick;
    btns.appendChild(el);
  });

  overlay.style.display = "flex";
}

function hideOverlay() {
  const overlay = document.getElementById("game-overlay");
  if (overlay) overlay.style.display = "none";
}

/* -------------------------- Matchmaking Handler -------------------------- */

export function setupMatchmakingHandler(socket: WebSocket) {
  socket.addEventListener("message", (ev) => {
    let data: any = null;
    try { 
      data = JSON.parse(ev.data.toString()); 
    } catch (err) {
      console.debug("pong_client: received non-json message:", ev.data);
      return;
    }

    console.debug("pong_client: incoming message:", data);

    // Handle connection established
    if (data.type === "connected") {
      console.log("✅ Connected to game server:", data);
      (window as any).playerId = data.id;
      (window as any).gameUsername = data.username;
      return;
    }

    // Handle waiting for opponent
    if (data.type === "waiting") {
      console.log("⏳ Waiting for opponent:", data.message);
      const msgElement = document.getElementById("game-message");
      if (msgElement) {
        msgElement.textContent = data.message;
      }
      return;
    }

    // Handle match found
    if (data.type === "matchFound") {
      console.log("🎉 Match found!", data);
      handleMatchFound(data);
      return;
    }

    // Handle game state updates
    if (data.type === "state") {
      handleGameState(data);
      return;
    }

    // Handle opponent disconnect
    if (data.type === "opponentDisconnected") {
      console.warn("⚠️ Opponent disconnected");
      handleOpponentDisconnected();
      return;
    }

    // Handle match ended
    if (data.type === "matchEnded") {
      console.log("🏁 Match ended:", data.reason);
      handleMatchEnded(data.reason);
      return;
    }

    // Handle errors
    if (data.type === "error") {
      console.error("❌ Server error:", data);
      handleMatchmakingError(data.message || "Server error");
      return;
    }

    // Handle server stats (for debugging)
    if (data.type === "serverStats") {
      console.log("📈 Server stats:", data);
      return;
    }

    // fallback debug
    console.debug("pong_client: unhandled message:", data);
  });

  socket.addEventListener("close", (ev) => {
    console.warn("Pong socket closed", ev.code, ev.reason);
    if (typeof stopSearchingOverlay === "function") {
      try { stopSearchingOverlay(); } catch (_) {}
    }
    
    // Show reconnection option if not a normal closure
    if (ev.code !== 1000 && !ev.reason?.includes("User stopped")) {
      showOverlay(
        "Connection lost",
        [
          { text: "Reconnect", onClick: () => { 
            hideOverlay();
            if (typeof setupPong === "function") setupPong();
          }},
          { text: "Main Menu", onClick: () => { 
            hideOverlay();
            if (typeof setupPong === "function") setupPong();
          }}
        ]
      );
    }
  });

  socket.addEventListener("error", (err) => {
    console.error("Pong socket error", err);
    if (typeof stopSearchingOverlay === "function") {
      try { stopSearchingOverlay(); } catch (_) {}
    }
  });

  // keep reference if other modules need it
  (window as any).pongSocket = socket;
}

/* -------------------------- Match Event Handlers -------------------------- */

function handleMatchFound(matchData: any) {
  console.log("🎯 Starting game with match data:", matchData);
  
  // Stop searching overlay
  if (typeof stopSearchingOverlay === "function") {
    stopSearchingOverlay();
  }
  
  // Store match info globally
  (window as any).matchId = matchData.matchId;
  (window as any).playerRole = matchData.role;
  (window as any).opponent = matchData.opponent;
  
  // Set multiplayer mode
  gameSettings.multiplayer = true;
  
  console.log(`🎮 Player role: ${matchData.role}, Opponent: ${matchData.opponent}`);
  
  // Start the game - try different possible game start functions
  if (typeof (window as any).startPong === "function") {
    try { 
      (window as any).startPong(); 
      console.log("✅ Game started via startPong");
    } catch (e) { 
      console.warn("startPong failed, trying setPong:", e);
      startGameFallback();
    }
  } else {
    startGameFallback();
  }
}

function startGameFallback() {
  if (typeof (window as any).setPong === "function") {
    try { 
      (window as any).setPong(); 
      console.log("✅ Game started via setPong");
    } catch (e) { 
      console.error("setPong also failed:", e);
      showOverlay(
        "Failed to start game",
        [
          { text: "Retry", onClick: () => { 
            hideOverlay();
            if (typeof setupPong === "function") setupPong();
          }}
        ]
      );
    }
  } else {
    console.error("No game start function available");
    showOverlay(
      "Game start function not found",
      [
        { text: "Back to Menu", onClick: () => { 
          hideOverlay();
          if (typeof setupPong === "function") setupPong();
        }}
      ]
    );
  }
}

function handleGameState(stateData: any) {
  console.debug("🔄 Game state update:", stateData);
  
  // Forward to game engine if available
  if (typeof (window as any).handleServerGameState === "function") {
    try { 
      (window as any).handleServerGameState(stateData); 
    } catch (e) { 
      console.warn("handleServerGameState error", e); 
    }
  } else {
    // Fallback: log state for debugging
    console.debug("Game state (no handler):", stateData);
  }
}

function handleOpponentDisconnected() {
  console.warn("👤 Opponent disconnected");
  showOverlay(
    "Opponent disconnected",
    [
      { text: "Back to Menu", onClick: () => { 
        hideOverlay();
        if (typeof setupPong === "function") setupPong();
      }}
    ]
  );
}

function handleMatchEnded(reason: string) {
  console.log("🏁 Match ended:", reason);
  showOverlay(
    `Match ended: ${reason}`,
    [
      { text: "Play Again", onClick: () => { 
        hideOverlay();
        if (typeof setupPong === "function") setupPong();
      }},
      { text: "Main Menu", onClick: () => { 
        hideOverlay();
        if (typeof setupPong === "function") setupPong();
      }}
    ]
  );
}

function handleMatchmakingError(errorMessage: string) {
  console.error("❌ Matchmaking error:", errorMessage);
  if (typeof stopSearchingOverlay === "function") {
    stopSearchingOverlay();
  }
  
  showOverlay(
    errorMessage,
    [
      { text: "Retry", onClick: () => { 
        hideOverlay();
        if (typeof setupPong === "function") setupPong();
      }},
      { text: "Back", onClick: () => { 
        hideOverlay();
        if (typeof setupPong === "function") setupPong();
      }}
    ]
  );
}

/* -------------------------- Input Handling -------------------------- */

export function sendGameInput(direction: "up" | "down" | "stop") {
  const socket = (window as any).pongSocket;
  const playerRole = (window as any).playerRole;
  
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn("Cannot send input: WebSocket not connected");
    return;
  }
  
  if (!playerRole) {
    console.warn("Cannot send input: player role not set");
    return;
  }
  
  const inputMessage = {
    type: "input",
    player: playerRole === "left" ? "left" : "right",
    direction: direction
  };
  
  try {
    socket.send(JSON.stringify(inputMessage));
    console.debug("🎮 Sent input:", inputMessage);
  } catch (err) {
    console.error("Failed to send input:", err);
  }
}

export function sendGameControl(action: "start" | "pause" | "resume" | "restart") {
  const socket = (window as any).pongSocket;
  
  if (!socket || socket.readyState !== WebSocket.OPEN) {
    console.warn("Cannot send control: WebSocket not connected");
    return;
  }
  
  const controlMessage = {
    type: "control",
    action: action
  };
  
  try {
    socket.send(JSON.stringify(controlMessage));
    console.debug("🎮 Sent control:", controlMessage);
  } catch (err) {
    console.error("Failed to send control:", err);
  }
}

/* -------------------------- initClientPong ----------------------------- */

export function initClientPong(socket: WebSocket) {
  console.log("✅ initClientPong initialized. attaching WS handlers");
  setupMatchmakingHandler(socket);
}