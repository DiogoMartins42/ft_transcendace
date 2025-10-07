import Database from "better-sqlite3";
import bcrypt from "bcrypt";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, "sqlite.db");

import env from "../config/env.js";
//const db = new Database(env.dbFile);

const saltRounds = 10;

export async function checkPassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export async function hashPassword(password) {
  const hashed = await bcrypt.hash(password, saltRounds);
  return hashed;
}

export function getUserInfo(username) {
  //const db = new Database(dbPath);
  const db = new Database(env.dbFile);
  try {
    const row = db.prepare("SELECT username, email FROM users WHERE username = ?").get(username);
    if (!row) throw new Error("User not found");
    return row;
  } finally {
    db.close();
  }
}

export async function createUser(newUser) {
  //const db = new Database(dbPath);
  const db = new Database(env.dbFile);
  try {
    const insertStmt = db.prepare("INSERT OR IGNORE INTO users (username, password, email) VALUES (?, ?, ?)");
    const hashedPassword = await hashPassword(newUser.password);
    insertStmt.run(newUser.username, hashedPassword, newUser.email);
  } finally {
    db.close();
  }
}

export async function updateUserInfo(username, updates) {
  //const db = new Database(dbPath);
  const db = new Database(env.dbFile);
  try {
    const fields = [];
    const values = [];

    if (updates.email) {
      fields.push("email = ?");
      values.push(updates.email);
    }

    if (updates.password) {
      const hashedPassword = await hashPassword(updates.password);
      fields.push("password = ?");
      values.push(hashedPassword);
    }

    if (updates.newUsername) {
      fields.push("username = ?");
      values.push(updates.newUsername);
    }

    if (fields.length === 0) throw new Error("No valid fields to update");

    values.push(username);

    const stmt = db.prepare(`UPDATE users SET ${fields.join(", ")} WHERE username = ?`);
    const result = stmt.run(...values);

    if (result.changes === 0) throw new Error("User not found");
  } finally {
    db.close();
  }
}

export function getDB() {
  if (!db) {
    db = new Database(env.dbFile);
  }
  return db;
}

export async function initDB() {
  //const db = new Database(dbPath);
  const db = new Database(env.dbFile);

  db.prepare(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT NOT NULL,
      UNIQUE(username, email),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  db.prepare(`
    CREATE TABLE IF NOT EXISTS match_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      id_winner INTEGER NOT NULL,
      id_loser INTEGER NOT NULL,
      winner_points INTEGER DEFAULT 0,
      loser_points INTEGER DEFAULT 0,
      FOREIGN KEY (id_winner) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (id_loser) REFERENCES users(id) ON DELETE CASCADE
    )
  `).run();

  const releaseList = [
    ["bot", "bot_passwordwdajhiduwhawuidhawiudwaudawiduhawuiawduhawudbkdaygdbuighbuygst", "bot@gmail.com"],
  ];

  const insertStmt = db.prepare("INSERT OR IGNORE INTO users (username, password, email) VALUES (?, ?, ?)");
  for (const [username, password, email] of releaseList) {
    const hashedPassword = await hashPassword(password);
    insertStmt.run(username, hashedPassword, email);
  }

  console.log(db.prepare("SELECT * FROM users").all());

  return db;
}

export async function addUser(username, password, email) {
  //const db = new Database(dbPath);
  const db = new Database(env.dbFile);
  try {
    const hashedPassword = await hashPassword(password);
    const stmt = db.prepare("INSERT OR REPLACE INTO users (username, password, email) VALUES (?, ?, ?)");
    const result = stmt.run(username, hashedPassword, email);
    console.log(`User '${username}' added with ID ${result.lastInsertRowid}`);
  } finally {
    db.close();
  }
}

// Run init if file executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initDB();
}
