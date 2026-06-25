const { drizzle } = require("drizzle-orm/node-postgres");
const { Pool } = require("pg");
const schema = require("./schema/schema");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, "../../backend/.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://clampbox:password@localhost:5433/clampbox",
});

const db = drizzle(pool, { schema });

module.exports = {
  db,
  pool,
};
