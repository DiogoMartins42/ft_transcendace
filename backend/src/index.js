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
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();

fastify.decorate("db", db);
fastify.register(authRoutes, { prefix: "/auth" });
fastify.register(lobbyRoutes, { prefix: "/lobby" });

fastify.get("/api/user-stats", async (request, reply) => {
  const username = request.query.username || "test";

  try {
    const row = fastify.db.prepare(
      "SELECT username, email, wins, losses FROM users WHERE username = ?"
    ).get(username);

    if (!row) {
      return reply.code(404).send({ error: "User not found" });
    }

    return {
      username: row.username,
      email: row.email,
      wins: row.wins || 0,
      losses: row.losses || 0,
    };
  } catch (err) {
    request.log.error(err);
    return reply.code(500).send({ error: "Database error" });
  }
});


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
fastify.register(async function (fastify) {
  fastify.get("/ws", { websocket: true }, (connection, req) => {
    console.log("Client connected!");

    connection.send(JSON.stringify({ message: "Welcome to WS server!" }));

    connection.on("message", (message) => {
      console.log("Received:", message.toString());
      connection.send(JSON.stringify({ echo: message.toString() }));
    });

    connection.on("close", () => {
      console.log("Client disconnected");
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


const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: '0.0.0.0' });
    console.log("Server running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
