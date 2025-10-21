// backend/src/server.ts
import Fastify from "fastify";
import websocket from "@fastify/websocket";
import WebSocket from "ws";
import { GameEngine } from "./gameEngine.js";
import { gameSettings } from "./gameSettings.js";
import { GameState } from "./pong_types.js";

const fastify = Fastify();
fastify.register(websocket);

const players = new Map();
const usernameToId = new Map();
const waitingQueue = [];
const matches = new Map();

const canvasWidth = 800;
const canvasHeight = 600;

function mkId(prefix = "p") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function createMatch(leftId, rightId) {
  const matchId = mkId("m");
  const game = new GameEngine(canvasWidth, canvasHeight);
  const match = {
    id: matchId,
    leftId,
    rightId,
    game,
    paddleVelocities: { left: 0, right: 0 },
  };
  matches.set(matchId, match);

  const left = players.get(leftId);
  const right = players.get(rightId);
  left.matchId = matchId;
  right.matchId = matchId;

  left.conn.socket.send(
    JSON.stringify({
      type: "matchFound",
      role: "left",
      opponent: right.username || right.id,
      matchId,
    })
  );
  right.conn.socket.send(
    JSON.stringify({
      type: "matchFound",
      role: "right",
      opponent: left.username || left.id,
      matchId,
    })
  );

  return match;
}

function tryMatchFromQueue(playerId) {
  while (waitingQueue.length) {
    const otherId = waitingQueue.shift();
    if (otherId === playerId) continue;
    if (!players.has(otherId)) continue;
    return createMatch(otherId, playerId);
  }
  waitingQueue.push(playerId);
  const p = players.get(playerId);
  p.conn.socket.send(
    JSON.stringify({ type: "waiting", message: "Waiting for an opponent..." })
  );
  return null;
}

// WebSocket route
fastify.get("/ws", { websocket: true }, (connection, req) => {
  const url = new URL(req.url || "", `http://${req.headers.host}`);
  const usernameQuery = url.searchParams.get("username") || undefined;

  const playerId = mkId("p");
  const playerInfo = {
    id: playerId,
    username: usernameQuery,
    conn: connection,
    matchId: undefined,
  };
  players.set(playerId, playerInfo);
  if (playerInfo.username) usernameToId.set(playerInfo.username, playerId);

  connection.socket.send(
    JSON.stringify({
      type: "connected",
      id: playerId,
      username: playerInfo.username || null,
    })
  );

  connection.socket.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw.toString());

      if (msg.type === "findMatch") {
        if (playerInfo.matchId) {
          const match = matches.get(playerInfo.matchId);
          if (match) {
            const opponentId =
              match.leftId === playerId ? match.rightId : match.leftId;
            const opponent = players.get(opponentId);
            connection.socket.send(
              JSON.stringify({
                type: "matchFound",
                role: match.leftId === playerId ? "left" : "right",
                opponent: opponent.username || opponent.id,
                matchId: match.id,
              })
            );
            return;
          }
        }
        tryMatchFromQueue(playerId);
        return;
      }

      if (msg.type === "control") {
        const match = matches.get(playerInfo.matchId);
        if (!match) return;

        if (msg.action === "start") {
          match.game.gameState = GameState.PLAYING;
          match.game.launchBall();
        } else if (msg.action === "pause") {
          match.game.gameState = GameState.PAUSED;
        } else if (msg.action === "resume") {
          match.game.gameState = GameState.PLAYING;
        } else if (msg.action === "restart") {
          match.game.restart(canvasWidth, canvasHeight);
          match.paddleVelocities.left = 0;
          match.paddleVelocities.right = 0;
        }
        return;
      }

      if (msg.type === "input") {
        const match = matches.get(playerInfo.matchId);
        if (!match) return;
        const senderRole = match.leftId === playerId ? "left" : "right";
        if (msg.player !== senderRole) return;

        const vel = match.paddleVelocities;
        if (msg.player === "left") {
          if (msg.direction === "up") vel.left = -gameSettings.paddleSpeed;
          else if (msg.direction === "down") vel.left = gameSettings.paddleSpeed;
          else if (msg.direction === "stop") vel.left = 0;
        } else {
          if (msg.direction === "up") vel.right = -gameSettings.paddleSpeed;
          else if (msg.direction === "down") vel.right = gameSettings.paddleSpeed;
          else if (msg.direction === "stop") vel.right = 0;
        }
      }
    } catch (e) {
      console.error("Invalid message:", e);
    }
  });

  connection.socket.on("close", () => {
    if (playerInfo.username) usernameToId.delete(playerInfo.username);
    players.delete(playerId);
    const idx = waitingQueue.indexOf(playerId);
    if (idx >= 0) waitingQueue.splice(idx, 1);

    if (playerInfo.matchId) {
      const matchId = playerInfo.matchId;
      const match = matches.get(matchId);
      if (match) {
        const opponentId =
          match.leftId === playerId ? match.rightId : match.leftId;
        const opponent = players.get(opponentId);
        if (opponent)
          opponent.conn.socket.send(
            JSON.stringify({ type: "opponentDisconnected" })
          );
        matches.delete(matchId);
      }
    }
  });
});

// Main loop for all matches
setInterval(() => {
  for (const [matchId, match] of matches.entries()) {
    const g = match.game;
    g.player1.y += match.paddleVelocities.left;
    g.player2.y += match.paddleVelocities.right;

    g.player1.y = Math.max(0, Math.min(canvasHeight - g.player1.height, g.player1.y));
    g.player2.y = Math.max(0, Math.min(canvasHeight - g.player2.height, g.player2.y));

    g.update(canvasWidth, canvasHeight);

    const state = {
      type: "state",
      gameState: g.gameState,
      ball: g.ball,
      paddles: { left: g.player1, right: g.player2 },
      score: { left: g.player1.score, right: g.player2.score },
    };

    const payload = JSON.stringify(state);

    const leftPlayer = players.get(match.leftId);
    const rightPlayer = players.get(match.rightId);
    if (leftPlayer) try { leftPlayer.conn.socket.send(payload); } catch {}
    if (rightPlayer) try { rightPlayer.conn.socket.send(payload); } catch {}
  }
}, 1000 / 30);

fastify
  .listen({ port: 3000, host: "0.0.0.0" })
  .then((address) => console.log(`🚀 Server listening at ${address}`))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });



