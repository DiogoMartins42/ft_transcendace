// routes/block.js
export default async function (fastify, opts) {
  // Block a user
  fastify.post('/block', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    console.log('🔐 AUTHENTICATED USER OBJECT:', request.user);

    const { blockedUserId } = request.body;
    
    // ✅ More robust user ID extraction
    let userId = request.user.id;
    
    // Fallback: try userId field if id doesn't exist
    if (!userId && request.user.userId) {
      console.log('⚠️ Using userId field instead of id');
      userId = request.user.userId;
    }
    
    // Final fallback: get from database using username
    if (!userId && request.user.username) {
      console.log('⚠️ Fetching user ID from database using username');
      const userFromDb = fastify.db.prepare('SELECT id FROM users WHERE username = ?').get(request.user.username);
      if (userFromDb) {
        userId = userFromDb.id;
        console.log('✅ Found user ID from username:', userId);
      }
    }

    if (!userId) {
      console.error('❌ Cannot determine user ID from JWT:', request.user);
      return reply.status(401).send({ 
        error: 'Cannot determine user identity',
        details: 'JWT token missing user ID' 
      });
    }

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

  // Unblock a user
  fastify.post('/unblock', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    const { blockedUserId } = request.body;
    
    // ✅ Same robust user ID extraction
    let userId = request.user.id;
    if (!userId && request.user.userId) userId = request.user.userId;
    if (!userId && request.user.username) {
      const userFromDb = fastify.db.prepare('SELECT id FROM users WHERE username = ?').get(request.user.username);
      if (userFromDb) userId = userFromDb.id;
    }

    if (!userId) {
      return reply.status(401).send({ error: 'Cannot determine user identity' });
    }

    console.log('✅ UNBLOCK REQUEST:', { userId, blockedUserId });

    if (!blockedUserId) {
      return reply.status(400).send({ error: 'blockedUserId is required' });
    }

    try {
      const result = fastify.db.prepare(`
        DELETE FROM blocked_users 
        WHERE user_id = ? AND blocked_user_id = ?
      `).run(userId, blockedUserId);

      console.log('✅ Unblock result, changes:', result.changes);

      if (result.changes === 0) {
        return reply.status(404).send({ error: 'Block relationship not found' });
      }

      return { 
        success: true, 
        message: 'User unblocked successfully',
        blockedUserId 
      };
    } catch (error) {
      console.error('❌ UNBLOCK ERROR:', error);
      return reply.status(500).send({ 
        error: 'Internal server error',
        details: error.message 
      });
    }
  });

  // Check if user is blocked
  fastify.get('/is-blocked/:userId', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    const targetUserId = parseInt(request.params.userId);
    
    // ✅ Same robust user ID extraction
    let userId = request.user.id;
    if (!userId && request.user.userId) userId = request.user.userId;
    if (!userId && request.user.username) {
      const userFromDb = fastify.db.prepare('SELECT id FROM users WHERE username = ?').get(request.user.username);
      if (userFromDb) userId = userFromDb.id;
    }

    if (!userId) {
      return reply.status(401).send({ error: 'Cannot determine user identity' });
    }

    console.log('🔍 BLOCK CHECK:', { userId, targetUserId });

    if (isNaN(targetUserId)) {
      return reply.status(400).send({ error: 'Invalid user ID' });
    }

    try {
      const block = fastify.db.prepare(`
        SELECT 1 FROM blocked_users 
        WHERE user_id = ? AND blocked_user_id = ?
        LIMIT 1
      `).get(userId, targetUserId);

      const isBlocked = !!block;
      console.log('🔍 Block status result:', { userId, targetUserId, isBlocked });

      return { isBlocked };
    } catch (error) {
      console.error('❌ BLOCK CHECK ERROR:', error);
      return reply.status(500).send({ 
        error: 'Internal server error',
        details: error.message 
      });
    }
  });
}