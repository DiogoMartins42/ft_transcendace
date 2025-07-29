import Fastify from "fastify";
import FastifyStatic from "@fastify/static";
import env from "./config/env.js";
import { options as loggerOptions } from "./config/logger.js";
import path from "path";

import fastifyJWT from "@fastify/jwt";
import fastifyWebsocket from "@fastify/websocket";
import authRoutes from "./routes/auth.js";
import lobbyRoutes from "./routes/lobby.js";

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
fastify.register(FastifyStatic, { 
  root: path.join(process.cwd(), "public"),
  prefix: "/",
});

fastify.get("/", (req, reply) => reply.redirect("/index.html"));

const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log("Server running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
