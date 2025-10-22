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
import { initDB } from "./database/init.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- HTTPS setup ---
let httpsOptions = undefined;
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

// --- Create Fastify instance ---
const fastify = Fastify({
  logger: loggerOptions,
  https: httpsOptions,
  trustProxy: true,
  connectionTimeout: 0,
  keepAliveTimeout: 0,
});

// --- CORS ---
fastify.register(fastifyCors, {
  origin: [
    "https://pongpong.duckdns.org",
    "https://localhost:3000",
    "http://localhost:5173",
  ],
  credentials: true,
});

// --- SQLite setup ---
const db = new Database(env.dbFile);
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    google_id TEXT UNIQUE,
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    IsOnline BOOLEAN DEFAULT FALSE,
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
  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
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
      console.log("🔍 WebSocket upgrade attempt:", {
        origin: info.origin,
        secure: info.secure,
        url: info.req.url,
      });
      next(true);
    },
  },
});

// Helper to extract and verify JWT token from WebSocket URL
async function extractUserFromToken(url, jwtSecret) {
  try {
    const urlObj = new URL(url, 'https://localhost');
    const token = urlObj.searchParams.get('token');
    if (!token) return null;
    
    const jwt = await import('@fastify/jwt');
    const decoded = jwt.default.verify(token, jwtSecret);
    return decoded;
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return null;
const wsClients = new Set();

// ========== HELPER FUNCTIONS FOR GAME CONTROL ==========

function handleGameControl(player, msg, matchmaking) {
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

function handlePlayerInput(player, msg, matchmaking) {
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

// ========== WEBSOCKET HANDLERS ==========

fastify.register(async function (fastify) {
  fastify.get("/ws", { websocket: true }, (connection, req) => {
    const socket = connection.socket || connection;
    const client = { socket, username: null, id: null };
    wsClients.add(client);
    fastify.log.info("➕ WS client connected, total:", wsClients.size);

    socket.send(
      JSON.stringify({
        type: "system",
        text: "Connected to WebSocket server",
      })
    );

    socket.on("message", (raw) => {
      let data;
      try {
        data = JSON.parse(raw.toString());
      } catch {
        fastify.log.warn("⚠️ Invalid WS JSON:", raw.toString());
        return;
      }

      // --- Username setup ---
      if (data.type === "setUsername" && typeof data.username === "string") {
        client.username = data.username.trim();
        if (!matchmaking.rejoinPlayer(socket, client.username)) {
          const player = matchmaking.addPlayer(socket, client.username);
          client.id = player.id;
        }
        socket.send(
          JSON.stringify({
            type: "system",
            text: `Username set to ${client.username}`,
          })
        );
        return;
      }

      // Handle direct messages with block checking
      if (
        (data.type === 'direct' || data.type === 'invite' || data.type === 'invite_accept') && data.to) {
        const target = data.to.trim().toLowerCase();
        const sender = (client.username || 'Anonymous').trim();
        const timestamp = new Date().toISOString();

        fastify.log.info('💬 Direct message request:', { from: sender, to: target });
      // --- Auto matchmaking ---
      if (data.type === "findMatch") {
        if (!client.id) {
          const player = matchmaking.addPlayer(socket, client.username);
          client.id = player.id;
        }
        const player = matchmaking.players.get(client.id);
        matchmaking.findMatch(player);
        return;
      }

      // --- GAME CONTROL (NEW!) ---
      if (data.type === "control") {
        if (!client.id) {
          console.warn("Control message from client without ID");
          return;
        }
        const player = matchmaking.players.get(client.id);
        if (player) {
          handleGameControl(player, data, matchmaking);
        }
        return;
      }

      // --- PLAYER INPUT (NEW!) ---
      if (data.type === "input") {
        if (!client.id) {
          console.warn("Input message from client without ID");
          return;
        }
        const player = matchmaking.players.get(client.id);
        if (player) {
          handlePlayerInput(player, data, matchmaking);
        }
        return;
      }

      // --- Invitation ---
      if (data.type === "invite") {
        const success = matchmaking.createInvite(client.id, data.to);
        if (!success) {
          socket.send(
            JSON.stringify({
              type: "error",
              message: "Invite failed: user not found",
            })
          );
        }
        return;
      }

      // --- Accept invitation ---
      if (data.type === "acceptInvite") {
        const success = matchmaking.acceptInvite(client.id, data.from);
        if (!success) {
          socket.send(
            JSON.stringify({
              type: "error",
              message: "Failed to accept invite",
            })
          );
        }
        return;
      }

      // --- Fallback: direct messaging (optional) ---
      if (data.type === "direct" && data.to && data.text) {
        for (const c of wsClients) {
          if (c.username === data.to && c.socket.readyState === 1) {
            c.socket.send(
              JSON.stringify({
                type: "direct",
                from: client.username,
                text: data.text,
                type: data.type,
                matchId: data.matchId || null,
                timestamp,
              }));
              fastify.log.info(`✅ Sent to ${c.username || 'Anonymous'}`);
            } catch (err) {
              fastify.log.error(`❌ Failed to send to ${c.username}:`, err.message);
            }
          }
        }
      }
    });

    socket.on("close", () => {
      if (client.id) matchmaking.removePlayer(client.id);
      wsClients.delete(client);
      fastify.log.info("➖ WS client disconnected", {
        username: client.username,
        total: wsClients.size,
      });
    });

    socket.on("error", (err) =>
      fastify.log.error("❌ WS error:", err.message)
    );
  });
});

// ========== GAME UPDATE LOOP (NEW!) ==========
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

// --- Diagnostic endpoint ---
fastify.get("/ws-test", async (request, reply) => {
  return {
    activeConnections: wsClients.size,
    matchmaking: {
      waiting: matchmaking.waiting.map((p) => p.username),
      matches: Array.from(matchmaking.matches.keys()),
    },
  };
});

fastify.get("/api/users", { preHandler: [fastify.authenticate] }, async (req, reply) => {
  const users = fastify.db.prepare(`
    SELECT id, username, email FROM users
    ORDER BY username ASC
  `).all();
  reply.send(users);
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
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    const address = fastify.server.address();
    const protocol = httpsOptions ? "https" : "http";
    const wsProtocol = httpsOptions ? "wss" : "ws";
    console.log("🚀 SERVER STARTED SUCCESSFULLY");
    console.log(`🌐 ${protocol}://pongpong.duckdns.org:${address.port}`);
    console.log(`📡 WebSocket URL: ${wsProtocol}://pongpong.duckdns.org:3000/ws`);
    const userCount = fastify.db.prepare('SELECT COUNT(*) as count FROM users').get();
    console.log(`👥 Users in database: ${userCount.count}`);
    console.log(`🎮 Game update loop running at 60 FPS`);
  } catch (err) {
    console.error("❌ SERVER STARTUP FAILED:", err);
    process.exit(1);
  }
};

start();