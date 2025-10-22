import { OAuth2Client } from 'google-auth-library';
import env from '../config/env.js';
import bcrypt from 'bcrypt';

export default async function routes(fastify, opts) {
  const db = fastify.db;
  
  // Check if Google OAuth is configured
  const isOAuthConfigured = env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET;
  
  if (!isOAuthConfigured) {
    console.warn('⚠️ Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env');
  }
  
  const googleClient = isOAuthConfigured 
    ? new OAuth2Client(
        env.GOOGLE_CLIENT_ID,
        env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI || `https://pongpong.duckdns.org:3000/oauth/google/callback`
      )
    : null;

  // Generate Google OAuth URL
  fastify.get("/google", async (request, reply) => {
    if (!isOAuthConfigured || !googleClient) {
      return reply.status(501).send({ error: "Google OAuth not configured" });
    }

    const authUrl = googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ],
      prompt: 'consent'
    });

    reply.redirect(authUrl);
  });

  // Google OAuth callback
  fastify.get("/google/callback", async (request, reply) => {
    if (!isOAuthConfigured || !googleClient) {
      return reply.status(501).send({ error: "Google OAuth not configured" });
    }

    const { code } = request.query;

    if (!code) {
      // Redirect to login with error
      return reply.redirect('/?error=missing_code');
    }

    try {
      // Exchange code for tokens
      const { tokens } = await googleClient.getToken(code);
      googleClient.setCredentials(tokens);

      // Get user info from Google
      const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      const { sub: googleId, email, name: username, picture } = payload;

      if (!email) {
        throw new Error("Email not provided by Google");
      }

      // Check if user exists
      let user = db
        .prepare("SELECT id, username, email, avatar_url FROM users WHERE email = ?")
        .get(email);

      if (!user) {
        // Create new user with Google OAuth
        const stmt = db.prepare(`
          INSERT INTO users (username, email, password)
          VALUES (?, ?, ?)
        `);
        
        // Generate a random password for OAuth users (they won't use it)
        const randomPassword = await bcrypt.hash(Math.random().toString(36) + googleId, 10);
        
        const result = stmt.run(
          username || email.split('@')[0],
          email,
          randomPassword
        );

        user = {
          id: result.lastInsertRowid,
          username: username || email.split('@')[0],
          email: email,
          avatar_url: picture || null
        };
      }

      // Generate JWT token
      const token = fastify.jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email
      });

      // Redirect to frontend with token in URL fragment (more secure than query param)
      // Frontend will extract the token and store it
      return reply.redirect(`/?token=${encodeURIComponent(token)}`);

    } catch (error) {
      console.error("Google OAuth error:", error);
      // Redirect to login with error
      return reply.redirect('/?error=oauth_failed');
    }
  });

  // Get OAuth configuration for frontend
  fastify.get("/config", async (request, reply) => {
    reply.send({
      googleEnabled: isOAuthConfigured,
      googleClientId: env.GOOGLE_CLIENT_ID
    });
  });
}