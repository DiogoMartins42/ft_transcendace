import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
//import fastifyMultipart from "@fastify/multipart"; // multipart form uploads and access to the uploaded file(s) as streams or buffers.
// npm install @fastify/multipart within ./backend/src
// npm uninstall @fastify/multipart

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const avatarsDir = path.join(__dirname, "./avatars");


// If path exists, serve the image requested to the server, otherwise send default.png
const SUPPORTED_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif"];

export default async function uploadsRoutes(fastify, options) {
  fastify.get("/avatars/:username", async (request, reply) => {
    const { username } = request.params;

    // Try each supported extension until one exists
    let filePath = null;
    for (const ext of SUPPORTED_EXTENSIONS) {
      const possiblePath = path.join(avatarsDir, `${username}${ext}`);
      if (fs.existsSync(possiblePath)) {
        filePath = possiblePath;
        break;
      }
    }

    // Default avatar if none found
    const defaultPath = path.join(avatarsDir, "default.png");

    const finalPath = filePath || defaultPath;
    const ext = path.extname(finalPath).toLowerCase();

    // Set the proper MIME type dynamically
    const mimeType = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
      ".gif": "image/gif",
    }[ext] || "application/octet-stream";

    console.log(`Serving avatar: ${username} → ${path.basename(finalPath)}`);

    console.log("Requested username:", username);
    console.log("File path found:", filePath || "none, using default");

    reply.type(mimeType).send(fs.readFileSync(finalPath));
  });



  fastify.addContentTypeParser("application/octet-stream", { parseAs: "buffer" }, async (req, body) => body);

  fastify.post("/upload-avatar/:username",
    { bodyLimit: 20 * 1024 * 1024 }, // 20 MB
    async (request, reply) => {
      const { username } = request.params;
      const fileData = request.body;

      //const uploadDir = path.join(process.cwd(), /* "uploads", */ "avatars");
      const filePath = path.join(avatarsDir, `${username}.png`);

      await fs.promises.mkdir(avatarsDir, { recursive: true });
      await fs.promises.writeFile(filePath, fileData);

      return reply.send({ message: "Avatar uploaded successfully" });
    }
  );


  /* fastify.register(fastifyMultipart, {
    limits: {
      fileSize: 20 * 1024 * 1024 // + max file size (20MB)
    }
  });

  fastify.post("/upload-avatar/:username", async (request, reply) => {
    const { username } = request.params;
    const data = await request.file();

    if (!data) {
      return reply.status(400).send({ error: "No file uploaded" });
    }

    const uploadDir = path.join(process.cwd(), "uploads", "avatars");
    const filePath = path.join(uploadDir, `${username}.png`);

    await fs.promises.mkdir(uploadDir, { recursive: true });
    await fs.promises.writeFile(filePath, await data.toBuffer());

    return reply.send({ message: "Avatar uploaded successfully" });
  }); */
}