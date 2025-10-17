import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default async function uploadsRoutes(fastify, options) {
  fastify.get("/avatars/:username", async (request, reply) => {
    const { username } = request.params;

    const filePath = path.join(__dirname, "./avatars", `${username}.png`);
    const defaultPath = path.join(__dirname, "./avatars", "default.png");

    console.log("Serving avatar for:", username);
    console.log("Looking for file at:", filePath);

    // Check if the image exists
    if (fs.existsSync(filePath)) {
      reply.type("image/png").send(fs.readFileSync(filePath));
    } else {
      reply.type("image/png").send(fs.readFileSync(defaultPath));
    }
  });
}

