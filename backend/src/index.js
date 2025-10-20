import Fastify from "fastify";
import FastifyStatic from "@fastify/static";
import env from "./config/env.js";
import { options as loggerOptions } from "./config/logger.js";
import path from "path";
import fs from "fs";
import fastifyJWT from "@fastify/jwt";
import fastifyWebsocket from '@fastify/websocket'
import authRoutes from "./routes/auth.js";
import lobbyRoutes from "./routes/lobby.js";
import blockRoutes from "./routes/block.js";
import oauthRoutes from "./routes/oauth.js";
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
  https: httpsOptions,
  trustProxy: true, // Important for reverse proxy scenarios
  connectionTimeout: 0, // Important for WebSocket
  keepAliveTimeout: 0 // Important for WebSocket
});

import fastifyCors from '@fastify/cors';
fastify.register(fastifyCors, {
  origin: ['https://pongpong.duckdns.org', 'https://localhost:3000', 'http://localhost:5173'],
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
fastify.register(blockRoutes, { prefix: "/block" });
fastify.register(statsRoutes, { prefix: "/stats" });
fastify.register(oauthRoutes, { prefix: "/oauth" });
// Register websocket plugin with options
fastify.register(fastifyWebsocket, {
  options: {
    maxPayload: 1048576, // 1MB
    verifyClient: (info, next) => {
      // Log all WebSocket connection attempts
      console.log('🔍 WebSocket upgrade attempt:', {
        origin: info.origin,
        secure: info.secure,
        url: info.req.url
      });
      next(true); // Accept all connections
    }
  }
});

// Helper to extract and verify JWT token from WebSocket URL
async function extractUserFromToken(url, jwtSecret) {
  try {
    const urlObj = new URL(url, 'http://localhost');
    const token = urlObj.searchParams.get('token');
    if (!token) return null;
    
    const jwt = await import('@fastify/jwt');
    const decoded = jwt.default.verify(token, jwtSecret);
    return decoded;
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return null;
  }
}

// Simple WS clients store
const wsClients = new Set();

// Helper function to check if user A has blocked user B
function isUserBlocked(db, userIdA, userIdB) {
  const block = db.prepare(`
    SELECT 1 FROM blocked_users 
    WHERE user_id = ? AND blocked_user_id = ?
    LIMIT 1
  `).get(userIdA, userIdB);
  return !!block;
}

// Helper function to get user ID from username
function getUserIdByUsername(db, username) {
  const user = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
  return user ? user.id : null;
}

// WebSocket route with improved error handling and block checking
fastify.register(async function (fastify) {
  fastify.get('/ws', { websocket: true }, (connection, req) => {
    const socket = connection.socket || connection;
    
    fastify.log.info('🎯 WebSocket connection established:', {
      origin: req.headers.origin,
      url: req.url,
      protocol: req.headers['sec-websocket-protocol']
    });

    if (!socket) {
      fastify.log.error('❌ No socket in connection!');
      return;
    }

    const client = { socket, username: null, userId: null };
    wsClients.add(client);
    fastify.log.info('➕ WS client connected, total:', wsClients.size);

    // Send welcome message
    try {
      socket.send(JSON.stringify({ 
        type: 'system', 
        text: 'Connected to WebSocket server',
        timestamp: new Date().toISOString()
      }));
    } catch (err) {
      fastify.log.error('❌ Failed to send welcome message:', err);
    }

    socket.on('message', (raw) => {
      let data;
      try {
        const rawStr = raw.toString();
        fastify.log.info('📨 Received raw message:', rawStr);
        data = JSON.parse(rawStr);
      } catch (err) {
        fastify.log.warn('⚠️ WS invalid JSON:', raw.toString());
        return;
      }

      // Handle setUsername
      if (data.type === 'setUsername' && typeof data.username === 'string') {
        client.username = data.username.trim();
        fastify.log.info('👤 setUsername:', client.username);
        try {
          socket.send(JSON.stringify({ 
            type: 'system', 
            text: `Username set to ${client.username}`,
            timestamp: new Date().toISOString()
          }));
        } catch (err) {
          fastify.log.error('❌ Failed to send username confirmation:', err);
        }
        return;
      }

      // Handle direct messages with block checking
      if (data.type === 'direct' && data.to) {
        const target = data.to.trim().toLowerCase();
        const sender = (client.username || 'Anonymous').trim();
        const timestamp = new Date().toISOString();

        fastify.log.info('💬 Direct message request:', { from: sender, to: target });

        // Get user IDs for block checking
        const senderUserId = getUserIdByUsername(fastify.db, sender);
        const targetUserId = getUserIdByUsername(fastify.db, data.to.trim());

        if (!senderUserId || !targetUserId) {
          fastify.log.warn('⚠️ Could not find user IDs for block check');
          // Continue without block check if users not in DB (e.g., anonymous users)
        }

        // Check if either user has blocked the other
        if (senderUserId && targetUserId) {
          const senderBlockedTarget = isUserBlocked(fastify.db, senderUserId, targetUserId);
          const targetBlockedSender = isUserBlocked(fastify.db, targetUserId, senderUserId);

          if (targetBlockedSender) {
            fastify.log.info(`🚫 Message blocked: ${target} has blocked ${sender}`);
            // Send error back to sender only
            try {
              socket.send(JSON.stringify({
                type: 'error',
                text: 'Your message was not delivered. This user has blocked you.',
                timestamp: new Date().toISOString()
              }));
            } catch (err) {
              fastify.log.error('❌ Failed to send block notification:', err);
            }
            return;
          }

          if (senderBlockedTarget) {
            fastify.log.info(`🚫 Message blocked: ${sender} has blocked ${target}`);
            // Send error back to sender
            try {
              socket.send(JSON.stringify({
                type: 'error',
                text: 'Cannot send message to a blocked user.',
                timestamp: new Date().toISOString()
              }));
            } catch (err) {
              fastify.log.error('❌ Failed to send block notification:', err);
            }
            return;
          }
        }

        // If not blocked, deliver the message
        for (const c of wsClients) {
          const state = c.socket && c.socket.readyState;
          if (state !== 1) continue; // 1 = OPEN

          const name = (c.username || '').trim().toLowerCase();
          if (name === target || name === sender.toLowerCase()) {
            try {
              c.socket.send(JSON.stringify({
                from: sender,
                to: data.to,
                text: data.text,
                type: 'direct',
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

    socket.on('close', (code, reason) => {
      wsClients.delete(client);
      fastify.log.info('➖ WS client disconnected', { 
        username: client.username,
        code, 
        reason: reason.toString(),
        total: wsClients.size 
      });
    });

    socket.on('error', (err) => {
      fastify.log.error('❌ WS socket error:', err.message);
    });

    socket.on('ping', () => {
      fastify.log.debug('🏓 Received ping');
    });

    socket.on('pong', () => {
      fastify.log.debug('🏓 Received pong');
    });
  });
});

// Diagnostic endpoint
fastify.get("/ws-test", async (request, reply) => {
  return {
    websocketEnabled: !!fastify.websocketServer,
    activeConnections: wsClients.size,
    clients: Array.from(wsClients).map(c => ({
      username: c.username,
      userId: c.userId,
      readyState: c.socket ? c.socket.readyState : null
    })),
    server: {
      https: !!httpsOptions,
      host: request.hostname,
      protocol: request.protocol
    }
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
    const wsProtocol = httpsOptions ? "wss" : "ws";
    
    console.log("\n" + "=".repeat(60));
    console.log("🚀 SERVER STARTED SUCCESSFULLY");
    console.log("=".repeat(60));
    
    if (typeof address === "string") {
      console.log(`🌐 Listening on: ${protocol}://${address}`);
    } else if (address) {
      console.log(`🌐 Listening on: ${protocol}://${address.address}:${address.port}`);
      console.log(`🌍 External URL: ${protocol}://pongpong.duckdns.org:${address.port}`);
    }
    
    console.log(`🔒 HTTPS: ${httpsOptions ? "Enabled ✅" : "Disabled ❌"}`);
    console.log(`🔌 WebSocket: ${fastify.websocketServer ? "Enabled ✅" : "Disabled ❌"}`);
    
    if (fastify.websocketServer) {
      console.log(`📡 WebSocket URL: ${wsProtocol}://pongpong.duckdns.org:3000/ws`);
      console.log(`📡 Local WebSocket: ${wsProtocol}://localhost:3000/ws`);
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