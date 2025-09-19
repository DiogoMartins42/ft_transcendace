const fastify = require('fastify')({ logger: true });
const path = require('path');
const { getUserInfo, createUser, incrementLosses, incrementWins, updateUserInfo } = require('./init.js');
const { addMatchResult } = require("./match_history.js");

const Database = require('better-sqlite3');
const dbPath = path.join(__dirname, 'sqlite.db');

// Register fastify-static to serve static files from frontend
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, '../frontend/for_copy/src/pages'),
  prefix: '/',
});

// Also serve stats.html at the root
fastify.register(require('@fastify/static'), {
  root: path.join(__dirname, '../frontend/for_copy/src/pages'),
  prefix: '/stats',
  decorateReply: false
});

// API endpoint to get user stats (username, email, wins, losses)
fastify.get('/api/user-stats', async (request, reply) => {
  const username = request.query.username || "test";

  try {
    const userData = getUserInfo(username);
    return userData;
  }
  catch (err) {
    if (err.message === "User not found") {
      reply.code(404).send({ error: err.message });
    } else {
      reply.code(500).send({ error: "Database error" });
    }
  }
});

// Get the match history
fastify.get("/api/matches/:username", async (request, reply) => {
  const { username } = request.params;

  const db = new Database(dbPath);

  try {
    // find the user id first
    const user = db.prepare("SELECT id FROM users WHERE username = ?").get(username);
    if (!user) {
      return reply.code(404).send({ error: `User '${username}' not found` });
    }

    // run the query
    const matches = db.prepare(`
      SELECT 
        match_history.id,
        users_winner.username AS winner,
        users_loser.username AS loser
      FROM match_history
      INNER JOIN users AS users_winner ON match_history.id_winner = users_winner.id
      INNER JOIN users AS users_loser ON match_history.id_loser = users_loser.id
      WHERE match_history.id_winner = ? OR match_history.id_loser = ?
      ORDER BY match_history.id DESC
    `).all(user.id, user.id);

    return { matches };
  }
  catch (err){
    return reply.code(500).send({ error: err.message });
  }
  finally{
    db.close();
  }
});


fastify.post('/api/create-user', async (request, reply) => {
  try {
    const userData = request.body;
    await createUser(userData)
  } 
  catch (err) {
    if (err.message === "Coudln't create user") {
      reply.code(404).send({ error: err.message });
    } else {
      reply.code(500).send({ error: err.message });
    }
  }
});

// Increment wins by 1
fastify.post('/api/user/:username/win', async (request, reply) => {
  const { username } = request.params;
  try {
    incrementWins(username);
    return { message: `Win added for ${username}` };
  }
  catch (err) {
    reply.code(404).send({ error: err.message });
  }
});

// Increment losses by 1
fastify.post('/api/user/:username/loss', async (request, reply) => {
  const { username } = request.params;
  try {
    incrementLosses(username);
    return { message: `Loss added for ${username}` };
  }
  catch (err) {
    reply.code(404).send({ error: err.message });
  }
});

// expects match results, {winner: "username_winner", loser: "username_loser"}
fastify.post("/api/match", async (request, reply) => {
  const { winner, loser } = request.body; 

  try {
    const result = addMatchResult(winner, loser);
    return result; // { message: "Match saved successfully" }
  } catch (err) {
    reply.code(400).send({ error: err.message });
  }
});

fastify.patch('/api/user/:username', async (request, reply) => {
  const { username } = request.params;
  const updates = request.body; // {email, password, wins, losses, newUsername}

  try {
    await updateUserInfo(username, updates);
    return {message: `User '${username}' updated successfully`};
  }
  catch (err) {
    reply.code(400).send({error: err.message});
  }
});


// Start the server
const start = async () => {
  try {
    await fastify.listen({ port: 3080, host: '0.0.0.0'});
    console.log(`Server running at http://localhost:3080`);
    console.log(`API endpoint: http://localhost:3080/api/user-stats?username=test`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
