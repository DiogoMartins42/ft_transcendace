import { GameState, StateMessage, InputMessage } from "./pong_types";
import { gameSettings } from "./gameSettings";

// -------------------- Helpers --------------------
function getCanvasAndContext()
{
	const canvas = document.getElementById("pong") as HTMLCanvasElement | null;
	if (!canvas) {
		console.error("Canvas element not found!");
		return { canvas: null, context: null };
	}
	const context = canvas.getContext("2d");
	if (!context) {
		console.error("Failed to get 2D context!");
		return { canvas: null, context: null };
	}
	return { canvas, context };
}

function render
(
	canvas: HTMLCanvasElement,
	context: CanvasRenderingContext2D,
	player1: any,
	player2: any,
	ball: any,
	net: any
) {
	// Clear canvas
	context.fillStyle = gameSettings.bgColor;
	context.fillRect(0, 0, canvas.width, canvas.height);

	// Draw net
	for (let i = 0; i <= canvas.height; i += 15) {
		context.fillStyle = gameSettings.itemsColor;
		context.fillRect(net.x, net.y + i, net.width, net.height);
	}

	// Draw scores
	context.fillStyle = "#FFF";
	context.font = "35px Lucky";
	context.fillText(player1.score.toString(), canvas.width / 4, canvas.height / 5);
	context.fillText(
		player2.score.toString(),
		(3 * canvas.width) / 4,
		canvas.height / 5
	);

	// Draw paddles
	context.fillStyle = gameSettings.itemsColor;
	context.fillRect(player1.x, player1.y, player1.width, player1.height);
	context.fillRect(player2.x, player2.y, player2.width, player2.height);

	// Draw ball
	context.fillStyle = "#05EDFF";
	context.beginPath();
	context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
	context.closePath();
	context.fill();
}

// -------------------- Client Init --------------------
export function initClientPong() {
	const { canvas, context } = getCanvasAndContext();
	if (!canvas || !context) return;

	const pauseBtn = document.getElementById("pause-btn") as HTMLButtonElement | null;
	const settingsBtn = document.getElementById("openSettings") as HTMLButtonElement | null;

	// Keep track of player role
	let playerRole: "left" | "right" | "spectator" = "spectator";

	// WebSocket connection
	const socket = new WebSocket("ws://localhost:3000/ws");

	socket.onopen = () => {
		console.log("Connected to server, waiting for role assignment...");
	};

	socket.onmessage = (event) => {
		const msg = JSON.parse(event.data);

		// Role assignment
		if (msg.type === "role") {
		  playerRole = msg.role;
		  console.log(`✅ You are the ${playerRole.toUpperCase()} player`);
		  if (playerRole === "spectator") {
			showOverlay("Spectator mode", []);
			} else {
				showOverlay("Press SPACE to start!", [
					{
						text: "Start",
						onClick: () =>
							socket.send(JSON.stringify({ type: "control", action: "start" })),
					},
				]);
			}
			return;
		}

		// Game state updates 
		if (msg.type === "state") {
			const state: StateMessage = msg;

    		render(
    			canvas!,
    			context!,
    			state.paddles.left,
    			state.paddles.right,
    			state.ball,
    			{ x: canvas!.width / 2 - 1, y: 0, width: 2, height: 10 }
    		);

			// Game over overlay
			if (state.gameState === GameState.GAME_OVER) {
				showOverlay("Game Over!", [
					{
						text: "Restart",
						onClick: () =>
							socket.send(
								JSON.stringify({ type: "control", action: "restart" })
							),
					},
				]);
			}
		}
	};

	// -------------------- INPUT HANDLING --------------------
	// Only active players can control paddles
	window.addEventListener("keydown", (e) => {
		if (playerRole === "spectator") return;

		let msg: InputMessage | null = null;
		if (playerRole === "left") {
			if (e.code === "KeyW") msg = { type: "input", player: "left", direction: "up" };
			else if (e.code === "KeyS") msg = { type: "input", player: "left", direction: "down" };
		} else if (playerRole === "right") {
			if (e.code === "ArrowUp") msg = { type: "input", player: "right", direction: "up" };
			else if (e.code === "ArrowDown") msg = { type: "input", player: "right", direction: "down" };
		}

		if (msg) socket.send(JSON.stringify(msg));

    	// Start/resume with SPACE
    	if (e.code === "Space") {
    		socket.send(JSON.stringify({ type: "control", action: "resume" }));
    		hideOverlay();
    	}
	});

	// Key release → stop paddle
	window.addEventListener("keyup", (e) => {
		if (playerRole === "spectator") return;

		let msg: InputMessage | null = null;
		if (playerRole === "left" && ["KeyW", "KeyS"].includes(e.code)) {
			msg = { type: "input", player: "left", direction: "stop" };
		} else if (playerRole === "right" && ["ArrowUp", "ArrowDown"].includes(e.code)) {
			msg = { type: "input", player: "right", direction: "stop" };
		}

		if (msg) socket.send(JSON.stringify(msg));
	});

	// Pause button
	if (pauseBtn) {
		pauseBtn.addEventListener("click", () => {
			socket.send(JSON.stringify({ type: "control", action: "pause" }));
			showOverlay("Paused", [
				{
					text: "Resume",
					onClick: () =>
						socket.send(JSON.stringify({ type: "control", action: "resume" })),
				},
				{
					text: "Restart",
					onClick: () =>
						socket.send(JSON.stringify({ type: "control", action: "restart" })),
				},
			]);
		});
	}

	// Settings button → just pauses for now
	if (settingsBtn) {
		settingsBtn.addEventListener("click", () => {
			socket.send(JSON.stringify({ type: "control", action: "pause" }));
			showOverlay("Settings paused", [
				{
					text: "Resume",
					onClick: () =>
						socket.send(JSON.stringify({ type: "control", action: "resume" })),
				},
			]);
		});
	}
}

// -------------------- UI Overlays --------------------
function showOverlay
(
	message: string,
	buttons: { text: string; onClick: () => void }[]
) {
	const overlay = document.getElementById("overlay");
	if (!overlay) return;

	overlay.innerHTML = `<p style="font-size:24px;margin-bottom:12px;">${message}</p>`;
	buttons.forEach((btn) => {
		const buttonEl = document.createElement("button");
		buttonEl.innerText = btn.text;
		buttonEl.onclick = btn.onClick;
		buttonEl.className =
			"px-4 py-2 m-2 rounded bg-yellow-400 hover:bg-yellow-300 transition";
		overlay.appendChild(buttonEl);
	});

	overlay.style.display = "flex";
}

function hideOverlay() 
{
	const overlay = document.getElementById("overlay");
	if (overlay) overlay.style.display = "none";
}

