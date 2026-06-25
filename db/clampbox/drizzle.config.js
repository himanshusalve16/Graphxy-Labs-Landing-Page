const { defineConfig } = require("drizzle-kit");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from backend or root .env
dotenv.config({ path: path.resolve(__dirname, "../../backend/.env") });
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

module.exports = defineConfig({
  schema: "./schema/schema.js",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "postgresql://clampbox:password@localhost:5433/clampbox",
  },
});
