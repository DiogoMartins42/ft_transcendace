// routes/block.js
export default async function (fastify, opts) {
  // Block a user
  fastify.post('/block', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    console.log('🔐 AUTHENTICATED USER:', request.user);
    console.log('📦 REQUEST BODY:', request.body);

    const { blockedUserId } = request.body;
    
    // Check if user ID exists in JWT
    if (!request.user || !request.user.id) {
      console.error('❌ JWT MISSING USER ID:', request.user);
      return reply.status(401).send({ error: 'Invalid authentication: missing user ID' });
    }
    
    const userId = request.user.id;

    console.log('🚫 BLOCK REQUEST - User ID:', userId, 'Blocked User ID:', blockedUserId);

    if (!blockedUserId) {
      console.log('❌ Missing blockedUserId');
      return reply.status(400).send({ error: 'blockedUserId is required' });
    }

    // Prevent self-blocking
    if (userId === blockedUserId) {
      console.log('❌ Self-block attempt');
      return reply.status(400).send({ error: 'Cannot block yourself' });
    }

    try {
      // Check if target user exists
      const targetUser = fastify.db.prepare(`
        SELECT id FROM users WHERE id = ?
      `).get(blockedUserId);

      if (!targetUser) {
        console.log('❌ Target user not found:', blockedUserId);
        return reply.status(404).send({ error: 'User not found' });
      }

      // Check if already blocked
      const existing = fastify.db.prepare(`
        SELECT 1 FROM blocked_users 
        WHERE user_id = ? AND blocked_user_id = ?
      `).get(userId, blockedUserId);

      if (existing) {
        console.log('❌ Already blocked:', { userId, blockedUserId });
        return reply.status(409).send({ error: 'User already blocked' });
      }

      // Add block
      console.log('📝 Inserting block into database...');
      const result = fastify.db.prepare(`
        INSERT INTO blocked_users (user_id, blocked_user_id)
        VALUES (?, ?)
      `).run(userId, blockedUserId);

      console.log('✅ Block successful, changes:', result.changes);
      return { 
        success: true, 
        message: 'User blocked successfully',
        blockedUserId 
      };
    } catch (error) {
      console.error('❌ BLOCK ERROR:', error);
      console.error('Error details:', error.message);
      return reply.status(500).send({ 
        error: 'Internal server error',
        details: error.message 
      });
    }
  });
}