import Fastify from "fastify";
import statsRoutes from "./stats.js";

const fastify = Fastify({ logger: true });

// Register the routes plugin
fastify.register(statsRoutes);

// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Backend running on http://pongpong.duckdns.org:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
