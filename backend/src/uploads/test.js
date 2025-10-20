import Fastify from "fastify";
import uploadsRoutes from "./uploads.js"; // path to your module

const fastify = Fastify({ logger: true });

// register your routes
fastify.register(uploadsRoutes, { prefix: "/uploads" });

const start = async () => {
  try {
    await fastify.listen({ port: 3001 });
    console.log("Server running on http://localhost:3001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();