// To set up the database 
// run 'npm install sqlite3'
// run ''
// run 'npm install bcrypt'

// Import SQLite3
const sqlite3 = require('sqlite3').verbose();

// Import bcrypt for password hashing
// Use bcryptjs if bcrypt install fails
const bcrypt = require('bcrypt'); // or: require('bcryptjs');

// Number of salt rounds for bcrypt hashing
const saltRounds = 10;

// Function to hash passwords
async function hashPassword(password) {
  try {
    // Generate a salt and hash the password
    const hashed = await bcrypt.hash(password, saltRounds);
    return hashed;
  } catch (err) {
    console.error("Error hashing password:", err);
    throw err;
  }
}

// Verifies if the password is correct
async function checkPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

// Get the hashed password from the database
function getHashedPassword(username) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database('sqlite.db');
    db.get(
      'SELECT password FROM users WHERE username = ?', [username],
      (err, row) => {
        db.close();
        if (err)
          return reject(err);
        if (!row)
          return reject(new Error('User not found'));
        resolve(row.password);
      }
    );
  });
}

// Check if the password is valid
async function verifyUserPassword(username, inputPassword) {
  try {
    const hashedPassword = await getHashedPassword(username);
    const isCorrect = await checkPassword(inputPassword, hashedPassword);
    console.log(`Password for ${username} is ${isCorrect ? 'correct' : 'incorrect'}`);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Fetch user info (excluding password)
function getUserInfo(username) {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database("sqlite.db");

    db.get(
      "SELECT username, email, wins, losses FROM users WHERE username = ?",
      [username],
      (err, row) => {
        db.close();
        if (err) {
          return reject(err);
        }
        if (!row) {
          return reject(new Error("User not found"));
        }
        resolve(row);
      }
    );
  });
}

// Init the Database
async function initDB() {
  const db = new sqlite3.Database('sqlite.db');

  db.serialize(async () => {
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        email TEXT,
        wins INTEGER DEFAULT 0,
        losses INTEGER DEFAULT 0,
        UNIQUE(username, password)
      )
    `);

    const releaseList = [
      ["test", "test_password", "test_email@gmail.com"],
      ["rcruz-an", "rcruz_password", "my_email@gmail.com"]
    ];

    const stmt = db.prepare("INSERT OR IGNORE INTO users (username, password, email) VALUES (?, ?, ?)");

    for (const [username, password, email] of releaseList){
      const hashedPassword = await hashPassword(password);
      stmt.run(username, hashedPassword, email);

      // Checking if the password is correct
      //const isCorrect = await checkPassword("test_password", hashedPassword);
      //console.log(`Password check for user '${username}': ${isCorrect ? 'Successful' : 'Unsuccessful'}`);
    }

    stmt.finalize(() => {
      // Debug: print all users after insertions
      db.each("SELECT * FROM users", (err, row) => {
        if (err) throw err;
        console.log(row);
      }, () => {
        // Close DB only after all queries finish
        db.close();
      });
    });
  });
}


// Function to add a single user
async function addUser(username, password, email) {
  const db = new sqlite3.Database('sqlite.db');
  const hashedPassword = await hashPassword(password);

  const stmt = db.prepare("INSERT OR REPLACE INTO users (username, password, email) VALUES (?, ?, ?)");
  stmt.run(username, hashedPassword, email, function (err) {
    if (err) {
      console.error("Error inserting user:", err.message);
    } else {
      console.log(`User '${username}' added with ID ${this.lastID}`);
    }
  });

  stmt.finalize();
  db.close();
}

// Run initialization when script is executed directly
if (require.main === module) {
  initDB();
}

// Export functions for use in other files
module.exports = {addUser, hashPassword, initDB, verifyUserPassword, getUserInfo};
