import path from "path";
import { fileURLToPath } from "url";
import fastifyStatic from "@fastify/static";
import Database from "better-sqlite3";

import { getUserInfo, createUser, updateUserInfo } from "./init.js";
import { addMatchResult } from "./match_history.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "sqlite.db");

import env from "../config/env.js";

export default async function statsRoutes(fastify, options) {
  // Serve static files
  //fastify.register(fastifyStatic, {
  //  root: path.join(__dirname, "../frontend/for_copy/src/pages"),
  //  prefix: "/",
  //});
//
  //fastify.register(fastifyStatic, {
  //  root: path.join(__dirname, "../frontend/for_copy/src/pages"),
  //  prefix: "/stats",
  //  decorateReply: false,
  //});

  // Routes
  fastify.get("/api/user-stats", async (request, reply) => {
    const username = request.query.username || "bot";
    try {
      return getUserInfo(username);
    } catch (err) {
      if (err.message === "User not found") return reply.code(404).send({ error: err.message });
      return reply.code(500).send({ error: "Database error" });
    }
  });

  fastify.get("/api/matches/:username", async (request, reply) => {
    const { username } = request.params;
    //const db = new Database(dbPath);
    const db = new Database(env.dbFile);

    try {
      const user = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
      if (!user) return reply.code(404).send({ error: `User '${username}' not found` });

      const matches = db.prepare(`
        SELECT 
          m.id,
          w.username AS winner,
          l.username AS loser,
          m.winner_points,
          m.loser_points
        FROM match_history m
        INNER JOIN users w ON m.id_winner = w.id
        INNER JOIN users l ON m.id_loser = l.id
        WHERE m.id_winner = ? OR m.id_loser = ?
        ORDER BY m.id DESC
      `).all(user.id, user.id);

      return { matches };
    } catch (err) {
      return reply.code(500).send({ error: err.message });
    } finally {
      db.close();
    }
  });

  fastify.post("/api/create-user", async (request, reply) => {
    try {
      await createUser(request.body);
      return { message: "User created successfully" };
    } catch (err) {
      return reply.code(400).send({ error: err.message });
    }
  });

  fastify.post("/api/match", async (request, reply) => {
    const { winner, loser, winner_points, loser_points } = request.body;
    try {
      return addMatchResult(winner, loser, winner_points, loser_points);
    } catch (err) {
      return reply.code(400).send({ error: err.message });
    }
  });

  fastify.patch("/api/user/:username", async (request, reply) => {
    const { username } = request.params;
    const updates = request.body;
    try {
      await updateUserInfo(username, updates);
      return { message: `User '${username}' updated successfully` };
    } catch (err) {
      return reply.code(400).send({ error: err.message });
    }
  });
}