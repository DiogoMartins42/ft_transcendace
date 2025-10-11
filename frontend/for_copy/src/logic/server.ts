import Fastify, { FastifyInstance, FastifyRequest } from "fastify";
import websocket, { SocketStream } from "@fastify/websocket";
import { GameEngine } from "./gameEngine";
import { InputMessage, ControlMessage, StateMessage, GameState } from "./pong_types";
import { gameSettings } from "./gameSettings";

// -------------------- Server Setup --------------------
const fastify: FastifyInstance = Fastify();
fastify.register(websocket);

// Canvas size
const canvasWidth = 800;
const canvasHeight = 600;

// Game engine
const game = new GameEngine(canvasWidth, canvasHeight);

// Player management
let leftPlayer: SocketStream | null = null;
let rightPlayer: SocketStream | null = null;
const spectators: Set<SocketStream> = new Set();

// Paddle velocities
const paddleVelocities = {
	left: 0,
	right: 0,
};

// -------------------- Role Assignment --------------------
function assignRole(connection: SocketStream): "left" | "right" | "spectator"
{
	if (!leftPlayer) {
		leftPlayer = connection;
		console.log("Assigned LEFT player");
		return "left";
	} else if (!rightPlayer) {
		rightPlayer = connection;
		console.log("Assigned RIGHT player");
		return "right";
	} else {
		spectators.add(connection);
		console.log("Assigned SPECTATOR");
		return "spectator";
	}
}

// -------------------- WebSocket Route --------------------
fastify.get(
	"/ws",
	{ websocket: true },
	(connection: SocketStream, _req: FastifyRequest) => {
		const role = assignRole(connection);

		// Send role assignment to the client
		connection.socket.send(JSON.stringify({ type: "role", role }));

		connection.socket.on("message", (raw: Buffer) => {
			try {
				const msg = JSON.parse(raw.toString());

			// -------------------- INPUT --------------------
			if (msg.type === "input") {
				const input = msg as InputMessage;

				if (input.player === "left" && connection === leftPlayer) {
					if (input.direction === "up")
						paddleVelocities.left = -gameSettings.paddleSpeed;
					else if (input.direction === "down")
						paddleVelocities.left = gameSettings.paddleSpeed;
					else if (input.direction === "stop") paddleVelocities.left = 0;
				} else if (input.player === "right" && connection === rightPlayer) {
					if (input.direction === "up")
						paddleVelocities.right = -gameSettings.paddleSpeed;
					else if (input.direction === "down")
						paddleVelocities.right = gameSettings.paddleSpeed;
					else if (input.direction === "stop") paddleVelocities.right = 0;
				}
			}

			// -------------------- CONTROL --------------------
			else if (msg.type === "control") {
				const control = msg as ControlMessage;

				switch (control.action) {
					case "start":
						game.gameState = GameState.PLAYING;
						game.launchBall();
						break;
					case "pause":
						game.gameState = GameState.PAUSED;
						break;
					case "resume":
						game.gameState = GameState.PLAYING;
						break;
					case "restart":
						game.restart(canvasWidth, canvasHeight);
						break;
				}
			}
			} catch (e) {
				console.error("Invalid message:", e);
			}
		});

		// -------------------- Disconnection Handling --------------------
		connection.socket.on("close", () => {
			console.log("Client disconnected");

			if (connection === leftPlayer) {
				leftPlayer = null;
				paddleVelocities.left = 0;
				console.log("Left player disconnected. Game paused.");
			}
			if (connection === rightPlayer) {
				rightPlayer = null;
				paddleVelocities.right = 0;
				console.log("Right player disconnected. Game paused.");
			}

			spectators.delete(connection);

			if (!leftPlayer || !rightPlayer) {
				game.gameState = GameState.PAUSED;
			}
		});
	}
);

// -------------------- Broadcast --------------------
function broadcastState(): void 
{
	const state: StateMessage = {
		type: "state",
		gameState: game.gameState,
		ball: game.ball,
		paddles: { left: game.player1, right: game.player2 },
		score: { left: game.player1.score, right: game.player2.score },
	};

	const payload = JSON.stringify(state);

	if (leftPlayer) leftPlayer.socket.send(payload);
	if (rightPlayer) rightPlayer.socket.send(payload);

	for (const spectator of spectators) {
		try {
			spectator.socket.send(payload);
		} catch {
			spectators.delete(spectator);
		}
	}
}

// -------------------- Main Game Loop --------------------
setInterval(() => {
	// Apply paddle velocities
	game.player1.y += paddleVelocities.left;
	game.player2.y += paddleVelocities.right;

	// Clamp to canvas
	game.player1.y = Math.max(
		0,
		Math.min(canvasHeight - game.player1.height, game.player1.y)
	);
	game.player2.y = Math.max(
		0,
		Math.min(canvasHeight - game.player2.height, game.player2.y)
	);

	// Update physics
	game.update(canvasWidth, canvasHeight);

	// Broadcast state
	broadcastState();
}, 1000 / 30); // 30 FPS

// -------------------- Start Server --------------------
fastify.listen({ port: 3000 }, (err?: Error, address?: string) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`🚀 Server listening at ${address}`);
});
