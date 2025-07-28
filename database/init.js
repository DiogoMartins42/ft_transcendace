// To set up the database 
// run 'npm install sqlite3'
// run ''

const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto'); // For hashing passwords

// Hashing function using SHA-256
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function checkPassword(plainPassword, hashedPassword) {
  return hashPassword(plainPassword) === hashedPassword;
}

function initDB() {
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

    //Testing the database
    db.each("SELECT * FROM users", (err, row) => {
      if (err) throw err;
      console.log(row);

      if (row.username === 'test') {
        const inputPassword = 'test_password';
        const isCorrect = checkPassword(inputPassword, row.password);
        console.log(`Password check for user '${row.username}': ${isCorrect ? 'Successful' : 'Unsuccessful'}`);
      }
      if (row.username === 'rcruz-an') {
        const inputPassword = 'a_wrong_password';
        const isCorrect = checkPassword(inputPassword, row.password);
        console.log(`Password check for user '${row.username}': ${isCorrect ? 'Successful' : 'Unsuccessful'}`);
      }
    });
  });

  db.close();
}

// Function to add a single user to the DB
function addUser(username, password, email) {
  const db = new sqlite3.Database('sqlite.db');

  const hashedPassword = hashPassword(password); // Hash the password before inserting

  const stmt = db.prepare(
    "INSERT OR REPLACE INTO users (username, password, email) VALUES (?, ?, ?)"
  ); // REPLACES if already exists — IDs will change

  stmt.run(username, hashedPassword, email, function (err) {
    if (err) {
      console.error("Error inserting user:", err.message);
    } else {
      console.log(`User '${username}' added with ID ${this.lastID}`);
    }
  });

  //This will print the everything on the "user" table 
  /* db.each("SELECT * FROM users", (err, row) => {
      if (err) throw err;
      console.log(row);
  }); */
  
  stmt.finalize();
  db.close();
}

module.exports = {
  initDB,
  addUser,
  checkPassword,
  hashPassword
};

//initDB(); For testing only