const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, 'sqlite.db');


function addMatchResult(username_winner, username_loser, winner_points, loser_points) {
  const db = new Database(dbPath);
  try {
    // Look up winner ID and loser ID
    let winner = db.prepare("SELECT id FROM users WHERE username = ?").get(username_winner);
    let loser = db.prepare("SELECT id FROM users WHERE username = ?").get(username_loser);
    
    if (!winner && !loser){
        throw new Error(`Usernames: '${(username_winner)}' and '${(username_loser)}' ' not found`)
    }

    // Default to bot if 1 user is not found
    if (!winner || !loser){
        const bot = db.prepare("SELECT id FROM users WHERE username = 'bot'").get();
        if (!bot) {
          throw new Error("Bot user not initialized in DB");
        }
        if (!winner) {
          winner = bot;
        }
        else{
          loser = bot;
        }
    }

    // Insert into match_history
    db.prepare(`
      INSERT INTO match_history (id_winner, id_loser, winner_points, loser_points)
      VALUES (?, ?, ?, ?)
    `).run(winner.id, loser.id, winner_points, loser_points);

    return { message: "Match saved successfully" };
  }
  finally{
    db.close();
  }
}

module.exports = {addMatchResult};