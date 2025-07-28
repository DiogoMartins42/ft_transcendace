// To set up the database 
// run 'npm install sqlite3'

const sqlite3 = require('sqlite3').verbose();

// Connect to (or create) the database
const db = new sqlite3.Database('sqlite.db');

// Create the table
db.serialize(() => {
  // Create the table only if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      release_year INTEGER UNIQUE,       -- avoid duplicates
      release_name TEXT,
      city TEXT,
      UNIQUE(release_year, release_name) -- avoid duplicates only if both are duplicates
    )
  `);

  const releaseList = [
    [1997, "Grand Theft Auto", "state of New Guernsey"],
    [1999, "Grand Theft Auto", "Anywhere, USA"],
    [2001, "Grand Theft Auto III", "Liberty City"],
    [2002, "Grand Theft Auto: Vice City", "Vice City"],
    [2004, "Grand Theft Auto: San Andreas", "state of San Andreas"],
    [2008, "Grand Theft Auto IV", "Liberty City"],
    [2013, "Grand Theft Auto V", "Los Santos"],
    [2008, "Grand Theft Auto IVAWDdawdawdawdawdawdawd", "Liberty City"],
  ];

  // Insert data -- Use INSERT OR IGNORE to avoid inserting duplicates
  const stmt = db.prepare("INSERT OR IGNORE INTO users (release_year, release_name, city) VALUES (?, ?, ?)");      //IGNORES if already exists


  //const stmt = db.prepare("INSERT OR REPLACE INTO users (release_year, release_name, city) VALUES (?, ?, ?)");  //REPLACES if already exists
                                                                                                                  //The IDs will change, it will delete and insert, not update

  releaseList.forEach(game => {
    stmt.run(game);
  });
  stmt.finalize();

  db.each("SELECT * FROM users", (err, row) => {
    if (err) throw err;
    console.log(row);
  });
});

db.close();