import Fastify from "fastify";
import websocket from "@fastify/websocket";
import { Matchmaking } from "./matchmaking.js";
import { gameSettings } from "./gameSettings.js";

const fastify = Fastify();
fastify.register(websocket);

// Create matchmaking instance
const matchmaking = new Matchmaking();

// WebSocket route
fastify.get("/ws", { websocket: true }, (connection, req) => {
  const url = new URL(req.url || "", `http://${req.headers.host}`);
  const username = url.searchParams.get("username") || undefined;

  console.log(`🔗 New connection from ${username || 'anonymous'}`);

  // Add player to matchmaking system
  const player = matchmaking.addPlayer(connection, username);

  connection.socket.send(
    JSON.stringify({
      type: "connected",
      id: player.id,
      username: player.username,
    })
  );

  connection.socket.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw.toString());
      console.log(`📨 Message from ${player.username}:`, msg.type);

      switch (msg.type) {
        case "findMatch":
          matchmaking.findMatch(player);
          break;

        case "control":
          handleGameControl(player, msg);
          break;

        case "input":
          handlePlayerInput(player, msg);
          break;

        case "rejoin":
          // Rejoin logic is handled in matchmaking.rejoinPlayer
          break;

        case "invite":
          if (msg.to) {
            const success = matchmaking.createInvite(player.id, msg.to);
            if (!success) {
              connection.socket.send(JSON.stringify({
                type: "error",
                message: "Player not found or unavailable"
              }));
            }
          }
          break;

        case "acceptInvite":
          if (msg.from) {
            const success = matchmaking.acceptInvite(player.id, msg.from);
            if (!success) {
              connection.socket.send(JSON.stringify({
                type: "error", 
                message: "Could not accept invite"
              }));
            }
          }
          break;

        default:
          console.warn("Unknown message type:", msg.type);
      }
    } catch (e) {
      console.error("Invalid message:", e, raw.toString());
    }
  });

  connection.socket.on("close", () => {
    console.log(`🔌 ${player.username} disconnected`);
    matchmaking.removePlayer(player.id);
  });

  connection.socket.on("error", (err) => {
    console.error(`❌ WebSocket error for ${player.username}:`, err);
  });
});

function handleGameControl(player, msg) {
  const match = matchmaking.matches.get(player.gameId);
  if (!match) {
    console.log(`❌ No match found for player ${player.username}, ignoring control`);
    return;
  }

  const game = match.game;
  console.log(`🎮 Control from ${player.username}: ${msg.action}, current state: ${game.gameState}`);

  switch (msg.action) {
    case "start":
      // Only allow starting from "start" state
      if (game.gameState === "start") {
        game.gameState = "playing";
        game.launchBall();
        console.log(`🚀 Game STARTED for match ${player.gameId} by ${player.username}`);
        broadcastGameState(match);
        
        // Notify both players that game started
        [match.player1, match.player2].forEach(p => {
          if (p?.socket?.readyState === 1) {
            p.socket.send(JSON.stringify({
              type: "gameStarted",
              message: "Game is now playing!",
              startedBy: player.username
            }));
          }
        });
      } else {
        console.log(`⚠️ Cannot start game: current state is ${game.gameState}`);
      }
      break;

    case "pause":
      if (game.gameState === "playing") {
        game.gameState = "paused";
        console.log(`⏸️ Game PAUSED for match ${player.gameId}`);
        broadcastGameState(match);
      }
      break;

    case "resume":
      if (game.gameState === "paused") {
        game.gameState = "playing";
        console.log(`▶️ Game RESUMED for match ${player.gameId}`);
        broadcastGameState(match);
      }
      break;

    case "restart":
      game.restart(game.canvasWidth, game.canvasHeight);
      console.log(`🔄 Game RESTARTED for match ${player.gameId}`);
      broadcastGameState(match);
      break;
  }
}

function handlePlayerInput(player, msg) {
  const match = matchmaking.matches.get(player.gameId);
  if (!match) return;

  // Store input for game update loop
  if (!match.inputs) match.inputs = {};
  
  const isPlayer1 = match.player1.id === player.id;
  const playerKey = isPlayer1 ? "player1" : "player2";
  
  match.inputs[playerKey] = msg.direction; // "up", "down", or "stop"
}

function broadcastGameState(match) {
  const state = {
    type: "state",
    gameState: match.game.gameState,
    ball: match.game.ball,
    paddles: {
      left: match.game.player1,
      right: match.game.player2
    },
    score: {
      left: match.game.player1.score,
      right: match.game.player2.score
    }
  };

  const payload = JSON.stringify(state);

  [match.player1, match.player2].forEach(player => {
    if (player?.socket?.readyState === 1) {
      try {
        player.socket.send(payload);
      } catch (err) {
        console.error("Failed to send to player:", player.username, err);
      }
    }
  });
}

// Game update loop
setInterval(() => {
  for (const [matchId, match] of matchmaking.matches.entries()) {
    const game = match.game;
    
    // Only update if game is playing
    if (game.gameState !== "playing") {
      continue;
    }

    // Apply player inputs
    if (match.inputs) {
      // Player 1 (left paddle)
      if (match.inputs.player1 === "up") {
        game.player1.y -= gameSettings.paddleSpeed;
      } else if (match.inputs.player1 === "down") {
        game.player1.y += gameSettings.paddleSpeed;
      }

      // Player 2 (right paddle)  
      if (match.inputs.player2 === "up") {
        game.player2.y -= gameSettings.paddleSpeed;
      } else if (match.inputs.player2 === "down") {
        game.player2.y += gameSettings.paddleSpeed;
      }

      // Keep paddles in bounds
      game.player1.y = Math.max(0, Math.min(game.canvasHeight - game.player1.height, game.player1.y));
      game.player2.y = Math.max(0, Math.min(game.canvasHeight - game.player2.height, game.player2.y));
    }

    // Update game state
    game.update(game.canvasWidth, game.canvasHeight);

    // Broadcast updated state
    broadcastGameState(match);

    // Check for game over
    if (game.gameState === "game_over") {
      const winner = game.player1.score >= gameSettings.scoreLimit ? match.player1.username : match.player2.username;
      
      [match.player1, match.player2].forEach(player => {
        if (player?.socket?.readyState === 1) {
          player.socket.send(JSON.stringify({
            type: "gameOver",
            winner: winner,
            score: {
              left: game.player1.score,
              right: game.player2.score
            }
          }));
        }
      });

      // End match after game over
      setTimeout(() => {
        matchmaking.endMatch(matchId);
      }, 5000);
    }
  }
}, 1000 / 60); // 60 FPS

fastify
  .listen({ port: 3000, host: "0.0.0.0" })
  .then((address) => console.log(`🚀 Server listening at ${address}`))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });