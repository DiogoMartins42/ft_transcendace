import Fastify from "fastify";
import FastifyStatic from "@fastify/static";
import env from "./config/env.js";
import { options as loggerOptions } from "./config/logger.js";
import path from "path";
import fs from "fs";
import fastifyJWT from "@fastify/jwt";
import fastifyWebsocket from '@fastify/websocket' // add near other imports
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

// register websocket plugin (must be registered before routes)
fastify.register(fastifyWebsocket)

// simple WS clients store
const wsClients = new Set()

fastify.get('/ws', { websocket: true }, (connection, req) => {
  const socket = connection && connection.socket ? connection.socket : connection;
  
  if (!socket) {
    fastify.log.warn('❌ No socket in connection!');
    return;
  }

  // Extract token from query parameters
  const url = new URL(req.url, `http://${req.headers.host}`);
  const token = url.searchParams.get('token');
  
  let client = { 
    socket, 
    username: 'Anonymous', // Default username
    userId: null,
    authenticated: false,
    id: Math.random().toString(36).substr(2, 9) // Simple ID for logging
  };

  fastify.log.info(`🔍 New WebSocket connection [${client.id}]:`, {
    hasToken: !!token,
    origin: req.headers.origin
  });

  // Verify token if provided
  if (token) {
    try {
      const decoded = fastify.jwt.verify(token);
      client.userId = decoded.userId;
      client.authenticated = true;
      
      // Get username from database
      const user = fastify.db.prepare('SELECT username FROM users WHERE id = ?').get(decoded.userId);
      if (user) {
        client.username = user.username;
        fastify.log.info(`✅ Authenticated WebSocket [${client.id}] for: ${user.username}`);
      }
    } catch (err) {
      fastify.log.warn(`❌ Invalid JWT token [${client.id}]:`, err.message);
      // Don't close connection - allow as anonymous
    }
  }

  // Add to clients store
  wsClients.add(client);
  fastify.log.info(`➕ WS client connected [${client.id}]: ${client.username}, Total: ${wsClients.size}`);

  socket.on('message', (raw) => {
    let data;
    try {
      data = JSON.parse(raw.toString());
      fastify.log.info(`📨 Received [${client.id}]:`, data.type);
    } catch (err) {
      fastify.log.warn(`⚠️ Invalid JSON [${client.id}]:`, raw.toString());
      return;
    }

    // Handle setUsername
    if (data.type === 'setUsername' && typeof data.username === 'string') {
      const newUsername = data.username.trim();
      if (newUsername && newUsername.length > 0) {
        const oldUsername = client.username;
        client.username = newUsername;
        fastify.log.info(`🔁 Username changed [${client.id}]: ${oldUsername} → ${newUsername}`);
        
        try {
          socket.send(JSON.stringify({ 
            type: 'system', 
            text: `Username set to ${newUsername}` 
          }));
        } catch (_) {}
      }
      return;
    }

    // Handle direct messages
    if (data.type === 'direct' && data.to && data.text) {
      const targetUsername = data.to.trim();
      const messageText = data.text.trim();

      if (!messageText) return;

      fastify.log.info(`💬 Direct message [${client.id}]: ${client.username} → ${targetUsername}`);

      // Find target user
      let delivered = false;
      for (const targetClient of wsClients) {
        if (targetClient.username && 
            targetClient.username.toLowerCase() === targetUsername.toLowerCase() && 
            targetClient.socket.readyState === 1) {
          try {
            targetClient.socket.send(JSON.stringify({
              from: client.username,
              to: targetUsername,
              text: messageText,
              type: 'direct',
              timestamp: new Date().toISOString(),
            }));
            delivered = true;
            fastify.log.info(`✅ Message delivered to: ${targetClient.username}`);
          } catch (err) {
            fastify.log.error(`❌ Failed to send to ${targetClient.username}:`, err.message);
          }
        }
      }

      // Send delivery status to sender
      try {
        socket.send(JSON.stringify({
          type: 'system',
          text: delivered ? `Message delivered to ${targetUsername}` : `User ${targetUsername} not found`
        }));
      } catch (_) {}
      
      return;
    }

    // Handle other message types
    if (data.type === 'invite' && data.to) {
      const targetUsername = data.to.trim();
      
      fastify.log.info(`🏓 Invite [${client.id}]: ${client.username} → ${targetUsername}`);
      
      // Find target user and send invite
      for (const targetClient of wsClients) {
        if (targetClient.username && 
            targetClient.username.toLowerCase() === targetUsername.toLowerCase() && 
            targetClient.socket.readyState === 1) {
          try {
            targetClient.socket.send(JSON.stringify({
              type: 'invite',
              from: client.username,
              to: targetUsername,
              text: data.text || `${client.username} invited you to a Pong match!`,
              timestamp: new Date().toISOString(),
            }));
          } catch (err) {
            fastify.log.error(`❌ Failed to send invite:`, err.message);
          }
          break;
        }
      }
      return;
    }
  });

  socket.on('close', (code, reason) => {
    wsClients.delete(client);
    fastify.log.info(`➖ WS client disconnected [${client.id}]:`, { 
      username: client.username,
      code, 
      reason: reason.toString(),
      remaining: wsClients.size 
    });
  });

  socket.on('error', (err) => {
    fastify.log.error(`❌ WS error [${client.id}]:`, err.message);
  });

  // Send welcome message
  try {
    socket.send(JSON.stringify({
      type: 'system',
      text: `Connected as ${client.username}`
    }));
  } catch (err) {
    fastify.log.error(`❌ Failed to send welcome [${client.id}]:`, err.message);
  }
});
// Diagnostic endpoint
fastify.get("/ws-debug", async (request, reply) => {
  const clients = Array.from(wsClients).map(c => ({
    username: c.username,
    userId: c.userId,
    authenticated: c.authenticated,
    readyState: c.socket ? c.socket.readyState : 'unknown'
  }));

  return {
    totalConnections: wsClients.size,
    activeConnections: clients.filter(c => c.readyState === 1).length,
    clients: clients
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
