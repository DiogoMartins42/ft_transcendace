// Multiplayer Pong client logic (FIXED with proper rendering)

import { gameSettings, visualSettings } from "./gameSettings";

/* -------------------------- Global State -------------------------- */
let animationFrameId: number | null = null;
let lastGameState: any = null;

/* -------------------------- Canvas & Rendering -------------------------- */

export function getCanvasAndContext(): {
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null;
} {
  let canvas = document.getElementById("pong") as HTMLCanvasElement | null;
  if (!canvas) {
    // Try to create a minimal game container + canvas so rendering can proceed for debugging.
    try {
      console.warn("#pong canvas not found — creating temporary canvas for debug");
      const app = document.getElementById("app") || document.body;
      const container = document.createElement("div");
      container.id = "pong-container";
      container.style.position = "relative";
      container.style.width = "100%";
      container.style.height = "480px";
      container.style.zIndex = "9999";
      container.style.display = "flex";
      container.style.justifyContent = "center";
      container.style.alignItems = "center";

      canvas = document.createElement("canvas");
      canvas.id = "pong";
      canvas.width = Math.min(960, window.innerWidth - 40);
      canvas.height = 480;
      canvas.style.width = `${canvas.width}px`;
      canvas.style.height = `${canvas.height}px`;
      canvas.style.background = "#000";
      canvas.style.border = "1px solid #444";

      container.appendChild(canvas);
      (app as HTMLElement).appendChild(container);
      console.info("Temporary #pong canvas appended to DOM for debug");
    } catch (err) {
      console.error("Failed to create debug canvas:", err);
      return { canvas: null, context: null };
    }
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
  // Clear canvas
  context.fillStyle = visualSettings.bgColor;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw net
  context.fillStyle = visualSettings.itemsColor;
  const circleRadius = 30;
  context.beginPath();
  context.arc(net.x, 0, circleRadius, 0, Math.PI * 2);
  context.fill();
  
  for (let i = 0; i <= canvas.height; i += 15) {
    context.fillRect(net.x - 1, i, net.width, net.height);
  }

  // Draw scores
  context.fillStyle = visualSettings.itemsColor;
  context.font = "45px fantasy";
  context.textAlign = "center";
  context.fillText(String(player1?.score ?? 0), canvas.width / 4, canvas.height / 5);
  context.fillText(String(player2?.score ?? 0), (3 * canvas.width) / 4, canvas.height / 5);

  // Draw paddles
  context.fillStyle = visualSettings.itemsColor;
  context.fillRect(player1.x, player1.y, player1.width, player1.height);
  context.fillRect(player2.x, player2.y, player2.width, player2.height);

  // Draw ball
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  context.closePath();
  context.fillStyle = visualSettings.itemsColor;
  context.fill();

  // ONLY draw overlays for specific states - FIXED!
  // const currentGameState = (window as any).currentGameState;
  
  // if (currentGameState === "start") {
  //   // drawStartScreen(context, canvas);
  // } else if (currentGameState === "paused") {
  //   drawPausedScreen(context, canvas);
  // } else if (currentGameState === "game_over") {
  //   drawGameOverScreen(context, canvas);
  // }
  // NO overlay for "playing" state - this lets the actual game show through!
}

// function drawStartScreen(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
//   context.fillStyle = "rgba(0, 0, 0, 0.7)";
//   context.fillRect(0, 0, canvas.width, canvas.height);
//   context.fillStyle = "#fff";
//   context.font = "36px sans-serif";
//   context.textAlign = "center";
//   context.fillText("READY TO PLAY", canvas.width / 2, canvas.height / 2 - 50);
//   context.font = "24px sans-serif";
//   context.fillText("Waiting to start...", canvas.width / 2, canvas.height / 2);
//   const playerRole = (window as any).playerRole;
//   context.fillText(
//     playerRole === "left" ? "You are LEFT player (W/S keys)" : "You are RIGHT player (↑/↓ keys)",
//     canvas.width / 2,
//     canvas.height / 2 + 50
//   );
// }

// function drawPausedScreen(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
//   context.fillStyle = "rgba(0, 0, 0, 0.7)";
//   context.fillRect(0, 0, canvas.width, canvas.height);
//   context.fillStyle = "#fff";
//   context.font = "36px sans-serif";
//   context.textAlign = "center";
//   context.fillText("GAME PAUSED", canvas.width / 2, canvas.height / 2);
// }

// function drawGameOverScreen(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
//   context.fillStyle = "rgba(0, 0, 0, 0.8)";
//   context.fillRect(0, 0, canvas.width, canvas.height);
//   context.fillStyle = "#fff";
//   context.font = "48px sans-serif";
//   context.textAlign = "center";
//   const winner = (window as any).lastWinner;
//   context.fillText(winner ? `${winner} WINS!` : "GAME OVER", canvas.width / 2, canvas.height / 2 - 50);
//   context.font = "24px sans-serif";
//   // context.fillText("Press RESTART to play again", canvas.width / 2, canvas.height / 2 + 50);
// }

/* -------------------------- Rendering Loop -------------------------- */

function startRenderLoop() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
  }

  function gameLoop() {
    const { canvas, context } = getCanvasAndContext();
    if (!canvas || !context) {
      console.warn("Canvas not available, stopping render loop");
      return;
    }

    // Use last received game state
    if (lastGameState) {
      render(
        canvas,
        context,
        lastGameState.paddles?.left ?? { x: 30, y: canvas.height / 2 - 50, width: 10, height: 100, score: 0 },
        lastGameState.paddles?.right ?? { x: canvas.width - 40, y: canvas.height / 2 - 50, width: 10, height: 100, score: 0 },
        lastGameState.ball ?? { x: canvas.width / 2, y: canvas.height / 2, radius: 10 },
        { x: canvas.width / 2 - 1, y: 0, width: 2, height: 10 }
      );
    }

    animationFrameId = requestAnimationFrame(gameLoop);
  }

  animationFrameId = requestAnimationFrame(gameLoop);
  console.log("✅ Render loop started");
}

function stopRenderLoop() {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
    console.log("🛑 Render loop stopped");
  }
}

/* ---------------------------- Overlay helpers --------------------------- */

function showOverlay(message: string, buttons: { text: string; onClick: () => void }[] = []) {
  const overlay = document.getElementById("game-overlay");
  const msg = document.getElementById("game-message");
  const btns = document.getElementById("overlay-buttons");

  if (!overlay || !msg || !btns) {
    console.warn("Overlay elements not found in DOM");
    return;
  }

  msg.textContent = message;
  btns.innerHTML = "";
  buttons.forEach((b) => {
    const el = document.createElement("button");
    el.textContent = b.text;
    el.className = "px-8 py-2 text-white font-lucky text-lg rounded-full shadow-lg transition-transform transform bg-[#00091D] border-2 border-white hover:scale-105 hover:border-green-600 hover:shadow-green-500/50 hover:shadow-2xl focus:outline-none hover:text-green-600";
    el.onclick = b.onClick;
    btns.appendChild(el);
  });

  overlay.classList.remove("hidden");
}

function hideOverlay() {
  const overlay = document.getElementById("game-overlay");
  if (overlay) {
    overlay.classList.add("hidden");
    console.log("✅ HTML overlay hidden");
  }
}

/* -------------------------- Input Setup -------------------------- */

function setupInputListeners() {
  // Remove existing listeners to prevent duplicates
  if ((window as any).pongKeyDownHandler) {
    document.removeEventListener("keydown", (window as any).pongKeyDownHandler);
  }
  if ((window as any).pongKeyUpHandler) {
    document.removeEventListener("keyup", (window as any).pongKeyUpHandler);
  }

  const keyDownHandler = (e: KeyboardEvent) => {
    const playerRole = (window as any).playerRole;
    if (!playerRole) return;

    const isLeft = playerRole === "left";
    const upKey = isLeft ? "ArrowUp" : "w";
    const downKey = isLeft ? "ArrowDown" : "s";

    if (e.key === upKey || e.key === upKey.toUpperCase()) {
      sendGameInput("up");
      e.preventDefault();
    } else if (e.key === downKey || e.key === downKey.toUpperCase()) {
      sendGameInput("down");
      e.preventDefault();
    }
  };

  const keyUpHandler = (e: KeyboardEvent) => {
    const playerRole = (window as any).playerRole;
    if (!playerRole) return;

    const isLeft = playerRole === "left";
    const upKey = isLeft ? "ArrowUp" : "w";
    const downKey = isLeft ? "ArrowDown" : "s";

    if (e.key === upKey || e.key === upKey.toUpperCase() || 
        e.key === downKey || e.key === downKey.toUpperCase()) {
      sendGameInput("stop");
      e.preventDefault();
    }
  };

  (window as any).pongKeyDownHandler = keyDownHandler;
  (window as any).pongKeyUpHandler = keyUpHandler;
  document.addEventListener("keydown", keyDownHandler);
  document.addEventListener("keyup", keyUpHandler);
  
  console.log("✅ Input listeners registered");
}

/* -------------------------- Match Event Handlers -------------------------- */

function handleMatchFound(matchData: any) {
  console.log("🎯 Starting game with match data:", matchData);
  
  if (typeof (window as any).stopSearchingOverlay === "function") {
    try { (window as any).stopSearchingOverlay(); } catch (_) {}
  }
  
  console.debug("handleMatchFound: calling setupPong/init and ensuring canvas exists");
  (window as any).matchId = matchData.matchId;
  (window as any).playerRole = matchData.role;
  (window as any).opponent = matchData.opponent;
  gameSettings.multiplayer = true;
  
  // Ensure UI initialized (call setupPong if present or import)
  (async () => {
    if (typeof (window as any).setupPong === "function") {
      try {
        console.log("🛠️ Calling setupPong()");
        (window as any).setupPong();
      } catch (e) {
        console.error("setupPong() error:", e);
      }
    } else {
      console.warn("setupPong function not found, UI may not be initialized");
    }

    const { canvas, context } = getCanvasAndContext();
    if (!canvas || !context) {
      console.warn("Canvas not available after setupPong(); match will not render");
      return;
    }

    // Apply initial state if provided
    const initialState = matchData.initialState || matchData.state || matchData.startState;
    if (initialState) {
      lastGameState = initialState;
      (window as any).currentGameState = initialState.gameState || "start";
    } else {
      // Set default state
      lastGameState = {
        gameState: "start",
        ball: { x: canvas.width / 2, y: canvas.height / 2, radius: 10 },
        paddles: {
          left: { x: 30, y: canvas.height / 2 - 50, width: 10, height: 100, score: 0 },
          right: { x: canvas.width - 40, y: canvas.height / 2 - 50, width: 10, height: 100, score: 0 }
        }
      };
    }

    // Setup input listeners for this match
    setupInputListeners();

    // Start rendering loop
    startRenderLoop();

    // Show match found overlay
    showOverlay(
      `Match found! Opponent: ${matchData.opponent}\n`,
      [
        {
          text: "Start Game",
          onClick: () => {
            hideOverlay();
            sendGameControl("start");
          }
        }
      ]
    );

    console.log("✅ Game initialized and rendering");
  })();
}

function handleGameState(stateData: any) {
  console.log(`🔄 Game state update: ${stateData.gameState}`, {
    ballMoving: stateData.ball.velocityX !== 0 || stateData.ball.velocityY !== 0,
    ballPos: { x: stateData.ball.x, y: stateData.ball.y }
  });
  
  // Update last game state for rendering loop
  lastGameState = stateData;
  (window as any).currentGameState = stateData.gameState;

  // CRITICAL: Hide overlay when game starts playing
  if (stateData.gameState === "playing") {
    hideOverlay();
    console.log("✅ Game playing - overlay hidden");
  }
}

function handleGameOver(data: any) {
  console.log("🏁 Game over received:", data);
  (window as any).currentGameState = "game_over";
  (window as any).lastWinner = data.winner;
  
  // Update last state with final scores
  if (lastGameState) {
    lastGameState.gameState = "game_over";
    if (data.score) {
      if (lastGameState.paddles) {
        lastGameState.paddles.left.score = data.score.left;
        lastGameState.paddles.right.score = data.score.right;
      }
    }
  }
  
  showOverlay(
    `Game Over! ${data.winner} wins!\nScore: ${data.score?.left} - ${data.score?.right}`,
    [
      // { text: "Play Again", onClick: () => { hideOverlay(); sendGameControl("restart"); } },
      { text: "Main Menu", onClick: () => { 
        hideOverlay(); 
        stopRenderLoop();
        window.location.reload();
      }}
    ]
  );
}

function handleRejoined(data: any) {
  console.log("🔄 Rejoined match:", data);
  (window as any).matchId = data.matchId;
  (window as any).playerRole = data.role;
  (window as any).opponent = data.opponent;
  gameSettings.multiplayer = true;

  setupInputListeners();
  startRenderLoop();
  
  showOverlay(`Rejoined match vs ${data.opponent}`, [{ text: "Continue", onClick: () => hideOverlay() }]);
}

function handleInvite(from: string) {
  showOverlay(`Invite from ${from}`, [
    { text: "Accept", onClick: () => { 
      hideOverlay(); 
      const s = (window as any).pongSocket; 
      if (s && s.readyState === WebSocket.OPEN) {
        s.send(JSON.stringify({ type: "acceptInvite", from })); 
      }
    }},
    { text: "Decline", onClick: () => hideOverlay() }
  ]);
}

function handleOpponentDisconnected() {
  console.warn("💤 Opponent disconnected");
  showOverlay("Opponent disconnected - waiting for reconnection...", [
    { text: "Wait", onClick: () => hideOverlay() },
    { text: "Leave Match", onClick: () => { 
      hideOverlay(); 
      stopRenderLoop();
      window.location.reload();
    }}
  ]);
}

function handleMatchEnded(reason: string) {
  console.log("🏁 Match ended:", reason);
  stopRenderLoop();
  showOverlay(`Match ended: ${reason}`, [
    { text: "Play Again", onClick: () => { 
      hideOverlay(); 
      window.location.reload();
    }},
    { text: "Main Menu", onClick: () => { 
      hideOverlay(); 
      window.location.reload();
    }}
  ]);
}

function handleMatchmakingError(errorMessage: string) {
  console.error("❌ Matchmaking error:", errorMessage);
  if (typeof (window as any).stopSearchingOverlay === "function") {
    (window as any).stopSearchingOverlay();
  }
  stopRenderLoop();
  showOverlay(errorMessage, [
    { text: "Retry", onClick: () => { 
      hideOverlay(); 
      window.location.reload();
    }},
    { text: "Back", onClick: () => { 
      hideOverlay(); 
      window.location.reload();
    }}
  ]);
}

function updateServerStats(stats: any) {
  const statsElement = document.getElementById("server-stats");
  if (statsElement) {
    statsElement.textContent = `Players: ${stats.players} | Waiting: ${stats.waiting} | Matches: ${stats.matches}`;
  }
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
    direction 
  };
  try { 
    socket.send(JSON.stringify(inputMessage)); 
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
  
  console.log(`🎮 Sending control: ${action}, matchId: ${(window as any).matchId}`);
  
  const controlMessage = { type: "control", action };
  try { 
    socket.send(JSON.stringify(controlMessage)); 
  } catch (err) { 
    console.error("Failed to send control:", err); 
  }
}

/* -------------------------- WebSocket Handler Setup -------------------------- */

export function setupMatchmakingHandler(socket: WebSocket) {
  socket.addEventListener("message", (ev) => {
    let data: any = null;
    try {
      if (!ev.data || (typeof ev.data === "string" && ev.data.trim() === "")) {
        console.warn("pong_client: empty payload");
        return;
      }
      data = JSON.parse(ev.data.toString());
    } catch (err) {
      console.debug("pong_client: non-json message:", ev.data);
      return;
    }

    console.debug("📩 pong_client message:", data.type);

    // Handle different message types
    switch (data.type) {
      case "connected":
        (window as any).playerId = data.id;
        (window as any).gameUsername = data.username;
        break;
      case "waiting":
        // Handled by setupPong.ts
        break;
      case "matchFound":
        handleMatchFound(data);
        break;
      case "state":
        handleGameState(data);
        break;
      case "gameOver":
        handleGameOver(data);
        break;
      case "opponentDisconnected":
        handleOpponentDisconnected();
        break;
      case "opponentRejoined":
        showOverlay(`${data.username} reconnected!`, [{ 
          text: "Continue", 
          onClick: () => hideOverlay() 
        }]);
        break;
      case "rejoined":
        handleRejoined(data);
        break;
      case "matchEnded":
        handleMatchEnded(data.reason);
        break;
      case "invite":
        handleInvite(data.from);
        break;
      case "error":
        handleMatchmakingError(data.message || "Server error");
        break;
      case "serverStats":
        updateServerStats(data);
        break;
      default:
        console.debug("Unhandled message type:", data.type);
    }
  });

  socket.addEventListener("close", (ev) => {
    console.warn("🔌 Pong socket closed", ev.code, ev.reason);
    stopRenderLoop();
    
    if (typeof (window as any).stopSearchingOverlay === "function") {
      try { (window as any).stopSearchingOverlay(); } catch (_) {}
    }
    
    if (ev.code !== 1000 && !ev.reason?.includes("User stopped")) {
      showOverlay("Connection lost", [
        { text: "Reconnect", onClick: () => { 
          hideOverlay(); 
          window.location.reload();
        }},
        { text: "Main Menu", onClick: () => { 
          hideOverlay(); 
          window.location.reload();
        }}
      ]);
    }
  });

  socket.addEventListener("error", (err) => {
    console.error("❌ Pong socket error", err);
    stopRenderLoop();
    if (typeof (window as any).stopSearchingOverlay === "function") {
      try { (window as any).stopSearchingOverlay(); } catch (_) {}
    }
  });

  (window as any).pongSocket = socket;
  console.log("✅ WebSocket handlers attached");
}

export function initClientPong(socket: WebSocket, initialMatchData?: any) {
  console.log("✅ initClientPong initialized");
  setupMatchmakingHandler(socket);
  
  // If we received match data before handlers were set up, process it now
  if (initialMatchData && initialMatchData.type === "matchFound") {
    console.log("📦 Processing initial match data in initClientPong");
    handleMatchFound(initialMatchData);
  }
}