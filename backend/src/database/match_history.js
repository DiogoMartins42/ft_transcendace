import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "sqlite.db");

import env from "../config/env.js";
//const db = new Database(env.dbFile);

export function addMatchResult(username_winner, username_loser, winner_points, loser_points) {
  //const db = new Database(dbPath);
  const db = new Database(env.dbFile);
  try {
    let winner = db.prepare("SELECT id FROM users WHERE username = ?").get(username_winner);
    let loser = db.prepare("SELECT id FROM users WHERE username = ?").get(username_loser);

    if (!winner && !loser) {
      throw new Error(`Usernames: '${username_winner}' and '${username_loser}' not found`);
    }

    if (!winner || !loser) {
      const bot = db.prepare("SELECT id FROM users WHERE username = 'bot'").get();
      if (!bot) throw new Error("Bot user not initialized in DB");
      if (!winner) winner = bot;
      else loser = bot;
    }

    if (username_winner === 'bot' && username_loser === 'bot'){
      return { message: "Match not saved. User isn't logged in." };
    }
    if (winner.id === loser.id){
      return { message: "Match not saved. User isn't logged in" };
    }

    db.prepare(`
      INSERT INTO match_history (id_winner, id_loser, winner_points, loser_points)
      VALUES (?, ?, ?, ?)
    `).run(winner.id, loser.id, winner_points, loser_points);

    return { message: "Match saved successfully" };
  } finally {
    db.close();
  }
}
