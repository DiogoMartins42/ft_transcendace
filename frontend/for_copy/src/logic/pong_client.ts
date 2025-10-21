// Multiplayer Pong client logic

//import { GameState } from "./pong_types";
//import type { InputMessage, StateMessage, GameStateType } from "./pong_types";
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

/* -------------------------- initClientPong ----------------------------- */

export function initClientPong(socket: WebSocket) {
  console.log("✅ initClientPong initialized. attaching WS handlers");

  socket.addEventListener("message", (ev) => {
    let data: any = null;
    try { data = JSON.parse(ev.data.toString()); }
    catch (err) {
      console.debug("pong_client: received non-json message:", ev.data);
      return;
    }

    console.debug("pong_client: incoming message:", data);

    // Add queue status handling
    if (data.type === "queueStatus" || data.type === "waitingForOpponent") {
      console.info("📊 Queue status:", data);
      // Update the searching overlay with queue position
      const msgElement = document.getElementById("game-message");
      if (msgElement) {
        const position = data.position || data.playersInQueue;
        if (position) {
          msgElement.textContent = `🔍 Searching for opponent... (Position: ${position})`;
        }
      }
      return;
    }

    // Add matchmaking error handling
    if (data.type === "matchmakingError" || data.type === "error") {
      console.error("Matchmaking error:", data);
      if (typeof stopSearchingOverlay === "function") {
        stopSearchingOverlay();
      }
      showOverlay(
        data.message || "Matchmaking failed",
        [
          { text: "Retry", onClick: () => { 
            hideOverlay();
            socket.send(JSON.stringify({ type: "joinQueue" }));
          }},
          { text: "Back", onClick: () => { 
            hideOverlay();
            if (typeof setupPong === "function") {
              setupPong();
            }
          }}
        ]
      );
      return;
    }

    // role / assignment messages
    if (data.type === "role" || data.type === "assignRole") {
      const role = data.role || data.value || data.payload;
      (window as any).playerRole = role;
      console.info("🍀 assigned role:", role);

      // stop searching UI if available
      if (typeof stopSearchingOverlay === "function") {
        try { stopSearchingOverlay(); } catch (_) {}
      }

      // if your app has a function to start the game for players, call it safely
      if (role === "player" || role === "owner") {
        (window as any).gameRole = "player";
        if (typeof (window as any).startPong === "function") {
          try { (window as any).startPong(); } catch (_) {}
        } else if (typeof (window as any).setPong === "function") {
          try { (window as any).setPong(); } catch (_) {}
        }
      } else {
        (window as any).gameRole = "spectator";
      }
      return;
    }

    // match found
    if (data.type === "matchFound" || data.type === "match") {
      console.info("🔔 match found:", data);
      if (typeof stopSearchingOverlay === "function") {
        try { stopSearchingOverlay(); } catch (_) {}
      }
      // if server sent initial state, try to call your initializer if present
      if (data.start && typeof (window as any).initGameFromServer === "function") {
        try { (window as any).initGameFromServer(data); } catch (_) {}
      }
      return;
    }

    // gameplay / state messages
    if (data.type === "gameState" || data.type === "state") {
      if (typeof (window as any).handleServerGameState === "function") {
        try { (window as any).handleServerGameState(data); } catch (e) { console.warn("handleServerGameState error", e); }
      } else {
        // fallback: log state for debugging
        console.debug("game state:", data);
      }
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