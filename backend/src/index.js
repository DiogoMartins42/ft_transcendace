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
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

        // Assign a username for this socket (replace with real auth if available)
        socket.username = "Anonymous"; // Or get from JWT, etc.

        // Send welcome message
        if (socket.readyState === 1) {
            socket.send(JSON.stringify({ 
                type: "welcome", 
                message: "Connected to this server!" 
            }));
        }
        
        socket.on("message", (message) => {
            let messageData;
            try {
                messageData = JSON.parse(message.toString());
            } catch (e) {
                messageData = { type: "chat", text: message.toString() };
            }

            if (messageData.type === "chat") {
                // Attach sender's username
                messageData.username = socket.username;

                // Send to all clients, including sender
                for (const client of clients) {
                    if (client.readyState === 1) {
                        client.send(JSON.stringify(messageData));
                    }
                }
            } else if (messageData.type === "connection") {
                console.log("Client connected with message:", messageData.text);
            }
        });
        
        socket.on("close", () => {
            console.log("Client disconnected");
            clients.delete(socket);
        });
        
        socket.on("error", (error) => {
            console.error("WebSocket error:", error);
            clients.delete(socket);
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
