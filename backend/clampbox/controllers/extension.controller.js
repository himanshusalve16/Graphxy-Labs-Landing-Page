const { db } = require('../../../db/clampbox/db');
const { extensionSessions, users } = require('../../../db/clampbox/schema/schema');
const { eq, and } = require('drizzle-orm');

async function resolveDefaultUserId() {
  try {
    const list = await db.select({ id: users.id }).from(users).limit(1);
    if (list.length > 0) {
      return list[0].id;
    }

    const [inserted] = await db
      .insert(users)
      .values({
        email: 'admin@graphxylabs.dev',
        name: 'Admin Developer',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning({ id: users.id });
    
    return inserted.id;
  } catch (err) {
    console.error('[User Resolver] Error resolving user ID:', err.message);
    return '00000000-0000-0000-0000-000000000000';
  }
}

exports.ping = async (req, res) => {
  const { installationId, extensionVersion = '1.0.0', browser = 'Chrome', platform = 'Windows' } = req.body;
  const organizationId = req.organizationId; // Set by gatewayAuth middleware

  if (!installationId) {
    return res.status(400).json({ success: false, error: 'installationId is required.' });
  }

  try {
    const userId = await resolveDefaultUserId();

    // Check if session already exists
    const sessions = await db
      .select()
      .from(extensionSessions)
      .where(
        and(
          eq(extensionSessions.organizationId, organizationId),
          eq(extensionSessions.installationId, installationId)
        )
      );

    if (sessions.length > 0) {
      // Update session last seen
      await db
        .update(extensionSessions)
        .set({
          extensionVersion,
          browser,
          platform,
          lastSeenAt: new Date(),
          status: 'active'
        })
        .where(eq(extensionSessions.id, sessions[0].id));
    } else {
      // Create new session
      await db
        .insert(extensionSessions)
        .values({
          organizationId,
          userId,
          installationId,
          extensionVersion,
          browser,
          platform,
          status: 'active',
          lastSeenAt: new Date(),
          createdAt: new Date()
        });
    }

    res.status(200).json({ success: true, message: 'Extension session recorded.' });
  } catch (error) {
    console.error('[Extension Controller] Ping error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to record extension session.' });
  }
};
