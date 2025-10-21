// Multiplayer Pong client logic

import { InputMessage, StateMessage, GameState, GameStateType } from "./pong_types";
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

export function initClientPong(
  socket: WebSocket,
  initialRole?: "left" | "right" | "spectator",
  opponentName?: string
): void {
  const { canvas, context } = getCanvasAndContext();
  if (!canvas || !context) {
    console.error("initClientPong: missing canvas/context");
    return;
  }

  let playerRole: "left" | "right" | "spectator" = initialRole ?? "spectator";
  let currentGameState: GameStateType = GameState.START; // ✅ fixed typing

  // initial overlay
  if (playerRole !== "spectator") {
    showOverlay(`Matched vs ${opponentName ?? "player"}`, [
      {
        text: "Start",
        onClick: () => {
          socket.send(JSON.stringify({ type: "control", action: "start" }));
          hideOverlay();
        },
      },
    ]);
  } else {
    showOverlay("Searching for opponent...", []);
  }

  /* ----------------------- Socket listeners ----------------------- */

  socket.addEventListener("message", (ev) => {
    let msg: any;
    try {
      msg = JSON.parse(ev.data);
    } catch {
      console.warn("Invalid message:", ev.data);
      return;
    }

    switch (msg.type) {
      	case "role":
        	playerRole = msg.role;
			stopSearchingOverlay();
        	if (playerRole !== "spectator") {
         		showOverlay(`You are ${playerRole.toUpperCase()}`, [
          		{
          	    	text: "Start",
              		onClick: () => {
                		socket.send(JSON.stringify({ type: "control", action: "start" }));
                		hideOverlay();
              		},
            	},
          	]);
        	} else {
          		showOverlay("Spectator mode", []);
        	}
        	break;
    	case "waiting":
        	showOverlay(msg.message ?? "Waiting for opponent...", []);
        	break;
    	case "matchFound":
        	playerRole = msg.role;
			stopSearchingOverlay();
        	hideOverlay();
        	break;
		case "state": {
			const state = msg;
			const net = { x: canvas.width / 2 - 1, y: 0, width: 2, height: 10 };
			render(canvas, context, state.paddles.left, state.paddles.right, state.ball, net);

			currentGameState = state.gameState;			
			if (state.gameState === GameState.GAME_OVER) {
				showOverlay("🏁 Game Over", [
			    	{
			    		text: "🔁 Rematch",
			    		onClick: () => {
			    			socket.send(JSON.stringify({ type: "rematchRequest" }));
			    			showOverlay("⌛ Waiting for opponent to accept rematch...", []);
			    		},
			    	},
			    	{
			    		text: "🎯 New Opponent",
			    		onClick: () => {
			    			socket.send(JSON.stringify({ type: "findMatch" }));
			    			showOverlay("🔍 Searching for opponent...", []);
			    		},
			    	},
			    	{
			    		text: "🏠 Menu",
			    		onClick: () => {
			    			hideOverlay();
			    			setupPong();
			    		},
			    	},
			  	]);
			}
			break;
}


      case "invite":
        showOverlay(`${msg.from} invited you to play`, [
          {
            text: "Accept",
            onClick: () => {
              socket.send(JSON.stringify({ type: "acceptInvite", from: msg.from }));
              hideOverlay();
            },
          },
          { text: "Decline", onClick: () => hideOverlay() },
        ]);
        break;

      case "matchEnded":
      case "opponentDisconnected":
        showOverlay("Match ended", [
          {
            text: "Back",
            onClick: () => window.location.reload(),
          },
        ]);
        break;
    }
  });

  socket.addEventListener("close", () => {
    showOverlay("Disconnected from server", [
      { text: "Reload", onClick: () => window.location.reload() },
    ]);
  });

  socket.addEventListener("error", () => {
    showOverlay("WebSocket error", [
      { text: "Reload", onClick: () => window.location.reload() },
    ]);
  });

  /* ------------------------ Input handling ------------------------ */

  function sendInput(player: "left" | "right", direction: "up" | "down" | "stop") {
    const msg: InputMessage = { type: "input", player, direction };
    socket.send(JSON.stringify(msg));
  }

  window.addEventListener("keydown", (e) => {
    if (playerRole === "spectator") return;
    if (currentGameState !== GameState.PLAYING) return; // ✅ now valid comparison

    if (["KeyW", "ArrowUp"].includes(e.code)) sendInput(playerRole, "up");
    else if (["KeyS", "ArrowDown"].includes(e.code)) sendInput(playerRole, "down");

    if (e.code === "Space") {
      const action =
        currentGameState === GameState.PLAYING ? "pause" : "resume";
      socket.send(JSON.stringify({ type: "control", action }));
    }
  });

  window.addEventListener("keyup", (e) => {
    if (playerRole === "spectator") return;
    if (["KeyW", "KeyS", "ArrowUp", "ArrowDown"].includes(e.code))
      sendInput(playerRole, "stop");
  });

  const pauseBtn = document.getElementById("pause-btn");
  if (pauseBtn) {
    pauseBtn.addEventListener("click", () => {
      socket.send(JSON.stringify({ type: "control", action: "pause" }));
      showOverlay("Paused", [
        {
          text: "Resume",
          onClick: () => {
            socket.send(JSON.stringify({ type: "control", action: "resume" }));
            hideOverlay();
          },
        },
      ]);
    });
  }

  console.log("✅ initClientPong initialized. Role:", playerRole);
}


