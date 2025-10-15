import Fastify from "fastify";
import FastifyStatic from "@fastify/static";
import env from "./config/env.js";
import { options as loggerOptions } from "./config/logger.js";
import path from "path";
import fs from "fs";
import fastifyJWT from "@fastify/jwt";
import fastifyWebsocket from "@fastify/websocket";
import authRoutes from "./routes/auth.js";
import lobbyRoutes from "./routes/lobby.js";
import { fileURLToPath } from "url";
import statsRoutes from "./database/stats.js";
import { initDB } from "./database/init.js";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Optional HTTPS setup ---
let httpsOptions = undefined;
try {
  const certDir = "/app/certs";
  const keyPath = path.join(certDir, "key.pem");
  const certPath = path.join(certDir, "cert.pem");

  if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
    httpsOptions = {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath)
    };
    console.log("✅ HTTPS certificates loaded successfully");
  } else {
    console.warn("⚠️ HTTPS certs not found (certs/key.pem, certs/cert.pem). Running in HTTP mode.");
  }
} catch (err) {
  console.warn("⚠️ Error loading HTTPS certificates, defaulting to HTTP:", err);
}

// --- Create Fastify instance (with HTTPS if available) ---
const fastify = Fastify({
  logger: loggerOptions,
  https: httpsOptions
});

import fastifyCors from '@fastify/cors';
fastify.register(fastifyCors, {
  origin: ['https://pongpong.duckdns.org'],
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
    PRIMARY KEY (user_id, blocked_user_id)
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
    ('bot', 'bot@gmail.com', 'kdakwunda#^!@#HDJDOAPDKAW_D)AW*DANWDKAD><WAODWAD?DAIDAWdwad'),
    ('guest_multiplayer', 'guest_multiplayer@gmail.com', 'iuhduiawHd7&!(1u831dhwuhd*@!&!@(dwadawd')
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS match_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_winner INTEGER NOT NULL,
    id_loser INTEGER NOT NULL,
    winner_points INTEGER DEFAULT 0,
    loser_points INTEGER DEFAULT 0,
    FOREIGN KEY (id_winner) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (id_loser) REFERENCES users(id) ON DELETE CASCADE
  )
`).run();


db.prepare(`
  INSERT OR IGNORE INTO users (username, email, password)
  VALUES 
    ('bot', 'bot@gmail.com', 'kdakwunda#^!@#HDJDOAPDKAW_D)AW*DANWDKAD><WAODWAD?DAIDAWdwad'),
    ('guest_multiplayer', 'guest_multiplayer@gmail.com', 'iuhduiawHd7&!(1u831dhwuhd*@!&!@(dwadawd')
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS match_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_winner INTEGER NOT NULL,
    id_loser INTEGER NOT NULL,
    winner_points INTEGER DEFAULT 0,
    loser_points INTEGER DEFAULT 0,
    FOREIGN KEY (id_winner) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (id_loser) REFERENCES users(id) ON DELETE CASCADE
  )
`).run();

fastify.decorate("db", db);

// --- JWT setup ---
fastify.register(fastifyJWT, { secret: env.JWT_SECRET });

// Auth decorator
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
fastify.register(statsRoutes, { prefix: "/stats" });

await fastify.register(fastifyWebsocket, {
  options: {
    maxPayload: 1048576,
    verifyClient: function (info, next) {
      console.log("🔍 WS Upgrade attempt:", {
        origin: info.origin,
        secure: info.secure,
        url: info.req.url
      });
      next(true);
    }
  }
});

const clients = new Set();

// WebSocket route
// --- WebSocket route ---
fastify.get("/ws", { websocket: true }, (connection, req) => {
  const socket = connection.socket; // ✅ Correct
  if (!socket) {
    console.error("❌ No socket in connection!");
    return;
  }

  let username = "Anonymous";
  let userId = null;

  console.log("🔌 New WebSocket connection attempt");
  console.log("   URL:", req.url);
  console.log("   Headers:", req.headers);

  try {
    // Parse the token
    const url = new URL(req.url, `https://${req.headers.host || "localhost"}`);
    const token = url.searchParams.get("token");

    if (token) {
      console.log("🔍 Token found:", token.substring(0, 20) + "...");
      const decoded = fastify.jwt.verify(token);
      userId = decoded.userId;

      const user = fastify.db.prepare(`SELECT username FROM users WHERE id = ?`).get(userId);
      if (user) {
        username = user.username;
        console.log(`✅ Authenticated: ${username} (ID: ${userId})`);
      } else {
        console.warn(`⚠️ User ID ${userId} not found in DB`);
      }
    } else {
      console.warn("⚠️ No token provided");
    }
  } catch (err) {
    console.error("❌ Auth error:", err.message);
  }

  console.log(`✅ WebSocket connected: ${username}`);

  const client = { socket, username, userId };
  clients.add(client);

  // ✅ Welcome message
  try {
    socket.send(
      JSON.stringify({
        type: "system",
        text: `Connected as ${username}`,
        timestamp: new Date().toISOString(),
      })
    );
  } catch (err) {
    console.error("❌ Failed to send welcome:", err.message);
  }

  // ✅ Message handler
  socket.on("message", (rawMessage) => {
    console.log(`📨 Message from ${username}:`, rawMessage.toString());

    let data;
    try {
      data = JSON.parse(rawMessage.toString());
    } catch {
      console.warn("⚠️ Invalid JSON:", rawMessage.toString());
      return;
    }

    const timestamp = new Date().toISOString();

    if (data.type === "direct" && data.to) {
      console.log(`💬 Direct message: ${username} -> ${data.to}`);

      for (const c of clients) {
        if (c.socket.readyState !== 1) continue;

        if (c.username === data.to || c.username === username) {
          try {
            c.socket.send(
              JSON.stringify({
                from: username,
                to: data.to,
                text: data.text,
                type: "direct",
                timestamp,
              })
            );
          } catch (err) {
            console.error(`❌ Failed to send to ${c.username}:`, err.message);
          }
        }
      }
    } else if (["system", "invite", "chat"].includes(data.type)) {
      console.log(`📢 Broadcast from ${username}:`, data.text);

      for (const c of clients) {
        if (c.socket.readyState !== 1) continue;

        try {
          c.socket.send(
            JSON.stringify({
              from: username,
              text: data.text,
              type: data.type,
              timestamp,
            })
          );
        } catch (err) {
          console.error(`❌ Failed to broadcast to ${c.username}:`, err.message);
        }
      }
    }
  });

  socket.on("close", () => {
    console.log(`❌ Disconnected: ${username}`);
    clients.delete(client);
  });

  socket.on("error", (err) => {
    console.error(`❌ WS Error for ${username}:`, err.message);
  });
});


// Diagnostic endpoint
fastify.get("/ws-test", async (request, reply) => {
  return {
    websocketEnabled: !!fastify.websocketServer,
    activeConnections: clients.size,
    clients: Array.from(clients).map(c => ({
      username: c.username,
      userId: c.userId,
      readyState: c.ws.readyState
    }))
  };
});

// --- Static frontend ---
const frontendPath = "/app/frontend";
fastify.register(FastifyStatic, {
  root: frontendPath,
  prefix: "/"
});

fastify.get("/", (req, reply) => reply.sendFile("index.html"));

fastify.setNotFoundHandler((req, reply) => {
  if (req.raw.url.startsWith("/api") || req.raw.url.startsWith("/auth")) {
    reply.code(404).send({ error: "Not Found" });
  } else {
    reply.sendFile("index.html");
  }
});

fastify.get("/api/users", { preHandler: [fastify.authenticate] }, async (req, reply) => {
  const users = fastify.db.prepare(`
    SELECT id, username, email FROM users
    ORDER BY username ASC
  `).all();
  reply.send(users);
});

// --- Start server ---
const start = async () => {
  try {
    // Listen on all interfaces
    await fastify.listen({ 
      port: 3000, 
      host: "0.0.0.0" 
    });
    
    const address = fastify.server.address();
    const protocol = httpsOptions ? "https" : "http";
    
    console.log("\n" + "=".repeat(60));
    console.log("🚀 SERVER STARTED SUCCESSFULLY");
    console.log("=".repeat(60));
    
    if (typeof address === "string") {
      console.log(`📍 Listening on: ${protocol}://${address}`);
    } else if (address) {
      console.log(`📍 Listening on: ${protocol}://${address.address}:${address.port}`);
      console.log(`🌐 External URL: ${protocol}://pongpong.duckdns.org:${address.port}`);
    }
    
    console.log(`🔒 HTTPS: ${httpsOptions ? "Enabled ✅" : "Disabled ❌"}`);
    console.log(`🔌 WebSocket: ${fastify.websocketServer ? "Enabled ✅" : "Disabled ❌"}`);
    
    if (fastify.websocketServer) {
      console.log(`📡 WebSocket URL: wss://pongpong.duckdns.org:3000/ws`);
    } else {
      console.log(`⚠️  WARNING: WebSocket server not initialized!`);
    }
    
    console.log("=".repeat(60) + "\n");
    
    // Test database
    const userCount = fastify.db.prepare('SELECT COUNT(*) as count FROM users').get();
    console.log(`👥 Users in database: ${userCount.count}`);
    
  } catch (err) {
    console.error("\n" + "=".repeat(60));
    console.error("❌ SERVER STARTUP FAILED");
    console.error("=".repeat(60));
    console.error(err);
    console.error("=".repeat(60) + "\n");
    process.exit(1);
  }
};

start();
