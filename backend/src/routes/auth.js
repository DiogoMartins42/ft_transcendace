import bcrypt from "bcrypt";

export default async function routes(fastify, opts) {
  const db = fastify.db;

  // --- REGISTER ---
  fastify.post("/register", async (request, reply) => {
    const { username, email, password } = request.body;

    if (!username || !email || !password) {
      return reply.status(400).send({ error: "Missing fields!" });
    }

    const userExists = db
      .prepare("SELECT id FROM users WHERE email = ?")
      .get(email);

    if (userExists) {
      return reply.status(409).send({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const stmt = db.prepare(`
      INSERT INTO users (username, email, password)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(username, email, hashedPassword);

    // ✅ Fix: Use consistent field name "id" instead of "userId"
    const token = fastify.jwt.sign({ 
      id: result.lastInsertRowid,  // ← Change from userId to id
      username: username,          // ← Also include username for better debugging
      email: email
    });

    return reply.status(201).send({
      token,
      user: {
        id: result.lastInsertRowid,
        username,
        email,
      },
    });
  });

  // --- LOGIN ---
  fastify.post("/login", async (request, reply) => {
    const { email, password } = request.body;

    if (!email || !password) {
      return reply.status(400).send({ error: "Missing email or password!" });
    }

    const user = db
      .prepare("SELECT id, username, email, password FROM users WHERE email = ?")
      .get(email);

    if (!user) {
      return reply.status(401).send({ error: "Invalid email or password!" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return reply.status(401).send({ error: "Invalid email or password!" });
    }

    // ✅ Fix: Use consistent field name "id" instead of "userId"
    const token = fastify.jwt.sign({ 
      id: user.id,           // ← Change from userId to id
      username: user.username, // ← Include username
      email: user.email
    });

    return reply.send({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  });

  // --- VERIFY TOKEN / SESSION ---
  fastify.get(
    "/me",
    { preValidation: [fastify.authenticate] },
    async (request, reply) => {
      // ✅ Fix: Now use request.user.id instead of request.user.userId
      const userId = request.user.id;

      const user = db
        .prepare("SELECT id, username, email FROM users WHERE id = ?")
        .get(userId);

      if (!user) {
        return reply.status(404).send({ error: "User not found" });
      }

      return reply.send(user);
    }
  );
}