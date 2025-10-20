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

  // Routes
  // Get user information
  fastify.get("/api/user-stats", async (request, reply) => {
    const username = request.query.username || "bot";
    try {
      return getUserInfo(username);
    } catch (err) {
      if (err.message === "User not found") return reply.code(404).send({ error: err.message });
      return reply.code(500).send({ error: "Database error" });
    }
  });

  // Get match history from <username>
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
          m.created_at,
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

  // Create a new user
  fastify.post("/api/create-user", async (request, reply) => {
    try {
      await createUser(request.body);
      return { message: "User created successfully" };
    } catch (err) {
      return reply.code(400).send({ error: err.message });
    }
  });

  // Add a match to match history
  fastify.post("/api/match", async (request, reply) => {
    const { winner, loser, winner_points, loser_points } = request.body;
    try {
      return addMatchResult(winner, loser, winner_points, loser_points);
    } catch (err) {
      return reply.code(400).send({ error: err.message });
    }
  });

  // Update user's information
  fastify.patch("/api/user/:username", async (request, reply) => {
    const { username } = request.params;
    const updates = request.body;
    try{
      await updateUserInfo(username, updates);
      return { message: `User '${username}' updated successfully` };
    } catch (err) {
      return reply.code(400).send({ error: err.message });
    }
  });

  // Add user as a friend (treated has followers)
  fastify.post("/api/friends/:username", async (request, reply) => {
    const { username } = request.params;
    const { friendUsername } = request.body;
    const db = new Database(env.dbFile);

    try {
      if (!friendUsername) {
        return reply.code(400).send({ error: "Missing 'friendUsername' in body" });
      }

      // Get user IDs
      const user = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
      const friend = db.prepare("SELECT id FROM users WHERE username = ?").get(friendUsername);

      if (!user) return reply.code(404).send({ error: `User '${username}' not found` });
      if (!friend) return reply.code(404).send({ error: `User '${friendUsername}' not found` });
      if (user.id === friend.id) return reply.code(400).send({ error: "You cannot add yourself" });

      // Insert into friends table
      const stmt = db.prepare("INSERT INTO friends (user_id, friend_id) VALUES (?, ?)");
      stmt.run(user.id, friend.id);

      return reply.code(201).send({ message: `${username} added ${friendUsername} as a friend` });
    } catch (err) {
      if (err.message.includes("UNIQUE")) {
        return reply.code(400).send({ error: `${friendUsername} is already added` });
      }
      return reply.code(500).send({ error: err.message });
    } finally {
      db.close();
    }
  });

  // Get list of a user’s friends
  /* fastify.get("/api/friends/:username", async (request, reply) => {
    const { username } = request.params;
    const db = new Database(env.dbFile);

    try {
      const user = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
      if (!user) return reply.code(404).send({ error: `User '${username}' not found` });

      const friends = db.prepare(`
        SELECT u.username
        FROM friends f
        JOIN users u ON f.friend_id = u.id
        WHERE f.user_id = ?
      `).all(user.id);

      return reply.send({ username, friends: friends.map(f => f.username) });
    } catch (err) {
      return reply.code(500).send({ error: err.message });
    } finally {
      db.close();
    }
  }); */
  // Get list of a user’s friends with online status
  fastify.get("/api/friends/:username", async (request, reply) => {
    const { username } = request.params;
    const db = new Database(env.dbFile);

    try {
      const user = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
      if (!user) return reply.code(404).send({ error: `User '${username}' not found` });

      const friends = db.prepare(`
        SELECT u.username
        FROM friends f
        JOIN users u ON f.friend_id = u.id
        WHERE f.user_id = ?
      `).all(user.id);

      // Add online status (temporary - all offline until we fix clients access)
      const friendsWithStatus = friends.map(friend => ({
        username: friend.username,
        status: 'offline'
      }));

      return reply.send({ 
        username, 
        friends: friendsWithStatus 
      });
    } catch (err) {
      return reply.code(500).send({ error: err.message });
    } finally {
      db.close();
    }
  });
}