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

// --- SQLite setup ---
const db = new Database(env.dbFile);

db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_id INTEGER NOT NULL,
    content TEXT,
    type TEXT DEFAULT 'text',
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS blocked_users (
    user_id INTEGER NOT NULL,
    blocked_user_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, blocked_user_id)
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    type TEXT,
    message TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
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

// --- WebSocket setup ---
fastify.register(fastifyWebsocket);
const clients = new Set();

fastify.register(async function (fastify) {
  fastify.get("/ws", { websocket: true }, (connection, req) => {
    console.log("Client connected!");

    const socket = connection.socket || connection;
    clients.add(socket);
    socket.username = null;

    socket.on("message", (message) => {
      let messageData;
      try {
        messageData = JSON.parse(message.toString());
      } catch {
        messageData = { type: "chat", text: message.toString() };
      }

      if (!socket.username) {
        socket.username = messageData.username || "Anonymous" + Math.floor(1000 + Math.random() * 9000);
      }

      if (messageData.type === "chat") {
        messageData.username = socket.username;
        for (const client of clients) {
          if (client.readyState === 1) client.send(JSON.stringify(messageData));
        }
      } else if (messageData.type === "connection") {
        console.log("Client connected with message:", messageData.text);
      }
    });
  });
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

// --- Start server ---
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    const address = fastify.server.address();
    const protocol = httpsOptions ? "https" : "http";
    if (typeof address === "string") {
      console.log(`🚀 Server running at ${protocol}://${address}`);
    } else {
      console.log(`🚀 Server running at ${protocol}://${address.address}:${address.port}`);
    }
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
