// index.js (final corrected, full version)

import Fastify from "fastify";
import FastifyStatic from "@fastify/static";
import env from "./config/env.js";
import { options as loggerOptions } from "./config/logger.js";
import path from "path";
import fs from "fs";
import fastifyJWT from "@fastify/jwt";
import fastifyWebsocket from "@fastify/websocket";
import fastifyCors from "@fastify/cors";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import crypto from "crypto";

import { Matchmaking } from "./pong/matchmaking.js";
import { gameSettings } from "./pong/gameSettings.js";

const matchmaking = new Matchmaking();

// --- Routes ---
import authRoutes from "./routes/auth.js";
import lobbyRoutes from "./routes/lobby.js";
import blockRoutes from "./routes/block.js";
import oauthRoutes from "./routes/oauth.js";
import uploadsRoutes from "./uploads/uploads.js";
import statsRoutes from "./database/stats.js";
import { initDB } from "./database/init.js"; // optional init helper

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- HTTPS setup (only enable in production if certs exist) ---
let httpsOptions = undefined;
if (process.env.NODE_ENV === "production") {
  try {
    const certDir = "/app/certs";
    const keyPath = path.join(certDir, "key.pem");
    const certPath = path.join(certDir, "cert.pem");
    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      httpsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      };
      console.log("✅ HTTPS certificates loaded successfully");
    } else {
      console.warn("⚠️ HTTPS certs not found. Running in HTTP mode.");
    }
  } catch (err) {
    console.warn("⚠️ HTTPS setup failed:", err);
  }
} else {
  console.log("💻 Development mode: HTTPS disabled (use HTTP / localhost).");
}

// --- Create Fastify instance ---
const fastify = Fastify({
  logger: loggerOptions,
  https: httpsOptions,
  trustProxy: true,
  connectionTimeout: 0,
  keepAliveTimeout: 0,
});

// --- CORS ---
// Accept local dev origins & your DuckDNS production domain
fastify.register(fastifyCors, {
  origin: (origin, cb) => {
    // allow requests with no origin (like curl, server-to-server)
    if (!origin) return cb(null, true);

    const allowed = new Set([
      "https://pongpong.duckdns.org",
      "https://www.pongpong.duckdns.org",
      "http://pongpong.duckdns.org",
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000",
      // Add other dev origins you use
    ]);

    if (allowed.has(origin)) return cb(null, true);
    // allow if origin host matches localhost or 127.0.0.1 (flexible)
    try {
      const u = new URL(origin);
      if (u.hostname === "localhost" || u.hostname === "127.0.0.1") return cb(null, true);
    } catch (e) {
      // ignore parse errors
    }
    cb(new Error("Not allowed by CORS"), false);
  },
  credentials: true,
});

// --- SQLite setup ---
const db = new Database(env.dbFile);

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    google_id TEXT UNIQUE,
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    content TEXT,
    type TEXT DEFAULT 'text',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS blocked_users (
    user_id INTEGER NOT NULL,
    blocked_user_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, blocked_user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (blocked_user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`).run();

db.prepare(`
  INSERT OR IGNORE INTO users (username, email, password)
  VALUES 
    ('bot', 'bot@gmail.com', 'placeholderpass'),
    ('guest_multiplayer', 'guest_multiplayer@gmail.com', 'placeholderpass')
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS match_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_winner INTEGER NOT NULL,
    id_loser INTEGER NOT NULL,
    winner_points INTEGER DEFAULT 0,
    loser_points INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS friends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    friend_id INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(friend_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, friend_id)
  )
`).run();

fastify.decorate("db", db);

// --- JWT setup ---
fastify.register(fastifyJWT, { secret: env.JWT_SECRET });
fastify.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: "Unauthorized", message: err.message });
  }
});

// --- Routes ---
fastify.register(authRoutes, { prefix: "/auth" });
fastify.register(lobbyRoutes, { prefix: "/lobby" });
fastify.register(blockRoutes, { prefix: "/block" });
fastify.register(statsRoutes, { prefix: "/stats" });
fastify.register(oauthRoutes, { prefix: "/oauth" });
fastify.register(uploadsRoutes, { prefix: "/uploads" });

// --- WebSocket setup ---
fastify.register(fastifyWebsocket, {
  options: {
    maxPayload: 1048576,
    verifyClient: (info, next) => {
      fastify.log.info("🔍 WebSocket upgrade attempt:", {
        origin: info.origin,
        secure: info.secure,
        url: info.req.url,
      });
      next(true);
    },
  },
});

const wsClients = new Set();

/* -------------------- Game helper functions -------------------- */

// NOTE: these functions are intentionally similar to the "after" version you provided.
// They use matchmaking data structures (matchmaking.matches, matchmaking.players, etc.)

function mkId(prefix = "p") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

function broadcastGameState(match) {
  const state = {
    type: "state",
    gameState: match.game.gameState,
    ball: match.game.ball,
    paddles: { left: match.game.player1, right: match.game.player2 },
    score: { left: match.game.player1.score, right: match.game.player2.score },
  };

  const payload = JSON.stringify(state);

  [match.player1, match.player2].forEach((player) => {
    if (player?.socket?.readyState === 1) {
      try {
        player.socket.send(payload);
      } catch (err) {
        console.error("Failed to send to player:", player.username, err);
      }
    }
  });
}

function handleGameControl(player, msg) {
  const match = matchmaking.matches.get(player.gameId);
  if (!match) {
    fastify.log.warn(`No match found for ${player.username} when handling control`);
    return;
  }

  const game = match.game;
  fastify.log.info(`🎮 Control from ${player.username}: ${msg.action}, state: ${game.gameState}`);

  switch (msg.action) {
    case "start":
      if (game.gameState === "start") {
        game.gameState = "playing";
        game.launchBall();
        broadcastGameState(match);
        [match.player1, match.player2].forEach((p) => {
          if (p?.socket?.readyState === 1) {
            p.socket.send(JSON.stringify({ type: "gameStarted", message: "Game is now playing!", startedBy: player.username }));
          }
        });
      }
      break;

    case "pause":
      if (game.gameState === "playing") {
        game.gameState = "paused";
        broadcastGameState(match);
      }
      break;

    case "resume":
      if (game.gameState === "paused") {
        game.gameState = "playing";
        broadcastGameState(match);
      }
      break;

    case "restart":
      game.restart(game.canvasWidth, game.canvasHeight);
      match.paddleVelocities = { left: 0, right: 0 };
      broadcastGameState(match);
      break;
  }
}

function handlePlayerInput(player, msg) {
  const match = matchmaking.matches.get(player.gameId);
  if (!match) return;

  if (!match.inputs) match.inputs = {};
  const isP1 = match.player1.id === player.id;
  const key = isP1 ? "player1" : "player2";
  match.inputs[key] = msg.direction; // "up", "down", "stop"
}

/* -------------------- WebSocket Route -------------------- */

fastify.register(async function (fastify) {
  fastify.get("/ws", { websocket: true }, (connection, req) => {
    const socket = connection.socket || connection;
    const client = { socket, username: null, id: null };
    wsClients.add(client);
    fastify.log.info("➕ WS client connected, total:", wsClients.size);

    // initial greeting/message
    try {
      socket.send(JSON.stringify({ type: "system", text: "Connected to WebSocket server" }));
    } catch (e) {
      /* ignore send errors */
    }

    socket.on("message", (raw) => {
      let data;
      try {
        data = JSON.parse(raw.toString());
      } catch (e) {
        fastify.log.warn("⚠️ Invalid WS JSON:", raw.toString());
        return;
      }

      // --- Username setup ---
      if (data.type === "setUsername" && typeof data.username === "string") {
        client.username = data.username.trim();
        // attempt to rejoin if possible
        if (!matchmaking.rejoinPlayer) {
          // fallback: addPlayer and store id on client
          const created = matchmaking.addPlayer(socket, client.username);
          client.id = created.id;
        } else {
          const rejoined = matchmaking.rejoinPlayer(socket, client.username);
          if (!rejoined) {
            const created = matchmaking.addPlayer(socket, client.username);
            client.id = created.id;
          } else {
            // rejoinPlayer may return a player object
            client.id = rejoined.id || client.id;
          }
        }

        try {
          socket.send(JSON.stringify({ type: "system", text: `Username set to ${client.username}` }));
        } catch {}
        return;
      }

      // --- Auto matchmaking ---
      if (data.type === "findMatch") {
        if (!client.id) {
          const player = matchmaking.addPlayer(socket, client.username);
          client.id = player.id;
        }
        const player = matchmaking.players.get(client.id);
        if (player) matchmaking.findMatch(player);
        return;
      }

      // --- GAME CONTROL ---
      if (data.type === "control") {
        if (!client.id) {
          fastify.log.warn("Control message from client without ID");
          return;
        }
        const player = matchmaking.players.get(client.id);
        if (player) handleGameControl(player, data);
        return;
      }

      // --- PLAYER INPUT ---
      if (data.type === "input") {
        if (!client.id) {
          fastify.log.warn("Input message from client without ID");
          return;
        }
        const player = matchmaking.players.get(client.id);
        if (player) handlePlayerInput(player, data);
        return;
      }

      // --- Invite ---
      if (data.type === "invite") {
        const success = matchmaking.createInvite(client.id, data.to);
        if (!success) {
          socket.send(JSON.stringify({ type: "error", message: "Invite failed: user not found" }));
        }
        return;
      }

      // --- Accept invite ---
      if (data.type === "acceptInvite") {
        const success = matchmaking.acceptInvite(client.id, data.from);
        if (!success) {
          socket.send(JSON.stringify({ type: "error", message: "Failed to accept invite" }));
        }
        return;
      }

      // --- Direct message fallback (optional) ---
      if (data.type === "direct" && data.to && data.text) {
        for (const c of wsClients) {
          if (c.username === data.to && c.socket.readyState === 1) {
            c.socket.send(JSON.stringify({ type: "direct", from: client.username, text: data.text }));
          }
        }
      }
    });

    socket.on("close", () => {
      if (client.id) matchmaking.removePlayer(client.id);
      wsClients.delete(client);
      fastify.log.info("➖ WS client disconnected", { username: client.username, total: wsClients.size });
    });

    socket.on("error", (err) => fastify.log.error("❌ WS error:", err.message));
  });
});

/* -------------------- GAME UPDATE LOOP -------------------- */
/*
  The matchmaking instance is expected to hold:
    - matchmaking.matches (Map of matchId -> matchInfo)
    - each matchInfo contains .game (GameEngine), .player1/.player2, .paddleVelocities, .inputs, etc.
  This loop updates only active "playing" games, applies inputs, ticks physics, broadcasts state,
  and detects game over to end matches (keeping behavior close to your previous "after" file).
*/

setInterval(() => {
  for (const [matchId, match] of matchmaking.matches.entries()) {
    const game = match.game;

    // Ensure paddles stay within bounds if inputs present
    if (match.inputs) {
      // Apply inputs to paddle positions using server-side paddle speed
      if (match.inputs.player1 === "up") {
        game.player1.y -= gameSettings.paddleSpeed;
      } else if (match.inputs.player1 === "down") {
        game.player1.y += gameSettings.paddleSpeed;
      }

      if (match.inputs.player2 === "up") {
        game.player2.y -= gameSettings.paddleSpeed;
      } else if (match.inputs.player2 === "down") {
        game.player2.y += gameSettings.paddleSpeed;
      }

      // clamp
      game.player1.y = Math.max(0, Math.min(game.canvasHeight - game.player1.height, game.player1.y));
      game.player2.y = Math.max(0, Math.min(game.canvasHeight - game.player2.height, game.player2.y));
    }

    // Update physics (GameEngine should use canvasWidth/canvasHeight internally)
    game.update(game.canvasWidth, game.canvasHeight);

    // Broadcast state to both players
    broadcastGameState(match);

    // Check game over (engine sets game.gameState to "game_over" or GameState.GAME_OVER)
    if (game.gameState === "game_over" || game.gameState === "GAME_OVER" || game.gameState === "game_over") {
      const winner =
        game.player1.score >= gameSettings.scoreLimit ? match.player1.username : match.player2.username;

      [match.player1, match.player2].forEach((player) => {
        if (player?.socket?.readyState === 1) {
          player.socket.send(JSON.stringify({
            type: "gameOver",
            winner,
            score: { left: game.player1.score, right: game.player2.score }
          }));
        }
      });

      // End match (give a short delay so clients can see final state)
      setTimeout(() => {
        matchmaking.endMatch(matchId);
        fastify.log.info(`🏁 Match ${matchId} ended`);
      }, 3000);
    }
  }
}, 1000 / 60); // 60 FPS

// --- Diagnostic endpoint ---
fastify.get("/ws-test", async (request, reply) => {
  return {
    activeConnections: wsClients.size,
    matchmaking: {
      waiting: (matchmaking.waiting && matchmaking.waiting.map((p) => p.username)) || [],
      matches: Array.from(matchmaking.matches ? matchmaking.matches.keys() : []),
    },
  };
});

// --- Static frontend ---
const frontendPath = "/app/frontend";
fastify.register(FastifyStatic, { root: frontendPath, prefix: "/" });
fastify.get("/", (req, reply) => reply.sendFile("index.html"));

fastify.setNotFoundHandler((req, reply) => {
  if (req.raw.url.startsWith("/api") || req.raw.url.startsWith("/auth")) {
    reply.code(404).send({ error: "Not Found" });
  } else {
    reply.sendFile("index.html");
  }
});

// --- Start server ---
const start = async () => {
  try {
    const port = process.env.PORT || 3000;
    const host = "0.0.0.0";
    await fastify.listen({ port, host });

    const address = fastify.server.address();
    const protocol = httpsOptions ? "https" : "http";
    const wsProtocol = httpsOptions ? "wss" : "ws";
    const domain = (process.env.NODE_ENV === "production") ? "pongpong.duckdns.org" : "localhost";

    console.log("🚀 SERVER STARTED SUCCESSFULLY");
    console.log(`🌐 ${protocol}://${domain}:${address.port}`);
    console.log(`📡 WebSocket URL: ${wsProtocol}://${domain}:${address.port}/ws`);
    console.log(`👥 Connected clients: ${wsClients.size}`);
    console.log(`🎮 Game update loop running at 60 FPS`);
  } catch (err) {
    console.error("❌ SERVER STARTUP FAILED:", err);
    process.exit(1);
  }
};

start();
