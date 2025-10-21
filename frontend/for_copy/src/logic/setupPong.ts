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
				text: "🌐 Online Multiplayer",
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

function startMultiplayer() {
	console.log("Starting multiplayer...");

	// Show searching overlay with animated dots
	showSearchingOverlay();

	const wsUrl =
		import.meta.env.VITE_WS_URL ||
		(window.location.protocol === "https:"
			? "wss://localhost:3000/ws"
			: "ws://localhost:3000/ws");

	try {
		const socket = new WebSocket(wsUrl);

		socket.addEventListener("open", () => {
			console.log("Connected to Pong WebSocket:", wsUrl);
			initClientPong(socket);
		});

		socket.addEventListener("error", () => {
			showOverlay(
				2,
				[
					{
						text: "Retry",
						onClick: () => {
							hideOverlay();
							startMultiplayer();
						},
					},
					{
						text: "Back",
						onClick: () => {
							hideOverlay();
							setupPong();
						},
					},
				],
				"⚠️ Failed to connect to server"
			);
		});
	} catch (e) {
		console.error("WebSocket error:", e);
		showOverlay(
			2,
			[
				{
					text: "Retry",
					onClick: () => {
						hideOverlay();
						startMultiplayer();
					},
				},
				{
					text: "Back",
					onClick: () => {
						hideOverlay();
						setupPong();
					},
				},
			],
			"⚠️ Connection failed"
		);
	}
}

/* -------------------- Animated “Searching” Overlay -------------------- */

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
	const intervalId = (overlay as any)._dotInterval;
	if (intervalId) clearInterval(intervalId);
	console.log("🛑 Searching overlay stopped");
}



