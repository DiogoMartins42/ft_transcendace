import bcrypt from "bcrypt";

export default async function routes(fastify, opts) {
    const db = fastify.db;

    fastify.post('/register', async (request, reply) => {
        //To Do: Handle registration
        const { username, email, password } = request.body;

        if (!username || !email || !password) {
            return reply.status(400).send({ error: "Missing fields!" });
        }

        const userExists = db
            .prepare("SELECT id FROM users WHERE email = ?")
            .get(email);
        
        if (userExists) {
            return reply.status(409).send({ error: "Email already registered"})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const stmt = db.prepare(`
            INSERT INTO users (username, email, password)
            VALUES (?, ?, ?)
        `);

        const result = stmt.run(username, email, hashedPassword);

        return reply.status(201).send({ message: "User Created", userId: result.lastInsertRowid});

    });

    fastify.post('/login', async (request, reply) => {
        //To Do: Handle login
        const { email, password} = request.body;

        if (!email || !password){
            return reply.status(400).send({ error: "Missing email or password!"})
        }

        const user = db
            .prepare("SELECT id, password FROM users WHERE email = ?")
            .get(email);
        
        if (!user) {
            return reply.status(401).send({error : "Invalid email or password!"})
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return reply.status(401).send({error : "Invalid email or password!"})
        }

        const token = fastify.jwt.sign({userId: user.id});

        return reply.send({ token });
    });
}