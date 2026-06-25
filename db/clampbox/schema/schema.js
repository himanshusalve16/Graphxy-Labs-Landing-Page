const { pgTable, uuid, text, timestamp, integer, boolean, jsonb } = require("drizzle-orm/pg-core");

// 1. Users
const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  name: text("name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 2. Organizations
const organizations = pgTable("organizations", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  plan: text("plan").default("free").notNull(),
  clampboxEnabled: boolean("clampbox_enabled").default(false).notNull(),
  settingsJson: jsonb("settings_json").default({}).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 3. Organization Members
const organizationMembers = pgTable("organization_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  role: text("role").notNull(), // owner, admin, security, developer, auditor, member
  status: text("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 4. Gateway Keys
const gatewayKeys = pgTable("gateway_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  keyHash: text("key_hash").unique().notNull(),
  keyFingerprint: text("key_fingerprint").notNull(),
  provider: text("provider"),
  environment: text("environment").default("production").notNull(),
  status: text("status").default("active").notNull(),
  lastUsedAt: timestamp("last_used_at"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  revokedAt: timestamp("revoked_at"),
});

// 5. Policies
const policies = pgTable("policies", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  enabled: boolean("enabled").default(true).notNull(),
  priority: integer("priority").default(100).notNull(),
  conditions: jsonb("conditions").notNull(), // { classifications: [...], minimumRiskScore: 70 }
  action: text("action").notNull(), // allow, warn, redact, block, log_only
  redaction: jsonb("redaction"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 6. Policy Assignments
const policyAssignments = pgTable("policy_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }).notNull(),
  policyId: uuid("policy_id").references(() => policies.id, { onDelete: "cascade" }).notNull(),
  gatewayKeyId: uuid("gateway_key_id").references(() => gatewayKeys.id, { onDelete: "set null" }),
  provider: text("provider"),
  source: text("source"), // extension, gateway
  environment: text("environment"),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  enabled: boolean("enabled").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 7. API Keys (Vault Entries)
const apiKeys = pgTable("api_keys", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }).notNull(),
  provider: text("provider").notNull(), // openai, anthropic, gemini, grok, perplexity
  label: text("label").notNull(),
  encryptedKey: text("encrypted_key").notNull(),
  keyFingerprint: text("key_fingerprint").notNull(),
  environment: text("environment").default("production").notNull(),
  status: text("status").default("active").notNull(),
  lastUsedAt: timestamp("last_used_at"),
  rotationDueAt: timestamp("rotation_due_at"),
  createdBy: uuid("created_by").references(() => users.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  revokedAt: timestamp("revoked_at"),
});

// 8. Audit Logs
const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  gatewayKeyId: uuid("gateway_key_id").references(() => gatewayKeys.id, { onDelete: "set null" }),
  extensionSessionId: uuid("extension_session_id"),
  eventType: text("event_type").notNull(), // prompt_inspected, policy_blocked, policy_redacted, etc.
  source: text("source").notNull(), // extension, gateway, dashboard_test
  provider: text("provider"),
  action: text("action"), // allow, warn, redact, block, log_only
  status: text("status").notNull(), // success, blocked, failed
  riskScore: integer("risk_score"),
  severity: text("severity"), // low, medium, high, critical
  labels: jsonb("labels"), // ["secret", "personal_data"]
  policyId: uuid("policy_id").references(() => policies.id, { onDelete: "set null" }),
  requestHash: text("request_hash"),
  responseHash: text("response_hash"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 9. Prompt Events
const promptEvents = pgTable("prompt_events", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }).notNull(),
  auditLogId: uuid("audit_log_id").references(() => auditLogs.id, { onDelete: "cascade" }),
  source: text("source").notNull(),
  provider: text("provider"),
  promptHash: text("prompt_hash").notNull(),
  promptLength: integer("prompt_length"),
  detectionCount: integer("detection_count").default(0).notNull(),
  detections: jsonb("detections"),
  classifications: jsonb("classifications"),
  redactionCount: integer("redaction_count").default(0).notNull(),
  decision: text("decision").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// 10. Waitlist
const waitlist = pgTable("waitlist", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull(),
  name: text("name"),
  company: text("company"),
  role: text("role"),
  teamSize: text("team_size"),
  useCase: text("use_case"),
  source: text("source"),
  status: text("status").default("new").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// 11. Extension Sessions
const extensionSessions = pgTable("extension_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  installationId: text("installation_id").notNull(),
  extensionVersion: text("extension_version").notNull(),
  browser: text("browser").notNull(),
  platform: text("platform"),
  status: text("status").default("active").notNull(),
  policyBundleVersion: text("policy_bundle_version"),
  lastSeenAt: timestamp("last_seen_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  revokedAt: timestamp("revoked_at"),
});

module.exports = {
  users,
  organizations,
  organizationMembers,
  gatewayKeys,
  policies,
  policyAssignments,
  apiKeys,
  auditLogs,
  promptEvents,
  waitlist,
  extensionSessions,
};
