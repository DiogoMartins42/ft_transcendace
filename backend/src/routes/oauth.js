import { OAuth2Client } from 'google-auth-library';
import env from '../config/env.js';
import bcrypt from 'bcrypt';

// Dynamic URL generation for local network
const getBackendBaseUrl = (request) => {
  const host = request?.headers?.host || 'pongpong.duckdns.org:3000';
  return `https://${host}`;
};

const getFrontendUrl = (request) => {
  const host = request?.headers?.host || 'pongpong.duckdns.org:3000';
  const domain = host.split(':')[0]; // Remove port
  return `https://${domain}${domain.includes(':') ? '' : ':3000'}`;
};

export default async function routes(fastify, opts) {
  const db = fastify.db;
  
  // Check if Google OAuth is configured
  const isOAuthConfigured = env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET;
  
  console.log('🔐 OAuth Initialization:', {
    isOAuthConfigured,
    hasClientId: !!env.GOOGLE_CLIENT_ID,
    hasClientSecret: !!env.GOOGLE_CLIENT_SECRET
  });
  
  if (!isOAuthConfigured) {
    console.warn('⚠️ Google OAuth not configured. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env');
  }
  
  // OAuth client will be configured per request with dynamic redirect URI
  let googleClient = null;

  // Generate Google OAuth URL
  fastify.get("/google", async (request, reply) => {
    console.log('🚀 /oauth/google endpoint hit');
    
    if (!isOAuthConfigured) {
      console.error('❌ OAuth not configured when /google endpoint was called');
      return reply.status(501).send({ error: "Google OAuth not configured" });
    }

    try {
      const backendBaseUrl = getBackendBaseUrl(request);
      const redirectUri = `${backendBaseUrl}/oauth/google/callback`;
      
      console.log('🔗 Dynamic OAuth Configuration:', {
        backendBaseUrl,
        redirectUri,
        host: request.headers.host
      });

      // Create OAuth client with dynamic redirect URI
      googleClient = new OAuth2Client(
        env.GOOGLE_CLIENT_ID,
        env.GOOGLE_CLIENT_SECRET,
        redirectUri
      );

      const authUrl = googleClient.generateAuthUrl({
        access_type: 'offline',
        scope: [
          'https://www.googleapis.com/auth/userinfo.profile',
          'https://www.googleapis.com/auth/userinfo.email'
        ],
        prompt: 'consent'
      });

      console.log('✅ Generated OAuth URL, redirecting to Google');
      console.log('🔗 Auth URL:', authUrl);
      
      reply.redirect(authUrl);
    } catch (error) {
      console.error('❌ Error generating auth URL:', error);
      return reply.status(500).send({ error: "Failed to generate OAuth URL" });
    }
  });

  // Google OAuth callback
  fastify.get("/google/callback", async (request, reply) => {
    console.log('🔄 /oauth/google/callback endpoint hit');
    console.log('📋 Query parameters:', request.query);
    console.log('🌐 Headers host:', request.headers.host);
    
    if (!isOAuthConfigured) {
      console.error('❌ OAuth not configured when callback was called');
      return reply.status(501).send({ error: "Google OAuth not configured" });
    }

    const { code, error: googleError } = request.query;

    if (googleError) {
      console.error('❌ Google returned error:', googleError);
      const frontendUrl = getFrontendUrl(request);
      return reply.redirect(`${frontendUrl}/?error=google_error&message=${encodeURIComponent(googleError)}`);
    }

    if (!code) {
      console.error('❌ Missing authorization code in callback');
      const frontendUrl = getFrontendUrl(request);
      return reply.redirect(`${frontendUrl}/?error=missing_code`);
    }

    try {
      const backendBaseUrl = getBackendBaseUrl(request);
      const frontendUrl = getFrontendUrl(request);
      const redirectUri = `${backendBaseUrl}/oauth/google/callback`;
      
      console.log('🔄 OAuth Callback Configuration:', {
        backendBaseUrl,
        frontendUrl,
        redirectUri
      });

      // Create OAuth client with the same redirect URI used in the initial request
      const googleClient = new OAuth2Client(
        env.GOOGLE_CLIENT_ID,
        env.GOOGLE_CLIENT_SECRET,
        redirectUri
      );

      console.log('🔄 Exchanging code for tokens...');
      const { tokens } = await googleClient.getToken(code);
      console.log('✅ Tokens received:', tokens ? 'yes' : 'no');
      
      if (!tokens.id_token) {
        throw new Error("No ID token in response");
      }

      console.log('🔄 Verifying ID token...');
      const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token,
        audience: env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      console.log('✅ Google payload received:', {
        email: payload.email,
        name: payload.name,
        googleId: payload.sub
      });
      
      const { sub: googleId, email, name: username, picture } = payload;

      if (!email) {
        throw new Error("Email not provided by Google");
      }

      // Check if user exists
      let user = db
        .prepare("SELECT id, username, email, avatar_url FROM users WHERE email = ? OR google_id = ?")
        .get(email, googleId);

      console.log('👤 User lookup result:', user ? `exists (id: ${user.id})` : 'new user');

      if (!user) {
        console.log('🆕 Creating new user...');
        // Create new user with Google OAuth
        const stmt = db.prepare(`
          INSERT INTO users (username, email, password, google_id, avatar_url, email_verified)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        
        // Generate a random password for OAuth users (they won't use it)
        const randomPassword = await bcrypt.hash(Math.random().toString(36) + googleId, 10);
        
        const result = stmt.run(
          username || email.split('@')[0],
          email,
          randomPassword,
          googleId,
          picture || null,
          true
        );

        user = {
          id: result.lastInsertRowid,
          username: username || email.split('@')[0],
          email: email,
          avatar_url: picture || null
        };
        console.log('✅ New user created with id:', user.id);
      }

      // Generate JWT token
      const token = fastify.jwt.sign({
        id: user.id,
        username: user.username,
        email: user.email,
        avatar_url: user.avatar_url
      });

      console.log('✅ JWT token generated, redirecting to frontend...');
      console.log('🔑 Redirecting to:', `${frontendUrl}?token=${encodeURIComponent(token)}`);
      
      // Redirect to frontend with token
      return reply.redirect(`${frontendUrl}?token=${encodeURIComponent(token)}`);

    } catch (error) {
      console.error("❌ Google OAuth error:", error);
      console.error("❌ Error stack:", error.stack);
      const frontendUrl = getFrontendUrl(request);
      return reply.redirect(`${frontendUrl}/?error=oauth_failed&message=${encodeURIComponent(error.message)}`);
    }
  });

  // Get OAuth configuration for frontend
  fastify.get("/config", async (request, reply) => {
    console.log('🔧 /oauth/config endpoint hit');
    const config = {
      googleEnabled: isOAuthConfigured,
      googleClientId: env.GOOGLE_CLIENT_ID
    };
    console.log('📋 OAuth config response:', config);
    reply.send(config);
  });

  // OAuth status endpoint
  fastify.get("/status", async (request, reply) => {
    reply.send({
      oauth: {
        configured: isOAuthConfigured,
        clientId: env.GOOGLE_CLIENT_ID ? 'set' : 'missing',
        clientSecret: env.GOOGLE_CLIENT_SECRET ? 'set' : 'missing',
      },
      server: {
        time: new Date().toISOString(),
        nodeEnv: process.env.NODE_ENV
      }
    });
  });
}