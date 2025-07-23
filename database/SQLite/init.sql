CREATE TABLE IF NOT EXISTS usersTestingNewTable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
);

--INSERT INTO users (username, password) VALUES ('admin', 'securepassword');

--DROP TABLE users;