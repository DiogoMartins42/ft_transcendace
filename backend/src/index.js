import Fastify from "fastify";
import FastifyStatic from "@fastify/static";
import env from "./config/env.js";
import { options as loggerOptions } from "./config/logger.js";
import path from "path";

import fastifyJWT from "@fastify/jwt";
import fastifyWebsocket from "@fastify/websocket";
import authRoutes from "./routes/auth.js";
import lobbyRoutes from "./routes/lobby.js";
import { fileURLToPath } from "url";

import statsRoutes from "./database/stats.js";
import { initDB } from "./database/init.js"; 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fastify = Fastify({ logger: loggerOptions });

//SQLite
import Database from "better-sqlite3";
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
fastify.register(authRoutes, { prefix: "/auth" });
fastify.register(lobbyRoutes, { prefix: "/lobby" });

//JWT Auth

fastify.register(fastifyJWT, { secret: env.JWT_SECRET });
fastify.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.send(err);
  }
});

fastify.register(fastifyWebsocket);
const clients = new Set();

fastify.register(async function (fastify) {
  fastify.get("/ws", { websocket: true }, (connection, req) => {
      console.log("Client connected!");
      
      const socket = connection.socket || connection;
      clients.add(socket);

      // Assign username from query or message, or generate anonymous
      socket.username = null;

      socket.on("message", (message) => {
        let messageData;
        try {
          messageData = JSON.parse(message.toString());
        } catch (e) {
          messageData = { type: "chat", text: message.toString() };
        }

        // Set username if provided, otherwise generate anonymous
        if (!socket.username) {
          if (messageData.username) {
            socket.username = messageData.username;
          } else {
            socket.username = "Anonymous" + Math.floor(1000 + Math.random() * 9000);
          }
        }

        if (messageData.type === "chat") {
          messageData.username = socket.username;

          // Send to all clients, including sender
          for (const client of clients) {
            if (client.readyState === 1) {
              client.send(JSON.stringify(messageData));
            }
          }
        } else if (messageData.type === "connection") {
            console.log("Client connected with message:", messageData.text);
            // Don't broadcast connection messages - this is the key fix!
        }
    });
  });
});



const frontendPath = "/app/frontend";
fastify.register(FastifyStatic, { 
  root: frontendPath,
  prefix: "/",
});

fastify.get("/", (req, reply) => {
  reply.sendFile("index.html");
});

fastify.setNotFoundHandler((req, reply) => {
  if (req.raw.url.startsWith("/api") || req.raw.url.startsWith("/auth")) {
    reply.code(404).send({ error: "Not Found" });
  } else {
    reply.sendFile("index.html");
  }
});

//fastify.register(statsRoutes);
fastify.register(statsRoutes, { prefix: "/stats" });

const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    const address = fastify.server.address();
    if (typeof address === 'string') {
      console.log(`Server running on ${address}`);
    } else {
      console.log(`Server running on http://${address.address}:${address.port}`);
    }
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
