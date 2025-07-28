
import Fastify from "fastify";
import env from "./config/env.js"
import logger from "./config/logger.js";
import path from "path";
import FastifyStatic from "@fastify/static";


const fastify = Fastify({logger: true });
// Declare a route

fastify.register(FastifyStatic, { 
  root: path.join(process.cwd(), "public"),
  prefix: "/",
})

fastify.get('/', (request, reply) => {
  reply.redirect('/index.html');
});


// Run the server!
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
    console.log('Server running at http://localhost:3000');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
