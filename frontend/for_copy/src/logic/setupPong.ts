// setupPong.ts — overlay-based menu with animated "Searching for opponent..." state
import { setPong } from "./pong";
import { initClientPong } from "./pong_client";
import { GameState } from "./pong_types";

/* ---------------- Overlay helpers (same style as yours) ---------------- */

function showOverlay(
	btn_type: number,
	buttons: { text: string; onClick: () => void }[],
	message?: string
) {
	const overlay = document.getElementById("game-overlay") as HTMLDivElement | null;
	const msg = document.getElementById("game-message") as HTMLParagraphElement | null;
	const btns = document.getElementById("overlay-buttons") as HTMLDivElement | null;
	if (!overlay || !btns) return;

	btns.innerHTML = "";
	if (msg) msg.textContent = message ?? "";

	if (btn_type === 1) {
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
	}

	if (btn_type === 2) {
		buttons.forEach((b) => {
			const btn = document.createElement("button");
			btn.textContent = b.text;
			btn.className =
				"w-35 px-8 py-2 text-white font-lucky text-lg rounded-lg shadow-lg transition-transform " +
				"transform bg-[#00091D] border-2 border-white hover:scale-105 hover:border-blue-600 " +
				"hover:shadow-blue-500/50 hover:shadow-2xl focus:outline-none hover:text-blue-600";
			btn.onclick = b.onClick;
			btns.appendChild(btn);
		});
	}

	overlay.classList.remove("hidden");
}

function hideOverlay() {
	const overlay = document.getElementById("game-overlay");
	if (overlay) overlay.classList.add("hidden");
}

/* -------------------- Setup Pong Entry -------------------- */

export function setupPong() {
	const overlay = document.getElementById("game-overlay");
	if (!overlay) {
		console.error("setupPong: Missing #game-overlay in HTML");
		return;
	}

	// Show main menu overlay
	showOverlay(
		1,
		[
			{
				text: "🎮 Single Player",
				onClick: () => {
					hideOverlay();
					startSinglePlayer();
				},
			},
			{
				text: "🌐 Multiplayer",
				onClick: () => {
					hideOverlay();
					startMultiplayer();
				},
			},
		],
		"Select Game Mode"
	);
}

/* -------------------- Mode Handlers -------------------- */

function startSinglePlayer() {
	console.log("Starting single player...");
	(window as any).gameState = GameState.START; // to match legacy setPong
	setPong();
}

/* -------------------- Multiplayer -------------------- */

let matchmakingTimeout: number;

function startMultiplayer() {
  console.log("Starting multiplayer...");

  // Show searching overlay if function exists
  if (typeof showSearchingOverlay === "function") {
    try { showSearchingOverlay(); } catch (e) { console.warn("showSearchingOverlay failed", e); }
  }

  // Set a timeout for matchmaking
  matchmakingTimeout = window.setTimeout(() => {
    console.warn("Matchmaking timeout - no opponent found");
    if (typeof stopSearchingOverlay === "function") {
      stopSearchingOverlay();
    }
    showOverlay(
      2,
      [
        { text: "Retry", onClick: () => { hideOverlay(); startMultiplayer(); } },
        { text: "Back", onClick: () => { hideOverlay(); setupPong(); } }
      ],
      "⏰ No opponents found. Try again later."
    );
  }, 30000); // 30 second timeout

  // Check if WebSocket functions are available
  if (typeof (window as any).initWebSocket === 'function' && typeof (window as any).sendMessage === 'function') {
    console.log("🔌 Using existing WebSocket system...");
    
    // Try to use existing WebSocket connection
    try {
      (window as any).initWebSocket(handleWebSocketMessage);
      
      // Send joinQueue message using the existing sendMessage function
      setTimeout(() => {
        if (typeof (window as any).sendMessage === 'function') {
          (window as any).sendMessage({ type: "joinQueue" });
          console.debug("✅ Sent joinQueue request via existing WS");
        } else {
          console.error("❌ sendMessage function not available");
          handleMultiplayerError("WebSocket not properly initialized");
        }
      }, 1000);
      
    } catch (e) {
      console.error("❌ Failed to initialize WebSocket:", e);
      handleMultiplayerError("Failed to connect to server");
    }
  } else {
    console.error("❌ WebSocket system not available - creating direct connection");
    createDirectWebSocketConnection();
  }
}

function createDirectWebSocketConnection() {
  console.log("🔄 Creating direct WebSocket connection for multiplayer...");

  const wsUrl =
    import.meta.env.VITE_WS_URL ||
    (window.location.protocol === "https:"
      ? `wss://${window.location.host}/ws`
      : `ws://${window.location.host}/ws`);

  let socket: WebSocket | null = null;
  try {
    socket = new WebSocket(wsUrl);

    socket.addEventListener("open", () => {
      console.log("✅ Connected to Pong WebSocket:", wsUrl);

      // Initialize client pong handler if available
      if (typeof initClientPong === "function") {
        try { 
          initClientPong(socket as WebSocket); 
          console.log("✅ Client Pong handler initialized");
        } catch (e) { 
          console.warn("⚠️ initClientPong failed", e); 
        }
      } else {
        // attach a minimal logger so we still see server messages
        socket!.addEventListener("message", (ev) => {
          try { 
            const data = JSON.parse(ev.data.toString());
            console.debug("📥 pong socket msg:", data);
            handleWebSocketMessage(data);
          } catch { 
            console.debug("📥 pong socket raw msg:", ev.data); 
          }
        });
      }

      // tell server we want to join matchmaking queue
      try {
        socket!.send(JSON.stringify({ type: "joinQueue" }));
        console.debug("✅ Sent joinQueue request via direct WS");
      } catch (err) {
        console.warn("❌ Failed to send joinQueue:", err);
      }
    });

    socket.addEventListener("error", (err) => {
      console.error("❌ Pong WebSocket error:", err);
      handleMultiplayerError("Failed to connect to game server");
    });

    socket.addEventListener("close", (ev) => {
      console.warn("❌ Pong WebSocket closed", ev.code, ev.reason);
      if (typeof stopSearchingOverlay === "function") {
        try { stopSearchingOverlay(); } catch (_) {}
      }
    });

  } catch (e) {
    console.error("❌ WebSocket connection creation failed:", e);
    handleMultiplayerError("Failed to create WebSocket connection");
  }
}

function handleWebSocketMessage(msg: any) {
  console.log("📥 Multiplayer WS message:", msg);
  
  // Handle match found messages
  if (msg.type === "matchFound" || msg.type === "match" || msg.type === "role") {
    console.log("🎉 Match found!");
    if (typeof stopSearchingOverlay === "function") {
      stopSearchingOverlay();
    }
  }
  
  // Handle queue status updates
  if (msg.type === "queueStatus") {
    console.log("📊 Queue status:", msg);
    // Update the searching overlay with queue position
    const msgElement = document.getElementById("game-message");
    if (msgElement) {
      const position = msg.position || msg.playersInQueue;
      if (position) {
        msgElement.textContent = `🔍 Searching for opponent... (Position: ${position})`;
      }
    }
  }
  
  // Handle connection errors
  if (msg.type === "error") {
    console.error("❌ Multiplayer error:", msg);
    handleMultiplayerError(msg.message || "Connection error");
  }
}

function handleMultiplayerError(errorMessage?: string) {
  if (typeof stopSearchingOverlay === "function") {
    stopSearchingOverlay();
  }
  
  if (typeof showOverlay === "function") {
    showOverlay(
      2,
      [
        { text: "Retry", onClick: () => { hideOverlay(); startMultiplayer(); } },
        { text: "Back", onClick: () => { hideOverlay(); setupPong(); } }
      ],
      errorMessage || "⚠️ Failed to connect to multiplayer"
    );
  }
}

/* -------------------- Animated "Searching" Overlay -------------------- */

function showSearchingOverlay() {
	const overlay = document.getElementById("game-overlay") as HTMLDivElement | null;
	const msg = document.getElementById("game-message") as HTMLParagraphElement | null;
	const btns = document.getElementById("overlay-buttons") as HTMLDivElement | null;
	if (!overlay || !msg || !btns) return;

	btns.innerHTML = "";
	msg.textContent = "🔍 Searching for opponent";

	// Add animated dots (...)
	const dots = document.createElement("span");
	dots.style.display = "inline-block";
	dots.style.width = "24px";
	msg.appendChild(dots);

	let dotCount = 0;
	const dotInterval = setInterval(() => {
		dotCount = (dotCount + 1) % 4;
		dots.textContent = ".".repeat(dotCount);
	}, 500);

	overlay.classList.remove("hidden");

	// Store interval ID so it can be cleared when match found or overlay hidden
	(overlay as any)._dotInterval = dotInterval;
}

export function stopSearchingOverlay() {
	const overlay = document.getElementById("game-overlay") as HTMLDivElement | null;
	if (!overlay) return;
	
	// Clear the matchmaking timeout
	if (matchmakingTimeout) {
		clearTimeout(matchmakingTimeout);
	}
	
	const intervalId = (overlay as any)._dotInterval;
	if (intervalId) clearInterval(intervalId);
	console.log("🛑 Searching overlay stopped");
}