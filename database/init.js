// To set up the database 
// run 'npm install sqlite3'
// run ''

const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto'); // For hashing passwords

// Hashing function using SHA-256
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Connect to (or create) the database
const db = new sqlite3.Database('sqlite.db');

// Create the table
db.serialize(() => {
  // Create the table only if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,       -- avoid duplicates
      password TEXT,
      email TEXT,
      UNIQUE(username, password) -- avoid duplicates only if both are duplicates
    )
  `);

  const releaseList = [
    ["test", "test_password", "test_email@gmail.com"],
    ["rcruz-an", "rcruz_password", "my_email@gmail.com"]
  ];

  // Insert data -- Use INSERT OR IGNORE to avoid inserting duplicates
  const stmt = db.prepare("INSERT OR IGNORE INTO users (username, password, email) VALUES (?, ?, ?)");      //IGNORES if already exists

  //const stmt = db.prepare("INSERT OR REPLACE INTO users (username, password, email) VALUES (?, ?, ?)");  //REPLACES if already exists
                                                                                                          //The IDs will change, it will delete and insert, not update

  releaseList.forEach(([username, password, email]) => {
    const hashedPassword = hashPassword(password); // Hash the password before inserting
    stmt.run(username, hashedPassword, email);
  });

  stmt.finalize();

  db.each("SELECT * FROM users", (err, row) => {
    if (err) throw err;
    console.log(row);
  });
});

db.close();
