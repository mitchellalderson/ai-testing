const { Pool } = require("pg");

async function migrate() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.DATABASE_SSL === "true"
        ? { rejectUnauthorized: false }
        : false,
  });

  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS url_mappings (
        id SERIAL PRIMARY KEY,
        original_url TEXT NOT NULL,
        short_code VARCHAR(10) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        clicks INTEGER DEFAULT 0
      );
      
      CREATE INDEX IF NOT EXISTS idx_short_code ON url_mappings(short_code);
    `;

    await pool.query(createTableQuery);
    console.log("Database migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
