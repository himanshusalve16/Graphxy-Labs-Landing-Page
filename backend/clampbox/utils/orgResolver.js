const { db } = require('../../../db/clampbox/db');
const { organizations } = require('../../../db/clampbox/schema/schema');

function isValidUuid(id) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}

async function resolveOrganizationId(orgIdInput) {
  if (orgIdInput && isValidUuid(orgIdInput)) {
    return orgIdInput;
  }

  try {
    const list = await db
      .select({ id: organizations.id })
      .from(organizations)
      .limit(1);

    if (list.length > 0) {
      return list[0].id;
    }

    const [inserted] = await db
      .insert(organizations)
      .values({
        name: 'Default Org',
        slug: 'default-org',
        plan: 'free',
        clampboxEnabled: true,
        settingsJson: {
          defaultAction: 'allow',
          extensionSyncInterval: 300,
          auditRetentionDays: 90,
          alertThreshold: 'high'
        }
      })
      .returning({ id: organizations.id });

    return inserted.id;
  } catch (error) {
    console.error('[Org Resolver] Error resolving org ID:', error.message);
    return '00000000-0000-0000-0000-000000000000';
  }
}

module.exports = { resolveOrganizationId, isValidUuid };
