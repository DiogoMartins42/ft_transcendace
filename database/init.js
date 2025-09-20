const Database = require('better-sqlite3');
const bcrypt = require('bcrypt');
const path = require('path');
const saltRounds = 10;

// Get the correct database path
const dbPath = path.join(__dirname, 'sqlite.db');

// Verifies if the password is correct
async function checkPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// Function to hash passwords
async function hashPassword(password) {
  try {
    const hashed = await bcrypt.hash(password, saltRounds);
    return hashed;
  } catch (err) {
    console.error("Error hashing password:", err);
    throw err;
  }
}

// Fetch user info (excluding password)
function getUserInfo(username) {
  const db = new Database(dbPath);
  try {
    //const stmt = db.prepare('SELECT username, email, wins, losses FROM users WHERE username = ?');
    const stmt = db.prepare('SELECT username, email FROM users WHERE username = ?');
    const row = stmt.get(username);
    if (!row) throw new Error('User not found');
    return row;
  } finally {
    db.close();
  }
}

//Create a user and add it to the database
async function createUser(newUser) {
  const db = new Database(dbPath)
  try{
    const insertStmt = db.prepare("INSERT OR IGNORE INTO users (username, password, email) VALUES (?, ?, ?)");

    const hashedPassword = await hashPassword(newUser.password);
    insertStmt.run(newUser.username, hashedPassword, newUser.email);
  }
  finally{
    db.close();
  }
}

// Increment wins
function incrementWins(username) {
  const db = new Database(dbPath);
  try {
    const stmt = db.prepare("UPDATE users SET wins = wins + 1 WHERE username = ?");
    const result = stmt.run(username);
    if (result.changes === 0) throw new Error("User not found");
  } finally {
    db.close();
  }
}

// Increment losses
function incrementLosses(username) {
  const db = new Database(dbPath);
  try {
    const stmt = db.prepare("UPDATE users SET losses = losses + 1 WHERE username = ?");
    const result = stmt.run(username);
    if (result.changes === 0) throw new Error("User not found");
  } finally {
    db.close();
  }
}

// Update user info (username, email, password, wins, losses)
async function updateUserInfo(username, updates) {
  const db = new Database(dbPath);
  try {
    const fields = [];
    const values = [];

    // Handle each updatable field
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

    if (fields.length === 0) {
      throw new Error("No valid fields to update");
    }

    values.push(username); // WHERE username = ?

    const stmt = db.prepare(`UPDATE users SET ${fields.join(", ")} WHERE username = ?`);
    const result = stmt.run(...values);

    if (result.changes === 0) {
      throw new Error("User not found");
    }
  } finally {
    db.close();
  }
}


// Init the Database
async function initDB() {
  const db = new Database(dbPath);

  try {
    // Create table
    db.prepare(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT NOT NULL,
        UNIQUE(username, email)
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
      ["bot", "bot_passwordwdajhiduwhawuidhawiudwaudawiduhawuiawduhawudbkdaygdbuighbuygst", "bot@gmail.com"]
    ];

    const insertStmt = db.prepare("INSERT OR IGNORE INTO users (username, password, email) VALUES (?, ?, ?)");

    for (const [username, password, email] of releaseList) {
      const hashedPassword = await hashPassword(password);
      insertStmt.run(username, hashedPassword, email);
    }

    // Debug: print all users
    const rows = db.prepare("SELECT * FROM users").all();
    console.log(rows);
    
  } finally {
    db.close();
  }
}

// Function to add a single user - UPDATED PATH
async function addUser(username, password, email) {
  const db = new Database(dbPath);
  try {
    const hashedPassword = await hashPassword(password);
    const stmt = db.prepare("INSERT OR REPLACE INTO users (username, password, email) VALUES (?, ?, ?)");
    const result = stmt.run(username, hashedPassword, email);
    console.log(`User '${username}' added with ID ${result.lastInsertRowid}`);
  } finally {
    db.close();
  }
}

// Run initialization when script is executed directly
if (require.main === module) {
  initDB();
}

// Export functions for use in other files
module.exports = {addUser, hashPassword, initDB, getUserInfo, checkPassword, createUser, incrementWins, incrementLosses, updateUserInfo};
