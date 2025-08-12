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
